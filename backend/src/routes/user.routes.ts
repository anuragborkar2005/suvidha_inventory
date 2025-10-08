import { Router } from 'express';
import { getStaff, login, register, updateStaff } from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/asynHandler.js';

const router = Router();

router.route('/register').post(asyncHandler(register));
router.route('/login').post(asyncHandler(login));
router.route('/staff').get(asyncHandler(getStaff));
router.route('/user/:id').patch(asyncHandler(updateStaff));

export { router as userRouter };
