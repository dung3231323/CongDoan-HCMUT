import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto, CreateManyFaculties, DeleteFacultyDto, EditFacultyDto, EditManyFaculties, GeneralFacultyResponseDto, GetAllFacultyDto, GetAllFacultyResponseDto } from './dto';
import { FAIL_MESSAGE, SUCCESS } from 'src/common/constants/activity.category';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FACULTY_MESSAGE } from 'src/common/constants';
import { GetUser } from 'src/common/decorators';
import { JwtPayLoad } from 'src/common/model/jwt-payload.interface';

@ApiBearerAuth()
@ApiTags('faculty')
@Controller('faculty')
@UseGuards( AuthGuard('jwt'))
export class FacultyController {
    constructor(private facultyService: FacultyService){}

    @HttpCode(200)
    @ApiOperation({
        summary: "Lấy thông tin tất cả khoa phòng ban"
    })
    @ApiOkResponse({
        description:"Lấy thông tin tất cả khoa phòng ban thành công!", 
        type: GetAllFacultyResponseDto
    })
    @Get('all')
    async getAll(){
        const all = await this.facultyService.getAllFaculty()
        
        if(all.length === 0){
            throw new NotFoundException(FACULTY_MESSAGE.NO_FACULTY_EXISTING)
        }

        return {message: SUCCESS, data: all}
    }


    // @HttpCode(200)
    // @ApiOperation({
    //     summary: "Get faculties with pagination"
    // })
    // @ApiOkResponse({
    //     description: "Get faculties successfully!",
    //     type: GetAllFacultyResponseDto
    // })
    // @Get('all-paging')
    // async getAllWithPaging(@Query() dto: GetAllFacultyDto, @GetUser() user: JwtPayLoad){
    //     const all = await this.facultyService.getFacultyWithPaging(dto, user)

    //     if (all.length === 0) {
    //         throw new NotFoundException(FACULTY_MESSAGE.NO_FACULTY_EXISTING);
    //     }

    //     return {
    //         message: FACULTY_MESSAGE.SUCCESS,
    //         data: all
    //     }
    // }


    @ApiOperation({
        summary: "Lấy thông tin một khoa/phòng ban bằng ID"
    })
    @ApiOkResponse({
        description: "Lấy thông tin một khoa/phòng ban bằng ID thành công!",
        type: GeneralFacultyResponseDto
    })
    @Get(':id')
    async getOne(@Param('id') id: string){
        const faculty = await this.facultyService.getFacultyById(id)

        if(!faculty){
            throw new NotFoundException(FACULTY_MESSAGE.NOT_FOUND_FACULTY)
        }

        return {
            message: FACULTY_MESSAGE.SUCCESS,
            data: faculty
        }
    }


    @ApiOperation({
        summary: "Tạo một khoa/phòng ban"
    })
    @ApiOkResponse({
        description: "Tạo một khoa/phòng ban thành công!",
        type: GeneralFacultyResponseDto
    })
    @Post('create')
    async createOne(@Body() dto: CreateFacultyDto, @GetUser() user: JwtPayLoad){
        if(user.role === 'MODERATOR' && dto.unionDeptId !== user.unionDeptId){
            return new ForbiddenException(FACULTY_MESSAGE.USER_HAS_NO_PERMISSION)
        }

        const faculty = await this.facultyService.createOneFaculty(dto)

        return {
            message: FACULTY_MESSAGE.SUCCESS,
            data: faculty
        }
    }


    @ApiOperation({
        summary: "Tạo nhiều khoa/phòng ban"
    })
    @ApiOkResponse({
        description: "Tạo nhiều khoa/phòng ban thành công!",
        type: GetAllFacultyResponseDto
    })
    @Post('create-bulk')
    async createMany(@Body() dto: CreateManyFaculties){
        const faculties = await this.facultyService.createManyFaculties(dto.faculties)

        return{
            message: FACULTY_MESSAGE.SUCCESS,
            data: faculties
        }
    }

    @ApiOperation({
        summary: "Chỉnh sửa một khoa/phòng ban"
    })
    @ApiOkResponse({
        description: "Chỉnh sửa một khoa/phòng ban thành công!",
        type: GeneralFacultyResponseDto
    })
    @Patch('edit')
    async editOne(@Body() dto: EditFacultyDto, @GetUser() user: JwtPayLoad){
        
        if(!this.facultyService.isUserHasPermission(user, dto.unionDeptId)){
            return new ForbiddenException(FACULTY_MESSAGE.USER_HAS_NO_PERMISSION)
        }

        const faculty = await this.facultyService.editOneFaculty(dto)
        
        return {
            message: FACULTY_MESSAGE.SUCCESS,
            data: faculty
        }
    }

    @ApiOperation({
        summary: "Chỉnh sửa nhiều khòa/phòng ban"
    })
    @ApiOkResponse({
        description: "Chỉnh sửa nhiều khòa/phòng ban thành công!",
        type: GetAllFacultyResponseDto
    })
    @Patch('update-bulk')
    async editManyFaculties(@Body() dto: EditManyFaculties){
        const faculties = await this.facultyService.editManyFaculties(dto.faculties)

        return {
            message: FACULTY_MESSAGE.SUCCESS,
            data: faculties
        }
    }

    
    @ApiOperation({
        summary: "Xóa một khoa/phòng ban"
    })
    @ApiOkResponse({
        description: "Xóa một khoa/phòng ban thành công!",
        type: GeneralFacultyResponseDto
    })
    @Delete('delete')
    async deleteOne(
        @Query() dto: DeleteFacultyDto, 
        @GetUser() user: JwtPayLoad
    ){
        if(!this.facultyService.isUserHasPermission(user, dto.unionDeptId)){
            return new ForbiddenException(FACULTY_MESSAGE.USER_HAS_NO_PERMISSION)
          }

        const faculty = await this.facultyService.deleteOneFaculty(dto)
        
        return{
            message: FACULTY_MESSAGE.SUCCESS,
            data: faculty
        }
    }
}
