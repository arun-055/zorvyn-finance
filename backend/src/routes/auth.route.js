import express from "express";

import { signup,login, getme } from "../controllers/auth.controller.js";
import { signupValidator, loginValidator } from "../validations/userValidation.js";
import auth from "../middleware/auth.middleware.js";

const router =express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login); 
router.get("/me", auth, getme);

export default router;



