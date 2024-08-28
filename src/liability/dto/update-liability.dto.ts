import { PartialType } from '@nestjs/swagger';
import { CreateLiabilityDto } from './create-liability.dto';
import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString , IsOptional, Min} from "class-validator"

export class UpdateLiabilityDto extends PartialType(CreateLiabilityDto) {

    @IsString()
    @IsOptional()
    title?:string

    @IsNumber({}, {message: 'Значение должно быть числом'} )
    @Min(0, { message: 'Значение должно быть положительным числом или нулём.' })
    @IsOptional()
    amount?:number
    
    user:User

    // @IsDate()
    // createdAt: Date

    // @IsDate()
    // updatedAt: Date

}
