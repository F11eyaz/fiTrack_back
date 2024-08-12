import {BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {
  constructor(
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
    const payload = { id: user.id, email: user.email, familyId: user.family.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async sendResetToken(email: string, resetToken: string) {
    const resetLink = `http://localhost:4000/reset-password?resetToken=${resetToken}&email:${email}`
    await this.mailerService.sendMail({
      to: email,
      from: 'dumanb228@gmail.com',
      subject: 'Восстановление пароля',
      html: `<b>Ссылка на восстановаление пароля:</b> ${resetLink}`,
    });
  }


  async forgotPassword(email: string) {
    console.log(email)
    const user = await this.userService.findOne(email)
    console.log(user)
    if (!user){
      throw new BadRequestException("Такого пользователя не существует")
    }

    const resetToken = uuidv4()
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1)

    this.sendResetToken(email, resetToken)

    return {message: "Отправлено письмо на почту"}

  }

  async resetPassword(email: string, newPassword: string){
    const user = await this.userService.findOne(email)
    const hashedNewPassword = await argon2.hash(newPassword);
    await this.userService.changePassword( user.password, hashedNewPassword, user.id,)
    return {message: "Пароль успешно изменен"}
  }
  
  
}
