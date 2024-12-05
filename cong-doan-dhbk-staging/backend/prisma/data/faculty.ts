import { Faculty } from "@prisma/client";
import { FacultyId, UnionId } from "./constants";

export const facultyData = [
  {
    id: FacultyId.CSE,
    code: "CSE",
    name: "Khoa Khoa Hoc Va ky Thuat May Tinh",
    unionDeptId: UnionId.CSE,
  },
] as Faculty[];
