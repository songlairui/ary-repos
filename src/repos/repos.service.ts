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
    // 选出最近的一条记录const
    const repoRemoteQb = this.repoRemoteRepository
      .createQueryBuilder('Repo__remotes')
      .leftJoin(
        RepoRemote,
        'self2',
        'Repo__remotes.repoId = self2.repoId and Repo__remotes.id < self2.id',
      )
      .where('self2.id IS NULL')
      .getQuery();
    // const deployLocQb = this.deployLocRepository
    //   .createQueryBuilder('self1')
    //   .leftJoin(
    //     DeployLocation,
    //     'self2',
    //     'self1.repoId = self2.repoId and self1.id < self2.id',
    //   )
    //   .where('self2.id IS NULL')
    //   .getQuery();

    const result = await this.repoRepository
      .createQueryBuilder('Repo')
      .leftJoinAndSelect(
        qr =>
          qr
            .subQuery()
            .from(RepoRemote, 'RepoRemote')
            .leftJoin(
              `(${this.repoRemoteRepository
                .createQueryBuilder('rr')
                .where({})
                .getQuery()})`,
              'self2',
              'RepoRemote.repoId = self2.rr_repoId and RepoRemote.id < self2.rr_id',
            )
            .where('self2.rr_id IS NULL'),
        'r2',
        'Repo.id = r2.repoId',
      )
      // .leftJoinAndSelect(
      //   `(${repoRemoteQb})`,
      //   'r2',
      //   'Repo.id = r2.Repo__remotes_repoId',
      // )
      // .getQuery();
      // .leftJoinAndSelect(deployLocQb, 'deployLoc', 'repo.id = deployLoc.repoId')
      .getMany();
    console.info(result, 'result');
    console.info(result.map(item => item.remotes));
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
