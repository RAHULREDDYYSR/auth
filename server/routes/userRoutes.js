import {getAllUsers, getSingleUser,  showCurrentUser,updateUser, updateUserPassword} from "../controllers/userController.js";
import express from "express";
const app = express();
import {authenticateUser,authorizePermissions} from "../middleware/authentication.js"


app.route('/').get(authenticateUser,authorizePermissions('admin'),getAllUsers)

app.route('/showMe').get(authenticateUser, showCurrentUser)
app.route('/updateUser').patch(authenticateUser, updateUser)
app.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

app.route('/:id').get(authenticateUser,getSingleUser)


export default app;