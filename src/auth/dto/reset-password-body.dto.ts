import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordBodyDto {

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
