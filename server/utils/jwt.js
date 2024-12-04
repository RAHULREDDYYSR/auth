import jwt from 'jsonwebtoken'

export const createJWT = ({payload}) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token;
}


export const isTokenValid = (token)=> jwt.verify(token, process.env.JWT_SECRET)

export const attachCookiesToRequest = ({ res, user, refreshToken }) => {
    const accessTokenJWT = createJWT({ payload: { user } });
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
  
    const oneDay = 1000 * 60 * 60 * 24;
    const longerExp = 1000 * 60 * 60 * 24 * 30;
  
    res.cookie('accessToken', accessTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      expires: new Date(Date.now() + oneDay),
    });
  
    res.cookie('refreshToken', refreshTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      expires: new Date(Date.now() + longerExp),
    });
  };

// export const attachSingleCookiesToRequest = ({res, user})=>{
//     const token = createJWT({payload:user})

//     const oneDay = 1000 * 24 * 60 * 60
//     res.cookie('token',token,{
//         httpOnly:true,
//         expires:new Date(Date.now()+oneDay),
//         secure:process.env.NODE_ENV === 'production',
//         signed:true
//     })
// }