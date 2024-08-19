// token.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resetToken: string;

  @Column()
  userEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
