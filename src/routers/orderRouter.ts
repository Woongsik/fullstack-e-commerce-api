import express from 'express';

import {
  getAllOrders,
  getOrderByOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
  getClientSecret
} from '../controllers/ordersController';
import { passportAuthenticate } from '../misc/utils/AuthUtil';

const router = express.Router();

router.get('/', passportAuthenticate(), getAllOrders);
router.get('/:orderId', passportAuthenticate(), getOrderByOrderId);

router.post('/', passportAuthenticate(), createOrder);
router.put('/:orderId', passportAuthenticate(), updateOrder);
router.delete('/:orderId', passportAuthenticate(), deleteOrder);

router.post('/stripe', getClientSecret);

export default router;
