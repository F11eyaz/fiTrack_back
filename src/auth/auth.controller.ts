import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { ApiTags,ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';;
import { LocalAuthGuard } from './guards/local-auth-guard';



@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: AuthDto })
  async login (@Req() req){
    return this.authService.login(req.user)
  }  


  @Post("forgot-password")
  async forgotPassword (@Body() email: any){
    return this.authService.forgotPassword(email.email)
  }  

  @Post("reset-password")
  async resetPassword (@Body() email: any, newPassword: any){
    return this.authService.resetPassword(email.email, newPassword.newPassword)
  } 
  
}

