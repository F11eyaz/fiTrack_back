import { IsNotEmpty, IsNumber, IsString, IsOptional} from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  action: '+' | '-';

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  user?: number;
}
