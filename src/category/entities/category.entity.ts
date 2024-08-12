import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { Family } from 'src/family/entities/family.entity'

@Entity()
export class Category {
    @PrimaryGeneratedColumn({name: 'category_id'})
    id: number

    @Column()
    title: string

    @ManyToOne(() => Family, (family) => family.categories)
    family: Family;

    // @ManyToOne(()=> User, (user)=>user.categories)
    // @JoinColumn({name:'user_id'})
    // user: User

    // @OneToMany(()=> Transaction, (transaction)=> transaction.category)
    // transactions: Transaction[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
