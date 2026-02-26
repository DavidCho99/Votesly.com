import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';

@Entity('user_likes')
@Index(['user_uid', 'created_at']) // Fast querying for cooldowns if needed fallback
export class UserLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_uid: string;

  @Column()
  team_id: string;

  @Column()
  like_type: 'organic' | 'boosted';

  @Column({ default: 1 })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  // Relations (optional usage, but good for DB level constraints)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_uid' })
  user: User;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
