import { register,logout, login } from "../controllers/authController.js";
import express from "express";
const app = express();

app.post('/register',register);
app.post('/login',login);
app.get('/logout',logout);
export default app;