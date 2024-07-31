import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString ,IsNotEmpty, IsDate} from "class-validator"

export class CreateLiabilityDto {
    
    @IsString()
    @IsNotEmpty()
    title:string

    @IsNumber()
    amount:number
    
    user:User

}