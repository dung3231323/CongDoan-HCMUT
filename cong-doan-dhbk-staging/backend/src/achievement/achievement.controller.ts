import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import {
  CreateAchievementDto,
  CreateAchievementResponseDto,
  DeleteAchievementResponseDto,
  EditAchievementDto,
  EditAchievementResponseDto,
  GetAchievementsPaginationResponseDto,
  GetAchievementsWithPaginationDto,
  InsertListOfParticipantsDTO,
  deleteAchievementDto,
  getAchievementsByFacultyDto,
  getFilteredAchievementsDto,
  getParticipantsFromAchievementDto,
  // getAchievementByIdDto,
} from "./dto";
import { AchievementService } from "./achievement.service";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { GetUser } from "src/common/decorators";
import { ACHIEVE_MESSAGES } from "src/common/constants";
import { ADD_MODERATOR } from "src/common/decorators/moderator.decorator";
@ApiBearerAuth()
@ApiTags("achievement")
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@ApiBadRequestResponse({ description: "Bad request" })
@Controller("achievement")
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  // @Public()

  validateTokenPermission(user: JwtPayLoad, body_unionCode: string) {
    if (user.role == "MODERATOR" && user.unionDeptId == null) return false;
    if (user.role != "ADMIN" && user.unionDeptId != body_unionCode) return false;
    return true;
  }
  async isUserHasPermission(user: JwtPayLoad, id: string) {
    const achievement = await this.achievementService.getAchievementById(id);
    if (user.role == "ADMIN") return achievement;

    const isUserHasPermission = await this.achievementService.isFacultyWithIdInUnion(
      achievement.facultyId,
      user.unionDeptId,
    );

    if (!isUserHasPermission) {
      throw new ForbiddenException(ACHIEVE_MESSAGES.INVALID_PERMISSION);
    }

    return achievement;
  }
  async isUserHasPermissionForFaculty(user: JwtPayLoad, id: string) {
    if (user.role === "ADMIN") return;
    const isFacultyInUnion = await this.achievementService.isFacultyWithIdInUnion(id, user.unionDeptId);

    if (!isFacultyInUnion) {
      throw new NotFoundException(ACHIEVE_MESSAGES.INVALID_PERMISSION);
    }
  }
  async isUserHasPermissionForParticipant(user: JwtPayLoad, id: string) {
    if (user.role === "ADMIN") return;
    const isParticipantInUnionResult = await this.achievementService.isParticipantInUnionDept(id, user.unionDeptId);

    if (!isParticipantInUnionResult) {
      throw new NotFoundException(ACHIEVE_MESSAGES.INVALID_PERMISSION);
    }
  }

  @ApiOperation({ summary: "Create achievement", description: "Admin create achievement" })
  @ApiCreatedResponse({ description: "Create achievement successfully", type: CreateAchievementResponseDto })
  // @ADD_MODERATOR()
  @Post("create")
  async createAchievement(@Body() createAchievementBody: CreateAchievementDto, @GetUser() user: JwtPayLoad) {
    console.log(user);

    const achievement = await this.achievementService.createAchievement(createAchievementBody);
    return {
      message: ACHIEVE_MESSAGES.CREATE_SUCCESS,
      data: { ...achievement },
    };
  }

  @ApiOperation({
    summary: "Get all achievements with pagination",
    // description: "Get all achievements with pagination",
  })
  @ApiOkResponse({ description: "Get all achievements successfully", type: GetAchievementsPaginationResponseDto })
  @ADD_MODERATOR()
  @Get("pagination")
  async getAchievementsWithPagination(@Query() body: GetAchievementsWithPaginationDto, @GetUser() user: JwtPayLoad) {
    const achievements = await this.achievementService.getAchievementsWithPagination(body, user.role, user.unionDeptId);

    if (achievements.length === 0) {
      throw new NotFoundException(ACHIEVE_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }

    return { message: ACHIEVE_MESSAGES.SUCCESS, data: achievements };
  }

  @Get()
  async getAllAchievements(@GetUser() user: JwtPayLoad) {
    const achievements = await this.achievementService.getAllAchievements(user.role, user.unionDeptId);

    if (achievements.length === 0) {
      throw new NotFoundException(ACHIEVE_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }
    return { message: ACHIEVE_MESSAGES.GET_ALL_ACHIEVEMENT_SUCCESS, data: achievements };
  }

  @ApiOperation({ summary: "Edit achievement" })
  @ApiOkResponse({ description: "Edit achievement successfully", type: EditAchievementResponseDto })
  @Patch("edit")
  async editAchievement(@Body() editAchievement: EditAchievementDto, @GetUser() user: JwtPayLoad) {
    if (editAchievement.facultyId != null && user.role == "MODERATOR") {
      throw new ForbiddenException(ACHIEVE_MESSAGES.INVALID_PERMISSION_TO_CHANGE_FACULTY);
    }

    await this.isUserHasPermission(user, editAchievement.id);

    //thieu viec neu edit thuoc tinh moi gay ra trung lap(se sua sau)
    const updateAchievement = await this.achievementService.editAchievement(editAchievement);

    return {
      message: ACHIEVE_MESSAGES.SUCCESS,
      data: { ...updateAchievement },
    };
  }

  // @Get("filter-by-faculty")
  async getAchievementsByFaculty(
    { option, content, startDate, endDate, facultyId }: getFilteredAchievementsDto,
    user: JwtPayLoad,
  ) {
    await this.isUserHasPermissionForFaculty(user, facultyId);
    const achievements = await this.achievementService.getAchievementsByFaculty(content, startDate, endDate, facultyId);

    if (achievements.length === 0) throw new NotFoundException(ACHIEVE_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    return { message: ACHIEVE_MESSAGES.SUCCESS, data: achievements };
  }

  async getAchievementByParticipant(
    { option, content, startDate, endDate, participantId }: getFilteredAchievementsDto,
    user: JwtPayLoad,
  ) {
    await this.isUserHasPermissionForParticipant(user, participantId);
    const achievements = await this.achievementService.getAchievementsByParticipant(
      content,
      startDate,
      endDate,
      participantId,
    );
    return {};
    // await this.isUserHasPermissionForFaculty(user, id);
    // const achievements =
    //   await this.achievementService.getAchievementsByFaculty();
    // return { message: ACHIEVE_MESSAGES.SUCCESS, data: achievements };
  }

  @Post("filter")
  async getFilteredAchievements(
    @Body() getFilteredAchievement: getFilteredAchievementsDto,
    @GetUser() user: JwtPayLoad,
  ) {
    if (getFilteredAchievement.option === "faculty") {
      return await this.getAchievementsByFaculty(getFilteredAchievement, user);
    }

    if (getFilteredAchievement.option === "participant") {
      return await this.getAchievementByParticipant(getFilteredAchievement, user);
    }

    throw new InternalServerErrorException("Get filtered achievement failed");
  }

  async getParticipantsFromAchievement(@Body() { id }: getParticipantsFromAchievementDto, @GetUser() user: JwtPayLoad) {
    await this.isUserHasPermission(user, id);

    const participants = await this.achievementService.getAchievementWithParticipants(id);

    if (participants.length === 0) {
      throw new NotFoundException(ACHIEVE_MESSAGES.PARTICIPANT_NOT_FOUND);
    }
    return { message: ACHIEVE_MESSAGES.SUCCESS, data: participants };
  }

  @ApiOperation({ summary: "Delete achievement" })
  @ApiOkResponse({ description: "Delete achievement successfully", type: DeleteAchievementResponseDto })
  @Delete("delete")
  async deleteAchievement(@Query() { id }: deleteAchievementDto, @GetUser() user: JwtPayLoad) {
    await this.isUserHasPermission(user, id);

    const deletedAchievement = await this.achievementService.deleteAchievement(id);

    return {
      message: ACHIEVE_MESSAGES.SUCCESS,
      data: deletedAchievement,
    };
  }

  @Post("insert-participants")
  async insertListOfParticipants(
    @Body() insertListOfParticipantBody: InsertListOfParticipantsDTO,
    @GetUser() user: JwtPayLoad,
  ) {
    await this.isUserHasPermission(user, insertListOfParticipantBody.id);

    const listOfParticipants = await this.achievementService.insertListOfParticipants(insertListOfParticipantBody);
    return { message: ACHIEVE_MESSAGES.SUCCESS, data: { listOfParticipants } };
  }

  @Get(":id")
  async getAchievementById(@Param("id") id: string, @GetUser() user: JwtPayLoad) {
    const achievement = await this.isUserHasPermission(user, id);

    return { message: ACHIEVE_MESSAGES.SUCCESS, data: { ...achievement } };
  }
}
