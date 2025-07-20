const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// MongoDB
require("./config/db")();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // To read form data



app.use(session({
  secret: "skill-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

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
