import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";
import { IsAchievementExist, IsFacultyExist, IsUUIDAndRequiredBasedOnOption } from "../decorator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ACHIEVE_MESSAGES } from "src/common/constants";

export class CreateAchievementDto {
  @ApiProperty({ example: "New Content" })
  @IsString()
  @IsNotEmpty()
  @IsAchievementExist()
  content: string;

  @ApiProperty({ example: "New sign number" })
  @IsString()
  @IsNotEmpty()
  no: string;

  @ApiProperty({ example: "2024-07-02T14:17:20.115Z" })
  @IsDateString()
  @IsNotEmpty()
  signDate: Date;

  @ApiProperty({ example: "CSE" })
  @IsFacultyExist()
  @IsUUID()
  @IsNotEmpty()
  facultyId: string;
}

export class getAchievementByIdDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class GetAchievementsWithPaginationDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ example: "createAt" })
  @IsOptional()
  @IsString()
  @IsIn(["id", "no", "signDate", "createAt"])
  sortBy?: string = "createAt";

  @ApiPropertyOptional({ example: "asc" })
  @IsOptional()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc";
}

export class EditAchievementDto {
  @ApiPropertyOptional({ example: "New Content" })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: "New sign number" })
  @IsOptional()
  @IsString()
  no?: string;

  @ApiPropertyOptional({ example: "2024-07-02T14:17:20.115Z" })
  @IsOptional()
  @IsDateString()
  signDate?: Date;

  @ApiPropertyOptional({ example: "CSE" })
  @IsOptional()
  @IsUUID()
  facultyId?: string;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class deleteAchievementDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class getAchievementsByFacultyDto {
  @ApiProperty({ example: "CSE" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class getFilteredAchievementsDto {
  @ApiProperty({ example: "faculty" })
  @IsNotEmpty()
  @IsIn(["faculty", "participant"])
  option: "faculty" | "participant";

  @ApiPropertyOptional({ example: "facultyId" })
  @IsUUIDAndRequiredBasedOnOption("option")
  facultyId?: string;

  @ApiPropertyOptional({ example: "participantId" })
  @IsUUIDAndRequiredBasedOnOption("option")
  participantId?: string;

  @ApiPropertyOptional({ example: "new content" })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: "2024-07-02T14:17:20.115Z" })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ example: "2024-07-02T14:17:20.115Z" })
  @IsOptional()
  @IsDateString()
  startDate?: Date;
}
export class getParticipantsFromAchievementDto {
  @ApiProperty({ description: "Achievement ID" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

class participantDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
export class InsertListOfParticipantsDTO {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ example: ["123e4567-e89b-12d3-a456-426614174000"] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => participantDto)
  participants: participantDto[];
}
