import express from 'express';
import User from '../models/userModels.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import Order from '../models/orderModels.js';
// import User from '../models/userModels.js'

const orderRouter = express.Router();
//  Here we will be searching the User based on its Email being Provided during Signup.
//  If proper then validated else will be thrown Error using Middleware

// Here 'isAuth' acts an Middleware .We take User Info from backend in form of Tokrn verification & us eit in the field of 'user' in our Order
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const neworder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      orderTotal: req.body.orderTotal,
      user: req.user._id,
    });
    const order = await neworder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
   expressAsyncHandler(async(req,res)=>{
     const order =await Order.findById(req.params.id);
      if(order)
      {
        order.isPaid=true;
         order.paidAt=Date.now();
          order.paymentResult={
             id:req.body.id,
             status:req.body.status,
             update_time:req.body.update_time,
             email_address:req.body.email_address,
          };
          const updatedOrder= await order.save();
          res.send({message:'Order Paid Successfully,',order:updatedOrder});
      }
      else{
         res.status(404).send({message:'Order Not Found'});
      }
     
   })
)

export default orderRouter;
