import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SUCCESS } from 'src/common/constants/activity.category';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IdDto } from '../dtos/ActivityDTO';
import { createCategoryDto, createCategoryDtoRes, deleteCategoryDtoRes, editCategoryDto, editCategoryDtoRes, getAllCategoryDtoRes, getCategoryDtoRes } from '../dtos/CategoryDTO';
import { AuthGuard } from '@nestjs/passport';
import { ResponseClient } from 'src/response/response.entity';

//@Public()
@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private response: ResponseClient
    ) { }
    @ApiOperation({summary:"Create new category"})
    @ApiCreatedResponse({
        description:"Create category successfully",
        type: createCategoryDtoRes
    })
    @Post("/create")
    async create(@Body() category: createCategoryDto, @Res() res: Response) {
        const resultCate = await this.categoryService.createCategory(category)
        this.response.ResponseClient(SUCCESS, resultCate)
        return res.status(HttpStatus.CREATED).json(this.response)

    }

    @ApiOperation({ summary: "Update existed Category" })
    @ApiCreatedResponse({
        description: "Updated category successfully",
        type: editCategoryDtoRes
    })
    @Patch('/edit')
    async edit(@Body() category: editCategoryDto, @Res() res: Response) {
        await this.categoryService.updateCategory(category);
        this.response.ResponseClient(SUCCESS, category)
        return res.status(HttpStatus.OK).json(this.response)
    }

    @ApiOperation({ summary: "Get All Categories" })
    @ApiCreatedResponse({
        description: "Get All categories successfully",
        type: getAllCategoryDtoRes
    })
    @Get("/all")
    async getAll(@Res() res: Response) {
        const categories = await this.categoryService.getALLData();
        this.response.ResponseClient(SUCCESS, categories)
        return res.status(HttpStatus.OK).json(this.response)
    }

    @ApiOperation({ summary: "Get Category by Id" })
    @ApiCreatedResponse({
        description: "Get Category successfully",
        type: getCategoryDtoRes
    })
    @Get("/:id")
    async getId(@Res() res: Response, @Param('id') id: string) {
        const category = await this.categoryService.getCategory(id);
        this.response.ResponseClient(SUCCESS, category)
        return res.status(HttpStatus.OK).json(this.response)
    }

    @ApiOperation({ summary: "Delete Category" })
    @ApiCreatedResponse({
        description: "Delete Category successfully",
        type: deleteCategoryDtoRes
    })
    @Delete("/delete")
    async deleteId(@Query() { id }: IdDto, @Res() res: Response) {
        await this.categoryService.deleteById(id)
        this.response.ResponseClient(SUCCESS, id);
        return res.status(HttpStatus.OK).json(this.response)
    }
}
