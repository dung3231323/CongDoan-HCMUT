import { BadRequestException, Get, Injectable, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { CreateResultDto, GetUserDto, UpdateUserDto } from 'src/users/UserDto';
import { CreateUserDto } from 'src/users/UserDto/create-user.dto';
// import { JwtGuard } from 'src/common/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos';
import { USERS_MESSAGE } from 'src/common/constants';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async editInfo(data: UpdateUserDto) {
    var { id, ...updateData } = data;
    var userId = id;

    var isIdExist = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!isIdExist) throw new NotFoundException(USERS_MESSAGE.ID_NOT_FOUND);

    if (data.unionDeptId) { //unionDeptID can be null
      var isUnionDeptExist = await this.prisma.unionDepartment.findFirst({ where: { id: updateData.unionDeptId } });
      if (!isUnionDeptExist) throw new NotFoundException(USERS_MESSAGE.UNION_NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updateAt: new Date(),
      },
    });

    //DEBUG
    // console.log(updatedUser);

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const targetUser = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!targetUser) throw new NotFoundException(USERS_MESSAGE.ID_NOT_FOUND);

    const deletedUser = await this.prisma.user.delete({ where: { id: userId } });

    //DEBUG
    // console.log(deletedUser);
    return deletedUser;
  }

  async createUser(dataDto: CreateUserDto) {  //for single create
    if (dataDto.role == "ADMIN") {
      dataDto.unionDeptId = null;
    }

    const isEmailExist = await this.prisma.user.findFirst({ where: { email: dataDto.email } });
    if (isEmailExist) throw new BadRequestException(USERS_MESSAGE.EMAIL_DUPLICATE);

    if (dataDto.unionDeptId !== null) { //unionDeptID can be null
      const isUnionDeptExist = await this.prisma.unionDepartment.findFirst({ where: { id: dataDto.unionDeptId } });
      if (!isUnionDeptExist) throw new NotFoundException(USERS_MESSAGE.UNION_NOT_FOUND);
    }
    const data = {
      ...dataDto,
      familyName: '---',    //Empty, will be assigned in getMe
      givenName: '---',
      updateAt: new Date(),
    };
    return await this.prisma.user.create({ data: data });
  }

  async createEach(dataDto: CreateUserDto): Promise<CreateResultDto> {  //for createMany
    var result: string;
    var reason: string;
    const email = dataDto.email

    if (dataDto.role == "ADMIN") {
      dataDto.unionDeptId = null;
    }

    const isEmailExist = await this.prisma.user.findFirst({ where: { email: dataDto.email } });
    if (isEmailExist) {
      result = "Fail";
      reason = USERS_MESSAGE.EMAIL_DUPLICATE;
      return { email, result, reason };
    }

    console.log('UnionID: ', dataDto.unionDeptId);

    if (dataDto.unionDeptId !== null) { //unionDeptID can be null
      const isUnionDeptExist = await this.prisma.unionDepartment.findFirst({ where: { id: dataDto.unionDeptId } });

      // console.log(dataDto.unionDeptId, isUnionDeptExist);
      if (!isUnionDeptExist) {
        result = "Fail";
        reason = USERS_MESSAGE.UNION_NOT_FOUND;
        return { email, result, reason };
      }
    }

    const data = {
      ...dataDto,
      familyName: '---',    //Empty, will be assigned in getMe
      givenName: '---',
      updateAt: new Date(),
    };
    await this.prisma.user.create({ data: data });

    return { email, result: "Success", reason: USERS_MESSAGE.SUCCESS };
  }

  async getUserByEmail(email: string) {
    //Works
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user ? user : null;
  }

  async getUserByID(id: string) {
    //Works
    const user = await this.prisma.user.findFirst({ where: { id } });
    return user ? user : null;
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    //Activate when being deleted while Online
    if (!user) throw new NotFoundException(USERS_MESSAGE.ID_NOT_FOUND);
    return user;
  }

  async updateNameForNewUser(email: string, fname: string, gname: string) {
    const userId = await this.getUserIDByEmail(email);

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        familyName: fname,
        givenName: gname,
      },
    });
  }

  async getAllUsersWithThis(data: GetUserDto) {
    //Works
    const { email, id } = data;
    if (id) {
      const result = this.prisma.user.findMany({ where: { id } });
      if (!result) throw new BadRequestException(USERS_MESSAGE.ID_NOT_FOUND);
      return result;
    }
    if (email) {
      const result = this.prisma.user.findMany({ where: { email } });
      if (!result)
        throw new BadRequestException(USERS_MESSAGE.EMAIL_NOT_FOUND);
      return result;
    }
  }

  async getUserIDByEmail(email: string) {     //Works
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) throw new NotFoundException(USERS_MESSAGE.EMAIL_NOT_FOUND);
    return user.id
  }

  async getAll(pageOption: PageOptionsDto) {

    const users = await this.prisma.user.findMany({
      skip: pageOption.skip,
      take: pageOption.take,
      orderBy: { updateAt: pageOption.order },
    });

    const meta = new PageMetaDto({
      totalItem: await this.prisma.user.count(),
      itemCount: users.length,
      pageOptionsDto: pageOption
    });


    return new PageDto(users, meta);
  }

}
