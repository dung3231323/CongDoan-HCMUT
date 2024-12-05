import { UnionDepartment } from "@prisma/client";
import { UnionId } from "./constants";

export const UnionsData = [
  { id: UnionId.CSE, code: "CSE", name: "Khoa Khoa Hoc Va ky Thuat May Tinh" },
  { id: UnionId.Union1, code: "UD1", name: "Union1" },
  { id: UnionId.Union2, code: "UD2", name: "Union2" },
] as UnionDepartment[];
