// File: src/api/v1/orders/order.controller.js

import httpStatus from 'http-status';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { orderService } from './order.service.js';

const createNewOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const orderData = req.body;
  const order = await orderService.createOrder(user, orderData);
  res.status(httpStatus.CREATED).json(
    new ApiResponse(httpStatus.CREATED, order, 'Order created successfully')
  );
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getUserOrders(req.user._id);
    res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, orders, "Orders retrieved successfully")
    );
});

const getOrderDetails = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.user._id, req.params.orderId);
    res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, order, "Order details retrieved successfully")
    );
});

export const orderController = {
  createNewOrder,
  getUserOrders,
  getOrderDetails
};