import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { 
  ApiError, 
  BadRequest, 
  InternalServerError 
} from '../errors/ApiError';
import OrderModel, { OrderDocument } from '../model/OrderModel';
import ordersService from '../services/ordersService';
import { Order } from '../misc/types/Order';
import { UserDocument } from '../model/UserModel';
import { getUserFromRequest } from './controllerUtil';

const secretKey = 'sk_test_51P6SE2Jo0VhvXeMmlsDrG67UTAFU772Qmbo6WImJm61GIRRR3WJ3Z9InIGqU5tMEw7PB5yk8oXSqLNjsTrySlg7s005fzisE74';
const stripe = require("stripe")(secretKey);

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    const orders: OrderDocument[] = await ordersService.getAllOrders(user._id);
    return res.status(200).json(orders);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {// from mongoose
      return next(new BadRequest('Wrong format to get orders'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to get the orders'));
  }
};

export const getOrderByOrderId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: string = req.params.orderId;
    const order: OrderDocument = await ordersService.getOrderyById(orderId);
    return res.status(200).json(order);
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong id format'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to find the order'));
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);    
    const orderInfo: Order = req.body;
    orderInfo.user = user._id;
    const order: OrderDocument = new OrderModel(orderInfo);

    const newOrder: OrderDocument = await ordersService.createOrder(order);
    return res.status(201).json(newOrder);
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to create an order'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Cannot create a new order'));
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: string = req.params.orderId;
    const updateInfo: Partial<OrderDocument> = req.body;
    const updatedOrder: OrderDocument = await ordersService.updateOrder(orderId, updateInfo);
    return res.status(200).json(updatedOrder);
  } catch (e) {
    console.log(e);
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to udpate order'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to update the order'));
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: string = req.params.orderId;
    const deletedOrder: OrderDocument = await ordersService.deleteOrderById(orderId);
    return res.status(204).json();
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to delete order'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to delete the order'));
  }
};

export const getClientSecret = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalAmount: number = req.body.totalAmount;
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: totalAmount * 100, // 0.50 euro = 50
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: (e as any).message,
      },
    });
  }
}