import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateFacultyDto,
  DeleteFacultyDto,
  EditFacultyDto,
  GetAllFacultyDto,
} from "./dto";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { FACULTY_MESSAGE, UNION_DEPARTMENT_MESSAGE } from "src/common/constants";

@Injectable()
export class FacultyService {
  constructor(private prismaService: PrismaService) {}

  public async isUserHasPermission(user: JwtPayLoad, unionDeptId: string){
    if(user.role === null || (user.role === 'MODERATOR' && user.unionDeptId !== unionDeptId)){
      return false
    }

    return true;
  }

  private async updateFacultyCount(unionDeptId: string) {
    const existUnionDept = await this.prismaService.unionDepartment.findFirst({
      where: {
        id: unionDeptId,
      },
    });

    if (!existUnionDept){
      throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.ID_NOT_FOUND);
    }

    const count = await this.prismaService.faculty.count({
      where: {
        unionDeptId: unionDeptId,
      },
    });

    await this.prismaService.unionDepartment.update({
      where: { id: unionDeptId },
      data: { facultyCount: count },
    });
  }

  async getAllFaculty(){
    return await this.prismaService.faculty.findMany({
      orderBy:{
        ['createAt']: 'asc'
      }
    })
  }

  async getFacultyWithPaging(dto: GetAllFacultyDto, user: JwtPayLoad) {
    let whereCondition = {}
    if(user.role === 'MODERATOR'){
      whereCondition = {
        unionDeptId: user.unionDeptId
      }
    }

    return await this.prismaService.faculty.findMany({
      where: whereCondition,
      take: dto.pagesize,
      skip: (dto.page - 1) * dto.page,
      orderBy: {
        [dto.sortBy]: dto.order,
      },
    });
  }

  async getFacultyById(id: string) {
    return await this.prismaService.faculty.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createOneFaculty(dto: CreateFacultyDto) {
    const existUnionDept = await this.prismaService.unionDepartment.findUnique({
      where:{
        id: dto.unionDeptId
      }
    })

    if(!existUnionDept){
      throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.ID_NOT_FOUND + ` ${dto.unionDeptId}`)
    } 

    const faculty = await this.prismaService.faculty.create({
      data: dto,
    });

    this.updateFacultyCount(dto.unionDeptId);

    return faculty;
  }

  async createManyFaculties(faculties: CreateFacultyDto[]){
    const createdFaculties = faculties.map((faculty) => {
      return this.createOneFaculty(faculty)
    })

    return Promise.all(createdFaculties)
  }

  async editOneFaculty(dto: EditFacultyDto) {

    const existFaculty = await this.prismaService.faculty.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!existFaculty) {
      throw new NotFoundException(FACULTY_MESSAGE.NOT_FOUND_FACULTY);
    }

    const faculty = await this.prismaService.faculty.update({
      where: { id: dto.id },
      data: dto,
    });

    //Nếu thay đổi công đoàn thì update lại số lượng phòng khoa của công đoàn
    if(faculty.unionDeptId !== existFaculty.unionDeptId){
      this.updateFacultyCount(faculty.unionDeptId)
      this.updateFacultyCount(existFaculty.unionDeptId)
    }

    return faculty
  }

  async editManyFaculties (faculties: EditFacultyDto[]){
    const updatedFaculties = faculties.map((faculty) => {
      return this.editOneFaculty(faculty)
    })

    return Promise.all(updatedFaculties)
  }

  async deleteOneFaculty(dto: DeleteFacultyDto) {
    const existFaculty = await this.prismaService.faculty.findFirst({
      where: {
        id: dto.id,
      },
    });

    if (!existFaculty) {
      throw new NotFoundException(FACULTY_MESSAGE.ID_NOT_FOUND);
    }

    const faculty = await this.prismaService.faculty.delete({
      where: {
        id: dto.id,
      },
    });

    this.updateFacultyCount(dto.unionDeptId);

    return faculty;
  }
}
