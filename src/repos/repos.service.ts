import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Repo, DeployLocation, RepoRemote } from './repos.entity';
import { CreateRepoDto } from './dto/repos.dto';

@Injectable()
export class ReposService {
  constructor(
    @InjectRepository(Repo)
    private readonly repoRepository: Repository<Repo>,
  ) {}

  async findAll(): Promise<Repo[]> {
    return this.repoRepository.find({
      relations: ['deploylocations', 'remotes'],
    });
  }

  async create(data: CreateRepoDto): Promise<Repo> {
    const { name, description, deploylocations = [], remotes = [] } = data;
    // AVAILABLE toast for the updated records
    const [deploylocationRecords, remoteRecords] = [
      await Promise.all(
        deploylocations.map(
          (itemData): Promise<DeployLocation> => {
            return new DeployLocation(itemData).save();
          },
        ),
      ),
      await Promise.all(
        remotes.map(
          (itemData): Promise<RepoRemote> => {
            return new RepoRemote(itemData).save();
          },
        ),
      ),
    ];

    const repo = new Repo({
      name,
      description,
      deploylocations: deploylocationRecords,
      remotes: remoteRecords,
    });

    return repo.save();
  }
}
