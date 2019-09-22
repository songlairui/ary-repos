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

  async findAll(): Promise<any> {
    // 外键关联字段 remotes deploylocations, 只取关联数据中最新的一个
    const repoRemoteQb = this.repoRemoteRepository
      .createQueryBuilder('self1')
      .select('self1.id', 'id')
      .leftJoin(
        RepoRemote,
        'self2',
        'self1.repoId = self2.repoId and self1.id < self2.id',
      )
      .where('self2.id IS NULL')
      .getQuery();

    const deployLocQb = this.deployLocRepository
      .createQueryBuilder('self1')
      .select('self1.id', 'id')
      .leftJoin(
        DeployLocation,
        'self2',
        'self1.repoId = self2.repoId and self1.updated_at < self2.updated_at',
      )
      .where('self2.id IS NULL')
      .getQuery();

    const result = await this.repoRepository
      .createQueryBuilder('Repo')
      .leftJoinAndSelect('Repo.remotes', 't1', `t1.id IN (${repoRemoteQb})`)
      .leftJoinAndSelect(
        'Repo.deploylocations',
        't2',
        `t2.id IN (${deployLocQb})`,
      )
      .getMany();

    return result;
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
