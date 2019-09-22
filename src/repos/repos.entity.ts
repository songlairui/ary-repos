import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { AbstractBaseEntity } from '../common/abstract.entity';

@Entity()
export class Repo extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  // 存放路径， 存放设备, 多对多
  @OneToMany(type => DeployLocation, result => result.repo)
  deploylocations: DeployLocation[];

  // 远程地址
  @OneToMany(type => RepoRemote, result => result.repo)
  remotes: RepoRemote[];

  constructor(partial: Partial<Repo>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity()
export class DeployLocation extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Repo, result => result.deploylocations)
  repo: Repo;

  @Column({ length: 500 })
  dirpath: string;

  @Column()
  device: string;

  @Column()
  os: string;

  @Column('text')
  description: string;
  constructor(partial: Partial<DeployLocation>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity()
export class RepoRemote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Repo, result => result.remotes)
  repo: Repo;

  @Column()
  name: string;

  @Column()
  fetch: string;

  @Column()
  push: string;

  constructor(partial: Partial<RepoRemote>) {
    super();
    Object.assign(this, partial);
  }
}
