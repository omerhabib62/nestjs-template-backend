import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/services.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Service])],
    exports:[TypeOrmModule]
})
export class ServicesModule {}
