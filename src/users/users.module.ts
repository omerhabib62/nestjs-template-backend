

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { ContentCreator } from '../content_creators/entities/content-creators.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, ContentCreator]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          global: true,
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: { expiresIn: '60s', algorithm: 'HS256' },
        }),
      }),
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            auth: {
              user: configService.get<string>('EMAIL_USERNAME'),
              pass: configService.get<string>('EMAIL_PASSWORD'),
            },
          },
        }),
      }),
    ],
    providers: [UsersService],
    exports: [TypeOrmModule, UsersService, JwtModule],
  })
  export class UserModule {}