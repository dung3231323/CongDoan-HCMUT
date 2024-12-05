import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateAchievementDto,
  EditAchievementDto,
  GetAchievementsWithPaginationDto,
  InsertListOfParticipantsDTO,
} from "./dto";
import { ACHIEVE_MESSAGES } from "src/common/constants";
import { Achievement, UserRole } from "@prisma/client";
@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async isFacultyWithIdInUnion(facultyId: string, unionDeptId: string) {
    const faculty = await this.prisma.faculty.findFirst({
      where: {
        id: facultyId,
        unionDeptId,
      },
    });

    return !!faculty;
  }
  async isParticipantInUnionDept(participantId: string, unionDeptId: string) {
    const participant = await this.prisma.participant.findFirst({
      where: {
        id: participantId,
      },
    });

    if (!participant) throw new NotFoundException(ACHIEVE_MESSAGES.PARTICIPANT_NOT_FOUND);
    return participant.unionDeptId === unionDeptId;
  }

  async createAchievement({ content, no, signDate, facultyId }: CreateAchievementDto) {
    return await this.prisma.achievement.create({
      data: {
        content,
        no,
        signDate: new Date(signDate),
        faculty: {
          connect: {
            id: facultyId,
          },
        },
      },
      // select: {
      //   content: true,
      //   no: true,
      //   signDate: true,
      //   id: true,
      //   facultyId: true,
      // },
    });
  }

  async getAchievementById(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: {
        id,
      },
    });

    if (!achievement) {
      throw new NotFoundException(ACHIEVE_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }
    return achievement;
  }

  async getAchievementsWithPagination(
    { page, pageSize, sortBy, order }: GetAchievementsWithPaginationDto,
    user_role: UserRole,
    unionDeptId: string,
  ) {
    let whereClause: any = undefined;
    if (user_role === "MODERATOR") {
      whereClause = {
        faculty: {
          unionDept: {
            id: unionDeptId,
          },
        },
      };
    }

    const achievements = await this.prisma.achievement.findMany({
      where: whereClause,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        faculty: {
          select: { name: true },
        },
      },
    });

    const modifiedAchievements = achievements.map((achievement) => ({
      ...achievement,
      facultyName: achievement.faculty.name, //this is questionable
      faculty: undefined, // Optionally remove the original faculty object
    }));

    return modifiedAchievements;
  }

  async getAllAchievements(user_role: UserRole, unionDeptId: string) {
    let whereClause: any = undefined;
    if (user_role === "MODERATOR") {
      whereClause = {
        faculty: {
          unionDept: {
            id: unionDeptId,
          },
        },
      };
    }

    const achievements = await this.prisma.achievement.findMany({ where: whereClause, orderBy: { createAt: "desc" } });

    return achievements;
  }

  async editAchievement({ id, content, facultyId, no, signDate }: EditAchievementDto) {
    console.log(id);
    const existingAchievement = await this.prisma.achievement.findUnique({
      where: { id },
    });

    if (!existingAchievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }

    const updateData = {
      content: content ?? undefined,
      facultyId: facultyId ?? undefined,
      no: no ?? undefined,
      signDate: signDate ?? undefined,
    };

    // if (updateData.facultyId != null && user)

    return this.prisma.achievement.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteAchievement(id: string) {
    // const existingAchievement = await this.prisma.achievement.findUnique({
    //   where: { id },
    // });

    // if (!existingAchievement) {
    //   throw new NotFoundException(ACHIEVE_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    // }

    const achievement = await this.prisma.achievement.delete({
      where: {
        id,
      },
    });

    return achievement;
  }

  async getAchievementWithParticipants(id: string) {
    const { participants } = await this.prisma.achievement.findUnique({
      where: {
        id,
      },
      select: {
        participants: true,
      },
    });

    return participants;
  }

  async insertListOfParticipants({ id, participants }: InsertListOfParticipantsDTO) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      include: { participants: true },
    });
    if (!achievement) {
      throw new NotFoundException("Achievement not found");
    }

    const currentParticipantIds = achievement.participants.map((p) => p.participantId as string);

    //filter the list of new participant
    const newParticipants = participants.filter((participant) => !currentParticipantIds.includes(participant.id));

    const participant = await Promise.all(
      newParticipants.map(async (participant) => {
        const participantExist = await this.prisma.participant.findUnique({
          where: { id: participant.id },
        });

        //check if participant exist
        if (!participantExist) {
          throw new NotFoundException(`Participant ${participant.id} not found`);
        }

        return this.prisma.achievement.update({
          where: { id },
          data: {
            participants: {
              create: [
                {
                  participant: {
                    connect: {
                      id: participant.id,
                    },
                  },
                },
              ],
              // connect: [{ participantId: participant.id }], // Assuming the relation is directly with the Participant ID
            },
          },
        });
      }),
    );

    return participant;
  }

  async getAchievementsByFaculty(content: string, startDate: Date, endDate: Date, facultyId: string) {
    let whereClause = { facultyId };
    if (content) whereClause["content"] = content;
    if (startDate && endDate) {
      whereClause["signDate"] = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      whereClause["signDate"] = {
        gte: startDate,
      };
    } else if (endDate) {
      whereClause["signDate"] = {
        lte: endDate,
      };
    }
    console.log(whereClause);
    const achievements = await this.prisma.achievement.findMany({
      where: whereClause,
    });

    return achievements;
  }

  async getAchievementsByParticipant(content: string, startDate: Date, endDate: Date, participantId: string) {
    let achievementsWhereClause = {};
    if (content) {
      achievementsWhereClause["content"] = {
        contains: content, // Assuming 'contains' for a partial match; adjust as needed
      };
    }
    if (startDate && endDate) {
      achievementsWhereClause["signDate"] = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      achievementsWhereClause["signDate"] = {
        gte: startDate,
      };
    } else if (endDate) {
      achievementsWhereClause["signDate"] = {
        lte: endDate,
      };
    }
    const participantWithAchievements = await this.prisma.participant.findUnique({
      where: { id: participantId },
      include: { achievements: { include: { achievement: true } } },
    });

    const achievements = participantWithAchievements.achievements.map((achievement) => {
      return achievement.achievement;
    });

    const filteredAchievements = achievements.filter((achievement) => {
      for (const key in achievementsWhereClause) {
        if (
          achievement[key] !== achievementsWhereClause[key] &&
          !achievement[key].includes(achievementsWhereClause[key])
        ) {
          return false;
        }
      }
      return true;
    });

    if (participantWithAchievements && participantWithAchievements.achievements) {
      return participantWithAchievements.achievements;
    } else {
      // Handle case where no participant or achievements are found
      return [] as Achievement[]; // Return an empty array or handle as needed
    }
    // let whereClause = { participantId };
    // if (content) whereClause["content"] = content;
    // if (startDate && endDate) {
    //   whereClause["signDate"] = {
    //     gte: startDate,
    //     lte: endDate,
    //   };
    // } else if (startDate) {
    //   whereClause["signDate"] = {
    //     gte: startDate,
    //   };
    // } else if (endDate) {
    //   whereClause["signDate"] = {
    //     lte: endDate,
    //   };
    // }
    // console.log(whereClause);
    // const achievements = await this.prisma.achievement.findMany({
    //   where: whereClause,
    // });

    // return achievements;
  }
}
