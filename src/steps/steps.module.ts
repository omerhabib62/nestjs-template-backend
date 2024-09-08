import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Steps } from './entities/steps.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Steps])],
  exports:[TypeOrmModule]
})
export class StepsModule {}
