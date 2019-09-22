import { Column, Entity, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/abstract.entity';

@Entity()
export class Repo extends AbstractBaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  // 存放路径， 存放设备, 多对多
  @OneToMany(type => DepolyLocation, result => result.repo)
  depolylocations: DepolyLocation[];

  // 远程地址
  @OneToMany(type => RemoteRepo, result => result.repo)
  remotes: RemoteRepo[];
}

@Entity()
export class DepolyLocation extends AbstractBaseEntity {
  @PrimaryColumn()
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
}

@Entity()
export class RemoteRepo {
  @PrimaryColumn()
  id: number;

  @ManyToOne(type => Repo, result => result.remotes)
  repo: Repo;

  @Column()
  fetch: string;

  @Column()
  push: string;
}
