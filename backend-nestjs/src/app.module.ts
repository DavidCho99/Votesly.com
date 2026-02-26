import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/user.entity';
import { Team } from './teams/team.entity';
import { UserLike } from './likes/user_like.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { RankingGateway } from './gateway/ranking.gateway';
import { SyncService } from './sync/sync.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    
    // PostgreSQL persistent storage config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/bfbr'),
        entities: [User, Team, UserLike],
        synchronize: true, // Auto-create schemas (dev only)
      }),
      inject: [ConfigService],
    }),

    // Redis fast in-memory store config
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RankingGateway, SyncService],
})
export class AppModule {}
