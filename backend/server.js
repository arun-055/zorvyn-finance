import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from './src/lib/db.js';
dotenv.config();
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import recordRoutes from './src/routes/recordRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard API is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});