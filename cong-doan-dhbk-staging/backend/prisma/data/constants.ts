import { v4 as uuidv4 } from "uuid";

export const generateUUID = () => {
  return uuidv4() as string;
};

export const UserId = {
  test: generateUUID(),
};
export const UnionId = {
  CSE: generateUUID(),
  Union1: generateUUID(),
  Union2: generateUUID(),
};

export const FacultyId = {
  CSE: generateUUID(),
  Faculty1: generateUUID(),
  Faculty2: generateUUID(),
};

export const CategoryId = {
  Sport: generateUUID(),
  Festival: generateUUID(),
};
