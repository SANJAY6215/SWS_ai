const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

describe('SWS AI API Endpoints', () => {
  
  // Close DB connection after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fetch the root API and return status message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('SWS AI API is running...');
  });

  it('should fetch all documents (initially empty or mock)', async () => {
    const res = await request(app).get('/api/documents');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fetch all notifications', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
