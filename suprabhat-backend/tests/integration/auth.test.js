import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import User from '../../src/api/v1/users/user.model.js';

describe('Auth Routes', () => {
  const userCredentials = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should return 201 CREATED and successfully register a user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userCredentials)
        .expect(httpStatus.CREATED);


      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userCredentials.email);
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 409 CONFLICT if email is already taken', async () => {
      await User.create(userCredentials);
      await request(app)
        .post('/api/v1/auth/register')
        .send(userCredentials)
        .expect(httpStatus.CONFLICT);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 200 OK and an access token on successful login', async () => {
      // Create user first
      await User.create(userCredentials);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userCredentials.email, password: userCredentials.password })
        .expect(httpStatus.OK);

      expect(res.body.data.user.email).toBe(userCredentials.email);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 UNAUTHORIZED for incorrect password', async () => {
      // Create user first
      await User.create(userCredentials);

      await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userCredentials.email, password: 'wrongpassword' })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return 401 UNAUTHORIZED if no token is provided', async () => {
      await request(app)
        .get('/api/v1/users/me')
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should return 200 OK and user profile if token is valid', async () => {
      // Create user and then log in to get a valid token
      await User.create(userCredentials);
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userCredentials.email, password: userCredentials.password });

      expect(loginRes.body.data.token).toBeDefined(); // Add this check!
      const token = loginRes.body.data.token;

      const profileRes = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.OK);

      expect(profileRes.body.data.email).toBe(userCredentials.email);
    });
  });
});