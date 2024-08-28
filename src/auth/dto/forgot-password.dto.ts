import { IsEmail} from "class-validator"

export class ForgotPasswordDto {
    @IsEmail({}, {message:"Некорректный формат почты"})
    email: string

}
