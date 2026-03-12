import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app=express();
const PORT=process.env.PORT||5001;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);


app.use(cors({
    origin: allowedOrigins,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes",notesRoutes);

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server started on PORT:",PORT);
    });
});

