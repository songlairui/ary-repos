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
    @InjectRepository(RepoRemote)
    private readonly repoRemoteRepository: Repository<RepoRemote>,
    @InjectRepository(DeployLocation)
    private readonly deployLocRepository: Repository<DeployLocation>,
  ) {}

  async findAll(): Promise<any[]> {
    return this.repoRemoteRepository
      .createQueryBuilder('self1')
      .leftJoin(
        RepoRemote,
        'self2',
        'self1.repoId = self2.repoId and self1.id < self2.id',
      )
      .where('self2.id IS NULL')
      .getMany();
  }

  async findOneById(id: number): Promise<Repo> {
    return this.repoRepository.findOne(id, {
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
