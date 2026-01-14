import express from "express";
import { authorizeRoles, userAuth } from "../middleware/auth.middleware.js";
import {
  deleteUserByAdmin,
  getAllUsersByAdmin,
  getUserByIdForAdmin,
  softDeleteUsersByAdmin,
  updateUsersByAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(userAuth, authorizeRoles("admin"));

router.route("/users").get(getAllUsersByAdmin);
router.route("/users/:userId").get(getUserByIdForAdmin);
router.route("/users/:userId/role").put(updateUsersByAdmin);
router.route("/users/:userId/active").patch(softDeleteUsersByAdmin);
router.route("/users/:userId").delete(deleteUserByAdmin);

export default router;
