import {User} from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../errors/index.js'
import { attachCookiesToRequest,createTokenUser } from '../utils/index.js'


export const register = async(req, res)=>{
    const {email, name, password} = req.body
    const emailAlreadyExists = await User.findOne({email: email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Email already exists', StatusCodes.BAD_REQUEST)
    }

    const isFirstAccount = await User.countDocuments({}) 
    const role = isFirstAccount ? 'user' : 'admin'
    const user = await User.create({name,email,password,role});
    const  tokenUser = createTokenUser(user)
    attachCookiesToRequest({res, user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})    
}

export const login = async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    const  tokenUser = createTokenUser(user)
    attachCookiesToRequest({res, user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

export const logout = async(req, res)=>{
    res.cookie('token','logout',{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg:'User logged out successfully'})
}