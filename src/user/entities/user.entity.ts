
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn} from "typeorm"
import { Family } from "src/family/entities/family.entity"
import { Role } from "src/auth/roles/role.enum"
import { Transaction } from "src/transaction/entities/transaction.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @Column({
    type: 'simple-array',
     enum: Role
    })
    roles: Role[];

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[]

    @Column({ type: 'float' })
    cash: number

    @ManyToOne(()=> Family, family => family.users)
    family: Family

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
 