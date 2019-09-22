import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReposService } from './repos.service';
import { Repo } from './repos.entity';
import { CreateRepoDto } from './dto/repos.dto';

@Controller('repos')
export class ReposController {
  constructor(private readonly repoService: ReposService) {}

  @Get()
  allRepos(): Promise<Repo[]> {
    return this.repoService.findAll();
  }

  @Post()
  createRepo(@Body() createRepoDto: CreateRepoDto) {
    return this.repoService.create(createRepoDto);
  }
}
