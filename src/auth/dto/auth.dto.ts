import { IsEmail,MinLength } from "class-validator"

export class AuthDto {
    @IsEmail({}, {message:"Некорректный формат почты"})
    email: string

    @MinLength(8, {message: "Пароль должен быть более 8 символов"})
    password: string
}
