-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('WORKING', 'RESIGNATION', 'RETIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "familyName" TEXT,
    "givenName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MODERATOR',
    "unionDeptId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isUnionMember" BOOLEAN NOT NULL DEFAULT false,
    "dob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL DEFAULT 'Nguyen Van A',
    "phone" TEXT NOT NULL DEFAULT '+012345678',
    "sID" TEXT NOT NULL DEFAULT '1234',
    "uID" TEXT,
    "unionJoinDate" TIMESTAMP(3),
    "familyName" TEXT DEFAULT 'Nguyen Van ',
    "givenName" TEXT DEFAULT 'A',
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "numOfChildren" INTEGER NOT NULL DEFAULT 0,
    "workingStatus" "ParticipantStatus",
    "facultyName" TEXT NOT NULL DEFAULT 'MT',
    "facultyId" TEXT NOT NULL DEFAULT 'MT',
    "unionDeptId" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unionDeptId" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnionDepartment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "facultyCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UnionDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "activityStartDate" TIMESTAMP(3),
    "activityEndDate" TIMESTAMP(3),
    "imgURL" TEXT,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "unionDeptId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantAndActivity" (
    "activityId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "ParticipantAndActivity_pkey" PRIMARY KEY ("activityId","participantId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "no" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "signDate" TIMESTAMP(3) NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementsOnParticipants" (
    "achievementId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchievementsOnParticipants_pkey" PRIMARY KEY ("achievementId","participantId")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL DEFAULT '1',
    "familyName" TEXT NOT NULL DEFAULT 'Nguyen',
    "givenName" TEXT NOT NULL DEFAULT 'A',
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "dob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_sID_key" ON "Participant"("sID");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_uID_key" ON "Participant"("uID");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_code_key" ON "Faculty"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnionDepartment_code_key" ON "UnionDepartment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UnionDepartment_name_key" ON "UnionDepartment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_content_key" ON "Achievement"("content");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unionDeptId_fkey" FOREIGN KEY ("unionDeptId") REFERENCES "UnionDepartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_unionDeptId_fkey" FOREIGN KEY ("unionDeptId") REFERENCES "UnionDepartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_unionDeptId_fkey" FOREIGN KEY ("unionDeptId") REFERENCES "UnionDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_unionDeptId_fkey" FOREIGN KEY ("unionDeptId") REFERENCES "UnionDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantAndActivity" ADD CONSTRAINT "ParticipantAndActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantAndActivity" ADD CONSTRAINT "ParticipantAndActivity_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementsOnParticipants" ADD CONSTRAINT "AchievementsOnParticipants_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementsOnParticipants" ADD CONSTRAINT "AchievementsOnParticipants_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
