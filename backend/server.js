import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import "./config/passport.js";

dotenv.config();

import servicesRoutes from "./routes/servicesRoutes.js";
import serviceRoutet from "./routes/serviceRoutet.js";
import expensesRoutes from "./routes/expensesRoutes.js";
import advancesRoutes from "./routes/advancesRoutes.js";
import clockingsRoutes from "./routes/clockingsRoutes.js";
import sessionsRoutes from "./routes/sessionsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import feesRoutes from "./routes/feesRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// --- Define __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS setup
const allowedOrigins = [
  "https://salonmanagementsystem.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌍 CORS Origin:", origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        console.log("✅ Allowed:", origin);
        return callback(null, true);
      }
      console.error("🚫 Blocked CORS Origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

// --- Sessions ---
const PgSessionStore = pgSession(session);

const isProd = process.env.NODE_ENV === "production";
console.log("🧭 Environment:", process.env.NODE_ENV);

const sessionConfig = {
  store: new PgSessionStore({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: isProd ? { rejectUnauthorized: false } : false, // ✅ conditional SSL
    },
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd ? true : false,
    sameSite: isProd ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

app.use(session(sessionConfig));

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Static files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/services", servicesRoutes);
app.use("/api/servicet", serviceRoutet);
app.use("/api/expenses", expensesRoutes);
app.use("/api/advances", advancesRoutes);
app.use("/api/clockings", clockingsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
