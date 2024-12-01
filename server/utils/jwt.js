import jwt from 'jsonwebtoken'

export const createJWT = ({payload}) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token;
}


export const isTokenValid = ({token})=> jwt.verify(token, process.env.JWT_SECRET)

export const attachCookiesToRequest = ({res, user})=>{
    const token = createJWT({payload:user})

    const oneDay = 1000 * 24 * 60 * 60
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+oneDay),
        secure:process.env.NODE_ENV === 'production',
        signed:true
    })
}