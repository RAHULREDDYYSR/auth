import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
    rating: {
        type:Number,
        min:1,
        max:5,
        required:[true,'please provide rating']
    },
    
    title: {
        type:String,
        trim:true,
        required:[true,'please provide review title'],
        maxLength:100,
    },
    comment: {
        type:String,
        required:[true,'please provide review comment'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:[true,'please provide product']
    }
},{timestamps:true}
)

//one user can create only one review to the product
ReviewSchema.index({product:1, user:1},{unique:true})

ReviewSchema.post('save', async function () {
    await calculateAverageRating(this.product);
})

ReviewSchema.post('deleteOne', { document: true, query: false }, async function () {
    await calculateAverageRating(this.product);
})

export const Review = mongoose.model('Review', ReviewSchema)

async function calculateAverageRating(ProductId) {
    const result = await Review.aggregate([
        {
            '$match': {
              'product': ProductId
            }
          }, {
            '$group': {
              '_id': null, 
              'averageRating': {
                '$avg': '$rating'
              }, 
              'numOfReviews': {
                '$sum': 1
              }
            }
          }
    ]) 
    console.log(result);
    
    try {
        await Review.model('Product').findOneAndUpdate(
            {_id:ProductId},
        {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        })
    } catch (error) {
        console.log(error)
        
    }       
}