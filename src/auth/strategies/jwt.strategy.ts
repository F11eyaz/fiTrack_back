import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {

    // Возвращаем объект пользователя, который будет доступен в request.user

    return { id: payload.id, email: payload.email, familyId: payload.familyId, roles: payload.roles, isVerified: payload.isVerified }; // если тут нет familyId то показываться будут все экземпляры всех сущностей потому что familyId - undefined 
    }
}
