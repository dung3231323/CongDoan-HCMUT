import { Activity } from "@prisma/client";
import { CategoryId, UnionId, UserId } from "./constants";

export const activityData = [
  {
    name: "Bong da 1",
    activityStartDate: new Date(),
    activityEndDate: new Date(),
    categoryId: CategoryId.Sport,
    userId: UserId.test,
    unionDeptId: UnionId.CSE,
  },
  {
    name: "Tet",
    activityStartDate: new Date(),
    activityEndDate: new Date(),
    categoryId: CategoryId.Festival,
    userId: UserId.test,
    unionDeptId: UnionId.CSE,
  },
] as Activity[];
