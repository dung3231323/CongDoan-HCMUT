import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  createUnionDepartmentDto,
  deleteUnionDepartmentDto,
  editUnionDepartmentDto,
  GetAllUnionDepartmentDto,
} from "./dto";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { UNION_DEPARTMENT_MESSAGE } from "src/common/constants/union-department.message";

@Injectable()
export class UnionDepartmentService {
  constructor(private prismaService: PrismaService) {}


  async getUnionDeptWithPaging(dto: GetAllUnionDepartmentDto) {
    return await this.prismaService.unionDepartment.findMany({
      take: dto.pagesize,
      skip: (dto.page - 1) * dto.pagesize,
      orderBy: {
        [dto.sortBy]: dto.order,
      },
    });
  }

  async changeNewUnionDepartmentForMember(id: string, newId: string){
    await this.prismaService.faculty.updateMany({
      where:{unionDeptId: id},
      data: {unionDeptId: newId}
    })

    const count = await this.prismaService.faculty.count({
      where:{unionDeptId: newId}
    })

    await this.prismaService.unionDepartment.update({
      where:{id: newId},
      data:{facultyCount: count}
    })

    await this.prismaService.activity.updateMany({
      where:{unionDeptId: id},
      data: {unionDeptId: newId}
    })

    await this.prismaService.user.updateMany({
      where:{unionDeptId: id},
      data: {unionDeptId: newId}
    })

    await this.prismaService.participant.updateMany({
      where:{unionDeptId: id},
      data: {unionDeptId: newId}
    })
  }

  async unionDepartmentHas(unionDeptId: string){
    const faculties = await this.prismaService.faculty.findMany({
      where: {unionDeptId: unionDeptId}
    })

    const activities = await this.prismaService.activity.findMany({
      where: {unionDeptId: unionDeptId},
      include:{
        category: true,
      }
    })

    const moderators = await this.prismaService.user.findMany({
      where: {unionDeptId: unionDeptId}
    })

    const participants = await this.prismaService.participant.findMany({
      where: {unionDeptId: unionDeptId}
    })

    return{
      faculties,
      activities,
      moderators,
      participants
    }
  }

  async validateDeleteUnionDepartment(dto: deleteUnionDepartmentDto){
    if(!dto.newId){
      throw new BadRequestException('Không có Id công đòn bộ phận thay thế!')
    }

    const existedUnionDept = await this.prismaService.unionDepartment.findUnique({
      where:{
        id: dto.id
      }
    })

    if(!existedUnionDept){
      throw new NotFoundException(`Không tìm thấy công đoàn bộ phần cần xóa với ID là: ${dto.id}`)
    }

    if(dto.id === dto.newId){
      throw new BadRequestException('Không thể dùng công đoàn bộ phận muốn xóa để thay thế!')
    }

    const existedNewUnionDept = await this.prismaService.unionDepartment.findUnique({
      where:{
        id: dto.newId
      }
    })

    if(!existedNewUnionDept){
      throw new NotFoundException(`Không tìm thấy công đoàn bộ phân thay thế có Id là: ${dto.newId}`)
    }

    return "Xác thực thành công, có thể xóa công đoàn bộ phận ngay bây giờ"
  }

  async getAllUnionDept(){
    return this.prismaService.unionDepartment.findMany({
      orderBy:{
        ['createAt']: 'asc'
      }
    })
  }

  async getAllNameUnionDept(){
    return this.prismaService.unionDepartment.findMany({
      select:{
        id: true,
        name: true
      }
    })
  }

  async getUnionDeptById(id: string) {
    const unionDept = await this.prismaService.unionDepartment.findUnique({
      where: {
        id: id,
      },
    });

    if (!unionDept) {
      throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.NOT_FOUND_UNIONDEPT);
    }

    return unionDept;
  }

  async createOneUnionDept(dto: createUnionDepartmentDto) {
    
    return await this.prismaService.unionDepartment.create({
      data: dto,
    });
  }

  async editOneUnionDept(dto: editUnionDepartmentDto) {
    const existedUnionDept =
      await this.prismaService.unionDepartment.findUnique({
        where: {
          id: dto.id,
        },
      });

    if (!existedUnionDept) {
      throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.NOT_FOUND_UNIONDEPT);
    }

    const unionDept = await this.prismaService.unionDepartment.update({
      where: {
        id: dto.id,
      },
      data: dto,
    });

    return unionDept;
  }

  async deleteOneUnionDept(dto: deleteUnionDepartmentDto) {
    const existedUnionDept =
      await this.prismaService.unionDepartment.findFirst({
        where: {
          id: dto.id,
        },
      });

    if (!existedUnionDept) {
      throw new NotFoundException(`Không tìm thấy công đoàn bộ phận cần xóa với id là: ${dto.id}`);
    }
    
    if(dto.newId){
      const existedNewUnionDept =
      await this.prismaService.unionDepartment.findFirst({
        where: {
          id: dto.newId,
        },
      });


      if (!existedNewUnionDept) {
        throw new NotFoundException(`Không tìm thấy công đoàn bộ phận thay thế với id là: ${dto.newId}`);
      }

      await this.changeNewUnionDepartmentForMember(dto.id, dto.newId)
    }

    return await this.prismaService.unionDepartment.delete({
      where: {
        id: dto.id,
      },
    });

  }
}
