import mongoose from "mongoose";


export const connectDB = (uri) =>{
   mongoose.connect(uri)
   .then(()=>{console.log('connected to db');})
   .catch(err=>{console.log(err);});}
