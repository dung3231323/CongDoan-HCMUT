
import { IsOptional, IsString, IsEmail, IsDate, IsBoolean, IsEnum, IsUUID, IsInt, IsNumber, IsNumberString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { WorkingStatus } from "./participant.enum";



export class FilterParticipantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Họ và tên lót phải là một chuỗi !' })
  familyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Tên phải là một chuỗi !' })
  givenName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là một chuỗi !' })
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isUnionMember?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({ allow_display_name: true }, { message: 'Định dạng email không hợp lệ !' })
  email?: string;

  @ApiProperty({ enum: WorkingStatus, required: false })
  @IsOptional()
  @IsEnum(WorkingStatus, { message: 'Trạng thái làm việc phải là Đang làm việc, Nghỉ việc hoặc Nghỉ hưu' })
  workingStatus?: WorkingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'Số lượng con không hợp lệ !' })
  numOfChildrenMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'Khoa phòng ban không hợp lệ !' })
  facultyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate({ message: 'Vui lòng nhập theo định dạng dd-mm-yyyy' })
  @Type(() => Date)
  dobFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate({ message: 'Vui lòng nhập theo định dạng dd-mm-yyyy' })
  @Type(() => Date)
  dobTo?: Date;
}