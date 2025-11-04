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

// --- Route imports ---
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

// =========================
// 🌍  CORS CONFIGURATION
// =========================
const allowedOrigins = [
  "https://salonmanagementsystem.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests from server tools
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle all preflight OPTIONS requests
app.options("*", cors());

// =========================
// ⚙️ MIDDLEWARES
// =========================
app.use(express.json());
app.use(cookieParser());

// --- Session store ---
const PgSessionStore = pgSession(session);
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

const sessionConfig = {
  store: new PgSessionStore({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: isProd ? { rejectUnauthorized: false } : false,
    },
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: isProd,               // ✅ cookies only over HTTPS
    sameSite: isProd ? "None" : "Lax", // ✅ allow cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  },
};

app.use(session(sessionConfig));

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// =========================
// 📁 STATIC FILES
// =========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// 🚏 API ROUTES
// =========================
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

// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});







// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import passport from "passport";
// import pgSession from "connect-pg-simple";
// import "./config/passport.js";

// dotenv.config();

// import servicesRoutes from "./routes/servicesRoutes.js";
// import serviceRoutet from "./routes/serviceRoutet.js";
// import expensesRoutes from "./routes/expensesRoutes.js";
// import advancesRoutes from "./routes/advancesRoutes.js";
// import clockingsRoutes from "./routes/clockingsRoutes.js";
// import sessionsRoutes from "./routes/sessionsRoutes.js";
// import usersRoutes from "./routes/usersRoutes.js";
// import reportsRoutes from "./routes/reportsRoutes.js";
// import feesRoutes from "./routes/feesRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// const app = express();

// // --- Define __dirname for ES modules ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ CORS setup
// const allowedOrigins = [
//   "https://salehishsalonmanagementsystem.onrender.com",
//   "http://localhost:5173"
// ];

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     res.header("Access-Control-Allow-Credentials", "true");
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(cors({
//   origin: (origin, callback) => {
//     console.log("🌍 CORS Origin:", origin);
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json());
// app.use(cookieParser());

// // --- Sessions ---
// const PgSessionStore = pgSession(session);

// const isProd = process.env.NODE_ENV === "production";
// console.log("🧭 Environment:", process.env.NODE_ENV);

// const sessionConfig = {
//   store: new PgSessionStore({
//     conObject: {
//       connectionString: process.env.DATABASE_URL,
//       ssl: isProd ? { rejectUnauthorized: false } : false,
//     },
//     createTableIfMissing: true,
//   }),
//   secret: process.env.SESSION_SECRET || "fallback-secret",
//   resave: false,
//   saveUninitialized: false,
//   proxy: true,
//   cookie: {
//     httpOnly: true,
//     secure: isProd, // ✅ secure only when HTTPS
//     sameSite: isProd ? "None" : "Lax", // ✅ allow cross-site cookies in prod
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   },
// };


// app.set("trust proxy", 1)
// app.use(session(sessionConfig));

// // --- Passport ---
// app.use(passport.initialize());
// app.use(passport.session());

// // --- Static files ---
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // --- Routes ---
// app.use("/api/services", servicesRoutes);
// app.use("/api/servicet", serviceRoutet);
// app.use("/api/expenses", expensesRoutes);
// app.use("/api/advances", advancesRoutes);
// app.use("/api/clockings", clockingsRoutes);
// app.use("/api/sessions", sessionsRoutes);
// app.use("/api/users", usersRoutes);
// app.use("/api/reports", reportsRoutes);
// app.use("/api/fees", feesRoutes);
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5500;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
