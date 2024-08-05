import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString ,IsNotEmpty, IsPositive} from "class-validator"

export class CreateLiabilityDto {
    
    @IsString()
    @IsNotEmpty()
    title:string

    @IsNumber()
    @IsPositive()
    amount:number
    
    user:User

}