import express from "express";
const router = express.Router();

import {getSummary, getCategoryBreakdown, getMonthlyTrends, getWeeklyTrends, getInsights} from "../controllers/dashboard.controller.js";

import auth from "../middleware/auth.js";
import { requireMinRole } from "../middleware/rbac.js";

router.use(auth);


router.get("/summary", requireMinRole("viewer"), getSummary);


router.get("/category-breakdown", requireMinRole("viewer"), getCategoryBreakdown);




router.get("/monthly-trends", requireMinRole("analyst"), getMonthlyTrends);


router.get("/weekly-trends", requireMinRole("analyst"), getWeeklyTrends);


router.get("/insights", requireMinRole("analyst"), getInsights);

export default router;