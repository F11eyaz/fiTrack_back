import { User } from 'src/user/entities/user.entity'
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn} from 'typeorm'

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title:string

    @Column()
    amount:number

    @ManyToOne(() => User, (user) => user.asset)
    @JoinColumn({name:'user_id'})
    user:User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
