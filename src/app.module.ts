import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReposModule } from './repos/repos.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ReposModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
