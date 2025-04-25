import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

let createdIntentId: number;

describe('Intent API', () => {

  it('should create a new intent', async () => {
    const res = await request(BASE_URL)
      .post('/api/intent')
      .send({
        prompt: 'Create a world-building idea',
        type: 'Story Prompt',
        userId: 1
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.prompt).toBe('Create a world-building idea');

    createdIntentId = res.body.id;
  });

  it('should fail to create intent with missing fields', async () => {
    const res = await request(BASE_URL)
      .post('/api/intent')
      .send({
        type: 'Missing prompt and userId'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all intents for a user', async () => {
    const res = await request(BASE_URL)
      .get('/api/intent?userId=1');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fail to get intents without userId', async () => {
    const res = await request(BASE_URL)
      .get('/api/intent');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get a single intent by ID', async () => {
    const res = await request(BASE_URL)
      .get(`/api/intent/${createdIntentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdIntentId);
  });

  it('should fail to get a non-existing intent', async () => {
    const res = await request(BASE_URL)
      .get('/api/intent/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should update an intent', async () => {
    const res = await request(BASE_URL)
      .put(`/api/intent/${createdIntentId}`)
      .send({
        prompt: 'Updated world-building idea',
        type: 'Updated Type'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.prompt).toBe('Updated world-building idea');
  });

  it('should fail to update a non-existing intent', async () => {
    const res = await request(BASE_URL)
      .put('/api/intent/999999')
      .send({
        prompt: 'This should fail',
        type: 'Error'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
  });

  it('should delete an intent', async () => {
    const res = await request(BASE_URL)
      .delete(`/api/intent/${createdIntentId}`);

    expect(res.statusCode).toBe(204);
  });

  it('should fail to delete a non-existing intent', async () => {
    const res = await request(BASE_URL)
      .delete('/api/intent/999999');

    expect(res.statusCode).toBe(500);
  });

});
