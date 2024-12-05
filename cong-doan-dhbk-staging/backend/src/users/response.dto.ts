import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "John Doe" })
  name: string;
}
class GetAllMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  take: number;

  @ApiProperty({ example: 2 })
  itemCount: number;

  @ApiProperty({ example: 2 })
  totalItem: number;

  @ApiProperty({ example: 1 })
  pageCount: number;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ example: false })
  hasNextPage: boolean;
}
export class GetAllUsersResponseDto {
  //   @ApiProperty({ example: "Get all users successfully, data's type is User[] with full properties" })
  //   message: string;

  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty()
  meta: GetAllMetaDto;
}

export class GetMeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "johndoe@gmail.com" })
  email: string;

  @ApiProperty({ example: "John" })
  firstName: string;

  @ApiProperty({ example: "Doe" })
  lastName: string;
}

export class EditUserResponseDto {
  @ApiProperty({ example: "1" })
  id: string;

  @ApiProperty({ example: "JohnDoe@gmail.com" })
  email: string;

  @ApiProperty({ example: "John" })
  firstName: string;

  @ApiProperty({ example: "Doe" })
  givenName: string;
}

export class DeleteUserReponseDto {
  @ApiProperty({ example: "1" })
  id: string;

  @ApiProperty({ example: "JohnDoe@gmail.com" })
  email: string;

  @ApiProperty({ example: "John" })
  firstName: string;

  @ApiProperty({ example: "Doe" })
  givenName: string;
}

export class CreateUserResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  unionDeptId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
