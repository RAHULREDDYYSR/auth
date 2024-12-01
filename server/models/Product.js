import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'please provide product name'],
        maxLength:[100, 'Name can not be more than 100 characters']
    },
    price:{
        type:Number,
        required:[true,'please provide product value'],
        default:0
    },
    description:{
        type:String,
        required:[true,'please provide product description'],
        maxLength:[1000, 'description can not be more than 1000 characters']
    },
    image:{
        type:String,
        default:'/uploads/example.jpeg'
    },
    category:{
        type:String,
        required:[true,'please provide product category'],
        enum:['office','kitchen','bedroom'],
    },
    company:{
        type:String,
        required:[true,'please provide product company'],
        enum:{
            values:['ikea','liddy','marcos'],
            message: '{VALUE} is not supported'
        },
    },
    colors:{
        type:[String],
        default:["#2222"],
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        required: true,
        default:15
    },
    averageRating:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },

},
{timestamps:true,toJSON:{virtuals:true}, toObject:{virtuals:true}}
);

ProductSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false,
    // match:{rating:5}
})

ProductSchema.pre('deleteOne', { document: true, query: false }, async function(next){
    await this.model('Review').deleteMany({product: this._id});
    next();
});

export const Product = mongoose.model('Product', ProductSchema)