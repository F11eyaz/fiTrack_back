import { IsNotEmpty, IsNumber} from "class-validator";

export class AdminCashTransferDto {
    from: string
    to: string

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
