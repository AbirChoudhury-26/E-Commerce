import express from "express";
import Product from "../models/productModels.js";

const productRouter= express.Router();


// Here in these function we are getting some data from Backend Database by means of Id or tyoe or One by one.
//  Hence It becomes Imp. that we need to use 'GET' method for reteieving items 
productRouter.get('/',async(req,res)=>{
     const products =await Product.find();
      res.send(products);
});

// This req,res was for Product type
productRouter.get('/type/:type',async(req,res)=>{
    const product=  await Product.findOne({type:req.params.type});
     if(product){
      res.send(product);
     }
     else{ 
      res.status(404).send({message:"Product Not found"});
     }
  });
  

  productRouter.get('/:id',async(req,res)=>{
     const product=  await Product.findById(req.params.id);
      if(product){
       res.send(product);
      }
      else{ 
       res.status(404).send({message:"Product Not found"});
      }
   });
  

export default productRouter;