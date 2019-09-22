import { Controller, Get } from '@nestjs/common';
import { ReposService } from './repos.service';
import { Repo } from './repos.entity';

@Controller('repos')
export class ReposController {
  constructor(private readonly repoService: ReposService) {}

  @Get()
  allRepos(): Promise<Repo[]> {
    return this.repoService.findAll();
  }
}
