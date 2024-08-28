import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = await super.canActivate(context);
    
    
    if (result) {
      const user = request.user;
      if (!user.isVerified) {
        throw new ForbiddenException('Пользователь не найден');
      }
      return true;
    }
    return false;
  }
}
