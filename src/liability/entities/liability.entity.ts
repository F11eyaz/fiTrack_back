import { User } from 'src/user/entities/user.entity'
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn} from 'typeorm'
import { Family } from 'src/family/entities/family.entity'

@Entity()
export class Liability {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title:string

    @Column({ type: 'float' })
    amount:number

    @ManyToOne(() => Family, (family) => family.categories)
    family: Family;

    // @ManyToOne(() => User, (user) => user.liability)
    // @JoinColumn({name:'user_id'})
    // user:User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
