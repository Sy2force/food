const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB, clearDB } = require('./setup');
const User = require('../models/User');

jest.setTimeout(30000); // Increase timeout to 30 seconds

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('User Routes', () => {
  const userPayload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    isBusiness: false
  };

  describe('POST /api/users (Register)', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(userPayload);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register user with existing email', async () => {
      await User.create(userPayload);
      
      const res = await request(app)
        .post('/api/users')
        .send(userPayload);
        
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email already registered');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login with valid credentials', async () => {
      await request(app).post('/api/users').send(userPayload);
      
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: userPayload.email,
          password: userPayload.password
        });
        
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid password', async () => {
      await request(app).post('/api/users').send(userPayload);
      
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: userPayload.email,
          password: 'wrongpassword'
        });
        
      expect(res.statusCode).toBe(401);
    });
  });

  describe('User Profile Operations', () => {
    let token;
    let userId;

    beforeEach(async () => {
      const res = await request(app).post('/api/users').send(userPayload);
      if (res.statusCode !== 201) {
        console.error('Setup Registration Failed:', res.statusCode, res.body);
      }
      token = res.body.token;
      userId = res.body.user ? res.body.user._id : null;
    });

    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('email', userPayload.email);
    });

    it('should update user profile', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
        
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name');
    });

    it('should update isBusiness status (PATCH)', async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isBusiness: true });
        
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('isBusiness', true);
    });
  });
});
