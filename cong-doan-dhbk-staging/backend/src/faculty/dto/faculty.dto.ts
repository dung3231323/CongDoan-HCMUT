import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class GetAllFacultyDto {
  @ApiPropertyOptional({example: 2})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({example: 2})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagesize?: number = 10;

  @ApiPropertyOptional({example: 2})
  @IsIn(["id", "code", "name", "createAt", "unionDeptId"])
  sortBy?: string = "createAt";

  @ApiPropertyOptional({example: 2})
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc";
}

export class CreateFacultyDto {
  @ApiProperty({ example: "CSE"})
  @IsString({ message: "Mã phải là một chuỗi"})
  @IsNotEmpty({ message: "Mã không được phép để trống"})
  code: string;

  @ApiProperty({ example: "Khoa học và Kỹ thuật Máy tính"})
  @IsString({ message: "Tên phải là một chuỗi"})
  @IsNotEmpty({ message: "Tên phải là một chuỗi"})
  name: string;

  @ApiProperty({ example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
  @IsString({ message: "Id của công đoàn bộ phận phải là một chuỗi"})
  @IsNotEmpty({ message: "Id của công đoàn bộ phận không được để trống"})
  unionDeptId: string;
}

export class CreateManyFaculties{
  @ApiProperty({
    type: [CreateFacultyDto],
  })
  @IsNotEmpty({ message: "Danh sách khoa/phòng ban không được phép để trống"})
  @IsArray({ message: "Danh sách khoa/phòng ban phải là một mảng"})
  faculties: CreateFacultyDto[]
}

export class EditFacultyDto {
  @ApiProperty({example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
  @IsNotEmpty({ message: "Id của khoa/phòng ban không được để trống"})
  @IsUUID()
  id: string;

  @ApiProperty({ example: "CSE"})
  @IsString({ message: "Mã phải là một chuỗi"})
  @IsNotEmpty({ message: "Mã không được phép để trống"})
  code: string;

  @ApiProperty({ example: "Khoa học và Kỹ thuật Máy tính"})
  @IsString({ message: "Tên phải là một chuỗi"})
  @IsNotEmpty({ message: "Tên phải là một chuỗi"})
  name: string;

  @ApiProperty({ example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
  @IsString({ message: "Id của công đoàn bộ phận phải là một chuỗi"})
  @IsNotEmpty({ message: "Id của công đoàn bộ phận không được để trống"})
  unionDeptId: string;
}

export class EditManyFaculties{
  @ApiProperty({type: [EditFacultyDto]})
  @IsNotEmpty({ message: "Danh sách khoa/phòng ban không được phép để trống"})
  @IsArray({ message: "Danh sách khoa/phòng ban phải là một mảng"})
  faculties: EditFacultyDto[]
}

export class DeleteFacultyDto {
  @ApiProperty({example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
  @IsNotEmpty({ message: "Id của khoa/phòng ban không được để trống"})
  @IsUUID()
  id: string;

  @ApiProperty({ example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
  @IsString({ message: "Id của công đoàn bộ phận phải là một chuỗi"})
  @IsNotEmpty({ message: "Id của công đoàn bộ phận không được để trống"})
  unionDeptId: string;
}
