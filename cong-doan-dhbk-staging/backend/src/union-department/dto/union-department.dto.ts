import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator"
import { EditActivityResponseDto } from "src/activities/dtos/ActivityDTO";
import { FacultyDto } from "src/faculty/dto";
import { EditParticipantDto } from "src/participants/dto/dto.editParticipant";
import { EditUserResponseDto } from "src/users/response.dto";

export class GetAllUnionDepartmentDto {
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

export class createUnionDepartmentDto{
    @ApiProperty({example: "CSE"})
    @IsString({ message: "Mã phải là một chuỗi"})
    @IsNotEmpty({ message: "Mã không được phép để trống"})
    code: string

    @ApiProperty({example: "Khoa học và Kỹ thuật Máy tính"})
    @IsString({ message: "Mã phải là một chuỗi"})
    @IsNotEmpty({ message: "Mã không được phép để trống"})
    name: string

}

export class editUnionDepartmentDto{
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
}

export class deleteUnionDepartmentDto{
    @ApiProperty({example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
    @IsNotEmpty({ message: "Id của khoa/phòng ban không được để trống"})
    @IsUUID()
    id: string;

    @ApiPropertyOptional({example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
    @IsOptional()
    @IsString({ message: "ID của công đoàn bộ phận mới phải là một chuỗi" })
    newId?: string
}
