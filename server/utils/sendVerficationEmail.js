import { sendEmail } from "./sendEmail.js";

export const sendVerificationEmail = async({name, email, verificationToken, origin}) =>{

    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<p> please confirm your mail by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email </a> </p>`
    return sendEmail({to: email, subject:"email Confirmation", html:`<h4> hello, ${name}</h4> ${message}`})
}