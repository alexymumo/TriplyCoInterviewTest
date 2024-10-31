const request = require('supertest');

const BASE_URL = 'https://restful-booker.herokuapp.com';

describe('GET /ping', () => {
  it('should return 200 when the api is up and running',async () => {
    const res = await request(BASE_URL)
    .get('/ping')
    expect(res.statusCode).toBe(201);
  });
  it('should return 404 when the api is not running',async () => {
    const res = await request(BASE_URL)
    .get('/ping1')
    expect(res.statusCode).toBe(404);
  });
});

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
    expect(Array.isArray(res.body)).toBe(true)
  });

  it('should return bookings by checkin/checkout date',async () => {
    const res = await request(BASE_URL)
    .get('/booking')
    .set('Content-Type', 'application/json')
    .query({checkin:'2014-05-21',checkout:'2014-05-21'})
    .send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true)
  });
});

describe('GET /booking/:id',() =>{
  it('should return a specific booking based on id given', async () => {
    const bookingId = 5;
    const res = await request(BASE_URL)
    .get(`/booking/${bookingId}`)
    expect(res.status).toBe(200); 
  });

  it('should return Not Found for invalid booking id', async () => {
    const bookingId = 12132323;
    const res = await request(BASE_URL)
    .get(`/booking/${bookingId}`)
    expect(res.status).toBe(404);

  });
});

describe('POST /booking',() =>{
  it('should create a new booking using valid details',async () => {
    const bookingData = {
      "firstname": "Testfirstname",
      "lastname": "Testlastname",
      "totalprice": 2000,
      "depositpaid": false,
      "bookingdates": {
          "checkin": "2024-01-01",
          "checkout": "2025-01-01"
      },
      "additionalneeds": "Dinner"
  };
    const res = await request(BASE_URL)
    .post('/booking')
    .send({
      "firstname": "Testfirstname",
      "lastname": "Testlastname",
      "totalprice": 2000,
      "depositpaid": false,
      "bookingdates": {
          "checkin": "2024-01-01",
          "checkout": "2025-01-01"
      },
      "additionalneeds": "Dinner"
    })
    //.set('Content-Type','application/json');
    expect(res.statusCode).toBe(201);
    //expect(res.body).toHaveProperty('bookingid')
    //expect(res.body).toHaveProperty('booking')
  });
  it('should return 500 for invalid data',async () => {
    const res = await request(BASE_URL)
    .post('/booking')
    .send("data")
    expect(res.statusCode).toBe(500);
  });
});

