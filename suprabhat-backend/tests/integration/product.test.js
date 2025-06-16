import request from 'supertest';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import Product from '../../src/api/v1/products/product.model.js';
import User from '../../src/api/v1/users/user.model.js';

describe('Product Routes', () => {
  let adminToken, userToken;

  const adminCredentials = { name: 'Admin User', email: 'admin.product@example.com', password: 'password123', role: 'admin' };
  const userCredentials = { name: 'Regular User', email: 'user.product@example.com', password: 'password123' };

  const productOne = { name: 'Fresh Apples', description: 'Crisp and juicy red apples.', price: 150, unit: 'kg', category: 'Fruits', stock: 50 };
  const productTwo = { name: 'Organic Spinach', description: 'Fresh leafy greens.', price: 80, unit: 'bunch', category: 'Vegetables', stock: 30 };

  beforeEach(async () => {
    // Re-create users and get fresh tokens before EVERY test
    await User.create(adminCredentials);
    await User.create(userCredentials);

    let res = await request(app).post('/api/v1/auth/login').send({ email: adminCredentials.email, password: adminCredentials.password });
    adminToken = res.body.data.token;

    res = await request(app).post('/api/v1/auth/login').send({ email: userCredentials.email, password: userCredentials.password });
    userToken = res.body.data.token;

    // Handle products
    await Product.deleteMany({});
    await Product.create([productOne, productTwo]);
  });

  describe('POST /api/v1/products/admin', () => {
    const newProduct = { name: 'Sweet Bananas', description: 'Ripe and sweet.', price: 60, unit: 'dozen', category: 'Fruits', stock: 100 };

    it('should return 201 CREATED and create a product if user is admin', async () => {
      const res = await request(app).post('/api/v1/products/admin').set('Authorization', `Bearer ${adminToken}`).send(newProduct).expect(httpStatus.CREATED);
      expect(res.body.data.name).toBe(newProduct.name);
    });

    it('should return 403 FORBIDDEN if user is not admin', async () => {
      await request(app).post('/api/v1/products/admin').set('Authorization', `Bearer ${userToken}`).send(newProduct).expect(httpStatus.FORBIDDEN);
    });

    it('should return 401 UNAUTHORIZED if no token is provided', async () => {
      await request(app).post('/api/v1/products/admin').send(newProduct).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /api/v1/products', () => {
    it('should return 200 OK and a list of all products', async () => {
      const res = await request(app).get('/api/v1/products').expect(httpStatus.OK);
      expect(res.body.data.results).toBeInstanceOf(Array);
      expect(res.body.data.results.length).toBe(2);
    });

    it('should correctly filter products by category', async () => {
      const res = await request(app).get('/api/v1/products?category=Fruits').expect(httpStatus.OK);
      expect(res.body.data.results.length).toBe(1);
      expect(res.body.data.results[0].name).toBe('Fresh Apples');
    });

    it('should correctly paginate results', async () => {
      // THIS IS THE FIX: Added sortBy=name:asc to make the test deterministic
      const res = await request(app)
        .get('/api/v1/products?sortBy=name:asc&limit=1&page=2')
        .expect(httpStatus.OK);
      
      expect(res.body.data.results.length).toBe(1);
      expect(Number(res.body.data.page)).toBe(2);
      // Page 1 is 'Fresh Apples', so Page 2 must be 'Organic Spinach'
      expect(res.body.data.results[0].name).toBe('Organic Spinach');
    });

    it('should correctly sort products by price in ascending order', async () => {
      const res = await request(app).get('/api/v1/products?sortBy=price:asc').expect(httpStatus.OK);
      expect(res.body.data.results[0].name).toBe('Organic Spinach');
      expect(res.body.data.results[1].name).toBe('Fresh Apples');
    });
  });

  describe('GET /api/v1/products/:productId', () => {
    it('should return 200 OK and the product details if ID is valid', async () => {
      const product = await Product.findOne({ name: 'Fresh Apples' });
      const res = await request(app).get(`/api/v1/products/${product._id}`).expect(httpStatus.OK);
      expect(res.body.data.name).toBe(product.name);
    });

    it('should return 404 NOT FOUND if product does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/v1/products/${nonExistentId}`).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/v1/products/admin/:productId', () => {
    let productToUpdate;

    beforeEach(async () => {
      productToUpdate = await Product.findOne({ name: 'Fresh Apples' });
    });

    it('should return 200 OK and update the product if user is admin', async () => {
      const updatePayload = { price: 160, stock: 45 };
      const res = await request(app).put(`/api/v1/products/admin/${productToUpdate._id}`).set('Authorization', `Bearer ${adminToken}`).send(updatePayload).expect(httpStatus.OK);
      expect(res.body.data.price).toBe(160);
    });

    it('should return 403 FORBIDDEN if user is not admin', async () => {
      await request(app).put(`/api/v1/products/admin/${productToUpdate._id}`).set('Authorization', `Bearer ${userToken}`).send({ price: 170 }).expect(httpStatus.FORBIDDEN);
    });

    it('should return 404 NOT FOUND if product ID does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app).put(`/api/v1/products/admin/${nonExistentId}`).set('Authorization', `Bearer ${adminToken}`).send({ price: 170 }).expect(httpStatus.NOT_FOUND);
    });

    it('should return 400 BAD REQUEST if update body is invalid (e.g., empty)', async () => {
      await request(app).put(`/api/v1/products/admin/${productToUpdate._id}`).set('Authorization', `Bearer ${adminToken}`).send({}).expect(httpStatus.BAD_REQUEST);
    });
  });
});