import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module'; // Đảm bảo đường dẫn đúng với AppModule của bạn

describe('Participants Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/participant/:id (GET) - should return participant if found', async () => {
    const validId = 'd9a52fac-5d50-42c0-94d7-5b881fbd7b9a'; 

    const response = await request(app.getHttpServer())
      .get(`/participant/${validId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(validId);
    expect(response.body).toHaveProperty('achievements');
    expect(response.body).toHaveProperty('childs');
    expect(response.body).toHaveProperty('activities');
  });

  it('/participant/:id (GET) - should return 404 if participant not found', async () => {
    const invalidId = '999999'; 

    const response = await request(app.getHttpServer())
      .get(`/participant/${invalidId}`)
      .expect(404);

    expect(response.body.message).toBe(`Participant with id ${invalidId} not found`);
  });
});