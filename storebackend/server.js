import express from 'express';
// import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './Routes/seedRoutes.js';
import productRouter from './Routes/productRoutes.js';
import userRouter from './Routes/userRoutes.js';
import orderRouter from './Routes/orderRoutes.js';

 dotenv.config();

 mongoose.connect(process.env.MONGODB_URI)
 .then(()=>{
   console.log("Connected TO DB SUCCESSFULLY")
 }).catch((err)=>{
   console.log(err.message);
 });


 const app=express();
 app.use(express.json());
 app.use(express.urlencoded({extended:true}));


//  Creating an API  for using Paypal Services for our Payment Gateway in MERN-Ecom Project.
app.get('/api/keys/paypal',(req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
});

//   Here the first Param is the Seed API Path & second is object being provided from Page created 
//  Note(V V Imp.): We need to use these Routes for product details from backend .Therefore need to use 'USE' method & not 'GET'
 app.use('/api/seed',seedRouter) 
 app.use('/api/products',productRouter)
 app.use('/api/users',userRouter)
 app.use('/api/orders',orderRouter)

// MiddleWare to check Signin for User 
  app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message});
  })

 const port=process.env.PORT || 5000;
 app.listen(port,()=>{
   console.log("This our Home page");
 });