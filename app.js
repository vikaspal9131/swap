const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); // Ye toh hai hi, good!
const app = express();

// MongoDB connection
require("./config/db")(); // Ye bhi theek hai

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// --- Yahan hai asal change, session configuration mein ---
app.use(session({
  secret: process.env.SESSION_SECRET || "a_very_secret_key_for_development_only", // IMPORTANT: 'skill-secret' ko ab dotenv se le raha hu ya ek fallback
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 din (milliseconds mein) - user ab 30 din tak logged in rahega
    httpOnly: true, // Browser JavaScript se cookie ko access nahi kar payega (security)
    secure: process.env.NODE_ENV === 'production', // Production mein hi HTTPS pe cookie bhejo
    sameSite: 'lax' // CSRF protection
  }
}));
// --- Session config change done! ---

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/swap"));
app.use("/", require("./routes/main"));
app.use("/", require("./routes/register"));
app.use("/", require("./routes/profile"));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));