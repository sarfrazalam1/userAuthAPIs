import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const userAuth = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized Request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) throw new ApiError(401, "Inavlid Access Token");

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been deactivated. Please contact to Admin."
      );
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Unauthorized: Access Denied");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied: insufficient permissions");
    }
    next();
  };
};
