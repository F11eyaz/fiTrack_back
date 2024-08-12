import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm'
import { Family } from 'src/family/entities/family.entity'

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title:string

    @Column()
    amount:number

    @ManyToOne(() => Family, (family) => family.asset)
    family: Family;

    // @ManyToOne(() => User, (user) => user.asset)
    // @JoinColumn({name:'user_id'})
    // user:User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
