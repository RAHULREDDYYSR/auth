import {Order} from '../models/Order.js'
import {Product} from '../models/Product.js'
import CustomError from '../errors/index.js'
import {checkPermissions} from '../utils/index.js'
import { StatusCodes } from 'http-status-codes'

const fakeStripeApt = async ({amount, currency}) =>{
    const clientSecret = 'someRandomValue'
    return {clientSecret,amount}
}

export const createOrder = async (req, res, next) => {
    const {items:cartItems,tax,shippingFee} = req.body
    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError('No cart items provided')
    }
    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    }
    let orderItems = []
    let subTotal = 0
    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct){
            throw new CustomError.NotFoundError(`No product found with ID: ${item.product}`)
        }
        const {name, price, image, _id} = dbProduct
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        }
        //ADD ITEM TO ORDER
        orderItems = [...orderItems, singleOrderItem]

        // calculate subTotal
        subTotal += price * item.amount
    }
    const total = tax + shippingFee + subTotal
    // get client secret
    const paymentIntent =  await fakeStripeApt({
        amount: total,
        currency: 'usd',
    })    
    const order = await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret:paymentIntent.clientSecret,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}



export const getAllOrders = async (req, res, next) => {
   const orders = await Order.find({})
   res.status(StatusCodes.OK).json({orders, count: orders.length})
}

export const getSingleOrder = async (req, res, next) => {
    const {id:orderId} = req.params
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError(`No order found with ID: ${orderId}`)
    }
    checkPermissions(req.user,order.user)
    res.status(StatusCodes.OK).json({order})

}

export const getCurrentUserOrders = async (req, res, next) => {
    const orders = await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}


export const updateOrder = async (req, res, next) => {
    const {id:orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError(`No order found with ID: ${orderId}`)
    }
    checkPermissions(req.user,order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
}