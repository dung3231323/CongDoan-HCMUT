import { Test, TestingModule } from "@nestjs/testing";
import { AchievementController } from "./achievement.controller";
import { AchievementService } from "./achievement.service";
import { CreateAchievementDto, EditAchievementDto, GetAchievementsWithPaginationDto } from "./dto";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { Achievement, PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ACHIEVE_MESSAGES } from "src/common/constants";

const testAllAchievementsDto = [
  {
    facultyName: "Faculty of Science",
    id: "achieve1",
    createAt: new Date("2023-01-01"),
    updateAt: new Date("2023-01-02"),
    no: "001",
    content: "Achievement 1",
    signDate: new Date("2023-01-01"),
    facultyId: "faculty1",
  },
];

const testAchievement: Achievement = {
  id: "achievement1",
  createAt: new Date("2023-01-01"),
  updateAt: new Date("2023-01-02"),
  no: "001",
  content: "Achievement 1",
  signDate: new Date("2023-01-01"),
  facultyId: "faculty1",
};

const mockAchievementService = {
  createAchievement({ facultyId, content, no, signDate }: CreateAchievementDto) {
    return {
      facultyId,
      content,
      no,
      signDate,
    };
  },
  isFacultyWithIdInUnion(facultyId: string, unionDeptId: string) {
    return true;
  },
  getAchievementsWithPagination(body: GetAchievementsWithPaginationDto) {
    // Mock implementation for getAllAchievements
    return testAllAchievementsDto;
  },
  getAllAchievements() {
    return testAllAchievementsDto;
  },
  getAchievementById(id: string) {
    return testAchievement;
  },
  editAchievement(body: EditAchievementDto) {
    return testAchievement;
  },
  deleteAchievement(id: string) {
    return testAchievement;
  },
};
const mockPrismaService = {
  achievement: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
};

describe("Achievement Controller", () => {
  let controller: AchievementController;
  let service: AchievementService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementController],
      providers: [
        {
          provide: AchievementService,
          useValue: mockAchievementService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
    service = module.get<AchievementService>(AchievementService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  const user: JwtPayLoad = { role: "ADMIN", unionDeptId: "id", email: "test@email.com", exp: 1, iat: 1, sub: "1" };

  describe("createAchievemnt", () => {
    const createAchievementBody: CreateAchievementDto = {
      facultyId: "testid",
      content: "content",
      no: "no",
      signDate: new Date(),
    };

    it("should return created achievement", async () => {
      await expect(controller.createAchievement(createAchievementBody, user)).resolves.toEqual({
        message: ACHIEVE_MESSAGES.CREATE_SUCCESS,
        data: {
          facultyId: createAchievementBody.facultyId,
          content: createAchievementBody.content,
          no: createAchievementBody.no,
          signDate: createAchievementBody.signDate,
        },
      });
    });
  });

  describe("getAllAchievement", () => {
    const body: GetAchievementsWithPaginationDto = {
      page: 1,
      order: "asc",
      pageSize: 10,
      sortBy: "createAt",
    };
    it("should return achievements with pagination", async () => {
      await expect(controller.getAchievementsWithPagination(body, user)).resolves.toEqual({
        message: ACHIEVE_MESSAGES.SUCCESS,
        data: testAllAchievementsDto,
      });
    });

    it("should return all achievements", async () => {
      await expect(controller.getAllAchievements(user)).resolves.toEqual({
        message: ACHIEVE_MESSAGES.GET_ALL_ACHIEVEMENT_SUCCESS,
        data: testAllAchievementsDto,
      });
    });
  });

  // describe("")

  describe("getAchievementById", () => {
    it("should return achievement by id", async () => {
      const id = "testid";
      // const achievement = await controller.getAchievementById(id, user);
      await expect(controller.getAchievementById(id, user)).resolves.toEqual({
        message: ACHIEVE_MESSAGES.SUCCESS,
        data: testAchievement,
      });
    });
  });

  //no need for edit achievement
  describe("EditAchievement", () => {
    it("should return edited achievement", async () => {
      await expect(
        controller.editAchievement({ id: "asdf", facultyId: "asdf" } as EditAchievementDto, user),
      ).resolves.toEqual({
        message: ACHIEVE_MESSAGES.SUCCESS,
        data: testAchievement,
      });
    });
  });

  describe("DeleteAchievement", () => {
    it("should return deleted achievement", async () => {
      const id = "testid";
      await expect(controller.deleteAchievement({ id }, user)).resolves.toEqual({
        message: ACHIEVE_MESSAGES.SUCCESS,
        data: testAchievement,
      });
    });
  });
});
