import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm'
import { User } from './entities/user.entity';
import * as argon2 from "argon2"
import { FamilyService } from 'src/family/family.service';
import { Role } from 'src/auth/roles/role.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly familyService: FamilyService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService

  ){}

  //Логику для удаления неподтвержденных пользователей
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async removeUnverifiedUsers() {
    try {
      const unverifiedUsers = await this.userRepository.find({
        where: {
          isVerified: false,
          createdAt: LessThan(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 день назад
        },
        relations: ['family'],
      });

      for (const user of unverifiedUsers) {
        // Удаляем пользователя
        await this.userRepository.delete(user.id);

        // Проверяем, есть ли еще пользователи в этой семье
        if (user.family) {
          const familyUsersCount = await this.userRepository.count({
            where: { family: { id: user.family.id } },
          });

          // Если больше нет пользователей в семье, удаляем семью
          if (familyUsersCount === 0) {
            await this.familyService.remove(user.family.id);
            console.log(`Удалена семья с ID: ${user.family.id}`);
          }
        }
      }

      console.log(`Удалено неподтвержденных аккаунтов: ${unverifiedUsers.length}`);
    } catch (e) {
      console.error('Ошибка при удалении неподтвержденных аккаунтов и семей:', e);
    }
  }



  async sendToken(email: any, token: any) {
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get('MAIL_USER'),
      subject: 'Ваш токен',
      text: `Ваш токен: ${token}, сохраните его.`,
      html: `<b>Ваш токен:</b> ${token}`,
    });
  }

  async sendVerificationEmail(email: any, token: any) {

    const url = `http://127.0.0.1:3000/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Подтвердите вашу почту',
      template: 'verification',
      context: {
        url,
      },
      text: `Перейдите по ссылке для подтверждения: ${url}`,
      html: `<b>Перейдите по ссылке для подтверждения:</b> ${url}`,
    });
  }

  async generateVerificationToken(email: string): Promise<string> {
    const payload = { email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  

  async create(createUserDto: CreateUserDto) {
    // Проверяем, существует ли пользователь с таким email
    const existUser = await this.userRepository.findOne({
        where: {
            email: createUserDto.email  
        }
    });

    if (existUser) {
        throw new BadRequestException("Такая почта уже существует");
    }

    // Определяем роли пользователя
    const roles: Role[] = [createUserDto.isMember ? Role.User : Role.Admin];

    // Создаем пользователя
    const user = await this.userRepository.save({
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: await argon2.hash(createUserDto.password),
        cash: 0,
        roles: roles,
    });

    try {
        // Если пользователь не является участником, создаем семью
        if (!createUserDto.isMember) {
            const family = await this.familyService.create(user.id);
            user.family = family;
            this.sendToken(user.email, user.family.token);
        } else {
            // Если пользователь является участником, подключаем к семье
            const validToken = await this.familyService.findFamilyByToken(createUserDto.token);
            if (validToken) {
                const family = await this.familyService.connectToFamily(user.id, createUserDto.token);
                user.family = family;
            } else {
              this.userRepository.delete(user.id)
                throw new BadRequestException("Неправильный токен семьи");
            }
        }

        // Сохраняем пользователя
        await this.userRepository.save(user);

        // Генерируем токен для проверки email и отправляем письмо
        const verificationToken = await this.generateVerificationToken(user.email);
        this.sendVerificationEmail(user.email, verificationToken);
        
    } catch (error) {
        // Логируем ошибку и выбрасываем исключение, если что-то пошло не так
        console.error('Ошибка при создании пользователя:', error);
        throw new InternalServerErrorException('Ошибка при создании пользователя');
    }
}


  async findOne(email: any) {
    const user = await this.userRepository.findOne({
      where: {email},
      relations: ['family'], 
    });
    return user
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['family'], 
    });
  }

  async findAll(){
    return await this.userRepository.find()
  }

  async findFamilyUsers(familyId: number){
    return await this.userRepository.find({
      where: { family: { id: familyId } },
      order: { createdAt: 'ASC',},
    });
  }

  async updatePersonalData(updatePersonalDataDto: UpdatePersonalDataDto, userId: number){
    // Найдите пользователя по ID
    const user = await this.findOneById(userId)
    
    if (!user) {
        throw new BadRequestException(`Пользователь с ID: ${userId} не найден`);
    }

    // Обновите данные пользователя
    // Object.assign(user, updatePersonalDataDto);
    try{
      user.fullName = updatePersonalDataDto.fullName
      await this.userRepository.save(user);
    }catch(e){
      throw new BadRequestException(e)
    }
}



  async changePassword(oldPassword: string, newPassword: string, id: number ) {
    const user = await this.findOneById(+id)
    const passwordMatch = await argon2.verify(user.password, oldPassword)

    if (!passwordMatch){
      throw new BadRequestException("Указанный пароль не совпадает со старым паролем")
    }
  user.password = await argon2.hash(newPassword);
    await this.userRepository.save(user)
    return user
  }

  async update(user: User){
    await this.userRepository.save(user); 
  }

  // async deleteAccount(id: number){
  //   const user = await this.findOneById(id)
  //   if (!user){
  //     throw new BadRequestException(`Пользователь с ID: ${id} не найден`)
  //   }

  //   await this.userRepository.delete(id); 
  // }
  
}