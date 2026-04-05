import { validationResult } from "express-validator";
import FinanceRecord from "../models/FinanceRecord.js";
import AuditData from "../models/AuditData.js";
import { sendSuccess, sendError } from "../utils/Response.js";

export const getAllRecords = async (req, res) => {
  try {
    const records = await FinanceRecord.find()
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    return sendSuccess(res, { records });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array(), 422);
  }

  try {
    const { amount, type, category, date, description } = req.body;

    const record = await FinanceRecord.create({
      amount,
      type,
      category,
      date: date ? new Date(date) : new Date(),
      description,
      createdBy: req.user._id,
    });

    await AuditData.create({
      performedBy: req.user._id,
      action: "CREATE_RECORD",
      targetModel: "FinanceRecord",
      targetId: record._id,
    });

    return sendSuccess(res, { record }, "Record created successfully", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
export const getRecordById = async (req, res) => {
  try {
    const record = await FinanceRecord.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!record) return sendError(res, "Record not found.", 404);

    return sendSuccess(res, { record });
  } catch (error) {
    return sendError(res, "Invalid record ID.", 400);
  }
};
export const updateRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);
    if (!record) return sendError(res, "Record not found.", 404);

    Object.assign(record, req.body);
    if (req.body.date) record.date = new Date(req.body.date);

    await record.save();

    return sendSuccess(res, { record }, "Record updated successfully");
  } catch (error) {
    return sendError(res, "Invalid record ID.", 400);
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findByIdAndDelete(req.params.id);
    if (!record) return sendError(res, "Record not found.", 404);

    return sendSuccess(res, {}, "Record deleted successfully");
  } catch (error) {
    return sendError(res, "Invalid record ID.", 400);
  }
};


