const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* ===== Middleware: Check Admin ===== */
function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }
  next();
}

/* ================= ADMIN DASHBOARD ================= */
router.get("/", isAdmin, (req, res) => {
  res.render("admin");
});

/* ================= VIEW USERS ================= */
router.get("/users", isAdmin, (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database error");
    }
    res.render("admin-users", { users: results });
  });
});

/* ================= ADD EVENT ================= */
router.post("/add-event", isAdmin, (req, res) => {

  const { event_name, date, time, venue, description } = req.body;

  if (!event_name || !date || !time || !venue || !description) {
    return res.redirect("/admin");
  }

  db.query(
    "INSERT INTO events (event_name, date, time, venue, description) VALUES (?,?,?,?,?)",
    [event_name, date, time, venue, description],
    (err) => {
      if (err) {
        console.log(err);
        return res.send("Failed to add event");
      }
      res.redirect("/admin");
    }
  );
});

/* ================= VIEW REGISTRATIONS ================= */
router.get("/registrations", isAdmin, (req, res) => {

  db.query(`
    SELECT users.name, users.email, events.event_name, events.date
    FROM event_registrations
    JOIN users ON event_registrations.user_id = users.user_id
    JOIN events ON event_registrations.event_id = events.event_id
    ORDER BY events.date DESC
  `, (err, results) => {

    if (err) {
      console.log(err);
      return res.send("Database error");
    }

    res.render("admin-registrations", { data: results });
  });
});

module.exports = router;
