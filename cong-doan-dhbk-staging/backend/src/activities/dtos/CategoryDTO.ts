import { ApiProperty } from "@nestjs/swagger";
import { Activity, Category } from "@prisma/client";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IdDto } from "./ActivityDTO";

export class editCategoryDto {
    @ApiProperty({ example: "Công đoàn 1" })
    @IsString({ message: "Tên phải là một chuỗi" })
    @IsNotEmpty({ message: "Tên Không được phép để trống" })
    name: string;

    @ApiProperty({ example: "123" })
    @IsString({ message: "id phải là một chuỗi" })
    @IsNotEmpty({ message: "id Không được phép để trống" })
    @IsUUID('4', { message: "id của loại hoạt động không hợp lệ" })
    id: string
}

export class createCategoryDto {
    @ApiProperty({ example: "Công đoàn 1" })
    @IsString({ message: "Tên phải là một chuỗi" })
    @IsNotEmpty({ message: "Tên Không được phép để trống" })
    name: string;
}

//-------- DTO which is used for Response Type in swagger

export class createCategoryDtoRes {
    @ApiProperty()
    message:string
    @ApiProperty({type: createCategoryDto})
    data: Category
}
export class editCategoryDtoRes {
    @ApiProperty()
    message:string
    @ApiProperty({type: editCategoryDto})
    data: Category
}

export class getAllCategoryDto {
    @ApiProperty()
    id:string
    @ApiProperty()
    name:string
    @ApiProperty()
    createdAt:Date
    @ApiProperty()
    updatedAt:Date
    @ApiProperty({type:[String]})
    activities: string[]
}

export class getAllCategoryDtoRes {
    @ApiProperty()
    message:string
    @ApiProperty({type: [getAllCategoryDto]})
    data: Category
}

export class getCategoryDtoRes {
    @ApiProperty()
    message: string
    @ApiProperty({ type: getAllCategoryDto })
    data: Category
}

export class deleteCategoryDtoRes {
    @ApiProperty()
    message:string
    @ApiProperty({type: IdDto})
    data: Category
}