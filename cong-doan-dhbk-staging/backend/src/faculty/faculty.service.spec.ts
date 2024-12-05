import { Test, TestingModule } from '@nestjs/testing';
import { FacultyService } from './faculty.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

const id = "dasfk43-45sdlkas-234"

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

describe('FacultyService', () => {
  let service: FacultyService;

  const mockPrismaService = {
    faculty:{
        count: jest.fn(() => {
            return{

            }
        }),

        findUnique: jest.fn(({where: {id: facultyId}}) => {
            return{
                id: facultyId,
                code: "MT",
                name: "May tinh",
                unionDeptId: randomUUID(),
            }
        }),

        create: jest.fn(({data: dto}) => {
            return{
                id: randomUUID(),
                code: dto.code,
                name: dto.name,
                unionDeptId: dto.unionDeptId
            }
        }),

        update: jest.fn(({where: {id: facultyId}, data: dto}) => {
            return{
                id: facultyId,
                code: dto.code,
                name: dto.name,
                unionDeptId: dto.unionDeptId
            }
        }),

        delete: jest.fn(({where: {id: facultyId}}) => {
            return{
                id: facultyId,
                code: "MT",
                name: "May tinh",
                unionDeptId: "unionexample"
            }
        })
    },

    unionDepartment:{
        findUnique: jest.fn(({where: {id: unionDeptId}}) => {
            return{

            }
        }),

        update: jest.fn(({where: {id: unionDeptId}, data: dto}) => {
            return {

            }
        })
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacultyService, PrismaService],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .compile();

    service = module.get<FacultyService>(FacultyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a faculty', async () => {
    const res = await service.getFacultyById(id)
    expect(res).toEqual({
        id: id,
        code: "MT",
        name: "May tinh",
        unionDeptId: expect.any(String)
    })
  })

  it('should create a faculty', async () => {
    const res = await service.createOneFaculty(createdto)
    expect(res).toEqual({
        id: expect.any(String),
        code: "MT",
        name: "May tinh",
        unionDeptId: "unionexample"
    })

    expect(mockPrismaService.faculty.create).toHaveBeenCalled()
  })

  it('should update a faculty', async () => {
    const res = await service.editOneFaculty(editdto)
    expect(res).toEqual({
        id: "asdflk4-asfdl",
        code: "MT",
        name: "May tinh",
        unionDeptId: "unionexample"
    })

    expect(mockPrismaService.faculty.update).toHaveBeenCalled()
  })
  
  it('should delete a faculty', async () => {
    const res = await service.deleteOneFaculty(deletedto)
    expect(res).toEqual({
        id: "asdflk4-asfdl",
        code: "MT",
        name: "May tinh",
        unionDeptId: "unionexample"
    })

    expect(mockPrismaService.faculty.delete).toHaveBeenCalled()
  })
});
