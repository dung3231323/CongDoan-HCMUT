import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { HttpStatus } from '@nestjs/common';
import { SUCCESS } from 'src/common/constants/activity.category';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseClient } from 'src/response/response.entity';
import { createCategoryDto, editCategoryDto } from '../dtos/CategoryDTO';
import { IdDto } from '../dtos/ActivityDTO';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
    let controller: CategoryController;
    let service: CategoryService;
    let responseClient: ResponseClient;

    const mockCategoryService = {
        createCategory: jest.fn(),
        updateCategory:jest.fn(),
        getALLData:jest.fn(),
        deleteById:jest.fn(),
        getCategory:jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                {
                    provide:CategoryService,
                    useValue:mockCategoryService
                },
                {
                    provide: ResponseClient,
                    useValue: {
                        ResponseClient: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
        service = module.get<CategoryService>(CategoryService);
        responseClient = module.get<ResponseClient>(ResponseClient);
    });

    describe('create', () => {
        it('should create a category and return status CREATED', async () => {
            // Mock data
            const categoryDto: createCategoryDto = {
                name: 'Công đoàn khoa Khoa học và Kỹ thuật máy tính',
            };
            const createdCategory = {
                name: 'Công đoàn khoa Khoa học và Kỹ thuật máy tính',
            };
            mockCategoryService.createCategory.mockResolvedValue(createdCategory);
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            await controller.create(categoryDto, res);
            expect(responseClient.ResponseClient).toHaveBeenCalledWith(SUCCESS, createdCategory);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
            expect(res.json).toHaveBeenCalledWith(responseClient);
        });
    });

    describe('edit', () => {
        it('should edit a category and return status OK', async () => {
            // Mock data
            const categoryDto: editCategoryDto = { id: '123', name: 'Công đoàn 1' };
            const updatedCategory = { id: '123', name: 'Công đoàn 1' };


            mockCategoryService.updateCategory.mockReturnValue(updatedCategory)
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

            await controller.edit(categoryDto, res);

            expect(responseClient.ResponseClient).toHaveBeenCalledWith(SUCCESS, updatedCategory);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(responseClient);
        });
    });

    describe('getAll', () => {
        it('should get all categories and return status OK', async () => {
            // Mock data
            const categories = [
                { id: '1', name: 'Công đoàn khoa Khoa học và Kỹ thuật máy tính' },
                { id: '2', name: 'Công đoàn 1' },
            ];

            // Mock the Prisma service behavior
            mockCategoryService.getALLData.mockReturnValue(categories)
            // Mock response object
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

            // Call the method
            await controller.getAll(res);

            expect(responseClient.ResponseClient).toHaveBeenCalledWith(SUCCESS, categories);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(responseClient);
        });
    });

    describe('getId', () => {
        it('should get a category by ID and return status OK', async () => {
            // Mock data
            const category = { 
                id: '1', 
                name: 'Công đoàn khoa Khoa học và Kỹ thuật máy tính',
                createdAt: "2024-07-25T08:27:37.938Z",
                updatedAt: "2024-08-03T14:22:25.183Z"    
            };
            const id = '1';

            // Mock the Prisma service behavior
            mockCategoryService.getCategory.mockReturnValue(category)
            // Mock response object
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
            await controller.getId(res, id);


            expect(responseClient.ResponseClient).toHaveBeenCalledWith(SUCCESS, category);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(responseClient);
        });
    });

    describe('deleteId', () => {
        it('should delete a category by ID and return status OK', async () => {
            // Mock data
            const idDto: IdDto = { id: '123' };
            const deletedCategory = { id: '123'};

            mockCategoryService.deleteById.mockReturnValue(deletedCategory)
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

            await controller.deleteId(idDto, res);

            expect(responseClient.ResponseClient).toHaveBeenCalledWith(SUCCESS, deletedCategory);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(responseClient);
        });
    });
});
