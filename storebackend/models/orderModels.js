import mongoose from "mongoose";

const orderSchema=new mongoose.Schema(
    {
      orderItems:[                      // For Each item array(orderItems),we are keeping order Information(Json key value pair format)
       {
          type:{type:String,required:true},
          name:{type:String,required:true},
          quantity:{type:Number,required:true},
          image:{type:String,required:true},
          price:{type:Number,required:true},
          product:{                            // Using references to the 'Product' model in the product property helps maintain data integrity, reduces data redundancy, and provides better querying capabilities when dealing with orders and associated products.
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true,
          },
       },
      ],
      shippingAddress:{
        fullName:{type:String,required:true},
        address:{type:String,required:true},
        city:{type:String,required:true},
        postalCode:{type:String,required:true},
        country:{type:String,required:true},
      },
      paymentMethod:{type:String,required:true},
      paymentResult:{
        id:String,
        status:String,
        update_time:String,
        email_address:String,
      },
      itemsPrice:{type:Number,required:true},
      shippingPrice:{type:Number,required:true},
      taxPrice:{type:Number,required:true},
      orderTotal:{type:Number,required:true},

      user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},  // This kind of setup is often used to create relationships between different models or collections in MongoDB. By referencing the ObjectId of a document in another collection, you can establish connections between related data without duplicating information.
      isPaid:{type:Boolean,default:false},
      paidAt:{type:Date},
      isDeleivered:{type:Boolean,default:false},
      deleiveredAt:{type:Date}
    },
    {
        timestamps:true,
    }
);

const Order= mongoose.model('Order',orderSchema)
export default Order;