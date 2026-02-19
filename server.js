const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const clubRoutes = require("./routes/club");
const adminRoutes = require("./routes/admin");

const app = express();

/* ===== VIEW ENGINE ===== */
app.set("view engine", "ejs");

/* ===== MIDDLEWARE ===== */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

/* ===== SESSION ===== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false
  })
);

/* ===== GLOBAL USER VARIABLE ===== */
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

/* ===== ROUTES ===== */
app.use("/", authRoutes);
app.use("/events", eventRoutes);
app.use("/clubs", clubRoutes);
app.use("/admin", adminRoutes);

/* ===== HOME (Dynamic Events) ===== */
app.get("/", (req, res) => {
  db.query("SELECT * FROM events ORDER BY date DESC LIMIT 3", (err, results) => {
    if (err) {
      console.log(err);
      return res.render("index", { events: [] });
    }

    res.render("index", { events: results });
  });
});

/* ===== STATIC PAGES ===== */
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/gallery", (req, res) => res.render("gallery"));
app.get("/team", (req, res) => res.render("team"));

/* ===== CONTACT FORM ===== */
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message);
  res.send("Message received successfully!");
});

/* ===== DASHBOARD (Protected) ===== */
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("dashboard");
});

/* ===== SERVER ===== */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
