import { Participant } from "@prisma/client";
import { FacultyId, generateUUID, UnionId } from "./constants";

export const participantsData = [
  {
    email: "abc@gmail.com",
    familyName: "Doe",
    givenName: "John",
    phone: "123-456-7890",
    sID: "S123456789",
    dob: new Date("1990-01-01T00:00:00.000Z"),
    gender: "FEMALE",
    uID: "U123456789",
    unionDeptId: UnionId.CSE,
    workingStatus: "WORKING",
    unionJoinDate: new Date("2020-01-01T00:00:00.000Z"),
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    facultyId: FacultyId.CSE,
    id: generateUUID(),
    updatedAt: new Date("2021-01-01T00:00:00.000Z"),
  },
] as Participant[];
