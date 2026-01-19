const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB, clearDB } = require('./setup');
const User = require('../models/User');
const Card = require('../models/Card');

jest.setTimeout(30000); // Increase timeout to 30 seconds

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('Card Routes', () => {
  let userToken;
  let businessToken;
  let businessUserId;
  let cardId;

  const businessUserPayload = {
    name: 'Business User',
    email: 'biz@test.com',
    password: 'password123',
    isBusiness: true
  };

  const cardPayload = {
    bizName: 'Test Business',
    bizDescription: 'A test business description that is long enough.',
    bizAddress: '123 Test St, Tel Aviv',
    bizPhone: '050-1234567',
    bizImage: 'https://example.com/image.jpg'
  };

  beforeEach(async () => {
    // Register business user
    const bizRes = await request(app).post('/api/users').send(businessUserPayload);
    businessToken = bizRes.body.token;
    businessUserId = bizRes.body.user._id;

    // Register regular user
    const userRes = await request(app).post('/api/users').send({
      name: 'Regular User',
      email: 'user@test.com',
      password: 'password123',
      isBusiness: false
    });
    userToken = userRes.body.token;
  });

  describe('POST /api/cards', () => {
    it('should create a card when user is business', async () => {
      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${businessToken}`)
        .send(cardPayload);
        
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('bizName', cardPayload.bizName);
      cardId = res.body._id;
    });

    it('should fail if user is not business', async () => {
      const res = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cardPayload);
        
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/cards', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${businessToken}`)
        .send(cardPayload);
    });

    it('should get all cards', async () => {
      const res = await request(app).get('/api/cards');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/cards/my-cards', () => {
    it('should return only user cards', async () => {
      await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${businessToken}`)
        .send(cardPayload);

      const res = await request(app)
        .get('/api/cards/my-cards')
        .set('Authorization', `Bearer ${businessToken}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].user_id).toBe(businessUserId);
    });
  });

  describe('PUT /api/cards/:id', () => {
    it('should update card if owner', async () => {
      const createRes = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${businessToken}`)
        .send(cardPayload);
      const id = createRes.body._id;

      const res = await request(app)
        .put(`/api/cards/${id}`)
        .set('Authorization', `Bearer ${businessToken}`)
        .send({ ...cardPayload, bizName: 'Updated Business' });
        
      expect(res.statusCode).toBe(200);
      expect(res.body.bizName).toBe('Updated Business');
    });
  });

  describe('PATCH /api/cards/:id (Like)', () => {
    it('should toggle like on card', async () => {
      const createRes = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${businessToken}`)
        .send(cardPayload);
      const id = createRes.body._id;

      const res = await request(app)
        .patch(`/api/cards/${id}`)
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.likes.length).toBe(1);
    });
  });

  describe('DELETE /api/cards/:id', () => {
    it('should delete card if owner', async () => {
      const createRes = await request(app)
        .post('/api/cards')
        .set('Authorization', `Bearer ${businessToken}`)
        .send(cardPayload);
      const id = createRes.body._id;

      const res = await request(app)
        .delete(`/api/cards/${id}`)
        .set('Authorization', `Bearer ${businessToken}`);
        
      expect(res.statusCode).toBe(200);
      
      const checkRes = await request(app).get(`/api/cards/${id}`);
      expect(checkRes.statusCode).toBe(404);
    });
  });
});
