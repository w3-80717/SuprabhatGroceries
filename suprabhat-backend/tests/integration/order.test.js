import request from 'supertest';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
// THIS IS THE FIX: Import Jest's globals explicitly
import { jest, describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals';
import app from '../../src/app.js';
import Order from '../../src/api/v1/orders/order.model.js';
import Product from '../../src/api/v1/products/product.model.js';
import User from '../../src/api/v1/users/user.model.js';

describe('Order Routes', () => {
  let adminToken, userToken, userTwoToken;
  let testUser, testUserTwo;
  let productInStock, productOutOfStock;

  // Spy on console.log for notification tests
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(async () => {
    // Re-create users and get fresh tokens before EVERY test
    const adminCredentials = { name: 'Admin', email: 'admin.order@example.com', password: 'password123', role: 'admin' };
    await User.create(adminCredentials);
    let res = await request(app).post('/api/v1/auth/login').send({ email: adminCredentials.email, password: adminCredentials.password });
    adminToken = res.body.data.token;

    const userCredentials = { name: 'User One', email: 'user.order1@example.com', password: 'password123', phone: 'whatsapp:+919999999991' };
    testUser = await User.create(userCredentials);
    res = await request(app).post('/api/v1/auth/login').send({ email: userCredentials.email, password: userCredentials.password });
    userToken = res.body.data.token;

    const userTwoCredentials = { name: 'User Two', email: 'user.order2@example.com', password: 'password123' };
    testUserTwo = await User.create(userTwoCredentials);
    res = await request(app).post('/api/v1/auth/login').send({ email: userTwoCredentials.email, password: userTwoCredentials.password });
    userTwoToken = res.body.data.token;

    // Setup products
    await Product.deleteMany({});
    productInStock = await Product.create({ name: 'Test Oranges', description: 'Juicy', price: 100, unit: 'kg', category: 'Fruits', stock: 10 });
    productOutOfStock = await Product.create({ name: 'Test Grapes', description: 'Sweet', price: 120, unit: 'kg', category: 'Fruits', stock: 0 });
    
    // Clear previous orders
    await Order.deleteMany({});
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('POST /api/v1/orders', () => {
    it('should create an order successfully, decrement stock, and trigger notifications', async () => {
      const orderPayload = {
        items: [{ productId: productInStock._id.toString(), quantity: 2 }],
        deliveryAddress: '123 Test Street, Test City',
      };

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderPayload)
        .expect(httpStatus.CREATED);

      expect(res.body.data.orderStatus).toBe('Pending');
      const updatedProduct = await Product.findById(productInStock._id);
      expect(updatedProduct.stock).toBe(8);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('--- 📧 Sending Email ---'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`To: ${testUser.email}`));
    });

    it('should return 400 BAD REQUEST for insufficient stock', async () => {
      const orderPayload = {
        items: [{ productId: productInStock._id.toString(), quantity: 20 }],
        deliveryAddress: '123 Test Street, Test City',
      };

      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderPayload)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/v1/orders', () => {
    it("should return 200 OK and only the user's own orders", async () => {
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ items: [{ productId: productInStock._id, quantity: 1 }], deliveryAddress: 'addr1' });

      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send({ items: [{ productId: productInStock._id, quantity: 1 }], deliveryAddress: 'addr2' });

      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);
        
      expect(res.body.data.results.length).toBe(1);
      expect(res.body.data.results[0].user.toString()).toBe(testUser._id.toString());
    });
  });
  
  describe('GET /api/v1/orders/:orderId', () => {
    it("should allow a user to get their own order details", async () => {
        const orderRes = await request(app)
          .post('/api/v1/orders')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ items: [{ productId: productInStock._id, quantity: 1 }], deliveryAddress: 'addr1' });

        const orderId = orderRes.body.data._id;

        const res = await request(app)
            .get(`/api/v1/orders/${orderId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(httpStatus.OK);

        expect(res.body.data._id).toBe(orderId);
    });

    it("should FORBID a user from getting another user's order details", async () => {
        const orderRes = await request(app)
          .post('/api/v1/orders')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ items: [{ productId: productInStock._id, quantity: 1 }], deliveryAddress: 'addr1' });

        const orderId = orderRes.body.data._id;

        await request(app)
            .get(`/api/v1/orders/${orderId}`)
            .set('Authorization', `Bearer ${userTwoToken}`) // Different user's token
            .expect(httpStatus.FORBIDDEN);
    });
  });
});