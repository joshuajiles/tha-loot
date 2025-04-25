import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

let createdUserId: number;

describe('User API', () => {

  it('should create a new user', async () => {
    const res = await request(BASE_URL)
      .post('/api/user')
      .send({
        email: 'testuser@example.com',
        password: 'securepassword',
        name: 'Test User'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('testuser@example.com');

    createdUserId = res.body.id;
  });

  it('should fail to create user with missing fields', async () => {
    const res = await request(BASE_URL)
      .post('/api/user')
      .send({
        password: 'noemail'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all users', async () => {
    const res = await request(BASE_URL)
      .get('/api/user');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a single user by ID', async () => {
    const res = await request(BASE_URL)
      .get(`/api/user/${createdUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdUserId);
  });

  it('should fail to get a non-existing user', async () => {
    const res = await request(BASE_URL)
      .get('/api/user/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should update a user', async () => {
    const res = await request(BASE_URL)
      .put(`/api/user/${createdUserId}`)
      .send({
        email: 'updateduser@example.com',
        password: 'newpassword',
        name: 'Updated Name'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('updateduser@example.com');
  });

  it('should fail to update a non-existing user', async () => {
    const res = await request(BASE_URL)
      .put('/api/user/999999')
      .send({
        email: 'failupdate@example.com',
        password: 'fail',
        name: 'Fail'
      })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(500);
  });

  it('should delete a user', async () => {
    const res = await request(BASE_URL)
      .delete(`/api/user/${createdUserId}`);

    expect(res.statusCode).toBe(204);
  });

  it('should fail to delete a non-existing user', async () => {
    const res = await request(BASE_URL)
      .delete('/api/user/999999');

    expect(res.statusCode).toBe(500);
  });

});
