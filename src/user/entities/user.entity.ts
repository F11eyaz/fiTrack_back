
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm"
import { Family } from "src/family/entities/family.entity"
import { Role } from "src/auth/roles/role.enum"

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

  
    // @OneToMany(() => Category, (category)=>category.user, {onDelete: "CASCADE"})
    // categories: Category[]

    // @OneToMany(() => Transaction, (transaction)=>transaction.user,  )
    // transactions: Transaction[]

    // @OneToMany(() => Asset, (asset)=>asset.user, {onDelete: "CASCADE"})
    // asset: Asset[]

    // @OneToMany(() => Liability, (liability)=>liability.user, {onDelete: "CASCADE"})
    // liability: Liability[]

    @ManyToOne(()=> Family, family => family.users)
    family: Family

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
 