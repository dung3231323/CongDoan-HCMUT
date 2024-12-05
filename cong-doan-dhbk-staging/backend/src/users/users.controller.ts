import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Public } from "src/common/decorators";
// import { CreateUserDto,  UpdateUserDto } from 'src/users/UserDto';
import { CreateUserDto } from "./UserDto/create-user.dto";
import { UpdateUserDto } from "./UserDto/update-user.dto";
import { GetUserDto } from "./UserDto/get-user.dto";
import { UsersService } from "./users.service";
// import { JwtGuard } from 'src/common/guards';
// import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { GetUser } from "../common/decorators/get-user.decorator";
import { Request } from "express";
import { Order, PageOptionsDto } from "src/dtos";
import { CreateUserMeta } from "./UserDto/create-meta.dto";
import { USERS_MESSAGE } from "src/common/constants";
import { create } from "node:domain";
import { DeleteUserReponseDto, EditUserResponseDto, GetAllUsersResponseDto, GetMeResponseDto } from "./response.dto";

@ApiBearerAuth()
@ApiTags("users")
// @Public()
@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: "Get all users" })
  @ApiOkResponse({
    status: 200,
    description: "Get all users successfully, data's type is User[] with full properties",
    schema: {
      example: {
        data: [
          { id: "1", email: "1@gmail.com" },
          { id: "2", email: "2@gmail.com" },
        ],
        meta: {
          page: 1,
          take: 10,
          itemCount: 2,
          totalItem: 2,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      },
    },
    type: GetAllUsersResponseDto,
  })
  // @ApiBadRequestResponse({ status: 400, description: "Bad request" })
  @UsePipes(ValidationPipe)
  @Get()
  async getUsers(@Query() query: PageOptionsDto) {
    query.take = query.take != undefined ? query.take : 10;
    query.page = query.page != undefined ? query.page : 1;
    query.skip = (query.page - 1) * query.take;
    query.order = query.order != undefined ? query.order : Order.ASC;

    return await this.userService.getAll(query);
  }

  @ApiOperation({ summary: "Get the current user" })
  @ApiOkResponse({
    status: 200,
    description: "Get user successfully, return User type with full properties",
    schema: {
      example: {
        id: "1",
        email: "HoangDeSaMac@gmail.com",
        firstName: "aaa",
        givenName: "bbb",
      },
      description: "The current user's info is returned, include other fields like createdAt, updatedAt, etc.",
    },
    type: GetMeResponseDto,
  })
  // @ApiBadRequestResponse({ status: 400, description: "Bad request" })
  @ApiHeader({ name: "Jwt bearer", description: "Bearer token for authentication" })
  @Get("me")
  async getMe(@GetUser() user) {
    var userId = user.sub;
    return await this.userService.getCurrentUser(userId);
  }

  @ApiOperation({ summary: "Edit info of the user" })
  @ApiOkResponse({
    status: 200,
    description: "Edit user successfully, return User type with full properties",
    schema: {
      example: {
        id: "1",
        email: "updated@gmail.com",
        firstName: "newName",
        givenName: "newName",
      },
    },
    type: EditUserResponseDto,
  })
  @ApiNotFoundResponse({ status: 404, description: USERS_MESSAGE.ID_NOT_FOUND })
  @ApiNotFoundResponse({ status: 404, description: USERS_MESSAGE.UNION_NOT_FOUND })
  @UsePipes(ValidationPipe)
  @Patch("edit")
  async editInfo(@Body() req: UpdateUserDto) {
    return await this.userService.editInfo(req);
  }

  @ApiOperation({ summary: "Delete user" })
  @ApiOkResponse({
    status: 200,
    description: "Delete user successfully, return User type with full properties",
    schema: {
      example: {
        id: "1",
        email: "deleted@gmail.com",
        firstName: "aaa",
        givenName: "bbb",
      },
      description: "The deleted user's info is returned, include other fields like createdAt, updatedAt, etc.",
    },
    type: DeleteUserReponseDto,
  })
  @ApiNotFoundResponse({ status: 404, description: USERS_MESSAGE.ID_NOT_FOUND })
  @Delete("delete")
  async deleteUser(@Query("id") id: string) {
    return await this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: "Create a new user" })
  @ApiCreatedResponse({
    status: 201,
    description: "Create user successfully, return User type with full properties",
    schema: {
      example: {
        email: "newEmail@gmail.com",
        role: "ADMIN",
        unionDeptId: "CSE",
        firstName: "---",
        givenName: "---",
      },
      description:
        "Both firstName and givenName will be updated by default, the email's name on their first login. Other info are also returned, such as ID, createdAt, updatedAt, etc.",
    },
    type: CreateUserDto,
  })
  @ApiNotFoundResponse({ status: 404, description: USERS_MESSAGE.ID_NOT_FOUND })
  @ApiNotFoundResponse({ status: 400, description: USERS_MESSAGE.UNION_NOT_FOUND })
  @UsePipes(ValidationPipe)
  @Post("create")
  async createUser(@Body() req: CreateUserDto) {
    return await this.userService.createUser(req);
  }

  @ApiOperation({ summary: "Create new users" })
  @ApiCreatedResponse({
    status: 201,
    description: "Create user successfully. In this case, the goodEmail is created, while the badEmail is NOT created",
    schema: {
      example: {
        meta: { userCount: 2, successCount: 1 },
        users: [
          { email: "goodEmail@gmail.com", result: "Success", reason: "Success" },
          { email: "badEmail@gmail.com", result: "Fail", reason: "Email is already existed" },
        ],
      },
    },
  })
  // @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: { $ref: getSchemaPath(CreateUserDto) },
        },
      },
      example: {
        users: [
          {
            email: "Arisu@millen.com",
            role: "ADMIN",
            unionDeptId: "CSE",
          },
          {
            email: "faker@t1.com",
            role: "MODERATOR",
            unionDeptId: "FAS",
          },
        ],
      },
    },
  })
  @UsePipes(ValidationPipe)
  @Post("createMany")
  async createMany(@Body() req: { users: CreateUserDto[] }) {
    const users = await Promise.all(req.users.map((user) => this.userService.createEach(user)));

    const successCount = users.filter((user) => user.result === "Success").length;
    const meta: CreateUserMeta = new CreateUserMeta(users.length, successCount);

    return { users, meta };
  }
}
