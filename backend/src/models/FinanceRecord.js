import mongoose from "mongoose";
const CATEGORIES = [
  "income",
  "expense",
  "investment",
  "business",
  "food",
  "transport",
  "utilities",
  "rent",
  "healthcare",
  "entertainment",
  "education",
  "shopping",
  "other",
];
const financeRecordSchema = new mongoose.Schema(
    {
        amount:{
            type: Number,
            required: true,
            min: 0
        },
        type:{
            type: String,
            enum: {
                values: ["income","expense"],
            },
            required: true
        },
        category:{
            type: String,
            enum:{
                values: CATEGORIES,
            },
            required: true
        },
        date:{
            type: Date,
            required: true,
            default: Date.now,
        },
        description:{
            type: String,
            maxLength: 500
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },{timestamps: true}
);
const FinanceRecord = mongoose.model("FinanceRecord", financeRecordSchema);
export default FinanceRecord ;