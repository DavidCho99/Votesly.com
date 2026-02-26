import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn() // Firebase UID
  uid: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  display_name: string;

  @Column({ default: 0 })
  total_organic_likes_given: number;

  @Column({ default: 0 })
  total_boosted_likes_given: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
