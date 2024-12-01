import express from "express";
const app = express();
import {authenticateUser, authorizePermissions} from "../middleware/authentication.js"
import {getAllOrders, getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder} from '../controllers/orderController.js'

app.route('/').post(authenticateUser, createOrder).get(authenticateUser, authorizePermissions('admin'),getAllOrders)

app.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

app.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder)

export default app;