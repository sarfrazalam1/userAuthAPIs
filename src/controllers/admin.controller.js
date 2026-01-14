import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/ayncHandler.js";

export const getAllUsersByAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, isActive } = req.query;

  const filter = { role: { $in: ["user", "manager"] } };

  if (role && ["user", "manager"].includes(role)) filter.role = role;

  if (isActive === "true") filter.isActive = true;
  else if (isActive === "false") filter.isActive = false;

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .select("fullName email role createdAt")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(page - 1) * Number(limit))
      .lean(),

    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          totalUsers,
          totalPages: Math.ceil(totalUsers / Number(limit)),
          currentPage: Number(page),
        },
      },
      "Users Fetched Successfully"
    )
  );
});

export const getUserByIdForAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

export const updateUsersByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "manager"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role. Allowed: user, manager");
  }

  // Security: Prevent changing your own role
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findOne({
    _id: userId,
    role: { $in: ["user", "manager"] },
  }).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not Found");
  if (user.role === role) throw new ApiError(400, "User already has this role");

  user.role = role;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Role updated successfully"));
});

export const softDeleteUsersByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be a boolean");
  }

  if (userId === req.user?._id?.toString()) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  const user = await User.findOne({
    _id: userId,
    role: { $in: ["user", "manager"] },
  });

  if (!user) throw new ApiError(404, "User not Found");

  user.isActive = isActive;

  if (!isActive) {
    user.refreshToken = undefined;
  }
  await user.save({ validateBeforeSave: false });

  const result = user.toObject();
  delete result.password;
  delete result.refreshToken;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: result },
        isActive ? "Account activated" : "Account deactivated"
      )
    );
});

export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Prevent admin from deleting their own account
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User permanently deleted from database"));
});
