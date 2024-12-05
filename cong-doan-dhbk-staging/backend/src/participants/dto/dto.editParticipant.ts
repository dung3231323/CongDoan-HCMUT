import { Gender } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested
} from "class-validator";
import { CreateChildrenDto } from "./dto.participant";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { WorkingStatus } from "./participant.enum";

export class UpdateChildDto {
    @IsOptional()
    @IsUUID('4', {message: "id của trẻ em không hợp lệ !"})
    id?: string; // Thêm id để quản lý các children

    @IsString({message: "Họ và tên đệm phải là một chuỗi !"})
    @IsOptional()
    @ApiProperty()
    familyName: string;

    @IsString({message: "Tên phải là một chuỗi !"})
    @ApiProperty()
    @IsOptional()
    givenName: string;

    @IsDate({message: "Vui lòng nhập ngày sinh của thành viên theo định dạng dd-mm-yyyy !"})
    @ApiProperty()
    @IsOptional()
    @Type(() => Date)
    dob: Date;

    @ApiProperty({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender, { message: 'Giới tính phải là Nam hoặc Nữ' })
    gender: Gender
}


export class EditParticipantDto {
  @IsString({message: "Họ và tên đệm phải là một chuỗi !"})
  @IsOptional()
  @ApiProperty()
  familyName?: string;  

  
  @IsOptional()
  @ApiProperty()
  @IsString({message: "Tên phải là một chuỗi !"})
  givenName?: string;

  
  @IsOptional()
  @ApiProperty()
  @IsEmail({ allow_display_name: true }, { message: 'Định dạng email không hợp lệ !' })
  email?: string;

  @IsString({message: "Số điện thoại phải là một chuỗi !"})
  @IsOptional()
  @ApiProperty()
  phone?: string;

  @IsString({message: "Mã số cán bộ phải là một chuỗi !"})
  @IsOptional()
  @ApiProperty()
  sID?: string;

  @IsDate({message: "Vui lòng nhập ngày sinh của thành viên theo định dạng dd-mm-yyyy !"})
  @IsOptional()
  @ApiProperty()
  @Type(() => Date)
  dob?: Date;
 
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isUnionMember?: boolean;

  @ValidateIf((o) => o.isUnionMember)
  @IsString({message: "Mã số công đoàn viên phải là một chuỗi !"})
  @ApiProperty()
  @IsOptional()
  uID?: string;

  @ValidateIf((o) => o.isUnionMember)
  @ApiProperty({ enum: WorkingStatus})
  @IsEnum(WorkingStatus, {
    message: 'Trạng thái làm việc phải là Đang làm việc, Nghỉ việc hoặc Nghỉ hưu',
  })
  @IsOptional()
  workingStatus: WorkingStatus;


  @IsOptional()
  @ApiProperty({ enum: Gender })
  @IsEnum(Gender, { message: 'Giới tính phải là Nam hoặc Nữ' })
  gender?: Gender;

  @IsUUID('4', {message: "Khoa/phòng ban không hợp lệ !"})
  @ApiProperty()
  @IsOptional()
  facultyId?: string;

  @ValidateIf((o) => o.isUnionMember)
  @IsDate({message: "Vui lòng nhập ngày sinh của thành viên theo định dạng dd-mm-yyyy !"})
  @Type(() => Date)
  @IsOptional()
  @ApiProperty()
  unionJoinDate?: Date;

  @ValidateIf((o) => o.isUnionMember)
  @IsInt()
  @IsOptional()
  @ApiProperty()
  numOfChildren?: number;

  @ValidateIf((o) => o.numOfChildren > 0)
  @ValidateNested({ each: true })
  @Type(() => CreateChildrenDto)
  @IsOptional()
  @ApiProperty({ description: 'Children information', type: [CreateChildrenDto] })
  children?: UpdateChildDto[];
}

export class EditBulkParticipantsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditParticipantDto)
  participants: EditParticipantDto[];
}

export class DeleteBulkParticipantsDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

  