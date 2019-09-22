import { Repo, RepoRemote, DeployLocation } from '../repos.entity';

export class CreateRepoRemoteDto {
  readonly repo?: Repo;
  readonly name: string;
  readonly fetch: string;
  readonly push: string;
}
export class CreateDeployLocationDto {
  readonly repo?: Repo;
  readonly dirpath: string;
  readonly device: string;
  readonly os: string;
}
export class CreateRepoDto {
  readonly name: string;
  readonly description: string;
  readonly deploylocations?: (CreateDeployLocationDto | DeployLocation)[];
  readonly remotes?: (CreateRepoRemoteDto | RepoRemote)[];
}
