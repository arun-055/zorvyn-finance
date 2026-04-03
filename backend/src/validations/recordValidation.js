
import { body, query } from "express-validator";

const VALID_CATEGORIES = [
  "salary", "freelance", "investment", "business",
  "food", "transport", "utilities", "rent",
  "healthcare", "entertainment", "education",
  "shopping", "taxes", "other",
];

const TYPES = ["income", "expense"];


export const createRecordValidator = [
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(TYPES).withMessage("Type must be income or expense"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be valid (YYYY-MM-DD)"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Max 500 characters"),
];

export const updateRecordValidator = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 }).withMessage("Amount must be positive"),

  body("type")
    .optional()
    .isIn(TYPES).withMessage("Type must be income or expense"),

  body("category")
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be valid"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Max 500 characters"),
];


export const filterRecordValidator = [
  query("type")
    .optional()
    .isIn(TYPES).withMessage("Type must be income or expense"),

  query("category")
    .optional()
    .isIn(VALID_CATEGORIES).withMessage("Invalid category"),

  query("startDate")
    .optional()
    .isISO8601().withMessage("Invalid startDate"),

  query("endDate")
    .optional()
    .isISO8601().withMessage("Invalid endDate"),

  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be 1–100"),
];