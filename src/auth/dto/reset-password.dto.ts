import { IsEmail, IsString, MinLength} from "class-validator"

export class ResetPasswordDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8, {message: "Пароль должен быть больше 8 символов"})
    newPassword: string

    @IsString()
    resetToken: string
}

