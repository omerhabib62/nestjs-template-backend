import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentRequestBrief } from './entities/content-request-briefs.entity';

@Module({
    imports:[TypeOrmModule.forFeature([ContentRequestBrief])],
    exports:[TypeOrmModule],
})
export class ContentRequestBriefModule {}
