import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, IsEnum, ValidateIf, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChildrenDto } from './dto.participant';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { WorkingStatus } from './participant.enum';

export class UpdateChildrenDto {
  @IsOptional()
  @IsUUID('4', {message: ""})
  id?: string; // Thêm id để quản lý các children

  @IsString()
  @IsOptional()
  @ApiProperty()
  familyName: string;

  @IsString({message: "Tên phải là một chuỗi !"})
  @ApiProperty()
  @IsOptional()
  givenName: string;

  @IsDate({message: "Vui lòng nhập ngày sinh con cái theo định dạng dd-mm-yyyy !"})
  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  dob: Date;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender, { message: 'Giới tính phải là Nam hoặc Nữ' })
  @IsOptional()
  gender: Gender
}

export class EditParticipantDto {
  @IsString()
  sID: string;

  @IsOptional()
  @IsString()
  familyName?: string;

  @IsDate({message: "Vui lòng nhập ngày sinh của thành viên theo định dạng dd-mm-yyyy !"})
  @IsOptional()
  @ApiProperty()
  @Type(() => Date)
  dob?: Date;

  @IsOptional()
  @IsString()
  givenName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  facultyId?: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender, { message: 'Giới tính phải là Nam hoặc Nữ !' })
  @IsOptional()
  gender: Gender;
  

  @IsOptional()
  @IsBoolean()
  isUnionMember?: boolean;

  @IsOptional()
  @IsString()
  uID?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  unionJoinDate?: Date;

  @IsOptional()
  @IsNumber()
  numOfChildren?: number;

  @ValidateIf((o) => o.isUnionMember)
  @ApiProperty({ enum: WorkingStatus, required: false })
  @IsEnum(WorkingStatus, {
    message: 'Trạng thái làm việc phải là Đang làm việc, Nghỉ việc hoặc Nghỉ hưu',
  })
  @IsOptional()
  workingStatus: WorkingStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChildrenDto)
  children?: UpdateChildrenDto[];
}

export class EditMultipleParticipantsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditParticipantDto)
  participants: EditParticipantDto[];
}