import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString ,IsNotEmpty, Min} from "class-validator"

export class CreateLiabilityDto {
    
    @IsString()
    @IsNotEmpty()
    title:string

    @IsNumber({}, {message: 'Значение должно быть числом'} )
    @Min(0, { message: 'Значение должно быть положительным числом или нулём.' })
    amount:number
    
    user:User

}