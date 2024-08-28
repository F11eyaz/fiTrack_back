import { IsString,Length,Matches} from "class-validator"


export class UpdatePersonalDataDto {
    // @IsEmail({}, {message:"Некорректный формат почты"})
    // email?: string

    @IsString({ message: 'Полное имя должно быть строкой' })
    @Length(2, 50, { message: 'Полное имя должно быть между 2 и 50 символами' })
    @Matches(/^[A-Za-z\s-]+$/, { message: 'Полное имя может состоять только из букв, пробелов и дефисов' })
    fullName: string;


}
