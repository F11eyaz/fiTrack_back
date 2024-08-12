import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { User } from './entities/user.entity';
import * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt';
import { FamilyService } from 'src/family/family.service';
import { Role } from 'src/auth/roles/role.enum';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

    private readonly familyService: FamilyService,
    private readonly mailerService: MailerService,

  ){

  }

  async sendToken(email: any, token: any) {
    await this.mailerService.sendMail({
      to: email,
      from: 'dumanb228@gmail.com',
      subject: 'Ваш токен',
      text: `Ваш токен: ${token}, сохраните его.`,
      html: `<b>Ваш токен:</b> ${token}`,
    });
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
    const user = await this.userRepository.save({
        email: createUserDto.email,
        password: await argon2.hash(createUserDto.password),
        roles: roles,
    });

    // Создаем семью и связываем ее с пользователем
    if(!createUserDto.isMember){
      const family = await this.familyService.create(user.id);
      user.family = family;
      this.sendToken(user.email, user.family.token)
      await this.userRepository.save(user);
    }else{
      console.log(user.id)
      const family = await this.familyService.connectToFamily(user.id, createUserDto.token, );
      user.family = family;
      await this.userRepository.save(user);
    }    
    await this.userRepository.save(user);
    // const token = this.jwtService.sign({email: createUserDto.email,  }); // возможно здесь ошибка с ролями 
    return { user };
}


  async findOne(email: any) {
    console.log(email)
    const user = await this.userRepository.findOne({
      where: {email},
      relations: ['family'], 
    });
    console.log(user)
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
  
}