import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column()
  mascot: string;

  @Column()
  conference: string;

  @Column()
  primary_color: string;

  @Column()
  secondary_color: string;

  @Column({ default: 0 })
  total_likes: number;

  @Column({ default: 0 })
  organic_likes: number;

  @Column({ default: 0 })
  boosted_likes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
