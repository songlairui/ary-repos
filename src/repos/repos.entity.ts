import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
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
  @OneToMany(type => DepolyLocation, result => result.repo)
  depolylocations: DepolyLocation[];

  // 远程地址
  @OneToMany(type => RepoRemote, result => result.repo)
  remotes: RepoRemote[];

  constructor(partial: Partial<Repo>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity()
export class DepolyLocation extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Repo, result => result.depolylocations)
  repo: Repo;

  @Column({ length: 500 })
  dirpath: string;

  @Column()
  device: string;

  @Column()
  os: string;

  @Column('text')
  description: string;
  constructor(partial: Partial<DepolyLocation>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity()
export class RepoRemote {
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
    Object.assign(this, partial);
  }
}
