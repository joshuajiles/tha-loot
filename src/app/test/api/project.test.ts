// /tests/api/project.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

let createdProjectId: number;

describe('Project API', () => {

  it('should create a new project', async () => {
    const res = await request(BASE_URL)
      .post('/api/project')
      .send({
        title: 'Test Project',
        description: 'Project created during testing',
        userId: 1
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Project');
    
    createdProjectId = res.body.id;
  });

  it('should fail to create project with missing fields', async () => {
    const res = await request(BASE_URL)
      .post('/api/project')
      .send({
        description: 'Missing title and userId'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all projects for a user', async () => {
    const res = await request(BASE_URL)
      .get('/api/project?userId=1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fail to get projects without userId', async () => {
    const res = await request(BASE_URL)
      .get('/api/project');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get a single project by ID', async () => {
    const res = await request(BASE_URL)
      .get(`/api/project/${createdProjectId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdProjectId);
  });

  it('should fail to get a non-existing project', async () => {
    const res = await request(BASE_URL)
      .get('/api/project/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should update a project', async () => {
    const res = await request(BASE_URL)
      .put(`/api/project/${createdProjectId}`)
      .send({
        title: 'Updated Project Title',
        description: 'Updated description'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Project Title');
  });

  it('should fail to update a non-existing project', async () => {
    const res = await request(BASE_URL)
      .put('/api/project/999999')
      .send({
        title: 'Should not update',
        description: 'Invalid ID'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);  // Prisma will throw because it can't update non-existent
  });

  it('should delete a project', async () => {
    const res = await request(BASE_URL)
      .delete(`/api/project/${createdProjectId}`);

    expect(res.statusCode).toBe(204);
  });

  it('should fail to delete a non-existing project', async () => {
    const res = await request(BASE_URL)
      .delete('/api/project/999999');

    expect(res.statusCode).toBe(500);  // Prisma will throw because it can't delete non-existent
  });

});
