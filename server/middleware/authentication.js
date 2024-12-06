import CustomError from '../errors/index.js';
import { isTokenValid } from '../utils/jwt.js';
import { Token } from '../models/token.js';
import { attachCookiesToRequest } from '../utils/jwt.js';

export const authenticateUser = async (req, res, next) =>{
    const{ refreshToken , accessToken} = req.signedCookies;
    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }
        const payload = isTokenValid(refreshToken);
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        })
        if(!existingToken || !existingToken?.isValid){
            throw new CustomError.UnauthenticatedError('Authentication failed') 
        }
        attachCookiesToRequest({res,user:payload.user, refreshToken: existingToken.refreshToken})
        req.user = payload.user
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication failed') 
    }
    
}
export const authorizePermissions = (...roles)=>{
    return(req, res, next) =>{
    if(!roles.includes(req.user.role)){
        throw new CustomError.UnauthorizedError('Unauthorized to access this route')
    }
    next()
    
}}

export const authenticateUserv1 = async (req, res, next) =>{
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication failed')  
    }
    try {
        const {name, userId, role} = isTokenValid({token})
        req.user = {name, userId, role}
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication failed') 
    }
    
}