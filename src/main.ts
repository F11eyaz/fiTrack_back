import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  // app.setGlobalPrefix('app') - создает глобальный префикс для всех маршрутов:
  // например /app/profile
  // вместо /profile
  // app.useGlobalPipes() - добавить глобальные пайпы
  await app.listen(3003);

}
bootstrap();
