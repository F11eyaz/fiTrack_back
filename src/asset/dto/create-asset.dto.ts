import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString ,IsNotEmpty, IsDate} from "class-validator"

export class CreateAssetDto {
    
    @IsString()
    @IsNotEmpty()
    title:string

    @IsNumber()
    amount:number
    
    user:User

    // @IsDate()
    // createdAt: Date

    // @IsDate()
    // updatedAt: Date
}