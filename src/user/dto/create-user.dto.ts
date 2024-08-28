import { IsEmail,IsString,Length,Matches,MinLength } from "class-validator"


export class CreateUserDto {
    @IsEmail({}, {message:"Некорректный формат почты"})
    email: string

    @IsString({ message: 'Полное имя должно быть строкой' })
    @Length(2, 50, { message: 'Полное имя должно быть между 2 и 50 символами' })
    @Matches(/^[A-Za-z\s-]+$/, { message: 'Полное имя может состоять только из букв, пробелов и дефисов' })
    
    fullName: string;

    @MinLength(8, {message: "Пароль должен быть больше 8 символов"})
    @Matches(/^[A-Za-z0-9!@#$%^&*()_+{}[\]:;<>,.?~\/-]+$/, {
        message: 'Пароль может содержать только латиницу и не должен включать кириллицу.',
    })
    password: string

    isMember: boolean

    token?: string
}
