import { Achievement } from "@prisma/client";
import { FacultyId } from "./constants";

export const achievementData = [
  {
    content: "ICPC",
    no: "123/VN",
    signDate: new Date(),
    facultyId: FacultyId.CSE,
  },
] as Achievement[];
