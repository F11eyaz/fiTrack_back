import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  // @ManyToOne(() => User, (user) => user.transactions)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @ManyToOne(() => Family, (family) => family.transactions)
  family: Family;

//   @ManyToOne(() => Category, (category) => category.transactions)
//   @JoinColumn({ name: 'category_id' })
  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
