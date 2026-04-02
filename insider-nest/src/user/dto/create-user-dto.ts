import { IsString, IsInt, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    nik?: string;

    @IsOptional()
    @IsEmail()
    email?: string

    @IsString()
    role: string
}