const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* ================= VIEW CLUBS ================= */
router.get("/", (req, res) => {
  db.query("SELECT * FROM clubs", (err, results) => {

    if (err) {
      console.log(err);
      return res.send("Database error");
    }

    res.render("clubs", { clubs: results });
  });
});

/* ================= JOIN CLUB ================= */
router.post("/join/:id", (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userId = req.session.user.user_id;
  const clubId = req.params.id;

  // Check if already joined
  db.query(
    "SELECT * FROM club_members WHERE user_id = ? AND club_id = ?",
    [userId, clubId],
    (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database error");
      }

      if (results.length > 0) {
        return res.redirect("/clubs");
      }

      db.query(
        "INSERT INTO club_members (user_id, club_id) VALUES (?, ?)",
        [userId, clubId],
        (err) => {
          if (err) {
            console.log(err);
            return res.send("Failed to join club");
          }

          res.redirect("/clubs");
        }
      );
    }
  );
});

module.exports = router;
