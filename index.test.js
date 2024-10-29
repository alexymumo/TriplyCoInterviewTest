const request = require('supertest');

describe('POST /auth', () => {
  it('should return a valid token when correct credentials are provided', async () => {
    const response = await request('https://restful-booker.herokuapp.com')
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send({
        username: 'admin',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('token'); // Check if the token is present
  });

  it('should return Bad credential for invalid credentials provided', async () => {
    const response = await request('https://restful-booker.herokuapp.com')
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send({
        username: 'ni',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('reason')
  });
});

