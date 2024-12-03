import { register,logout, login , verifyEmail} from "../controllers/authController.js";
import express from "express";
const app = express();

app.post('/register',register);
app.post('/login',login);
app.get('/logout',logout);
app.post('/verify-email',verifyEmail);

export default app;