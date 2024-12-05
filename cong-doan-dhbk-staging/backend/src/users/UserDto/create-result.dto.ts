import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from "class-validator";

export class CreateResultDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    result: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    reason: string;

}
