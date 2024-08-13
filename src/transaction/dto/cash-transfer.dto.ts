import { IsNotEmpty, IsNumber} from "class-validator";

export class CashTransferDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
