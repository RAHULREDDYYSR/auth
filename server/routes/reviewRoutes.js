import express from "express";
const app = express();
import {authenticateUser} from "../middleware/authentication.js"
import {createReview, getAllReviews,
       getSingleReview, updateReview,
       deleteReview} from '../controllers/reviewController.js'


app.route('/').post(authenticateUser, createReview).get(getAllReviews)

app.route('/:id')
.get(getSingleReview)
.patch(authenticateUser, updateReview)
.delete(authenticateUser, deleteReview)

export default app