import { ApiProperty } from "@nestjs/swagger";
import { UnionDepartment,Activity, Faculty, Participant, User } from "@prisma/client";
import { EditActivityResponseDto } from "src/activities/dtos/ActivityDTO";
import { FacultyDto } from "src/faculty/dto";
import { EditParticipantDto } from "src/participants/dto/dto.editParticipant";
import { EditUserResponseDto } from "src/users/response.dto";
 
export class UnionDepartmentDto{
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

    @ApiProperty({example: 2})
    facultyCount: number
}

export class NameUnionDepartmentDto{
    @ApiProperty({example: "1484930b-2c8e-42a4-9b97-d24b848d26nb"})
    id: string

    @ApiProperty({example: "Khoa học và Kỹ thuật Máy tính"})
    name: string
}

export class GetAllUnionDepartmentResponseDto{
    @ApiProperty({example: "Success"})
    message: string

    @ApiProperty({type: [UnionDepartmentDto]})
    data: UnionDepartment[]
}

export class GetAllNameUnionDepartmentResponseDto{
    @ApiProperty({example: "Success"})
    message: string

    @ApiProperty({type: [NameUnionDepartmentDto]})
    data: NameUnionDepartmentDto[]
}

export class GeneralUnionDepartmentResponseDto{
    @ApiProperty({example: "Success"})
    message: string

    @ApiProperty({type: UnionDepartmentDto})
    data: UnionDepartment
}

class EntityBelongToUnionDepartmentDto{
    @ApiProperty({type: [FacultyDto]})
    faculties: Faculty[]

    @ApiProperty({type: [EditActivityResponseDto]})
    activities: Activity[]

    @ApiProperty({type: [EditParticipantDto]})
    participants: Participant[]

    @ApiProperty({type: [EditUserResponseDto]})
    moderators: User[]
}

export class EntityBelongToUnionDepartmentResponseDto{
    @ApiProperty({example: "Success"})
    message: string

    @ApiProperty({type: EntityBelongToUnionDepartmentDto})
    data: EntityBelongToUnionDepartmentDto
}

export class ValidateDeleteUnionDepartmentResponseDto{
    @ApiProperty({example: "Success"})
    message: string
}
