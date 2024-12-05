import { Test, TestingModule } from '@nestjs/testing';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { randomInt, randomUUID } from 'crypto';
import { FACULTY_MESSAGE } from 'src/common/constants';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const id = "dasfk43-45sdlkas-234"

const user = {
    sub: "string",
    email: "string",
    role: UserRole.ADMIN,
    unionDeptId: "string",
    iat: randomInt(100),
    exp: randomInt(100),
}

const createdto = {
    code: "MT",
    name: "May tinh",
    unionDeptId: "unionexample"
}

const editdto = {
    id: "asdflk4-asfdl",
    code: "MT",
    name: "May tinh",
    unionDeptId: "unionexample"
}

const deletedto = {
    id: "asdflk4-asfdl",
    code: "MT",
    name: "May tinh",
    unionDeptId: "unionexample"
}

describe('FacultyController', () => {
  let controller: FacultyController;

  const mockFacultyService = {
    isUserHasPermission: jest.fn((user, unionDeptId) => {
        return true
    }),

    getFacultyById: jest.fn((id) => {
        return {
            id: id,
            code: "MT",
            name: "May tinh",
            unionDeptId: "unionexample"
        }
    }),

    createOneFaculty: jest.fn((dto) => {
        return{
            id: randomUUID(),
            code: dto.code,
            name: dto.name,
            unionDeptId: dto.unionDeptId
        }
    }),

    editOneFaculty: jest.fn((dto) => {
        return{
            id: dto.id,
            code: dto.code,
            name: dto.name,
            unionDeptId: dto.unionDeptId
        }
    }),

    deleteOneFaculty: jest.fn((dto) => {
        return {
            id: dto.id,
            code: dto.code,
            name: dto.name,
            unionDeptId: dto.unionDeptId
        }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacultyController],
      providers: [FacultyService, PrismaService, ConfigService]
    })
    .overrideProvider(FacultyService)
    .useValue(mockFacultyService)
    .compile();

    controller = module.get<FacultyController>(FacultyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a faculty', async () => {
    const res = await controller.getOne(id)
    expect(res).toEqual({
        message: FACULTY_MESSAGE.SUCCESS,
        data:{
            id: id,
            code: "MT",
            name: "May tinh",
            unionDeptId: "unionexample"
        }
    })
  })

  it('should create a faculty', async () => {
    const res = await controller.createOne(createdto, user)
    expect(res).toEqual({
        message: FACULTY_MESSAGE.SUCCESS,
        data:{
            id: expect.any(String),
            code: "MT",
            name: "May tinh",
            unionDeptId: "unionexample"
        }
    })

    expect(mockFacultyService.createOneFaculty).toHaveBeenCalled()
  })

  it('should change a faculty', async () => {
    const res = await controller.editOne(editdto, user)
    expect(res).toEqual({
        message: FACULTY_MESSAGE.SUCCESS,
        data:{
            id: "asdflk4-asfdl",
            code: "MT",
            name: "May tinh",
            unionDeptId: "unionexample"
        }
    })

    expect(mockFacultyService.editOneFaculty).toHaveBeenCalled()
  })

  it('shoud delete a faculty', async () => {
    const res = await controller.deleteOne(deletedto, user)
    expect(res).toEqual({
        message: FACULTY_MESSAGE.SUCCESS,
        data:{
            id: "asdflk4-asfdl",
            code: "MT",
            name: "May tinh",
            unionDeptId: "unionexample"
        }
    })

    expect(mockFacultyService.deleteOneFaculty).toHaveBeenCalled()
  })
});
