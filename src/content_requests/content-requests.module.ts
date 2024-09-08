import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentRequest } from './entities/content-requests.entity';

@Module({
    imports:[TypeOrmModule.forFeature([ContentRequest])],
    exports:[TypeOrmModule]
})
export class ContentRequestsModule {}
