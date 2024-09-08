import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCreator } from './entities/content-creators.entity';
import { ContentCreatorController } from './content-creator.controller';
import { ContentCreatorService } from './content-creator.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([ContentCreator]),AuthModule,UserModule],
    exports: [TypeOrmModule],
    controllers: [ContentCreatorController],
    providers: [ContentCreatorService]
})
export class ContentCreatorModule { }
