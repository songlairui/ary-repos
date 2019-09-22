import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReposService } from './repos.service';
import { Repo } from './repos.entity';

@Resolver('Repos')
export class ReposResolver {
  constructor(private readonly reposService: ReposService) {}

  @Query()
  repos(): Promise<Repo[]> {
    return this.reposService.findAll();
  }
  @Query()
  repo(@Args('id') id: number) {
    return this.reposService.findOneById(id);
  }
}
