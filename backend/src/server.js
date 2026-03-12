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


const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser clients (no Origin header)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/notes",notesRoutes);
app.use("/notes",notesRoutes);

app.get("/health",(req,res)=>{
    res.send("Thinkboard API is running");
});

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server started on PORT:",PORT);
    });
});

