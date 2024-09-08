import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsEmail, isJSON, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export class CreateProfileBody{

    // @IsNumber()
    // @IsNotEmpty()
    step: Number;


    @ValidateIf((object: CreateProfileBody) => object.step === 1)
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsString()
    @IsNotEmpty()
    city: string;


    @ValidateIf((object: CreateProfileBody) => object.step === 2)
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ValidateIf((object: CreateProfileBody) => object.step === 3)
    @IsDateString()
    @IsNotEmpty()
    dob: string;

    @ValidateIf((object: CreateProfileBody) => object.step === 4)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) 
    collaboratorsInterests: string[];

    
    @ValidateIf((object: CreateProfileBody) => object.step === 5)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) 
    languagesSpoken: string[];


    @ValidateIf((object: CreateProfileBody) => object.step === 6)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) 
    niche: string[];


    @ValidateIf((object: CreateProfileBody) => object.step === 7)
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) 
    specialAttributes: string[];

}