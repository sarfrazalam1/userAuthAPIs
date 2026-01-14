import { User } from "../models/user.model.js";
import { ApiError } from "./apiError.js";

export const accessCookiesOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "user not found");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token Generation Error:", error);
    throw new ApiError(
      500,
      error?.message || "Something went wrong while generating tokens"
    );
  }
};
