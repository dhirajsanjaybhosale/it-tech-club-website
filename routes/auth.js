const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const router = express.Router();

/* ================= GET LOGIN ================= */
router.get("/login", (req, res) => {
  res.render("login");
});

/* ================= GET SIGNUP ================= */
router.get("/signup", (req, res) => {
  res.render("signup");
});

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("signup", { error: "All fields are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.log(err);
        return res.render("signup", { error: "Database error" });
      }

      if (results.length > 0) {
        return res.render("signup", { error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            console.log(err);
            return res.render("signup", { error: "Registration failed" });
          }

          res.redirect("/auth/login");
        }
      );
    });

  } catch (error) {
    console.log(error);
    res.render("signup", { error: "Something went wrong" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { error: "All fields required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {

      if (err) {
        console.log(err);
        return res.render("login", { error: "Database error" });
      }

      if (results.length === 0) {
        return res.render("login", { error: "User not found" });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.render("login", { error: "Invalid password" });
      }

      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role || "student"
      };

      if (req.session.user.role === "admin") {
        return res.redirect("/admin");
      }

      res.redirect("/dashboard");
    }
  );
});

/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;