import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCreatorModule } from './content_creators/content-creators.module';
import { UgcVideosModule } from './ugc_videos/ugc-videos.module';
import { BrandsModule } from './brands/brands.module';
import { ContentRequestsModule } from './content_requests/content-requests.module';
import { ServicesModule } from './services/services.module';
import { FavoritesModule } from './favorites/favorites.module';
import { InvitesModule } from './invites/invites.module';
import { AuthModule } from './auth/auth.module';
import { ContentRequestBriefModule } from './content_request_briefs/content-request-briefs.module';
import { StepsModule } from './steps/steps.module';
import { ImagesModule } from './images/images.module';
import { createDataSourceOptions } from '../data-source-options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'.env.dev'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createDataSourceOptions(configService),
    }),
    ContentCreatorModule,
    UgcVideosModule,
    BrandsModule,
    ContentRequestsModule,
    ServicesModule,
    ContentRequestBriefModule,
    FavoritesModule,
    InvitesModule,
    AuthModule,
    StepsModule,
    ImagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
