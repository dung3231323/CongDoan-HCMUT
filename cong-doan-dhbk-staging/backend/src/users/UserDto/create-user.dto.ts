import { ApiProperty } from "@nestjs/swagger";
import { User, UserRole } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "The email of the user",
    required: true,
    example: "bachkhoa@hcmut.edu.vn",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The role name of the user",
    required: false,
    example: "ADMIN",
    default: "MODERATOR"
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  @Transform(({ value }) => value || 'MODERATOR')
  role: UserRole;

  @ApiProperty({
    description: "The falcuty id of the user",
    required: false,
    example: "CSE",
    default: "null"
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || null)
  unionDeptId: string;
}
