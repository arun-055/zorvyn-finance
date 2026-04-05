import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from './src/lib/db.js';
dotenv.config();
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import recordRoutes from './src/routes/record.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5001;

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



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});