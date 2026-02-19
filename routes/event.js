const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* ================= VIEW EVENTS ================= */
router.get("/", (req, res) => {
  db.query("SELECT * FROM events ORDER BY date DESC", (err, results) => {

    if (err) {
      console.log(err);
      return res.render("events", { events: [] });
    }

    res.render("events", { events: results });
  });
});

/* ================= REGISTER EVENT ================= */
router.post("/register/:id", (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userId = req.session.user.user_id;
  const eventId = req.params.id;

  // Check if already registered
  db.query(
    "SELECT * FROM event_registrations WHERE user_id = ? AND event_id = ?",
    [userId, eventId],
    (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database error");
      }

      if (results.length > 0) {
        return res.redirect("/events");
      }

      db.query(
        "INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)",
        [userId, eventId],
        (err) => {

          if (err) {
            console.log(err);
            return res.send("Registration failed");
          }

          res.redirect("/events");
        }
      );
    }
  );
});

module.exports = router;
