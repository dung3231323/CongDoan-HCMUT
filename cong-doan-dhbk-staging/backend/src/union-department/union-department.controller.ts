import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UnionDepartmentService } from "./union-department.service";
import {
  createUnionDepartmentDto,
  deleteUnionDepartmentDto,
  editUnionDepartmentDto,
  EntityBelongToUnionDepartmentResponseDto,
  GeneralUnionDepartmentResponseDto,
  GetAllNameUnionDepartmentResponseDto,
  GetAllUnionDepartmentDto,
  GetAllUnionDepartmentResponseDto,
  ValidateDeleteUnionDepartmentResponseDto,
} from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UNION_DEPARTMENT_MESSAGE } from "src/common/constants/union-department.message";
import { Public } from "src/common/decorators";
import { JwtPayLoad } from "src/common/model/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";

@Public()
//@ApiBearerAuth()
@ApiTags("union-department")
@Controller("union-department")
//@UseGuards(AuthGuard('jwt'))
export class UnionDepartmentController {
  constructor(private unionDepartmentService: UnionDepartmentService) {}

  @ApiOperation({
    summary: "Lấy thông tin toàn bộ công đoàn bộ phận"
  })
  @ApiOkResponse({
    description: "Lấy thông tin toàn bộ công đoàn bộ phận thành công!",
    type: GetAllUnionDepartmentResponseDto
  })
  @Get("all")
  async getAll() {
      const all = await this.unionDepartmentService.getAllUnionDept();

      if(!all) {
        throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.NO_UNIONDEPT_EXISTING)
      }

      return {
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data: all,
      }
  }

  @ApiOperation({
    summary: "Kiểm tra Công đoàn bộ phận có chứa bất kỳ entity"
  })
  @ApiOkResponse({
    description: "Kiểm tra Công đoàn bộ phận có chứa bất kỳ entity thành công",
    type: EntityBelongToUnionDepartmentResponseDto
  })
  @Get('get-entities/:id')
  async getEntityBelongToUnionDepartment(@Param('id') id: string){
    const data = await this.unionDepartmentService.unionDepartmentHas(id)

    return{
      message: "Success",
      data: data
    }
  }


  @ApiOperation({
    summary: "Kiểm tra trước khi xóa công đoàn bộ phận"
  })
  @ApiOkResponse({
    description: "Kiểm tra thành công",
    type: ValidateDeleteUnionDepartmentResponseDto
  })
  @Post('validate-delete')
  async validateDeleteUnionDept(@Body() dto: deleteUnionDepartmentDto){
    const data = await this.unionDepartmentService.validateDeleteUnionDepartment(dto)

    return{
      message: data
    }
  }
  // @ApiOperation({
  //   summary: "Get all union departments with pagination"
  // })
  // @ApiOkResponse({
  //   description: "Get all union departments with pagination successfully!",
  //   type: GetAllUnionDepartmentResponseDto
  // })
  // @Get("all-paging")
  // async getAllWithPaging(
  //   @Query() dto: GetAllUnionDepartmentDto,
  // ) {

  //     const all = await this.unionDepartmentService.getUnionDeptWithPaging(
  //       dto,
  //     );


  //     if (all.length === 0) {
  //       throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.NO_UNIONDEPT_EXISTING);
  //     }

  //     return{
  //       message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
  //       data: all,
  //     }
  // }

  @ApiOperation({
    summary: "Lấy tất cả tên của công đoàn bộ phận"
  })
  @ApiOkResponse({
    description: "Lấy tất cả tên của công đoàn bộ phận thành công!",
    type: GetAllNameUnionDepartmentResponseDto
  })
  @Get("all-name")
  async getAllName() {
      const all = await this.unionDepartmentService.getAllNameUnionDept();

      if((await all).length === 0){
        throw new NotFoundException(UNION_DEPARTMENT_MESSAGE.NO_UNIONDEPT_EXISTING)
      }

      return {
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data: all,
      }
  }

  @ApiOperation({
    summary: "Lấy thông tin một công đoàn bộ phận bằng ID"
  })
  @ApiOkResponse({
    description: "Lấy thông tin một công đoàn bộ phận bằng ID thành công!",
    type: GeneralUnionDepartmentResponseDto
  })
  @Get(":id")
  async getOne(
    @Param("id") id: string,
  ) {

      const one = await this.unionDepartmentService.getUnionDeptById(id);

      return {
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data: one,
      }
  }


  @ApiOperation({
    summary: "Tạo một công đoàn bộ phận"
  })
  @ApiOkResponse({
    description: "Tạo một công đoàn bộ phận thành công!",
    type: GeneralUnionDepartmentResponseDto
  })
  @Post("create")
  async createOne(
    @Body() dto: createUnionDepartmentDto,
  ) {

      const unionDept = await this.unionDepartmentService.createOneUnionDept(
        dto,
      );

      return {
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data: unionDept,
      }
  }

  @ApiOperation({
    summary: "Sửa một công đoàn bộ phận"
  })
  @ApiOkResponse({
    description: "Sửa một công đoàn bộ phận thành công!",
    type: GeneralUnionDepartmentResponseDto
  })
  @Patch("edit")
  async editOne(
    @Body() dto: editUnionDepartmentDto,
  ) {
    const unionDept = await this.unionDepartmentService.editOneUnionDept(dto);

    return {
      message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
      data: unionDept,
    }
  }

  @ApiOperation({
    summary: "Xóa một công đoàn bộ phận"
  })
  @ApiOkResponse({
    description: "Xóa một công đoàn bộ phận thành công!",
    type: GeneralUnionDepartmentResponseDto
  })
  @Delete("delete")
  async deleteOne(
    @Query() dto: deleteUnionDepartmentDto,
  ) {
      // if(user.role === 'MODERATOR'){
      //   throw new ForbiddenException(UNION_DEPARTMENT_MESSAGE.FAIL_DELETE)
      // }

      const one = await this.unionDepartmentService.deleteOneUnionDept(
        dto,
      );

      return {
        message: UNION_DEPARTMENT_MESSAGE.SUCCESS,
        data: one,
      }
  }
}
