import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCategoryDto, editCategoryDto } from '../dtos/CategoryDTO';
import { Category } from '@prisma/client';
import { ERROR_DB } from 'src/common/constants';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }
    async createCategory(category: createCategoryDto) {
        return await this.prisma.category.create({
            data: {
                name: category.name,
            },
            select:
            {
                id:true,
                name:true
            }
        })

    }

    async getCategory(id: string) {
        const categoryId = await this.prisma.category.findUnique({
            where: { 
                id: id 
            },
            include:{
                activities:{
                    select: {
                        id:true
                    }
                }
            }
        });
        if (!categoryId) {
            throw new NotFoundException(`${ERROR_DB.CATEGORY_NOTFOUND}:  ${id}`)
        }
        return {...categoryId, activities:categoryId.activities.map(activity=>activity.id)}
    }

    async updateCategory(category: editCategoryDto): Promise<Category> {
        const categoryId = await this.prisma.category.findUnique({
            where: {
                id: category.id
            }
        })
        if (!categoryId) {
            throw new NotFoundException(`${ERROR_DB.CATEGORY_NOTFOUND}: ${category.id}`)
        }

        const categoryUpdate = await this.prisma.category.update({
            where: {
                id: category.id
            },
            data: category
        });
        return categoryUpdate
    }

    async getALLData() {
        const categories = await this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
                createdAt:true,
                updatedAt: true,
                activities: {
                    select: {
                        id: true
                    }
                },
            },
            orderBy:{
                updatedAt:'desc'
            }
        })
        return categories.map(category => ({
            ...category,
            activities: category.activities.map(activity => activity.id)
        }))
    }

    async deleteById(id: string) {
        console.log(id)
        const category = await this.prisma.category.findUnique({ where: { id: id } });
        if (!category) {
            throw new NotFoundException(`${ERROR_DB.CATEGORY_NOTFOUND}: ${id}`)
        }
        return await this.prisma.category.delete({
            where: {
                id
            },
            select: {
                id: true,
                name: true
            }
        })
    }
}
