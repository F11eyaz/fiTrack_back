import { Controller, Post, UseGuards, Req, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags,ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';;
import { LocalAuthGuard } from './guards/local-auth-guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';



@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService

  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: AuthDto })
  async login (@Req() req){
    return this.authService.login(req.user)
  }  

   @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      await this.authService.verifyUser(decoded.email);
      return { message: 'Email успешно подтвержден' };
    } catch (error) {
      throw new BadRequestException('Неправильный или просроченный токен');
    }
  }

  @Post("forgot-password")
  async forgotPassword (@Body() email: any){
    return this.authService.forgotPassword(email.email)
  }  


  @UsePipes(new ValidationPipe())
  @Post("reset-password")
  async resetPassword (@Body() resetPasswordDto: ResetPasswordDto){
    return this.authService.resetPassword(resetPasswordDto)
  } 
  
}

