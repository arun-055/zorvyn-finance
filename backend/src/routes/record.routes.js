import express from "express";
const router = express.Router();

import {getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord} from "../controllers/record.controller.js";
import {auth} from "../middleware/auth.middleware.js";
import { requireRole, requireMinRole } from "../middleware/roleAccess.js";
import {createRecordValidator, updateRecordValidator, filterRecordValidator} from "../validations/recordValidation.js";

router.use(auth);
router.get("/", requireMinRole("viewer"), filterRecordValidator, getAllRecords);
router.get("/:id", requireMinRole("viewer"), getRecordById);
router.post("/", requireRole("admin"), createRecordValidator, createRecord);
router.patch("/:id", requireRole("admin"), updateRecordValidator, updateRecord);
router.delete("/:id", requireRole("admin"), deleteRecord);

export default router;