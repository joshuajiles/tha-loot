import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

let createdIdeaId: number;

describe('Idea API', () => {

  it('should create a new idea', async () => {
    const res = await request(BASE_URL)
      .post('/api/idea')
      .send({
        content: 'A society that communicates only through music',
        source: 'AI',
        userId: 1
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe('A society that communicates only through music');

    createdIdeaId = res.body.id;
  });

  it('should fail to create idea with missing fields', async () => {
    const res = await request(BASE_URL)
      .post('/api/idea')
      .send({
        source: 'Missing content and userId'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all ideas for a user', async () => {
    const res = await request(BASE_URL)
      .get('/api/idea?userId=1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fail to get ideas without userId', async () => {
    const res = await request(BASE_URL)
      .get('/api/idea');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get a single idea by ID', async () => {
    const res = await request(BASE_URL)
      .get(`/api/idea/${createdIdeaId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdIdeaId);
  });

  it('should fail to get a non-existing idea', async () => {
    const res = await request(BASE_URL)
      .get('/api/idea/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should update an idea', async () => {
    const res = await request(BASE_URL)
      .put(`/api/idea/${createdIdeaId}`)
      .send({
        content: 'Updated musical society idea',
        source: 'Human'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.content).toBe('Updated musical society idea');
  });

  it('should fail to update a non-existing idea', async () => {
    const res = await request(BASE_URL)
      .put('/api/idea/999999')
      .send({
        content: 'This should fail',
        source: 'Error'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
  });

  it('should delete an idea', async () => {
    const res = await request(BASE_URL)
      .delete(`/api/idea/${createdIdeaId}`);

    expect(res.statusCode).toBe(204);
  });

  it('should fail to delete a non-existing idea', async () => {
    const res = await request(BASE_URL)
      .delete('/api/idea/999999');

    expect(res.statusCode).toBe(500);
  });

});
