import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags,ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';;
import { LocalAuthGuard } from './guards/local-auth-guard';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: AuthDto })
  async login (@Request() req){
    return this.authService.login(req.user)
  }  
  
  @UseGuards(LocalAuthGuard)
  @Get('profile')
  getProfile(@Request() req){
    return req.user
  }
}

