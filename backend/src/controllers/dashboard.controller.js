import FinanceRecord from "../models/FinanceRecord.js";
import { sendSuccess, sendError } from "../utils/Response.js";


export const getSummary = async (req, res) => {
  try {
    const totals = await FinanceRecord.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const recent = await FinanceRecord.find()
      .sort({ date: -1 })
      .limit(5);

    let totalIncome = 0;
    let totalExpense = 0;

    for (let item of totals) {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    }

    return sendSuccess(res, {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      recentTransactions: recent
    });

  } catch (err) {
    return sendError(res, err.message);
  }
};


export const getCategoryWise = async (req, res) => {
  try {
    const data = await FinanceRecord.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err.message);
  }
};


export const getMonthlyTrends = async (req, res) => {
  try {
    const data = await FinanceRecord.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$amount" }
        }
      }
    ]);

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getWeeklyTrends = async (req, res) => {
  try {
    const data = await FinanceRecord.aggregate([
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" } },
          total: { $sum: "$amount" }
        }
      }
    ]);

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err.message);
  }
};


export const getInsights = async (req, res) => {
  try {
    const data = await FinanceRecord.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err.message);
  }
};