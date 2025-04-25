import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

let createdResourceId: number;

describe('Resource API', () => {

  it('should create a new resource', async () => {
    const res = await request(BASE_URL)
      .post('/api/resource')
      .send({
        title: 'Inspiring Talk',
        url: 'https://youtube.com/someinspiringtalk',
        type: 'Video',
        userId: 1
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Inspiring Talk');

    createdResourceId = res.body.id;
  });

  it('should fail to create resource with missing fields', async () => {
    const res = await request(BASE_URL)
      .post('/api/resource')
      .send({
        type: 'Missing title, url, userId'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all resources for a user', async () => {
    const res = await request(BASE_URL)
      .get('/api/resource?userId=1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fail to get resources without userId', async () => {
    const res = await request(BASE_URL)
      .get('/api/resource');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get a single resource by ID', async () => {
    const res = await request(BASE_URL)
      .get(`/api/resource/${createdResourceId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdResourceId);
  });

  it('should fail to get a non-existing resource', async () => {
    const res = await request(BASE_URL)
      .get('/api/resource/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should update a resource', async () => {
    const res = await request(BASE_URL)
      .put(`/api/resource/${createdResourceId}`)
      .send({
        title: 'Updated Inspiring Talk',
        url: 'https://youtube.com/updatedtalk',
        type: 'Video'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Inspiring Talk');
  });

  it('should fail to update a non-existing resource', async () => {
    const res = await request(BASE_URL)
      .put('/api/resource/999999')
      .send({
        title: 'Should fail',
        url: 'https://fail.com',
        type: 'Error'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
  });

  it('should delete a resource', async () => {
    const res = await request(BASE_URL)
      .delete(`/api/resource/${createdResourceId}`);

    expect(res.statusCode).toBe(204);
  });

  it('should fail to delete a non-existing resource', async () => {
    const res = await request(BASE_URL)
      .delete('/api/resource/999999');

    expect(res.statusCode).toBe(500);
  });

});
