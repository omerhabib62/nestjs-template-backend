import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UgcVideo } from './entities/ugc-videos.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UgcVideo])],
    exports: [TypeOrmModule]
})
export class UgcVideosModule { }
