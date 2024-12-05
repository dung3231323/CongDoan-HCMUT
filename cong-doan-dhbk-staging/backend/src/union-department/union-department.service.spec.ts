import { Test, TestingModule } from '@nestjs/testing';
import { UnionDepartmentService } from './union-department.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomInt, randomUUID } from 'node:crypto';

const createdto = {
  code: "UNI10",
  name: "UnionDepartment10",
}

const editdto = {
  id: "d48bdeac-3ee5-4e20-87eb-4ce97bb0aa5a",
  code: "UNI9",
  name: "UnionDepartment9",
}

const deletedto = {
  id: "d48bdeac-3ee5-4e20-87eb-4ce97bb0aa5a",
  newId: "newId"
}

const id = "e9406038-efe2-4fe0-ac29-e5c17b390346"

const mockPrismaService = {
  unionDepartment:{
    create: jest.fn(({data: dto}) => {
      return {
        id: randomUUID(),
        createAt: new Date(),
        updateAt: new Date(),
        code: dto.code,
        name: dto.name,
        facultyCount: 0,
      }
    }),

    findUnique: jest.fn(({where: {id: idUnion}}) => {
      return {
        id: idUnion,
        createAt: new Date(),
        updateAt: new Date(),
        code: 'CSE',
        name: 'Khoa Khoa Hoc Va ky Thuat May Tinh',
        facultyCount: randomInt(100),
      }
    }),

    update: jest.fn(({where:{id: idUnion}, data: dto}) =>{
      return {
        id: idUnion,
        createAt: new Date(),
        updateAt: new Date(),
        code: dto.code,
        name: dto.name,
        facultyCount: randomInt(100)
      }
    }),

    delete: jest.fn(({where: {id: idUnion}}) => {
      return{
        id: idUnion,
        createAt: new Date(),
        updateAt: new Date(),
        code: randomUUID(),
        name: randomUUID(),
        facultyCount: randomInt(100)
      }
    })
  },

  faculty: {
    deleteMany: jest.fn(({where:{unionDeptId: unionDeptid}}) =>{
      return{
        
      }
    })
  },

  user:{
    deleteMany: jest.fn(({where:{unionDeptId: unionDeptid}}) =>{
      return{
        
      }
    })
  },

  activity: {
    deleteMany: jest.fn(({where:{unionDeptId: unionDeptid}}) =>{
      return{
        
      }
    })
  }
}

describe('UnionDepartmentService', () => {
  let service: UnionDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnionDepartmentService, 
        PrismaService,
        ConfigService
      ],
    }).overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<UnionDepartmentService>(UnionDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a union department', async () =>{
    const res = await service.createOneUnionDept(createdto)
    expect(res).toEqual({
        id: expect.any(String),
        code: 'UNI10',
        createAt: expect.any(Date),
        updateAt: expect.any(Date),
        name: 'UnionDepartment10',
        facultyCount: 0,
    })

    expect(mockPrismaService.unionDepartment.create).toHaveBeenCalled();
  })

  it('should get a union department', async () =>{
    const res = await service.getUnionDeptById(id)
    expect(res).toEqual({
      id: id,
      code: 'CSE',
      name: 'Khoa Khoa Hoc Va ky Thuat May Tinh',
      createAt: expect.any(Date),
      updateAt: expect.any(Date),
      facultyCount: expect.any(Number)
    })

    expect(mockPrismaService.unionDepartment.findUnique).toHaveBeenCalled()
  })

  it('should change a union department', async () => {
    const res = await service.editOneUnionDept(editdto)
    expect(res).toEqual({
      id: editdto.id,
      code: editdto.code,
      name: editdto.name,
      updateAt: expect.any(Date),
      createAt: expect.any(Date),
      facultyCount: expect.any(Number)
    })

    expect(mockPrismaService.unionDepartment.update).toHaveBeenCalled()
  })

  it('should delete a union department', async () => {
    const res = await service.deleteOneUnionDept(deletedto)
    expect(res).toEqual({
      id:deletedto.id,
      code: expect.any(String),
      name: expect.any(String),
      createAt: expect.any(Date),
      updateAt: expect.any(Date),
      facultyCount: expect.any(Number)
    })
  })
});