import {getAllUsers, getUserById, updateUser, deleteUser} from "../controllers/user.controller.js";
import express from "express";
const router = express.Router();
import auth from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roleAccess.js";

router.use(auth, requireRole("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
