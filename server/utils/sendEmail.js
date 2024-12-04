import nodemailer from 'nodemailer';
import nodemailerConfig from './nodemailerConfig.js'
export const sendEmail = async({to, subject, html}) =>{
    const transporter = nodemailer.createTransport(nodemailerConfig);
    return transporter.sendMail({
        from: '"NMC THANOS 👻" <rahulreddyysr@gmail.com>', // sender address
        to, subject, html
      });
    
}