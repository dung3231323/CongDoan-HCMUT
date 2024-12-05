import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Achievement } from "@prisma/client";
import { IsOptional } from "class-validator";
import { ACHIEVE_MESSAGES } from "src/common/constants";

export class AchievementDto {
  @ApiProperty({ example: "Example Id" })
  id: string;

  @ApiProperty({ example: "Example created at" })
  createAt: Date;

  @ApiProperty({ example: "Example updated at" })
  updateAt: Date;

  @ApiProperty({ example: "Example no" })
  no: string;

  @ApiProperty({ example: "Example Content" })
  content: string;

  @ApiProperty({ example: "Example signdate" })
  signDate: string;

  @ApiProperty({ example: "Example faculty Id" })
  facultyId: string;
}

class AchievementWithFacultyName extends AchievementDto {
  @ApiProperty({ example: "Example faculty name" })
  facultyName: string;
}

export class CreateAchievementResponseDto {
  @ApiProperty({ example: ACHIEVE_MESSAGES.CREATE_SUCCESS })
  message: string;

  //   @ApiProperty({
  //     example: { content: "Example Content", id: "Example Id", no: "Example no", facultyId: "Example Id" } as Achievement,
  //   }) // Adjust the example as necessary
  @ApiProperty({ type: AchievementDto })
  data: Achievement;
}

export class GetAchievementsPaginationResponseDto {
  @ApiProperty({ example: ACHIEVE_MESSAGES.GET_ALL_ACHIEVEMENT_SUCCESS })
  message: string;

  @ApiProperty({ type: [AchievementWithFacultyName] })
  data: AchievementWithFacultyName[];
}

export class EditAchievementResponseDto {
  @ApiProperty({ example: "Success" })
  message: string;

  @ApiProperty({ type: AchievementDto })
  data: Achievement;
}

export class DeleteAchievementResponseDto {
  @ApiProperty({ example: "Success" })
  message: string;

  @ApiProperty({ type: AchievementDto })
  data: Achievement;
}
