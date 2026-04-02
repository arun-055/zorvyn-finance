import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { sendError } from "../utils/Response.js";

export async function protectRoute(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return sendError(res, "Unauthorized- No token provided", 401);
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoded){
            return sendError(res, "Unauthorized- Invalid token", 401);
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return sendError(res, "Unauthorized- User not found", 401);
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        return sendError(res, "Internal server error", 500);
    }
};