import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asynHandler.js";

const router = Router();

router.route("/register").post(asyncHandler(register));
router.route("/login").post(asyncHandler(login));

export { router as userRouter };
