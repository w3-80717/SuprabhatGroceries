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
  let adminToken; 
  let testAdmin; 
  let productInStock;
  let anotherProduct; 

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(async () => {
    // Setup User and get token
    const userCredentials = { name: 'User One', email: 'user.order1@example.com', password: 'password123', phone: 'whatsapp:+919999999991' };
    testUser = await User.create(userCredentials);
    let res = await request(app).post('/api/v1/auth/login').send({ email: userCredentials.email, password: userCredentials.password });
    userToken = res.body.data.token;

    // Setup Admin and get token
    const adminCredentials = { name: 'Admin User', email: 'admin.order@example.com', password: 'adminPassword123', role: 'admin' };
    testAdmin = await User.create(adminCredentials);
    res = await request(app).post('/api/v1/auth/login').send({ email: adminCredentials.email, password: adminCredentials.password });
    adminToken = res.body.data.token;


    productInStock = await Product.create({ name: 'Test Oranges', description: 'Juicy', price: 100, unit: 'kg', category: 'Fruits', stock: 10 });
    anotherProduct = await Product.create({ name: 'Test Apples', description: 'Crisp', price: 150, unit: 'kg', category: 'Fruits', stock: 5 });
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
      expect(res.body.data.user.toString()).toBe(testUser._id.toString());
      const updatedProduct = await Product.findById(productInStock._id);
      expect(updatedProduct.stock).toBe(8);
    });

    it('should trigger notifications on successful order', async () => {
      const orderPayload = { items: [{ productId: productInStock._id.toString(), quantity: 1 }], deliveryAddress: '123 Notification Lane' };
      
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderPayload)
        .expect(httpStatus.CREATED);
        
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('--- 📧 Sending Email ---'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`To: ${testUser.email}`));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('--- 📱 Sending WhatsApp Message ---'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`To: ${testUser.phone}`));
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
        .expect(httpStatus.CREATED);

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
        .expect(httpStatus.CREATED);

      const orderId = orderRes.body.data._id;
      expect(orderId).toBeDefined();

      const res = await request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data._id).toBe(orderId);
      expect(res.body.data.user.toString()).toBe(testUser._id.toString());
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

  // --- Admin Order Management Tests ---
  describe('Admin Order Routes', () => {
    let userOrder1, userOrder2;
    let userTwoToken;
    let testUserTwo;

    beforeEach(async () => {
      // Create a second user
      const userTwoCredentials = { name: 'User Two', email: 'user.order2@example.com', password: 'password123', phone: 'whatsapp:+919999999992' };
      testUserTwo = await User.create(userTwoCredentials);
      const loginRes = await request(app).post('/api/v1/auth/login').send({ email: userTwoCredentials.email, password: userTwoCredentials.password });
      userTwoToken = loginRes.body.data.token;

      // Create orders for both users
      const orderPayload1 = { items: [{ productId: productInStock._id.toString(), quantity: 1 }], deliveryAddress: 'User One Address' };
      const orderPayload2 = { items: [{ productId: anotherProduct._id.toString(), quantity: 2 }], deliveryAddress: 'User Two Address' };

      const res1 = await request(app).post('/api/v1/orders').set('Authorization', `Bearer ${userToken}`).send(orderPayload1);
      userOrder1 = res1.body.data;

      const res2 = await request(app).post('/api/v1/orders').set('Authorization', `Bearer ${userTwoToken}`).send(orderPayload2);
      userOrder2 = res2.body.data;
    });

    describe('GET /api/v1/orders/admin', () => {
      it('should return 200 OK and all orders for an admin', async () => {
        const res = await request(app)
          .get('/api/v1/orders/admin')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(httpStatus.OK);

        expect(res.body.data.results).toBeInstanceOf(Array);
        expect(res.body.data.results.length).toBe(2); 
        expect(res.body.data.results[0].user).toBeDefined(); 
        expect(res.body.data.results[0].items[0].productId).toBeDefined();
        expect(res.body.data.results.some(order => order._id === userOrder1._id)).toBe(true);
        expect(res.body.data.results.some(order => order._id === userOrder2._id)).toBe(true);
      });

      it('should return 403 FORBIDDEN if a regular user tries to access all orders', async () => {
        await request(app)
          .get('/api/v1/orders/admin')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(httpStatus.FORBIDDEN);
      });

      it('should return 401 UNAUTHORIZED if no token is provided', async () => {
        await request(app)
          .get('/api/v1/orders/admin')
          .expect(httpStatus.UNAUTHORIZED);
      });
    });

    describe('PUT /api/v1/orders/admin/:orderId/status', () => {
      it('should return 200 OK and update the order status for an admin', async () => {
        const newStatus = 'Confirmed';
        const res = await request(app)
          .put(`/api/v1/orders/admin/${userOrder1._id}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: newStatus })
          .expect(httpStatus.OK);

        expect(res.body.data.orderStatus).toBe(newStatus);
        const updatedOrderInDB = await Order.findById(userOrder1._id);
        expect(updatedOrderInDB.orderStatus).toBe(newStatus);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('--- 📱 Sending WhatsApp Message ---'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Hi ${testUser.name}, your Suprabhat order #${userOrder1._id.toString().slice(-6)} status has been updated to: *${newStatus}*.`));
      });

      it('should return 403 FORBIDDEN if a regular user tries to update order status', async () => {
        await request(app)
          .put(`/api/v1/orders/admin/${userOrder1._id}/status`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ status: 'Delivered' })
          .expect(httpStatus.FORBIDDEN);
      });

      it('should return 400 BAD REQUEST for an invalid status', async () => {
        await request(app)
          .put(`/api/v1/orders/admin/${userOrder1._id}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'InvalidStatus' })
          .expect(httpStatus.BAD_REQUEST);
      });

      it('should return 404 NOT FOUND if order does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await request(app)
          .put(`/api/v1/orders/admin/${nonExistentId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'Delivered' })
          .expect(httpStatus.NOT_FOUND);
      });
    });
  });
});