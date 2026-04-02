import { IsString, IsInt, IsOptional, IsEmail, IsBoolean, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateWhiteListDto {
    @IsArray()
    @IsString({ each: true })
    niks: string[];

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === undefined) {
            return true;
        }
        return value
    })
    rowstatus: boolean;

}