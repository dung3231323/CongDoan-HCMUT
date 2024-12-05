import { Test, TestingModule } from '@nestjs/testing';
import { UnionDepartmentController } from './union-department.controller';
import { UnionDepartmentService } from './union-department.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomInt, randomUUID } from 'crypto';
import { UNION_DEPARTMENT_MESSAGE } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

const id = "asdfa-3skd-23alsjd"

const createdto =  {
    code: "CSE",
    name: "Khoa hoc va Ky thuat May tinh"
}

const editdto =  {
    id: "dasas-3234-dasf",
    code: "CSE",
    name: "Khoa hoc va Ky thuat May tinh"
}

const deletedto = {
    id: "d48bdeac-3ee5-4e20-87eb-4ce97bb0aa5a",
    newId:""
}

describe('UnionDepartmentController', () => {
  let controller: UnionDepartmentController;

  const mockUnionDepartmentService = {
    getUnionDeptById: jest.fn(id => {
        return{
            id: id,
            createAt: new Date(),
            updateAt: new Date(),
            code: 'CSE',
            name: 'Khoa Khoa Hoc Va ky Thuat May Tinh',
            facultyCount: randomInt(100),
        }
    }),

    createOneUnionDept: jest.fn((dto) => {
        return{
            id: randomUUID(),
            createAt: new Date(),
            updateAt: new Date(),
            code: dto.code,
            name: dto.name,
            facultyCount: 0
        }
    }),

    editOneUnionDept: jest.fn((dto) => {
        return{
            id: dto.id,
            createAt: new Date(),
            updateAt: new Date(),
            code: dto.code,
            name: dto.name,
            facultyCount: randomInt(100),
        }
    }),

    deleteOneUnionDept: jest.fn((dto) => {
        return{
            id: dto.id,
            createAt: new Date(),
            updateAt: new Date(),
            code: dto.code,
            name: dto.name,
            facultyCount: randomInt(100)
        }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnionDepartmentController],
      providers: [UnionDepartmentService, PrismaService, ConfigService]
    })
    .overrideProvider(UnionDepartmentService)
    .useValue(mockUnionDepartmentService)
    .compile();

    controller = module.get<UnionDepartmentController>(UnionDepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a union department', async () => {
    const res = await controller.getOne(id)
    expect(res).toEqual({
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data:{
            id: id,
            code: 'CSE',
            name: 'Khoa Khoa Hoc Va ky Thuat May Tinh',
            createAt: expect.any(Date),
            updateAt: expect.any(Date),
            facultyCount: expect.any(Number)
        }
    })
    
    expect(mockUnionDepartmentService.getUnionDeptById).toHaveBeenCalled()
  })

  it('should create a union department', async () => {
    const res = await controller.createOne(createdto)
    expect(res).toEqual({
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data:{
            id: expect.any(String),
            code: 'CSE',
            createAt: expect.any(Date),
            updateAt: expect.any(Date),
            name: 'Khoa hoc va Ky thuat May tinh',
            facultyCount: 0,
        }
    })

    expect(mockUnionDepartmentService.createOneUnionDept).toHaveBeenCalled()
  })

  it('shoud change a union department', async () => {
    const res = await controller.editOne(editdto)
    expect(res).toEqual({
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data:{
            id: editdto.id,
            createAt: expect.any(Date),
            updateAt: expect.any(Date),
            code: editdto.code,
            name: editdto.name,
            facultyCount: expect.any(Number)
        }
    })
  })

  it('shoud delete a union department', async () => {
    const res = await controller.deleteOne(deletedto)
    expect(res).toEqual({
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data:{
            id: deletedto.id,
            createAt: expect.any(Date),
            updateAt: expect.any(Date),
            facultyCount: expect.any(Number)
        }
    })
  })
});
