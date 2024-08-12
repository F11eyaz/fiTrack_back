import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from './asset/asset.module';
import { LiabilityModule } from './liability/liability.module';
// import { FamilyModule } from './family/family.module';
import { FamilyModule } from './family/family.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MailerModule.forRoot({
      transport:{
        host:'smtp.gmail.com',
        auth: {
          user: 'dumanb228@gmail.com',
          pass:'ngdr vymd xqgo ysyk'
        }
      }
    }),
    UserModule,
    CategoryModule,
    AuthModule,
    TransactionModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        synchronize: true,
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }),
      inject:[ConfigService], 

    }),
    AssetModule,
    LiabilityModule,
    FamilyModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // },
  
  ],
})
export class AppModule {}
