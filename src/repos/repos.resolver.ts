import { Resolver, Query } from '@nestjs/graphql';
import { ReposService } from './repos.service';
import { Repo } from './repos.entity';

@Resolver('Repos')
export class ReposResolver {
  constructor(private readonly reposService: ReposService) {}

  @Query()
  async repos(): Promise<Repo[]> {
    return await this.reposService.findAll();
  }
}
