import { Category } from "src/category/entities/category.entity"
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn} from "typeorm"
import { Transaction } from "src/transaction/entities/transaction.entity"
import { Asset } from "src/asset/entities/asset.entity"
import { Liability } from "src/liability/entities/liability.entity"
// import { Family } from "src/family/entities/family.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string
  
    @OneToMany(() => Category, (category)=>category.user, {onDelete: "CASCADE"})
    categories: Category[]

    @OneToMany(() => Transaction, (transaction)=>transaction.user,  )
    transactions: Transaction[]

    @OneToMany(() => Asset, (asset)=>asset.user, {onDelete: "CASCADE"})
    asset: Asset[]

    @OneToMany(() => Liability, (liability)=>liability.user, {onDelete: "CASCADE"})
    liability: Liability[]

    // @ManyToOne(()=> Family, family => family.user)
    // @JoinColumn({name:'family_id'})
    // family: Family

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
 