
import mongoose from "mongoose";

const singleOrderItemSchema = mongoose.Schema({
    name:{type:String, required:true},
    image:{type:String, required:true},

    price:{type:Number, required:true},

    amount:{type:Number, required:true},
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }
}) 


const OrderSchema = mongoose.Schema({
    tax: {
        type:Number,
        required:[true,'please provide rating']
    },
    
    shippingFee: {
        type:Number,
        trim:true,
        required:[true,'please provide review title'],
        maxLength:100,
    },
    subTotal: {
        type:Number,
        required:[true,'please provide review comment'],
    },
    total:{
        type:Number,
        required:[true,'please provide user']
    },
    orderItems:[singleOrderItemSchema],
    status:{
        type:String,
        enum:['pending','failed','paid','delivered','canceled'],
        default:'pending'
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    },
    clientSecret: {
        type:String,
        required:[true,'please provide clientSecret'],
    },
    paymentIntentId:{
        type:String,
    }
},{timestamps:true}
)
export const Order = mongoose.model('Order',OrderSchema)