import { PartialType } from '@nestjs/swagger';
import { CreateAssetDto } from './create-asset.dto';

import { User } from "src/user/entities/user.entity"
import { IsNumber, IsString , IsOptional} from "class-validator"

export class UpdateAssetDto extends PartialType(CreateAssetDto) {

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
