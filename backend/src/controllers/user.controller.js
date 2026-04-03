import { validationResult } from "express-validator";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/Response.js";
import AuditData from "../models/AuditData.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return sendSuccess(res, { users });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) return sendError(res, "User not found.", 404);

    return sendSuccess(res, { user });
  } catch (error) {
    return sendError(res, "Invalid user ID.", 400);
  }
};


export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array(), 422);
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, "User not found.", 404);

    
    Object.assign(user, req.body);

    await user.save();

    await AuditData.create({
      performedBy: req.user._id,
      action: "UPDATE_USER",
      targetModel: "User",
      targetId: user._id,
    });

    return sendSuccess(res, { user }, "User updated successfully");
  } catch (error) {
    return sendError(res, "Invalid user ID.", 400);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return sendError(res, "User not found.", 404);

    await AuditData.create({
      performedBy: req.user._id,
      action: "DELETE_USER",
      targetModel: "User",
      targetId: user._id,
    });

    return sendSuccess(res, {}, "User deleted successfully");
  } catch (error) {
    return sendError(res, "Invalid user ID.", 400);
  }
};