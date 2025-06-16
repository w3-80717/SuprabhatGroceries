// File: src/api/v1/orders/order.service.js

import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Order from './order.model.js';
import { productService } from '../products/product.service.js';
import { ApiError } from '../../../utils/ApiError.js';
import { notificationService } from '../../../services/notification.service.js';
import Product from '../products/product.model.js';

/**
 * Creates a new order. This function is transactional.
 * @param {User} user - The user object placing the order.
 * @param {Object} orderData - The raw order data from the request body.
 * @returns {Promise<Order>} The created order.
 */
const createOrder = async (user, orderData) => {
  const { items, deliveryAddress } = orderData;
  const deliveryFee = 50; // Hardcoded for now

  // Conditionally start a transaction. In 'test' mode, we won't.
  const session = process.env.NODE_ENV !== 'test'
    ? await mongoose.startSession()
    : null;

  try {
    // Start the transaction if a session exists
    if (session) {
      session.startTransaction();
    }

    let subTotal = 0;
    const orderItems = [];
    const productStockUpdates = [];

    for (const item of items) {
      // Pass the session to findById if it exists
      const product = await Product.findById(item.productId).session(session || null);

      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, `Product with ID ${item.productId} not found.`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}.`);
      }

      orderItems.push({ productId: product._id, name: product.name, quantity: item.quantity, price: product.price });
      subTotal += product.price * item.quantity;
      productStockUpdates.push({ updateOne: { filter: { _id: product._id }, update: { $inc: { stock: -item.quantity } } } });
    }

    // Pass the session to bulkWrite if it exists
    await Product.bulkWrite(productStockUpdates, { session: session || null });

    const totalAmount = subTotal + deliveryFee;
    const orderToCreate = { user: user._id, items: orderItems, totalAmount, subTotal, deliveryFee, deliveryAddress, orderStatus: 'Pending' };

    // Pass the session to create if it exists
    const createdOrderArray = await Order.create([orderToCreate], { session: session || null });
    const createdOrder = createdOrderArray[0];

    // Commit the transaction if a session exists
    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    notificationService.sendOrderConfirmation(createdOrder, user);

    return createdOrder;

  } catch (error) {
    // Abort the transaction if a session exists and an error occurred
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

/**
 * Retrieves all orders for a specific user.
 * @param {mongoose.Types.ObjectId} userId - The ID of the user.
 * @returns {Promise<Array<Order>>} A list of the user's orders.
 */
const getUserOrders = async (userId) => {
  // Sort by newest first
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return {
      results: orders,
      totalResults: orders.length
  };
};

/**
 * Retrieves a single order by its ID, ensuring it belongs to the requesting user.
 * @param {mongoose.Types.ObjectId} userId - The ID of the user making the request.
 * @param {mongoose.Types.ObjectId} orderId - The ID of the order to retrieve.
 * @returns {Promise<Order>} The order object.
 */
const getOrderById = async (userId, orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found.');
  }

  // Security check: Ensure the user requesting the order is the one who owns it.
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to view this order.");
  }

  return order;
};

// This function would be used by an admin-only endpoint.
// We haven't built the corresponding controller/route for it yet.
/**
 * Updates the status of an order (Admin only).
 * @param {mongoose.Types.ObjectId} orderId - The ID of the order.
 * @param {string} newStatus - The new status to set.
 * @returns {Promise<Order>} The updated order.
 */
const updateOrderStatusByAdmin = async (orderId, newStatus) => {
    // We use .populate('user') to get the user's details for sending a notification.
    const order = await Order.findById(orderId).populate('user');
    if(!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    order.orderStatus = newStatus;
    await order.save();
    
    // Trigger a notification for the user about the status update.
    if (order.user) {
        notificationService.sendOrderStatusUpdate(order, order.user);
    }
    
    // We can return the lean object without the populated user to keep the API response small.
    const leanOrder = order.toObject();
    delete leanOrder.user;

    return leanOrder;
}


export const orderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatusByAdmin,
};