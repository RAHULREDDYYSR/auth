import {User} from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../errors/index.js'
import { attachCookiesToRequest,createTokenUser } from '../utils/index.js'
import crypto from 'crypto'
import { log } from 'console'


export const register = async(req, res)=>{
    const {email, name, password} = req.body
    const emailAlreadyExists = await User.findOne({email: email})
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Email already exists', StatusCodes.BAD_REQUEST)
    }
    //if there are no users the the first one will be admin
    const isFirstAccount = await User.countDocuments({}) 
    const role = isFirstAccount ? 'user' : 'admin'
    const verificationToken = crypto.randomBytes(40).toString('hex')
    const user = await User.create({name,email,password,role,verificationToken});
    
    res.status(StatusCodes.CREATED).json({msg:'success! please check your email to verify the account',verificationToken:user.verificationToken})    

    // const  tokenUser = createTokenUser(user)
    // attachCookiesToRequest({res, user:tokenUser})
    //  res.status(StatusCodes.CREATED).json({user:tokenUser})    
}
    
export const verifyEmail = async(req, res)=>{
    const {verificationToken, email} = req.body
    const user = await User.findOne({email: email})
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid email or verification token')
    }
    if(user.verificationToken !== verificationToken || user.email !== email){
        throw new CustomError.UnauthenticatedError('Invalid email or verification token')
    }
    user.isVerified = true
    user.verified = Date.now()
    user.verificationToken = ''
    await user.save()
    res.status(StatusCodes.OK).json({msg:'Email verified successfully'})   
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
    if(!user.isVerified){
        throw new CustomError.UnauthenticatedError('please verify your email')
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