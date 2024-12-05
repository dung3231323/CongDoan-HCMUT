import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Res,
} from "@nestjs/common";
import {
    AddManyParticipantsDto,
    createActivityDto,
    editActivityDto,
    EditActivityResponseDto,
    FilterActivity,
    IdDto,
} from "../dtos/ActivityDTO";
import {
    FORBIDDEN,
    SUCCESS,
} from "src/common/constants/activity.category";
import { ActivitiesService } from "./activities.service";
import { GetUser, Public } from "src/common/decorators";
import { Request, Response } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { AuthGuard } from "@nestjs/passport";
import { UserRole } from "@prisma/client";
import { ResponseClient } from "src/response/response.entity";

//@Public()
@ApiBearerAuth()
@ApiTags("activity")
@Controller("activity")
//@UseGuards(AuthGuard('jwt'))
export class ActivitiesController {
    constructor(
        private activityService: ActivitiesService,
        private response: ResponseClient
    ) { }

    @ApiCreatedResponse({description: "Create activity", type: createActivityDto})
    @Post("/create")
    async create(
        @Body() activity: createActivityDto,
        @Res() res: Response,
        @GetUser() user: JwtPayLoad
    ) {
        console.info(user.sub);
        const resultCate = await this.activityService.createActivity(activity, user);
        this.response.ResponseClient(SUCCESS, resultCate)
        return res.status(HttpStatus.CREATED).json(this.response)
    }

    @ApiOkResponse({description: "Edit activity", type: EditActivityResponseDto})
    @Patch("/edit") //Patch update part of data, @Put update full data 
    async edit(
        @Body() activity: editActivityDto,
        @Res() res: Response,
        @GetUser() user: JwtPayLoad
    ) {
        const updatedActivity =
            await this.activityService.updateActivity(activity, user.unionDeptId);
        this.response.ResponseClient(SUCCESS, updatedActivity)
        return res.status(HttpStatus.OK).json(this.response)
    }

    @Post("/participants")
    async getList(
        @Body() body: AddManyParticipantsDto,
        @Res() res: Response,
        @GetUser() user: JwtPayLoad
    ) {

        //It has getParticipantById to validate participantId exist in database so I don't comment it
        const participantList = await Promise.all(
            body.participants.map(async (participant) => {
                const newParticipant =
                    await this.activityService.getParticipantById(participant);
                return newParticipant;
            }),
        );
        //this is function to validate: USER ONLY ADD MANY PARTICIPANT IN SAME UNIONDEPT
        //await this.activityService.isUserHasQueryLsParticipant(participantList, user)

        await this.activityService.insertParticipants(
            body.activityId,
            body.participants,
        );
        this.response.ResponseClient(SUCCESS, body.participants)
        return res.status(HttpStatus.OK).json(this.response)
    }

    @Get("/all")
    async getAll(
        @Res() res: Response,
        @GetUser() user: JwtPayLoad
    ) {

        const activities = await this.activityService.getALLData();
        this.response.ResponseClient(SUCCESS, activities)
        return res.status(HttpStatus.OK).json(this.response)

    }

    @Get("/:id")
    async getId(
        @Res() res: Response,
        @Param('id') id: string,
        @GetUser() user: JwtPayLoad
    ) {

        const activity = await this.activityService.getActivity(id);
        this.response.ResponseClient(SUCCESS, activity)
        return res.status(HttpStatus.OK).json(this.response)

    }

    @Delete("/delete")
    async deleteActivity(@Query() {id}: IdDto, @Res() res: Response) {

        const activityDelete = await this.activityService.getActivity(id);
        await this.activityService.deleteAct(id);
        this.response.ResponseClient(SUCCESS, activityDelete)
        return res.status(HttpStatus.OK).json(this.response)

    }
    @Post("/filter/unionDepts")
    async getParticipantsBylistUnionDept(
        @Body() body: FilterActivity,
        @Res() res: Response,
    ) {

        await this.activityService.checkUnionDepts(body.ids);

        const activities = await this.activityService.getActivitiesFromListUnionDept(body)


        this.response.ResponseClient(SUCCESS, activities)
        return res.status(HttpStatus.OK).json(this.response)

    }
    @Post("/filter/participants")
    async getParticipantsBylistParticipants(
        @Body() body: FilterActivity,
        @Res() res: Response,
    ) {
        await this.activityService.checkParticipants(body.ids)

        const activities = await this.activityService.getActivitiesFromListPar(body)

        this.response.ResponseClient(SUCCESS, activities)
        return res.status(HttpStatus.OK).json(this.response)
    }
}
