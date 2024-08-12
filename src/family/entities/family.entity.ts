import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany} from 'typeorm'
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Category } from 'src/category/entities/category.entity';
import { Asset } from 'src/asset/entities/asset.entity';
import { Liability } from 'src/liability/entities/liability.entity';

@Entity()
export class Family {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => User, (user) => user.family,  { cascade: true })
    users: User[]

    @OneToMany(() => Category, (category)=>category.family, {onDelete: "CASCADE"})
    categories: Category[]

    @OneToMany(() => Transaction, (transaction)=>transaction.family,  )
    transactions: Transaction[]

    @OneToMany(() => Asset, (asset)=>asset.family, {onDelete: "CASCADE"})
    asset: Asset[]

    @OneToMany(() => Liability, (liability)=>liability.family, {onDelete: "CASCADE"})
    liability: Liability[]

    @Column({unique: true})
    token: string

    @BeforeInsert()
    generateToken(){
        this.token = uuidv4()
    }
}
