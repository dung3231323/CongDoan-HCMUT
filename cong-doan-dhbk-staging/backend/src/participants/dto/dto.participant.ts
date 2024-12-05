import {
  Gender,
} from "@prisma/client";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  ValidateIf,
  ValidateNested,
  ValidationError,
} from "class-validator";

import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { WorkingStatus } from "./participant.enum";

export class CreateChildrenDto {
    @IsOptional()
    @IsUUID('4', {message: ""})
    id?: string; // Thêm id để quản lý các children

    @IsString({message: "Tên phải là một chuỗi !"})
    @IsNotEmpty({message: "Vui lòng điền họ và tên lót !"})
    @ApiProperty()
    familyName: string;

    @IsString({message: "Tên phải là một chuỗi !"})
    @ApiProperty()
    @IsNotEmpty({message: "Vui lòng điền tên !"})
    givenName: string;

    @IsDate({message: "Vui lòng nhập ngày sinh con cái theo định dạng dd-mm-yyyy !"})
    @ApiProperty()
    @IsNotEmpty({message: "Vui lòng điền ngày sinh con cái !"})
    @Type(() => Date)
    dob: Date;

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender, { message: 'Giới tính phải là Nam hoặc Nữ' })
    gender: Gender
}

export class CreateParticipantDto {
  @ApiProperty()
  @IsString({message: "Họ và tên đệm phải là một chuỗi !"})
  @IsNotEmpty({message: "Vui lòng điền họ và tên lót !"})
  familyName: string;

  @IsString({message: "Tên phải là một chuỗi !"})
  @ApiProperty()
  @IsNotEmpty({message: "Vui lòng điền tên !"})
  givenName: string;

  @IsEmail({ allow_display_name: true }, { message: 'Định dạng email không hợp lệ !' })
  @ApiProperty()
  @IsNotEmpty({message: "Vui lòng điền email !"})
  email: string;

  @IsString({message: "Số điện thoại phải là một chuỗi !"})
  @ApiProperty()
  @IsNotEmpty({message: "Vui lòng điền số điện thoại !"})
  phone: string;

  @IsString({message: "Mã số cán bộ phải là một chuỗi !"})
  @ApiProperty()
  @IsNotEmpty({message: "Vui lòng điền mã số cán bộ !"})
  sID: string;

  @IsDate({message: "Vui lòng nhập ngày sinh của thành viên theo định dạng dd-mm-yyyy !"})
  @IsNotEmpty({message: "Vui lòng điền ngày sinh !"})
  @ApiProperty()
  @Type(() => Date)
  dob: Date;

  @ApiProperty()
  @IsUUID('4', { message: "Khoa phòng ban không hợp lệ !" })
  @IsNotEmpty({message: "Vui lòng chọn khoa phòng ban !"})
  facultyId: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender, { message: 'Giới tính phải là Nam hoặc Nữ !' })
  @IsNotEmpty({message: "Vui lòng chọn giới tính !"})
  gender: Gender;

  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty({message: "Vui lòng chọn trạng thái công đoàn viên !"})
  isUnionMember: boolean;

  @ValidateIf((o) => o.isUnionMember)
  @ApiProperty()
  @IsString({message: "Mã số công đoàn viên phải là một chuỗi !"})
  @IsNotEmpty({message: "Vui lòng điền mã số công đoàn viên !"})
  uID: string;

  @ValidateIf((o) => o.isUnionMember)
  @ApiProperty({ enum: WorkingStatus, required: false })
  @IsEnum(WorkingStatus, {
    message: 'Trạng thái làm việc phải là Đang làm việc, Nghỉ việc hoặc Nghỉ hưu',
  })
  @IsNotEmpty({message: "Vui lòng điền mã số công đoàn viên !"})
  workingStatus: WorkingStatus;

  @ValidateIf((o) => o.isUnionMember)
  @IsDate({message: "Vui lòng nhập ngày gia nhập công đoàn theo định dạng dd-mm-yyyy !"})
  @IsNotEmpty({message: "Vui lòng điền ngày gia nhập công đoàn !"})
  @ApiProperty()
  @Type(() => Date)
  unionJoinDate: Date;

  @ValidateIf((o) => o.isUnionMember)
  @IsInt({message: "Số lượng con không hợp lệ"})
  @ApiProperty()
  @IsNotEmpty({message: "Vui lòng điền số lượng con !"})
  numOfChildren: number;

  @ValidateIf((o) => o.numOfChildren > 0)
  @ValidateNested({ each: true })
  @Type(() => CreateChildrenDto)
  @ApiProperty({ description: 'Children information', type: [CreateChildrenDto] })
  @IsNotEmpty({message: "Vui lòng điền thông tin con cái !"})
  children: CreateChildrenDto[];
  validate(): ValidationError[] {
    const errors: ValidationError[] = [];

    if (this.numOfChildren === 0 && this.children && this.children.length > 0) {
      errors.push({
        property: "children",
        constraints: {
          populated: "Children cannot be populated when numOfChildren is 0",
        },
      });
    }

    return errors;
  }
}

export class CreateParticipantsDto {
  @ApiProperty({
    type: [CreateParticipantDto],
    description: 'Array of participants to create',
    example: [
      {
        familyName: 'Nguyen',
        givenName: 'An',
        email: 'an.nguyen@example.com',
        phone: '+84912345678',
        sID: 'S123456',
        dob: '2024-08-06T08:24:39.428Z',
        facultyId: 'a9499056-c512-442f-b6f6-bdf021cca60f',
        gender: 'MALE',
        isUnionMember: true,
        uID: 'UID123456',
        workingStatus: 'WORKING',
        unionJoinDate: '2024-08-06T08:24:39.428Z',
        numOfChildren: 2,
        children: [
          {
            familyName: 'Nguyen',
            givenName: 'Hoang',
            dob: '2018-06-01T00:00:00.000Z',
            gender: 'MALE'
          },
          {
            familyName: 'Nguyen',
            givenName: 'Linh',
            dob: '2019-08-15T00:00:00.000Z',
            gender: 'FEMALE'
          }
        ]
      },
      {
        familyName: 'Tran',
        givenName: 'Binh',
        email: 'binh.tran@example.com',
        phone: '+84987654321',
        sID: 'S654321',
        dob: '2024-08-06T08:24:39.428Z',
        facultyId: 'a9499056-c512-442f-b6f6-bdf021cca60f',
        gender: 'FEMALE',
        isUnionMember: false,
        uID: null,
        workingStatus: null,
        unionJoinDate: null,
        numOfChildren: 0,
        children:[]
      }
    ]
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateParticipantDto)
  participants: CreateParticipantDto[];
}
