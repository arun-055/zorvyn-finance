import mongoose from 'mongoose';

const auditDataSchema = new mongoose.Schema(
    {
        performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["FinancialRecord", "User"],
    },
     targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
},{timestamps: true}
);

const AuditData = mongoose.model("AuditData", auditDataSchema);
export default AuditData;