import {BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ResetToken } from './entities/reset-token.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ResetToken) private readonly tokenRepository: Repository<ResetToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string){
    const user = await this.userService.findOne(email);
    const passwordIsMatch = await argon2.verify(user.password, password)
    if (user && passwordIsMatch) {
      return user
    }
    throw new UnauthorizedException("Неправильная почта или пароль");
  } 
  
  async login(user: any) {
    if (!user.family){
      throw new ForbiddenException("Вы были исключены из семьи. Дождитесь пока вас добавят или создайте новый аккаунт")
    }

    if(user.isVerified){
      const payload = { id: user.id, fullName: user.fullName, email: user.email, familyId: user.family.id, roles: user.roles, isVerified: user.isVerified };
      return {
        token: this.jwtService.sign(payload),
      };
    }else{
      throw new ForbiddenException("Пользователь не верифицирован")
    }
  }

  async verifyUser(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    user.isVerified = true;
    await this.userService.update(user);
  }


  async sendResetToken(email: string, resetToken: string) {
    const resetLink = `fiTrack.kz/reset-password?resetToken=${resetToken}&email=${email}`
    await this.mailerService.sendMail({
      to: email,
      from: 'dumanb228@gmail.com',
      subject: 'Восстановление пароля',
      html: `<b>Ссылка на восстановаление пароля:</b> ${resetLink}`,
    });
  }


  async forgotPassword(email: string) {
    const user = await this.userService.findOne(email)
    if (!user){
      throw new BadRequestException("Такого пользователя не существует")
    }

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1)
    const resetToken = this.tokenRepository.create({
      expiresAt: expiryDate,
      userEmail: user.email,
      resetToken: uuidv4()
    });
    await this.tokenRepository.save(resetToken);
    this.sendResetToken(email, resetToken.resetToken)

    return {message: "Отправлено письмо на почту"}

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto){
    try{
      const validToken = await this.tokenRepository.findOne({
        where: {
          resetToken: resetPasswordDto.resetToken,
        },
      });

      
      if(validToken){
        const user = await this.userService.findOne(resetPasswordDto.email)
        const hashedNewPassword = await argon2.hash(resetPasswordDto.newPassword);
        user.password = hashedNewPassword
        await this.userRepository.save(user)
        await this.tokenRepository.delete(validToken.id);

        return {message: "Пароль успешно изменен"}
      }else{
        throw new BadRequestException("Неправильный токен")
      }
    }catch(e){
      throw new BadRequestException("Неправильный токен")
    }
  }
  
  
}
