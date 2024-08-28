import { IsEmail, IsString, MinLength, Matches} from "class-validator"

export class ResetPasswordDto {
    @IsEmail({}, {message:"Некорректный формат почты"})
    email: string

    @IsString()
    @MinLength(8, {message: "Пароль должен быть больше 8 символов"})
    @Matches(/^[A-Za-z0-9!@#$%^&*()_+{}[\]:;<>,.?~\/-]+$/, {
        message: 'Пароль может содержать только латиницу и не должен включать кириллицу.',
    })
    newPassword: string

    @IsString()
    resetToken: string
}

