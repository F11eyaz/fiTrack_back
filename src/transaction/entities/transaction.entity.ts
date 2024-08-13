import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
// import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Family } from 'src/family/entities/family.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ type: 'float'})
  amount: number;

  @Column({ type: 'float' })
  cashAfter: number;

  @ManyToOne(() => User, (user) => user.transactions)
  
  user: User;

  @ManyToOne(() => Family, (family) => family.transactions)
  family: Family;

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
