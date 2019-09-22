import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReposModule } from './repos/repos.module';
import { GraphQLModule } from '@nestjs/graphql';
import { DateScalar } from './common/date.scalar';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      typePaths: ['./**/*.graphql'],
      playground: true,
    }),
    ReposModule,
  ],
  providers: [DateScalar],
})
export class AppModule {}
