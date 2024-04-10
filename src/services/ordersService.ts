import OrderModel, { OrderDocument } from "../model/OrderModel";

const getAllOrders = async (userId: string): Promise<OrderDocument[]> => {
  return await OrderModel.find({
    user: userId
  }).populate([
    { path: 'user', select: { _id: 0, password: 0 }},
    { path: 'items.product',
      populate: {
        path: 'categories'
      }
    }
   ]);
}

const getOrderyById = async (orderId: string): Promise<OrderDocument | null> => {
  return await OrderModel.findById(orderId)
    .populate([
    { path: 'user', select: { _id: 0, password: 0 }},
    { path: 'items.product',
      populate: {
        path: 'categories'
      }
    }
  ]);
}

const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  return (await order.save())
    .populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product',
        populate: {
          path: 'categories'
        }
      }
    ]);
}
 
const updateOrder = async (orderId: string, updateInfo: Partial<OrderDocument>): Promise<OrderDocument | null> => {
  const updatedOrder = await OrderModel
    .findByIdAndUpdate(orderId, updateInfo, {
      new: true
    }).populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product',
        populate: {
          path: 'categories'
        }
      }
    ]);

  return updatedOrder;
}

const deleteOrderById = async (orerId: string): Promise<OrderDocument | null> => {
  return await OrderModel.findByIdAndDelete(orerId)
    .populate([
      { path: 'user', select: { _id: 0, password: 0 }},
      { path: 'items.product',
        populate: {
          path: 'categories'
        }
      }
    ]);
}

export default { 
  getAllOrders, 
  getOrderyById,
  createOrder,
  updateOrder,
  deleteOrderById
};  