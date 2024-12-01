import {Product} from '../models/Product.js'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../errors/index.js'
import path from 'path'

export const createProduct = async (req, res)=>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}


export const getAllProducts = async (req, res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products,count:products.length})
}


export const getSingleProduct = async (req, res)=>{
    const {id : productId} = req.params
    const product = await Product.findOne({_id: productId}).populate('reviews')
    if(!product) {
        throw new CustomError.NotFoundError('Product not found')
    }
    res.status(StatusCodes.OK).json({product})
}


export const updateProduct = async (req, res)=>{
    
    const {id : productId} = req.params
    const product = await Product.findOneAndUpdate({_id:productId},
        req.body, {new: true, runValidators: true})
        if(!product) {
            throw new CustomError.NotFoundError('Product not found')
        }
    res.status(StatusCodes.OK).json({product})
}


export const deleteProduct = async (req, res)=>{
    const {id : productId} = req.params
    const product = await Product.findOne({_id: productId})
    if(!product) {
        throw new CustomError.NotFoundError('Product not found')
    }
    await product.deleteOne()
    res.status(StatusCodes.OK).json({msg:'Product deleted successfully'})
}


export const uploadImage = async (req, res)=>{
    console.log(req.files);
    if(!req.files){
        throw new CustomError.BadRequestError('No file uploaded')
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('please upload an image')

    }
    const maxSize = 1024 * 1024
    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError('image too large')
    }
    const imagePath = path.join(process.cwd(),'./public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image: `/upload/${productImage.name}`})
    //console.log
}

