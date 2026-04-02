import { sendError } from "../utils/Response.js";
const ROLE_LEVELS = {
    viewer: 1,
    analyst: 2,
    admin: 3
}
export const requireRole = (...roles)=>(req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: "Unauthorized- No user information"});
    }
    if(!roles.includes(req.user.role)){
        return res.status(403).json({ message: `Access denied. Allowed: ${roles.join(", ")}`});
    }
    next();
}

export const requireMinRole = (minRole)=>(req, res, next)=>{
    if(!req.user){
        return res.status(401).json({message: "Unauthorized- No user information"});
    }   
      const userLevel = ROLE_LEVELS[req.user.role] || 0;
    const requiredLevel = ROLE_LEVELS[minRole] || 0;
    if(userLevel < requiredLevel){
        return res.status(403).json({ message: `Access denied. Minimum role required: ${minRole}`});4
        return
    }
    next();
};