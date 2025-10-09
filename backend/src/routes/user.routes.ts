import { Router } from "express";
import { login, register, addStaff, getAllStaff } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { verifyJwt, adminOnly } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/register").post(asyncHandler(register));
router.route("/login").post(asyncHandler(login));

// Admin-only routes
router.route("/add-staff").post(verifyJwt, adminOnly, asyncHandler(addStaff));
router.route("/staff").get(verifyJwt, adminOnly, asyncHandler(getAllStaff));

export { router as userRouter };
