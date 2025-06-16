import request from 'supertest';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { jest, describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals';
import app from '../../src/app.js';
import Order from '../../src/api/v1/orders/order.model.js';
import Product from '../../src/api/v1/products/product.model.js';
import User from '../../src/api/v1/users/user.model.js';

describe('Order Routes', () => {
  let userToken;
  let testUser;
  let productInStock;

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(async () => {
    // This setup runs before each test, ensuring a clean state.
    const userCredentials = { name: 'User One', email: 'user.order1@example.com', password: 'password123', phone: 'whatsapp:+919999999991' };
    testUser = await User.create(userCredentials);
    let res = await request(app).post('/api/v1/auth/login').send({ email: userCredentials.email, password: userCredentials.password });
    userToken = res.body.data.token;

    productInStock = await Product.create({ name: 'Test Oranges', description: 'Juicy', price: 100, unit: 'kg', category: 'Fruits', stock: 10 });
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('POST /api/v1/orders', () => {
    it('should create an order successfully and decrement stock', async () => {
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
    });

    it('should trigger notifications on successful order', async () => {
      // FIX: Used a valid delivery address
      const orderPayload = { items: [{ productId: productInStock._id.toString(), quantity: 1 }], deliveryAddress: '123 Notification Lane' };
      
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderPayload)
        .expect(httpStatus.CREATED); // Add expect() to ensure it passed
        
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('--- 📧 Sending Email ---'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`To: ${testUser.email}`));
    });

    it('should return 400 BAD REQUEST for insufficient stock', async () => {
      const orderPayload = {
        items: [{ productId: productInStock._id.toString(), quantity: 20 }],
        deliveryAddress: '123 Out of Stock Avenue',
      };

      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderPayload)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/v1/orders', () => {
    it("should return 200 OK and the user's own orders", async () => {
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ items: [{ productId: productInStock._id.toString(), quantity: 1 }], deliveryAddress: '123 My Order Street' })
        .expect(httpStatus.CREATED); // Ensure the order was actually created

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
        .send({ items: [{ productId: productInStock._id.toString(), quantity: 1 }], deliveryAddress: '123 My Detail Street' })
        .expect(httpStatus.CREATED); // Ensure the order was created

      const orderId = orderRes.body.data._id;
      expect(orderId).toBeDefined();

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
        .send({ items: [{ productId: productInStock._id.toString(), quantity: 1 }], deliveryAddress: '123 Secret Order Way' })
        .expect(httpStatus.CREATED);
      
      const orderId = orderRes.body.data._id;
      expect(orderId).toBeDefined();

      const userTwoCredentials = { name: 'User Two', email: 'user.order2@example.com', password: 'password123' };
      await User.create(userTwoCredentials);
      const loginRes = await request(app).post('/api/v1/auth/login').send({ email: userTwoCredentials.email, password: userTwoCredentials.password });
      const userTwoToken = loginRes.body.data.token;

      await request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set('Authorization', `Bearer ${userTwoToken}`) 
        .expect(httpStatus.FORBIDDEN);
    });
  });
});