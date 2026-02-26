import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class RankingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger('RankingGateway');
  private pendingBroadcasts: Record<string, number> = {};
  private redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
    // Flush buffered UI updates to all connected clients every 500ms
    // This perfectly mimics popsenzawa-echo's OnUpdated batched SSE loop
    setInterval(() => {
      const keys = Object.keys(this.pendingBroadcasts);
      if (keys.length > 0) {
        
        // Prepare the broadcast payload payload
        const updates: { teamId: string, increment: number }[] = [];
        for (const teamId of keys) {
           const increment = this.pendingBroadcasts[teamId];
           if (increment > 0) {
             updates.push({ teamId, increment });
           }
        }
        
        // Reset local queue securely before async emission
        this.pendingBroadcasts = {};
        
        // Fire batch delta update to all Next.js clients
        this.server.emit('vote_batch_update', updates);
      }
    }, 500);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client Connected: ${client.id}`);
    // Hydrate new connection with the latest cached team votes snapshot on load
    const currentVotes = await this.redis.hgetall('team_votes');
    client.emit('initial_rankings', currentVotes);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('vote')
  async handleVote(
    @MessageBody() data: { teamId: string, userId: string, type: 'organic' | 'boosted', amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { teamId, userId, type, amount } = data;

    // Reject invalid boosts early
    if (type === 'boosted' && amount <= 0) {
      return { status: 'error', message: 'Invalid boost amount' };
    }
    
    // Only organic clicks have strict rate limits
    if (type === 'organic') {
      const cooldownKey = `cooldown:${userId}`;
      const isCooldown = await this.redis.set(cooldownKey, '1', 'EX', 5, 'NX');
      if (!isCooldown) {
          return { status: 'error', message: 'Cooldown active. Please wait 5 seconds.' };
      }
    }

    // Atomic increment of the team's total points in memory
    const actualAmount = type === 'organic' ? 1 : amount;
    
    // We increment the total, the separate stat track, and the pending DB sync offset immediately
    await this.redis.hincrby('team_votes', teamId, actualAmount);
    await this.redis.hincrby(`team_votes_${type}`, teamId, actualAmount);
    // Buffer increment to eventually push to DB
    await this.redis.hincrby('pending_db_sync', teamId, actualAmount);
    
    // Buffer increment for the next batched websocket broadcast to all clients
    this.pendingBroadcasts[teamId] = (this.pendingBroadcasts[teamId] || 0) + actualAmount;

    return { status: 'success' };
  }
}
