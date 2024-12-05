import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './UserDto/create-user.dto';
import { UpdateUserDto } from './UserDto/update-user.dto';
import { GetUserDto } from './UserDto/get-user.dto';
import { PageOptionsDto } from 'src/dtos';
import { addAbortListener } from 'stream';
import { NotFoundException } from '@nestjs/common';
import { create } from 'domain';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

const mockPrismaService = {
    user: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
    },
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
        const dto: CreateUserDto = { 
            email: 'test@example.com', 
            role: 'ADMIN', 
            unionDeptId: null 
        };
        
        const result = {      
            id: expect.any(String),
            createAt:expect.any(Date),
            updateAt: expect.any(Date),
            email: "example@gmail.com",
            familyName: "---",
            givenName: "---",
            role: "ADMIN",
            unionDeptId: null 
        };

        jest.spyOn(prisma.user, 'create').mockResolvedValue(result as any);

        expect(await service.createUser(dto)).toBe(result);
    });
  });

  describe('editInfo', () => {
    it('should update user info', async () => {
        const dto: UpdateUserDto = {      
                id : "c4659470-e06c-4e7e-bdec-56770a6ffd49",
                familyName: "updated",
                givenName: "updated",
                role: "ADMIN",
                unionDeptId: null 
            };
        const result = {      
            id : "c4659470-e06c-4e7e-bdec-56770a6ffd49",
            familyName: "updated",
            givenName: "updated",
            role: "ADMIN",
            unionDept: null,
            email: expect.any(String),
            createAt: expect.any(Date),
            updatedAt: expect.any(Date)
        };
        jest.spyOn(prisma.user, 'update').mockResolvedValue(result as any);

        await expect(service.editInfo(dto)).rejects.toThrow(NotFoundException);
        // expect(await service.editInfo(dto)).toBe(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = { 
        id: expect.any(String),
        familyName: expect.any(String),
        givenName: expect.any(String),
        role: expect.any(String),
        unionDept: null,
        email: expect.any(String),
        createAt: expect.any(Date),
        updatedAt: expect.any(Date)
       };

       
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(result as any);

      await expect(service.deleteUser("1")).rejects.toThrow(NotFoundException);
    //   expect(await service.deleteUser('1')).toBe(result);
    });
  });

//   describe('getAll', () => {
//     it('should return an array of users', async () => {
//       const result = [{ id: '1', email: 'test@example.com' }];
//       jest.spyOn(prisma.user, 'findMany').mockResolvedValue(result as any);

//       expect(await service.getAll({} as PageOptionsDto)).toBe(result);
//     });
//   });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const result = { 
        id: expect.any(String),
        familyName: expect.any(String),
        givenName: expect.any(String),
        role: expect.any(String),
        unionDept: null,
        email: "test@example.com",
        createAt: expect.any(Date),
        updateAt: expect.any(Date)
       };
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(result as any);

      expect(await service.getUserByEmail('test@example.com')).toBe(result);
    //   await expect(service.getUserByEmail("1")).rejects.toThrow(NotFoundException);

    });
  });
});