import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import devisRoutes from "./routes/devisRoutes.js";
import factureRoutes from "./routes/factureRoutes.js";
import journalisationRoutes from "./routes/journalisationRoutes.js";
import User from "./models/User.js";
import statsRoutes from "./routes/statsRoutes.js";
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@crm.tn",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ Default admin created:");
      console.log("   Email: admin@crm.tn");
      console.log("   Password: admin123");
    } else {
      console.log("✅ Admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
};

createDefaultAdmin();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);

app.use("/api/devis",devisRoutes);
app.use("/api/facture",factureRoutes);
app.use("/api/jounalisation",journalisationRoutes);

app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
