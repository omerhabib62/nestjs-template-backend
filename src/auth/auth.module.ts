import { Module, SetMetadata } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { ContentCreator } from '../content_creators/entities/content-creators.entity';
import { ImagesModule } from '../images/images.module';



@Module({
  imports: [
    UserModule,
    ImagesModule,
    TypeOrmModule.forFeature([User, ContentCreator]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ]
})
export class AuthModule { }
