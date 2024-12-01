import {Review} from '../models/Review.js'
import {Product} from '../models/Product.js'
import CustomError from '../errors/index.js'
import {checkPermissions} from '../utils/index.js'
import { StatusCodes } from 'http-status-codes'


export const createReview = async (req, res) =>{
    const {product: productId} = req.body
    const isValidProduct = await Product.findOne({_id: productId})
    if(!isValidProduct) {
        throw new CustomError.NotFoundError(`No Product With id ${productId}`)
    }

    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId
    })
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError('You have already submitted a review for this product')
    }
    req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

export const getAllReviews = async (req, res) =>{
    const review = await Review.find({})
    .populate({path:'product',select:'name company price '})
    // .populate({path:'user',select:'name'})
    res.status(StatusCodes.OK).json({review,count:review.length})
}

export const getSingleReview = async (req, res) =>{
    const {id: reviewId} = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}

export const updateReview = async (req, res) =>{
    const {id : reviewId} = req.params
    // const review = await Product.findOneAndUpdate({_id:reviewId},
    //     req.body, {new: true, runValidators: true})
    const{rating, title, comment} = req.body
    const review = await Review.findOne({_id:reviewId})
        if(!review) {
            throw new CustomError.NotFoundError('review not found')
        }        
    checkPermissions(req.user, review.user);
    review.rating = rating
    review.title = title
    review.comment = comment
    await review.save()
    res.status(StatusCodes.OK).json({review})
}

export const deleteReview = async (req, res) =>{
    const {id : reviewId} = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    //find one and delete
    // const result = await Review.findOneAndDelete({ _id: reviewId})
    await review.deleteOne();
 
    res.status(StatusCodes.OK).json({msg: 'Review deleted successfully'})
}


export const getSingleProductReviews = async (req, res) =>{
    const {id : reviewId} = req.params
    const reviews = await Review.find({product: reviewId})
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
