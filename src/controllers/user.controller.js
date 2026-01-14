import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import {
  accessCookiesOptions,
  generateTokens,
  refreshCookieOptions,
} from "../utils/cookiesAndTokens.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exist");
  }
  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something wrong while creating user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, { createdUser }, "user created successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) throw new ApiError(404, "user does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessCookiesOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User Logged In Successfully"
      )
    );
});

export const LogoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", accessCookiesOptions)
    .clearCookie("refreshToken", refreshCookieOptions)
    .json(new ApiResponse(200, {}, "User logout Successfully"));
});

export const getUserDetails = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  try {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Rferesh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessCookiesOptions)
      .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
      .json(new ApiResponse(200, { accessToken }, "Access Token Refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(400, "Invalid old password");

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be the same as old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName || req.user.fullName,
        email: email || req.user.email,
      },
    },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser },
        "Account details updated successfully"
      )
    );
});
