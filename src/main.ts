import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whiteList = [
    'http://localhost:3000',
    'http://ec2-52-63-9-53.ap-southeast-2.compute.amazonaws.com/v1/api',
  ];
  app.enableCors({
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) >= 0 || !origin) {
        if (origin != '') {
          callback(null, true);
        }
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });


  /// Allow validation across application for entities
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('v1/api');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const baseURL = configService.get<string>('BASE_URL');

  await app.listen(port);
  console.log(`Server running at ${baseURL}:${port}`);
}
bootstrap();
