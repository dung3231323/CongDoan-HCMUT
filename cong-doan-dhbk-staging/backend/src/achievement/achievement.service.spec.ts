import { Test, TestingModule } from "@nestjs/testing";
import { AchievementService } from "./achievement.service";
import { PrismaService } from "../prisma/prisma.service";
describe("AchievementService", () => {
  let service: AchievementService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    achievement: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<AchievementService>(AchievementService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
