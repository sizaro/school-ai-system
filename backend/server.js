import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import pgSession from "connect-pg-simple";
import "./config/passport.js";

dotenv.config();

import servicesRoutes from './routes/servicesRoutes.js';
import serviceRoutet from './routes/serviceRoutet.js';
import expensesRoutes from './routes/expensesRoutes.js';
import advancesRoutes from './routes/advancesRoutes.js';
import clockingsRoutes from './routes/clockingsRoutes.js';
import sessionsRoutes from './routes/sessionsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import feesRoutes from './routes/feesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const PgSessionStore = pgSession(session);

app.use(
  session({
    store: new PgSessionStore({
      conString:
        process.env.NODE_ENV === "production"
          ? process.env.DATABASE_URL
          : process.env.LOCAL_DATABASE_URL,
      createTableIfMissing: true, // <-- add this
    }),
    secret: process.env.SESSION_SECRET || "sssssss",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// --- FIX: Define __dirname in ES module scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CORS setup ---
const allowedOrigins = [
  "https://salonmanagementsystem.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API routes ---
app.use('/api/services', servicesRoutes);
app.use('/api/servicet', serviceRoutet);
app.use('/api/expenses', expensesRoutes);
app.use('/api/advances', advancesRoutes);
app.use('/api/clockings', clockingsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/auth', authRoutes);

// --- Start server ---
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
