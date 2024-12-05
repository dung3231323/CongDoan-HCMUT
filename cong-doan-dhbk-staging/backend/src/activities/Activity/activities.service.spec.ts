import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createActivityDto, editActivityDto } from '../dtos/ActivityDTO';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ERROR_DB, LIST_PARTICIPANT_FORBIDDEN } from 'src/common/constants/activity.category';
import { JwtPayLoad } from 'src/common/model/jwt-payload.interface';
import { Omit } from '@prisma/client/runtime/library';

describe('ActivitiesService', () => {
    let service: ActivitiesService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        activity: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        category: {
            findFirst: jest.fn(),
        },
        unionDepartment: {
            findFirst: jest.fn(),
        },
        participant: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
        },
    };

    const mockJwtPayload: JwtPayLoad = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'ADMIN',
        unionDeptId: 'union-dept-id',
        iat: 1622470425,
        exp: 1622474025,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActivitiesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ActivitiesService>(ActivitiesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('createActivity', () => {
        it('should create an activity', async () => {
            const activityDto: createActivityDto = {
                name: 'New Activity',
                imgURL: 'https://example.com/image.jpg',
                activityStartDate: new Date(),
                activityEndDate: new Date(),
                categoryId: 'category-id',
                unionDeptId: 'union-dept-id',
                description: 'Activity Description',
            };

            const createdActivity = { ...activityDto, id: 'new-id' }

            const {categoryId, unionDeptId, ...returnData} = activityDto

            mockPrismaService.activity.create.mockResolvedValue(createdActivity);
            mockPrismaService.category.findFirst.mockResolvedValue(true);
            mockPrismaService.unionDepartment.findFirst.mockResolvedValue(true);

            await expect(
                service.createActivity(activityDto, mockJwtPayload),
            ).resolves.toEqual(createdActivity);

            expect(prismaService.activity.create).toHaveBeenCalledWith({
                data: {
                    ...returnData,
                    category: {
                        connect: {
                            id: activityDto.categoryId,
                        },
                    },
                    user: {
                        connect: {
                            id: mockJwtPayload.sub,
                        },
                    },
                    unionDept: {
                        connect: {
                            id: activityDto.unionDeptId,
                        },
                    },
                },
            });
        });
    });

    describe('getALLData', () => {
        it('should return all activities', async () => {
            const activities = [
                { id: '1', name: 'Activity 1' },
                { id: '2', name: 'Activity 2' },
            ];

            mockPrismaService.activity.findMany.mockResolvedValue(activities);

            await expect(service.getALLData()).resolves.toEqual(activities);

            expect(prismaService.activity.findMany).toHaveBeenCalled();
        });
    });

    describe('getActivity', () => {
        it('should return an activity by ID', async () => {
            const activity = { id: '1', name: 'Activity 1' };

            mockPrismaService.activity.findUnique.mockResolvedValue(activity);

            await expect(service.getActivity('1')).resolves.toEqual(activity);

            expect(prismaService.activity.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should throw NotFoundException if activity not found', async () => {
            mockPrismaService.activity.findUnique.mockResolvedValue(null);

            await expect(service.getActivity('1')).rejects.toThrow(
                new NotFoundException(`${ERROR_DB.ACTIVITY_NOTFOUND} 1`),
            );

            expect(prismaService.activity.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    describe('updateActivity', () => {
        it('should update an activity', async () => {
            const activityDto: editActivityDto = {
                id: '1',
                name: 'Updated Activity',
                activityStartDate: new Date(),
                activityEndDate: new Date(),
                categoryId: 'category-id',
                unionDeptId: 'union-dept-id',
                imgURL: 'https://example.com/image.jpg',
                description: 'Updated Description',
            };
            const {id, ...returnData} = activityDto
            mockPrismaService.activity.update.mockResolvedValue(activityDto);
            mockPrismaService.activity.findFirst.mockResolvedValue(true);

            await expect(
                service.updateActivity(activityDto, mockJwtPayload.unionDeptId),
            ).resolves.toEqual(activityDto);

            expect(prismaService.activity.update).toHaveBeenCalledWith({
                where: { id: activityDto.id },
                data: {
                    ...returnData,
                },
            })
        })
    });

    describe('getParticipantById', () => {
        it('should return a participant by ID', async () => {
            const participant = { id: '1', unionDeptId: 'union-dept-id' };

            mockPrismaService.participant.findUnique.mockResolvedValue(participant);
            mockPrismaService.participant.findFirst.mockResolvedValue(true)

            await expect(service.getParticipantById('1')).resolves.toEqual(participant);

            expect(prismaService.participant.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
                select: {
                    unionDeptId: true,
                    id: true,
                },
            });
        });
    });

    describe('insertParticipants', () => {
        it('should insert participants into an activity', async () => {
            const activityId = '1';
            const listParti = ['1', '2'];

            const updatedActivity = { id: '1', participants: listParti };

            mockPrismaService.activity.update.mockResolvedValue(updatedActivity);
            mockPrismaService.activity.findFirst.mockResolvedValue(true);

            await expect(
                service.insertParticipants(activityId, listParti),
            ).resolves.toEqual(updatedActivity);

            expect(prismaService.activity.update).toHaveBeenCalledWith({
                where: { id: activityId },
                data: {
                    updateAt: expect.any(Date),
                    participants: {
                        createMany: {
                            data: listParti.map((participantId) => ({ participantId })),
                            skipDuplicates: true,
                        },
                    },
                },
            });
        });
    });

    describe('ensureEntitiesExist', () => {
        it('should throw NotFoundException if activity does not exist', async () => {
            mockPrismaService.activity.findFirst.mockResolvedValue(null);

            await expect(service['ensureEntitiesExist']('1', null, null, null)).rejects.toThrow(
                new NotFoundException(`${ERROR_DB.ACTIVITY_NOTFOUND} 1`),
            );
        });

        it('should throw NotFoundException if category does not exist', async () => {
            mockPrismaService.category.findFirst.mockResolvedValue(null);

            await expect(service['ensureEntitiesExist'](null, '1', null, null)).rejects.toThrow(
                new NotFoundException(`${ERROR_DB.CATEGORY_NOTFOUND} 1`),
            );
        });

        it('should throw NotFoundException if unionDept does not exist', async () => {
            mockPrismaService.unionDepartment.findFirst.mockResolvedValue(null);

            await expect(service['ensureEntitiesExist'](null, null, '1', null)).rejects.toThrow(
                new NotFoundException(`${ERROR_DB.UNIONDEPT_NOTFOUND} 1`),
            );
        });

        it('should throw NotFoundException if participant does not exist', async () => {
            mockPrismaService.participant.findFirst.mockResolvedValue(null);

            await expect(service['ensureEntitiesExist'](null, null, null, '1')).rejects.toThrow(
                new NotFoundException(`${ERROR_DB.PARTICIPANT_NOTFOUND} 1`),
            );
        });

        it('should not throw any exceptions if all entities exist', async () => {
            mockPrismaService.activity.findFirst.mockResolvedValue(true);
            mockPrismaService.category.findFirst.mockResolvedValue(true);
            mockPrismaService.unionDepartment.findFirst.mockResolvedValue(true);
            mockPrismaService.participant.findFirst.mockResolvedValue(true);

            await expect(service['ensureEntitiesExist']('1', '1', '1', '1')).resolves.toBeUndefined();
        });
    });
});
