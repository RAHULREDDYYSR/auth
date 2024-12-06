import { register,logout, login , verifyEmail, forgotPassword, resetPassword} from "../controllers/authController.js";
import express from "express";
const app = express();
import {authenticateUser} from "../middleware/authentication.js"
app.post('/register',register);
app.post('/login',login);
app.delete('/logout',authenticateUser, logout);
app.post('/verify-email',verifyEmail);
app.post('/reset-password',resetPassword);
app.post('/forgot-password',forgotPassword);

export default app;