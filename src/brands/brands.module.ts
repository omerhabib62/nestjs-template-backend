import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brands.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Brand])],
    exports:[TypeOrmModule]
})
export class BrandsModule {}
