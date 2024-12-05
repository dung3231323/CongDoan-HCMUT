import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { createActivityDto, editActivityDto, FilterActivity } from "../dtos/ActivityDTO";
import { clear } from "console";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { ERROR_DB } from "src/common/constants";

@Injectable()
export class ActivitiesService {
    constructor(private readonly prisma: PrismaService) { }
    async createActivity(activity: createActivityDto, user: JwtPayLoad) {
        await this.ensureEntitiesExist(
            null,
            activity.categoryId,
            null,
            null
        )
        const existingUser = await this.prisma.user.findUnique({
            where: { id: user.sub },
        });
        if (!existingUser) {
            throw new Error(`${ERROR_DB.USER_NOTFOUND}: ${user.sub}`);
        }

        return await this.prisma.activity.create({
            data: {
                name: activity.name,
                imgURL: activity.imgURL,
                activityStartDate: activity.activityStartDate,
                activityEndDate: activity.activityEndDate,
                category: {
                    connect: {
                        id: activity.categoryId,
                    },
                },
                user:{
                    connect: {
                        id: user.sub,
                    },
                },
                unionDept: {
                    connect: {
                        id: activity.unionDeptId,
                    },
                },
                description: activity.description
            },
            select:{
                id:true,
                name:true,
                imgURL:true,
                activityStartDate:true,
                activityEndDate:true,
                categoryId:true,
                userId:true,
                unionDeptId:true,
                description:true
            }
        });
    }


    async getALLData() {
        return await this.prisma.activity.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                user: true,
                unionDept: true,
                participants: true,
                activityStartDate: true,
                activityEndDate: true,
                imgURL: true,
                updateAt: true,
                description: true
            },
            orderBy: {
                updateAt: 'desc'
            }
        });
    }
    async getActivity(id: string) {
        const activity = await this.prisma.activity.findUnique({
            where: {
                id: id
            },
        });

        if (!activity) {
            throw new NotFoundException(`${ERROR_DB.ACTIVITY_NOTFOUND}: ${id}`)
        }
        return activity
    }


    async updateActivity(activity: editActivityDto, unionDeptId: string) {
        await this.ensureEntitiesExist(
            activity.id,
            activity.categoryId,
            null,
            null
        )
        return await this.prisma.activity.update({
            where: { id: activity.id },
            data: {
                name: activity.name,
                activityEndDate: activity.activityStartDate,
                activityStartDate: activity.activityEndDate,
                categoryId: activity.categoryId,
                unionDeptId: activity.unionDeptId,
                imgURL: activity.imgURL,
                description: activity.description
            },
        });
    }
    async getParticipantById(id: string) {

        await this.ensureEntitiesExist(null, null, null, id)

        const participant = await this.prisma.participant.findUnique({
            where: {
                id: id,
            },
            select: {
                unionDeptId: true,
                id: true,
            },
        });

        return participant;
    }

    async getListParticipant(id: string) {
        return await this.prisma.activity.findUnique({
            where: {
                id: id,
            },
            include: {
                participants: true,
            },
        });
    }

    async insertParticipants(activityId: string, listParti: string[]) {

        await this.ensureEntitiesExist(activityId, null, null, null);

        const participantsToCreate = listParti.map((participantId) => ({
            participantId: participantId,
        }));
        return await this.prisma.activity.update({
            where: {
                id: activityId,
            },
            data: {
                updateAt: new Date(),
                participants: {
                    createMany: {
                        data: participantsToCreate,
                        skipDuplicates: true, // Bỏ qua nếu có bản ghi trùng lặp
                    },
                },
            },
        });
    }

    async deleteAct(id: string) {
        return await this.prisma.$transaction([
            this.prisma.participantAndActivity.deleteMany({
                where: {
                    activityId: id,
                },
            }),
            this.prisma.activity.delete({
                where: {
                    id: id,
                },
            }),
        ]);
    }

    async getActivitiesFromListUnionDept(body: FilterActivity) {

        const activityCondition = (body.startDate && body.endDate) ? {
            AND: [
                {
                    activityStartDate: {
                        gte: body.startDate
                    },
                    activityEndDate: {
                        lte: body.endDate
                    }
                }
            ]
        } : {}

        const activityData = await this.prisma.activity.findMany({
            where: {
                unionDept: {
                    id: {
                        in: body.ids
                    }
                },
                ...activityCondition
            },
            include: {
                participants: {
                    select: {
                        participantId: true
                    }
                }
            }
        });

        const activities = (activityData.map(activityId => ({
            ...activityId,
            participantIds: activityId.participants.map(participant => participant.participantId),
            participants: clear
        })))
        return activities
    }

    async getActivitiesFromListPar(body: FilterActivity) {

        const activityCondition = (body.startDate && body.endDate) ? {
            AND: [
                {
                    activityStartDate: {
                        gte: body.startDate
                    },
                    activityEndDate: {
                        lte: body.endDate
                    }
                }
            ]
        } : {}

        const activityData = await this.prisma.activity.findMany({
            where: {
                participants: {
                    some: {
                        participantId: {
                            in: body.ids
                        }
                    }
                },
                ...activityCondition
            },
            include: {
                participants: {
                    select: {
                        participantId: true
                    }
                }
            }
        });
        console.log(activityData)
        const activities = (activityData.map(activityId => ({
            ...activityId,
            participantIds: activityId.participants.map(participant => participant.participantId),
            participants: clear
        })))
        return activities
    }

    async checkUnionDepts(ids: string[]) {
        await Promise.all(
            ids.map(async (id) => {
                await this.ensureEntitiesExist(null, null, id, null)
            }),
        );
    }
    async checkParticipants(ids: string[]) {
        await Promise.all(
            ids.map(async (id) => {
                await this.ensureEntitiesExist(null, null, null, id)
            }),
        );
    }

    //------------check data exist in database -----------
    private async ensureEntitiesExist(activityId: string | null, categoryId: string | null, unionDeptId: string | null, participantId: string | null) {
        if (activityId != null) {
            const activityExists = await this.prisma.activity.findFirst({
                where: { id: activityId },
            });
            if (!activityExists) {
                throw new NotFoundException(
                    `${ERROR_DB.ACTIVITY_NOTFOUND}: ${activityId}`,
                );
            }
        }
        if (categoryId != null) {
            const categoryExists = await this.prisma.category.findFirst({
                where: { id: categoryId },
            });
            if (!categoryExists) {
                throw new NotFoundException(
                    `${ERROR_DB.CATEGORY_NOTFOUND}: ${categoryId}`,
                );
            }
        }
        if (unionDeptId != null) {
            const unionDeptExists = await this.prisma.unionDepartment.findFirst({
                where: { id: unionDeptId },
            });
            if (!unionDeptExists) {
                throw new NotFoundException(
                    `${ERROR_DB.UNIONDEPT_NOTFOUND}: ${unionDeptId}`,
                );
            }
        }
        if (participantId != null) {
            const participantExist = await this.prisma.participant.findFirst({
                where: { id: participantId }
            })

            if (!participantExist) {
                throw new NotFoundException(
                    `${ERROR_DB.PARTICIPANT_NOTFOUND}: ${participantId}`
                )
            }
        }
    }
}

