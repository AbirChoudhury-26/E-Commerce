import express from "express";
import Product from "../models/productModels.js";
import data from "../data.js"
import User from "../models/userModels.js";
const seedRouter = express.Router();

 seedRouter.get('/',async(req,res)=>{

//     An additional steps to clear the Product model before entering data to Product Database from Data.js file.
   await Product.deleteMany({});
//   Here we are pushing in Product object from Data.js file & then back sendign the response(res) to frontend
  const createProduct =await Product.insertMany(data.products);
  
  await User.deleteMany({});
//   Here we are pushing in Product object from Data.js file & then back sendign the response(res) to frontend
  const createUser =await User.insertMany(data.users);
  res.send({createProduct,createUser});
 });


export default seedRouter;