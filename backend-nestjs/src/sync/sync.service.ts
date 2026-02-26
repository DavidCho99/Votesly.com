import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../teams/team.entity';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  // Flush Redis pending sums to Postgres every 5 seconds to prevent DB lockup
  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncRedisToPostgres() {
    this.logger.debug('Running routine Database sync batch...');
    
    // Grab the exact delta we need to flush since last run
    const pendingVotes = await this.redis.hgetall('pending_db_sync');
    const organicBreakdown = await this.redis.hgetall('team_votes_organic');
    const boostedBreakdown = await this.redis.hgetall('team_votes_boosted');
    
    const teamIds = Object.keys(pendingVotes);
    if (teamIds.length === 0) return;

    for (const teamId of teamIds) {
      const pendingDelta = Number(pendingVotes[teamId]);
      const organicDelta = Number(organicBreakdown[teamId] || 0);
      const boostedDelta = Number(boostedBreakdown[teamId] || 0);

      if (pendingDelta > 0) {
        // Build SQL increment payload query
        await this.teamRepo.createQueryBuilder()
          .update(Team)
          .set({
            total_likes: () => `"total_likes" + ${pendingDelta}`,
            organic_likes: () => `"organic_likes" + ${organicDelta}`,
            boosted_likes: () => `"boosted_likes" + ${boostedDelta}`
          })
          .where("id = :id", { id: teamId })
          .execute();
        
        // Remove exactly the chunk we just successfully synced, safely avoiding a race condition
        // if users clicked between the HGETALL and the SQL Flush
        await this.redis.hincrby('pending_db_sync', teamId, -pendingDelta);
        await this.redis.hincrby('team_votes_organic', teamId, -organicDelta);
        await this.redis.hincrby('team_votes_boosted', teamId, -boostedDelta);
      }
    }
  }
}
