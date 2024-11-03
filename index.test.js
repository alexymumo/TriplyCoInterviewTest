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
  },10000);

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
    expect(200); 
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
      "additionalneeds": "Dinner"};
    const res = await request(BASE_URL)
    .post('/booking')
    .send(bookingData)
    .set('Content-Type','application/json')
    expect(200)

  });

  it('should return 500 for invalid data',async () => {
    const res = await request(BASE_URL)
    .post('/booking')
    .send("data")
    expect(res.statusCode).toBe(500);
  });
});


describe('DELETE /booking/:id',() => {
  it('should delete an existing booking and return 201',async () => {
    const res = await request(BASE_URL)
    .delete(`/booking/1`)
    .set('Content-Type','application/json')
    .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=');
    expect(res.statusCode).toBe(201)
  });

  it('should not delete a booking with an invalid booking id',async () => {
    const res = await request(BASE_URL)
    .delete(`/booking/2323232323232`)
    .set('Content-Type','application/json')
    .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=');
    expect(res.statusCode).toBe(405)
  });

  it('should not delete a booking with an invalid authorization and a valid booking id',async () => {
    const res = await  request(BASE_URL)
    .delete(`/booking/1`)
    .set('Content-Type','application/json')
    .set('Authorization','Basic Test34');
    expect(res.statusCode).toBe(403)
  });
  it('should not delete a booking with an invalid authorization and an invalid booking id',async () => {
    const res = await request(BASE_URL)
    .delete(`/booking/21134444`)
    .set('Content-Type','application/json')
    .set('Authorization','Basic Test23')
    expect(403)
  });
});


describe('PUT /booking/:id', () => {
  it('should update current booking with valid booking data',async () =>{
    const res = await request(BASE_URL)
    .put('/booking/1')
    .set('Content-Type','application/json')
    .set('Cookie','token=abc123')
    .send()

  });

  it('should return bad request with invalid data',async () =>{
    const res = await request(BASE_URL)
    .put('/booking/23')
    .set('Content-Type','application/json')
    .set('Cookie','token=abc123')
    .send("data")
    expect(res.statusCode).toBe(400)
  });

  it('should return forbidden with invalid token',async () => {
    const res = await request(BASE_URL)
    .put('/booking/691')
    .set('Content-Type','application/json')
    .send('invalid data')
    expect(res.statusCode).toBe(503)
  });
});


describe('PATCH /booking/:id',() => {
  it('should update a current booking with a partial payload',async () => {
    const patchData = {
        "firstname" : "Alex Test",
        "lastname" : "Test"
    }
    const res = await request(BASE_URL)
    .patch('/booking/78')
    .set('Content-Type','application/json')
    .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
    .send(patchData)
    expect(res.statusCode).toBe(200);
  },10000);
  
  it('should not update a current booking with partial payload with an invalid token',async () => {
    const patchData = {
      "firstname" : "Alex Test",
      "lastname" : "Test"
    }
    const res = await request(BASE_URL)
    .patch('/booking/78')
    .set('Content-Type','application/json')
    .set('Authorization','Basic Test')
    .send(patchData)
    expect(res.statusCode).toBe(403)
  });

  it('should not update a booking with invalid booking id',async () => {
    const patchData = {
      "firstname" : "Alex Test",
      "lastname" : "Test"
    }
    const res = await request(BASE_URL)
    .patch('booking/232T')
    .set('Content-Type','application/json')
    .set('Authorization','Basic YWRtaW46cGFzc3dvcmQxMjM=')
    .send(patchData)
    expect(res.statusCode).toBe(500)
  });
});

