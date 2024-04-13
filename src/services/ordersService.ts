import { InternalServerError, NotFoundError } from "../errors/ApiError";
import OrderModel, { OrderDocument } from "../model/OrderModel";

const getAllOrders = async (userId: string): Promise<OrderDocument[]> => {
  const orders: OrderDocument[] = await OrderModel.find({
    user: userId
  }).populate([
    { path: 'user', select: { _id: 0, password: 0 }},
    { path: 'items.product',
      populate: {
        path: 'category'
      }
    }
   ]);

   if (orders && orders.length > 0) {
    return orders;
   }

   throw new NotFoundError('No orders found'); 
}

const getOrderyById = async (orderId: string): Promise<OrderDocument> => {
  const order: OrderDocument | null = await OrderModel.findById(orderId)
    .populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product',
        populate: {
        path: 'category'
      }
    }
  ]);

  if (order) {
    return order;
  }

  throw new NotFoundError('No matched order with the id');
}

const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  const newOrder: OrderDocument | null = await (await order.save())
    .populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product', populate: {
          path: 'category'
        }
      }
    ]);

    if (newOrder) {
      return newOrder;
    }

    throw new InternalServerError('Cannot create a new order in db');
}
 
const updateOrder = async (orderId: string, updateInfo: Partial<OrderDocument>): Promise<OrderDocument> => {
  const updatedOrder: OrderDocument | null = await OrderModel
    .findByIdAndUpdate(orderId, updateInfo, {
      new: true
    }).populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product',
        populate: {
          path: 'category'
        }
      }
    ]);

    if (updatedOrder) {
      return updatedOrder;
    }

    throw new InternalServerError('Cannot update order in db');
}

const deleteOrderById = async (orerId: string): Promise<OrderDocument> => {
  const deletedOrder: OrderDocument | null = await OrderModel.findByIdAndDelete(orerId)
    .populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product',
        populate: {
          path: 'category'
        }
      }
    ]);
    
    if (deletedOrder) {
      return deletedOrder;
    }

    throw new InternalServerError('Cannot delete order in db');
}

export default { 
  getAllOrders, 
  getOrderyById,
  createOrder,
  updateOrder,
  deleteOrderById
};  