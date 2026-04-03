import User from '../models/User.js';
import { sendError, sendSuccess } from '../utils/Response.js';

import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { email, password, fullName , role } = req.body;
    try{
        if (!email || !password || !fullName || !role) {
      return sendError(res, "All fields are required", 400);
    }
     if (password.length < 6) {
    return sendError(res, "Password must be at least 6 characters long", 400);
     }
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      
      return sendError(res, "Invalid email format", 400);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      
      return sendError(res, "Email is already in use, please use a different email", 400);
    }

    const newUser = await User.create({
      email,
      fullName,
      password,
        role
    });
    await newUser.save(); 


    const token = jwt.sign(
        {userId: newUser._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return sendSuccess(res, { user: newUser }, "Signup successful", 201);
     

    }catch(err){
        console.error("Signup error:", err);
        return sendError(res, "Server error during signup", 500);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Invalid email or password", 400);
    }
    const isPasswordCorrect = await user.matchPassword(password);
     if (!isPasswordCorrect)
    return sendError(res, "Invalid email or password", 400);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
     res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
     secure: process.env.NODE_ENV === "production",
    });
   
    return sendSuccess(res, { user }, "Login successful", 200);
}
    catch(err){
        console.error("Login error:", err);
        sendError(res, "Server error during login", 500);
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt");
    sendSuccess(res, "Logged out successfully",200);
}
const getMe = async (req, res) => {
  try {
    return sendSuccess(res, {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};