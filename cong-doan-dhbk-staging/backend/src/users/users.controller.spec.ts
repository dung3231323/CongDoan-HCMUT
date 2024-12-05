import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./UserDto/create-user.dto";
import { UpdateUserDto } from "./UserDto/update-user.dto";
import { GetUserDto } from "./UserDto/get-user.dto";
import { CreateUserMeta } from "./UserDto/create-meta.dto";
import { PrismaService } from "src/prisma/prisma.service";
import exp from "constants";
import { create } from "domain";
import { JwtService } from "@nestjs/jwt";

describe("UsersController test", () => {
  let controller: UsersController;
  let service: UsersService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockUserService = {
    editInfo: jest.fn(),
    deleteUser: jest.fn(),
    createUser: jest.fn((dto) => ({
      id: "randomstringid",
      ...dto,
    })),
    createEach: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByID: jest.fn(),
    getCurrentUser: jest.fn(),
    getUserIDByEmail: jest.fn(),
    getAll: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => {
              user: {
                sub: "mockId";
              }
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  test("all dependencies should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  test("should create a user", async () => {
    const dto: CreateUserDto = {
      email: "example@gmail",
      role: "ADMIN",
      unionDeptId: null,
    };

    const result = {
      id: expect.any(String),
      createAt: expect.any(Date),
      updateAt: expect.any(Date),
      email: "example@gmail.com",
      familyName: "---",
      givenName: "---",
      role: "ADMIN",
      unionDeptId: null,
    };

    jest.spyOn(service, "createUser").mockResolvedValue(result as any);
    expect(await controller.createUser(dto)).toBe(result);
  });

  //   //Not yet implemented
  //   test('should return an array of users', async () => {
  //     const result = [{ id: 1, name: 'Test User' }];
  //     jest.spyOn(service, 'getAll').mockResolvedValue(result as any);
  //     expect(await controller.getUsers({} as any)).toBe(result);
  //   });
  // });

  //    //Not yet implemented, will mock jwt token
  //   it('should return the current user', async () => {
  //     const result = { id: 1, name: 'Test User' };
  //     jest.spyOn(service, 'getCurrentUser').mockResolvedValue(result as any);
  //     expect(await controller.getMe({ sub: 1 })).toBe(result);
  //   });

  it("should update user info", async () => {
    const dto: UpdateUserDto = {
      id: "1",
      familyName: "updated",
      givenName: "updated",
      role: "ADMIN",
      unionDeptId: null,
    };

    const result = {
      id: "1",
      familyName: "updated",
      givenName: "updated",
      role: "ADMIN",
      unionDept: null,
      email: expect.any(String),
      createAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    jest.spyOn(service, "editInfo").mockResolvedValue(result as any);
    expect(await controller.editInfo(dto)).toBe(result);
  });

  it("should delete a user", async () => {
    const result = { deleted: true };
    jest.spyOn(service, "deleteUser").mockResolvedValue(result as any);
    expect(await controller.deleteUser("1")).toBe(result);
  });

  it("should create multiple users and return meta data", async () => {
    const dto = {
      users: [
        {
          email: "momoi@gmail.com",
          role: "ADMIN",
          unionDeptId: null,
        },
        {
          email: "midori@gmail.com",
          role: "ADMIN",
          unionDeptId: null,
        },
      ],
    };

    const userResult = [
      { email: "momoi@gmail.com", result: "Success", reason: "Success" },
      { email: "midori@gmail.com", result: "Success", reason: "Success" },
    ];

    const metaResult = new CreateUserMeta(2, 2);

    jest.spyOn(service, "createEach").mockResolvedValueOnce(userResult[0]);
    jest.spyOn(service, "createEach").mockResolvedValueOnce(userResult[1]);

    const result = await controller.createMany(dto as { users: CreateUserDto[] });

    expect(result.users).toEqual(userResult);
    expect(result.meta).toEqual(metaResult);
  });
});
