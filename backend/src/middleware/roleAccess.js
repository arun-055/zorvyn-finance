import { sendError } from "../utils/Response.js";
const ROLE_LEVELS = {
    viewer: 1,
    analyst: 2,
    admin: 3
}
export const requireRole = (...roles)=>(req, res, next)=>{
    if(!req.user){
        return sendError(res, "Unauthorized- No user information", 401);
    }
    if(!roles.includes(req.user.role)){
        return sendError(res, `Access denied. Allowed: ${roles.join(", ")}`, 403); 
    }
    next();
}

export const requireMinRole = (minRole)=>(req, res, next)=>{
    if(!req.user){
        return sendError(res, "Unauthorized- No user information", 401);
    }   
      const userLevel = ROLE_LEVELS[req.user.role] || 0;
    const requiredLevel = ROLE_LEVELS[minRole] || 0;
    if(userLevel < requiredLevel){
        return sendError(res, `Access denied. Minimum role required: ${minRole}`, 403);
    }
    next();
};