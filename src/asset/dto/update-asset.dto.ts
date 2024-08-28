import { PartialType } from '@nestjs/swagger';
import { CreateAssetDto } from './create-asset.dto';

import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString , IsOptional, Min} from "class-validator"

export class UpdateAssetDto extends PartialType(CreateAssetDto) {

    @IsString()
    @IsOptional()
    title?:string

    @IsOptional()
    @IsNumber({}, {message: 'Значение должно быть числом'} )
    @Min(0, { message: 'Значение должно быть положительным числом или нулём.' })
    amount?:number
    
    user:User

    // @IsDate()
    // createdAt: Date

    // @IsDate()
    // updatedAt: Date
}
