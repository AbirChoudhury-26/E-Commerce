import express from "express";
import User from "../models/userModels.js";
import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils.js";
import bcrypt from 'bcryptjs';
// import User from '../models/userModels.js'

const userRouter= express.Router();
//  Here we will be searching the User based on its Email being Provided during Signup.
//  If proper then validated else will be thrown Error using Middleware
userRouter.post(
   '/signin', expressAsyncHandler(async(req,res)=>{
    const user= await User.findOne({email:req.body.email});
     
    if(user)
    {
      if(bcrypt.compareSync(req.body.password,user.password))
      {
         res.send({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user),
         })
          return ;
      }
      else
       res.status(401).send({message:"Password doesn't match with Email-Id"});
    }
    res.status(401).send({message:"Email-Id Doesn't Exist"})
   })
);

userRouter.post(
   '/signup',expressAsyncHandler(async(req,res)=>{

//  Here we use a new User Model to save the User Details in our MongoDB with help of Mongoose Connection.
      const newUser=new User({
         name:req.body.name,
         email:req.body.email,
         password:bcrypt.hashSync(req.body.password),
         // Converting The plain Text Password into Hashing value to Stire in Encrypted form in Database

      })

      const user=await newUser.save();
      res.send({
         _id:user._id,
         name:user.name,
         email:user.email,
         isAdmin:user.isAdmin,
         token:generateToken(user),
      })
   })
)


export default userRouter;