import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredentialsDto {
    @MinLength(4)
    @MaxLength(20)
    @IsString()
    username: string;

    @MinLength(8)
    @MaxLength(20)
    @IsString()
    password: string;
}
