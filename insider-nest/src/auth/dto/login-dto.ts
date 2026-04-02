import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe: boolean;
}