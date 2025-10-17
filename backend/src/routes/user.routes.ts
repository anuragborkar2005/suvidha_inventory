import { Router } from 'express';
import {
  getStaff,
  login,
  register,
  updateStaff,
  updatePassword,
} from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/asynHandler.js';

const router = Router();

router.route('/register').post(asyncHandler(register));
router.route('/login').post(asyncHandler(login));
router.route('/staff').get(asyncHandler(getStaff));
router.route('/user/:id').patch(asyncHandler(updateStaff));
router.route('/update-password').patch(asyncHandler(updatePassword));

export { router as userRouter };
