import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './entities/invites.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Invite])],
    exports:[TypeOrmModule],
    
})
export class InvitesModule {}
