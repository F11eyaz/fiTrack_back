import { BadRequestException, Injectable } from '@nestjs/common';
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
import * as cron from 'node-cron';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly familyService: FamilyService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService

  ){
    this.scheduleCleanup();
  }

  //Логику для удаления неподтвержденных пользователей
  private scheduleCleanup() {
    // Запуск задачи каждый день в полночь
    cron.schedule('0 0 * * *', () => this.removeUnverifiedUsers());
  }

  private async removeUnverifiedUsers() {
    try {
      const result = await this.userRepository.delete({
        isVerified: false,
        createdAt: LessThan(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 день назад
      });

      console.log(`Удалено неподтвержденных аккаунтов: ${result.affected}`);
    } catch (error) {
      console.error('Ошибка при удалении неподтвержденных аккаунтов:', error);
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
    const existUser = await this.userRepository.findOne({
        where: {
            email: createUserDto.email  
        }
    });

    if (existUser) {
        throw new BadRequestException("Такая почта уже существует");
    }

    // Пример преобразования ролей в массив
    const roles: Role[] = [createUserDto.isMember ? Role.User : Role.Admin];

    
    // Создаем пользователя
    const user = this.userRepository.create({
        email: createUserDto.email,
        password: await argon2.hash(createUserDto.password),
        cash: 0,
        roles: roles,

    });

    // Создаем семью и связываем ее с пользователем
    if(!createUserDto.isMember ){
      const family = await this.familyService.create(user.id);
      user.family = family;
      this.sendToken(user.email, user.family.token)
      await this.userRepository.save(user);

    }else{
      const validToken = await this.familyService.findFamilyByToken(createUserDto.token)
      if(validToken){
        const family = await this.familyService.connectToFamily(user.id, createUserDto.token, );
        console.log(family)
        user.family = family; 
        await this.userRepository.save(user);
      }else{
        throw new BadRequestException("Неправильный токен семьи")
      }

    }  
    const verificationToken = await this.generateVerificationToken(user.email)
    this.sendVerificationEmail(user.email, verificationToken )
    
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



  
}