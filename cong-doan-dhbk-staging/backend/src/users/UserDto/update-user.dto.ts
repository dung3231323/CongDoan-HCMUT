import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateUserDto {
  // @IsNotEmpty()
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  familyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  givenName: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unionDeptId: string;
}
