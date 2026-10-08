import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createPaymentOrder,
  verifyPayment,
  getOrderById,
  getMyOrders,
} from '../controllers/order.controller.js';

const orderRoutes = express.Router();

// Order Creation Flow
orderRoutes.post('/', authMiddleware, createPaymentOrder);
orderRoutes.post('/create-payment-order', authMiddleware, createPaymentOrder);

// Payment Verification Flow
orderRoutes.post('/verify-payment', authMiddleware, verifyPayment);

// Order Retrieval
orderRoutes.get('/my-orders', authMiddleware, getMyOrders);
orderRoutes.get('/', authMiddleware, getMyOrders);
orderRoutes.get('/:id', authMiddleware, getOrderById);

export default orderRoutes;
