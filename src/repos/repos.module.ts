import { Module } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ReposController } from './repos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repo } from './repos.entity';
import { ReposResolver } from './repos.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Repo])],
  providers: [ReposService, ReposResolver],
  controllers: [ReposController],
})
export class ReposModule {}
