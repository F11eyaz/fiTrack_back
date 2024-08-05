import { IsEmail,MinLength } from "class-validator"

export class CreateUserDto {
    @IsEmail({}, {message:"Некорректный формат почты"})
    email: string

    @MinLength(8, {message: "Пароль должен быть больше 8 символов"})
    password: string
}
