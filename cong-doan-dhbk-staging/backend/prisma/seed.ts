import { PrismaClient } from "@prisma/client";
import {
  achievementData,
  activityData,
  CategoryData,
  facultyData,
  participantsData,
  UnionId,
  UnionsData,
  usersData,
} from "./data";
const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    usersData.map(async (user) => {
      await prisma.user.create({ data: { ...user } });
    }),
  );

  await Promise.all(
    UnionsData.map(async (union) => {
      await prisma.unionDepartment.create({ data: { ...union } });
    }),
  );

  await Promise.all(
    facultyData.map(async (faculty) => {
      await prisma.faculty.create({ data: { ...faculty } });
    }),
  );

  await Promise.all(
    participantsData.map(async (participant) => {
      await prisma.participant.create({ data: { ...participant } });
    }),
  );

  await Promise.all(
    CategoryData.map(async (category) => {
      await prisma.category.create({ data: { ...category } });
    }),
  );

  await Promise.all(
    activityData.map(async (activity) => {
      await prisma.activity.create({
        data: {
          name: activity.name,
          activityStartDate: activity.activityStartDate,
          activityEndDate: activity.activityEndDate,
          category: {
            connect: {
              id: activity.categoryId,
            },
          },
          user: {
            connect: {
              id: activity.userId,
            },
          },
          unionDept: {
            connect: {
              id: activity.unionDeptId,
            },
          },
        },
      });
    }),
  );

  await Promise.all(
    achievementData.map(async (achievement) => {
      await prisma.achievement.create({ data: { ...achievement } });
    }),
  );
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
