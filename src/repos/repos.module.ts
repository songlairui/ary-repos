import { Module } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ReposController } from './repos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repo, RepoRemote, DeployLocation } from './repos.entity';
import { ReposResolver } from './repos.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Repo, RepoRemote, DeployLocation])],
  providers: [ReposService, ReposResolver],
  controllers: [ReposController],
})
export class ReposModule {}
