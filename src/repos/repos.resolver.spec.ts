import { Test, TestingModule } from '@nestjs/testing';
import { ReposResolver } from './repos.resolver';

describe('ReposResolver', () => {
  let resolver: ReposResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReposResolver],
    }).compile();

    resolver = module.get<ReposResolver>(ReposResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
