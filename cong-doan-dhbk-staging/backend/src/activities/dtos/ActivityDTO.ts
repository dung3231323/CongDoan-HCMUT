import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class createActivityDto {
    @ApiProperty({ example: "Xuân tình nguyện" })
    @IsString({ message: "Tên phải là một chuỗi" })
    @IsNotEmpty({ message: "Tên Không được phép để trống" })
    name: string;

    @ApiPropertyOptional({ example: "https://example.com/image.jpg" })
    @IsOptional()
    imgURL?: string;

    @ApiProperty({ example: "2024-08-15T09:00:00Z" })
    @IsDate({ message: "Vui lòng nhập ngày bắt đầu diễn ra hoạt động theo định dạng yyyy-mm-dd" })
    @IsNotEmpty({ message: "Ngày bắt đầu diễn ra hoạt động không được phép để trống" })
    @Type(() => Date) // Chuyển đổi giá trị thành kiểu Date
    activityStartDate: Date;

    @ApiProperty({ example: "2024-08-15T17:00:00Z" })
    @IsDate({ message: "Vui lòng nhập ngày kết thúc hoạt động theo định dạng yyyy-mm-dd" })
    @IsNotEmpty({ message: "Ngày kết thúc hoạt động không được phép để trống" })
    @Type(() => Date) // Chuyển đổi giá trị thành kiểu Date
    activityEndDate: Date;
    
    @ApiProperty({ example: "123" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của loại hoạt động không hợp lệ" })
    categoryId: string;

    @ApiProperty({ example: "456" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của loại hoạt động không hợp lệ" })
    unionDeptId: string;

    @ApiPropertyOptional({ example: "Hoạt động tình nguyện do sinh viên khoa Khoa học và Kỹ thuật máy tính." })
    @IsOptional()
    description?: string;
}

export class editActivityDto {
    @ApiProperty({ example: "123" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của hoạt động không hợp lệ" })
    id: string;

    @ApiProperty({ example: "Xuân tình nguyện" })
    @IsString({ message: "Tên phải là một chuỗi" })
    @IsNotEmpty({ message: "Tên Không được phép để trống" })
    name: string;

    @ApiPropertyOptional({ example: "https://example.com/new-image.jpg" })
    @IsOptional()
    imgURL?: string;

    @ApiProperty({ example: "2024-08-16T09:00:00Z" })
    @IsDate({ message: "Vui lòng nhập ngày bắt đầu diễn ra hoạt động theo định dạng yyyy-mm-dd" })
    @IsNotEmpty({ message: "Ngày bắt đầu diễn ra hoạt động không được phép để trống" })
    @Type(() => Date) // Chuyển đổi giá trị thành kiểu Date
    activityStartDate: Date;

    @ApiProperty({ example: "2024-08-16T17:00:00Z" })
    @IsDate({ message: "Vui lòng nhập ngày kết thúc hoạt động theo định dạng yyyy-mm-dd" })
    @IsNotEmpty({ message: "Ngày kết thúc hoạt động không được phép để trống" })
    @Type(() => Date) // Chuyển đổi giá trị thành kiểu Date
    activityEndDate: Date;

    @ApiProperty({ example: "789" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của loại hoạt động không hợp lệ" })
    categoryId: string;

    @ApiProperty({ example: "987" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của đơn vị không hợp lệ" })
    unionDeptId: string;

    @ApiPropertyOptional({ example: "Hoạt động tình nguyện do sinh viên khoa Khoa học và Kỹ thuật máy tính." })
    @IsOptional()
    description?: string;
}

export class AddManyParticipantsDto {
    @ApiProperty({ example: "123" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của hoạt động không hợp lệ" })
    activityId: string;

    @ApiProperty({ example: ["1", "2", "3"] })
    @IsNotEmpty({ message: "Danh sách người tham gia không được phép để trống" })
    participants: string[];
}

export class IdDto {
    @ApiProperty({ example: "123" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id không hợp lệ" })
    id: string;
}

export class FilterActivity {
    @ApiProperty({ example: ["123", "456", "789"] })
    @IsNotEmpty({ message: "Danh sách ids không được phép để trống" })
    ids: string[];

    @ApiPropertyOptional({ example: "2024-08-01T00:00:00Z" })
    @IsOptional()
    @IsDate({ message: "Vui lòng nhập ngày bắt đầu theo định dạng yyyy-mm-dd" })
    startDate?: Date;

    @ApiPropertyOptional({ example: "2024-08-31T23:59:59Z" })
    @IsOptional()
    @IsDate({ message: "Vui lòng nhập ngày kết thúc theo định dạng yyyy-mm-dd" })
    endDate?: Date;
}


//-------- DTO which is used for Response Type in swagger


export class EditActivityResponseDto {
    @ApiProperty({ example: "123" })
    id: string;

    @ApiProperty({ example: "2024-08-16" })
    createAt: Date;

    @ApiProperty({ example: "2024-08-16" })
    updateAt: Date;

    @ApiProperty({ example: "Xuân tình nguyện" })
    name: string;

    @ApiPropertyOptional({ example: "https://example.com/new-image.jpg" })
    imgURL?: string;

    @ApiProperty({ example: "2024-08-16T09:00:00Z" })
    activityStartDate: Date;

    @ApiProperty({ example: "2024-08-16T17:00:00Z" })
    activityEndDate: Date;

    @ApiProperty({ example: "789" })
    categoryId: string;

    @ApiProperty({ example: "987" })
    unionDeptId: string;

    @ApiPropertyOptional({ example: "Hoạt động tình nguyện do sinh viên khoa Khoa học và Kỹ thuật máy tính." })
    description?: string;
}
