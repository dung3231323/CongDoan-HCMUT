import { Category } from "@prisma/client";
import { CategoryId } from "./constants";

export const CategoryData = [
  {
    name: "Thể Thao",
    id: CategoryId.Sport,
  },
  {
    name: "Lễ Hội",
    id: CategoryId.Festival,
  },
] as Category[];

