import express from "express";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateAccountSchema,
} from "../validators/auth.validators.js";
import {
  changePassword,
  getUserDetails,
  loginUser,
  LogoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// public routes
router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);

// private routes
router.route("/logout").post(userAuth, LogoutUser);
router.route("/profile").get(userAuth, getUserDetails);
router.route("/refresh-token").post(userAuth, refreshAccessToken);
router
  .route("/change-password")
  .patch(userAuth, validate(changePasswordSchema), changePassword);
router
  .route("/update-profile")
  .patch(userAuth, validate(updateAccountSchema), updateAccountDetails);

export default router;
