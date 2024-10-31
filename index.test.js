const request = require('supertest');

const BASE_URL = 'https://restful-booker.herokuapp.com';

describe('POST /auth', () => {
  it('should return a valid token when correct credentials are provided', async () => {
    const response = await request(BASE_URL)
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send({
        username: 'admin',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200); 
    expect(response.body).toHaveProperty('token'); 
  });

  it('should return Bad credential for invalid credentials provided', async () => {
    const response = await request(BASE_URL)
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

describe('GET /booking', () =>{
  it('should return all the booking ids in the api', async () =>{
    const res = await request(BASE_URL)
    .get('/booking')
    .send();
    expect(res.statusCode).toBe(200);
  });
  it('should return bookings by firstname and lastname', async () => {
    const res = await request(BASE_URL)
    .get('/booking')
    .query({firstname:'sally',lastname:'brown'})
    .send();
    expect(res.statusCode).toBe(200);

  });

  it('should return bookings by checkin/checkout date',async () => {

  })
});

