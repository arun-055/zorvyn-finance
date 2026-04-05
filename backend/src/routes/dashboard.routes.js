import express from "express";
const router = express.Router();

import {getSummary, getCategoryWise, getMonthlyTrends, getWeeklyTrends, getInsights} from "../controllers/dashboard.controller.js";

import {auth} from "../middleware/auth.middleware.js";
import { requireMinRole } from "../middleware/roleAccess.js";

router.use(auth);
router.get("/summary", requireMinRole("viewer"), getSummary);
router.get("/category-wise", requireMinRole("viewer"), getCategoryWise);
router.get("/monthly-trends", requireMinRole("analyst"), getMonthlyTrends);
router.get("/weekly-trends", requireMinRole("analyst"), getWeeklyTrends);
router.get("/insights", requireMinRole("analyst"), getInsights);

export default router;