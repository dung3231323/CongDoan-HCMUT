import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createCategoryDto, editCategoryDto } from '../dtos/CategoryDTO';

describe('CategoryService', () => {
    let service: CategoryService;
    let prisma: PrismaService;

    const mockPrismaService = {
        category: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create a category', async () => {
            const categoryDto: createCategoryDto = { name: 'Test Category' };
            const createdCategory = { id: '1', ...categoryDto, createdAt: new Date(), updatedAt: new Date() };
            mockPrismaService.category.create.mockResolvedValue(createdCategory);

            const result = await service.createCategory(categoryDto);
            expect(result).toEqual(createdCategory);
            expect(prisma.category.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: categoryDto.name,
                }),
            });
        });
    });

    describe('getCategory', () => {
        it('should return a category by id', async () => {
            const category = { id: '1', name: 'Test Category' };
            mockPrismaService.category.findUnique.mockResolvedValue(category);

            const result = await service.getCategory('1');
            expect(result).toEqual(category);
            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should throw NotFoundException if category not found', async () => {
            mockPrismaService.category.findUnique.mockResolvedValue(null);

            await expect(service.getCategory('1')).rejects.toThrow(NotFoundException);
            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    describe('updateCategory', () => {
        it('should update a category', async () => {
            const categoryDto: editCategoryDto = { id: '1', name: 'Updated Category' };
            const updatedCategory = { id: '1', ...categoryDto };
            mockPrismaService.category.findUnique.mockResolvedValue({ id: '1' });
            mockPrismaService.category.update.mockResolvedValue(updatedCategory);

            const result = await service.updateCategory(categoryDto);
            expect(result).toEqual(updatedCategory);
            expect(prisma.category.update).toHaveBeenCalledWith({
                where: { id: categoryDto.id },
                data: categoryDto,
            });
        });

        it('should throw NotFoundException if category not found', async () => {
            mockPrismaService.category.findUnique.mockResolvedValue(null);

            await expect(service.updateCategory({ id: '1', name: 'Updated Category' }))
                .rejects.toThrow(NotFoundException);
            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    describe('getALLData', () => {
        it('should return all categories', async () => {
            const categories = [
                { id: '1', name: 'Category 1', activities: [], updatedAt: new Date() },
                { id: '2', name: 'Category 2', activities: [], updatedAt: new Date() },
            ];
            mockPrismaService.category.findMany.mockResolvedValue(categories);

            const result = await service.getALLData();
            expect(result).toEqual(categories);
            expect(prisma.category.findMany).toHaveBeenCalled();
        });
    });

    describe('deleteById', () => {
        it('should delete a category by id', async () => {
            const category = { id: '1', name: 'Category to delete' };
            mockPrismaService.category.findUnique.mockResolvedValue(category);
            mockPrismaService.category.delete.mockResolvedValue(category);

            const result = await service.deleteById('1');
            expect(result).toEqual(category);
            expect(prisma.category.delete).toHaveBeenCalledWith({
                where: { id: '1' },
                select: { id: true, name: true },
            });
        });

        it('should throw NotFoundException if category not found', async () => {
            mockPrismaService.category.findUnique.mockResolvedValue(null);

            await expect(service.deleteById('1')).rejects.toThrow(NotFoundException);
            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
});
