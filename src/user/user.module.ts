import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FamilyService } from 'src/family/family.service';
import { Family } from 'src/family/entities/family.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Family]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions:{expiresIn:'30d'},
      }),
      inject: [ConfigService],
    }),
    ],
  controllers: [UserController],
  providers: [UserService, FamilyService],
  exports: [UserService]
})
export class UserModule {}
