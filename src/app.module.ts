import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReposModule } from './repos/repos.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ReposModule],
})
export class AppModule {}
