import express from 'express';
import UserController from '../controllers/users.js'

const router = express.Router();

router.post('/create/:user_id', UserController.createUserReview)
router.get('/movies/:user_id', UserController.getUserReviews)

export default router;
