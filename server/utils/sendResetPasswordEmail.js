import { sendEmail } from "./sendEmail.js";

export const sendResetPasswordEmail = async({name, email, token , origin}) =>{
    const resetURl = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `<p>Please reset your password by clicking on the following link :</p>
    <h4><a href="${resetURl}">Reset Password</a></h4>`
    return sendEmail({
        to: email,
        subject: "Reset Password",
        html:`<h4>hello, ${name}</h4>
        ${message}`
    })
}