import { PartialType } from '@nestjs/swagger';
import { CreateLiabilityDto } from './create-liability.dto';
import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString , IsOptional} from "class-validator"

export class UpdateLiabilityDto extends PartialType(CreateLiabilityDto) {

    @IsString()
    @IsOptional()
    title?:string

    @IsNumber()
    @IsOptional()
    amount?:number
    
    user:User

    // @IsDate()
    // createdAt: Date

    // @IsDate()
    // updatedAt: Date

}
