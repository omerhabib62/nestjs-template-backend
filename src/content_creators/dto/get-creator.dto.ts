import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetCreatorsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    languages?: string;

      
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    location?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    gender?: string;


    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    topics?: string;


    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    characteristics?: string;

    
}