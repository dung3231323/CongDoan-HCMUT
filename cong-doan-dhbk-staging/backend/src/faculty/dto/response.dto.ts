import { ApiProperty } from "@nestjs/swagger";
import { Faculty } from "@prisma/client";

export class FacultyDto{
    @ApiProperty({example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
    id: string

    @ApiProperty({example: "2024-08-16T09:00:00Z"})
    creatAt: Date

    @ApiProperty({example: "2024-08-16T09:00:00Z"})
    updateAt: Date

    @ApiProperty({example: "CSE"})
    code: string

    @ApiProperty({example: "Khoa học và Kỹ thuật Máy tính"})
    name: string

    @ApiProperty({example:  "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
    unionDeptId: string
}

export class GetAllFacultyResponseDto {
    @ApiProperty({example: "Success"})
    message: string

    @ApiProperty({type: [FacultyDto]})
    data: Faculty[]
}

export class GeneralFacultyResponseDto{
    @ApiProperty({example: "Success"})
    message: string

    @ApiProperty({type: FacultyDto})
    data: Faculty
}
