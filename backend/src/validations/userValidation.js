import {body} from "express-validator";
const ROLES = ["viewer", "analyst", "admin"];

export const signupValidator=[
    body("fullName")
    .trim()
    .notEmpty().withMessage("Full name required")
    .isLength({min:3, max:100}).withMessage("Full name must be at least 3 characters long"),

    body("email")
    .trim()
    .notEmpty().withMessage("Email  required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

    body("password")
    .notEmpty().withMessage("Password required")
    .isLength({min:6}).withMessage("Password must be at least 6 characters long"),

    body("role")
    .notEmpty().withMessage("Role required")
    .isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(", ")}`),

];
 export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email required")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password required"),
];
export const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }),

  body("role")
    .optional()
    .isIn(ROLES).withMessage("Invalid role"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("Must be true/false"),
];

