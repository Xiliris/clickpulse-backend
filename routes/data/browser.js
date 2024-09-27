const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  let { startDate, endDate } = req.query;

  try {
    const authorized = await authorize(id, user.username);

    if (!authorized) {
      return res.status(401).json("Unauthorized.");
    }

    let rows;

    if (!startDate || !endDate) {
      [rows] = await database.query("SELECT * FROM browsers WHERE domain = ?", [
        authorized.domain,
      ]);
      startDate = addDayDate(rows[0].date);
      endDate = addDayDate(rows[rows.length - 1].date);
    } else {
      [rows] = await database.query(
        "SELECT browser, SUM(visits) AS total_visits, SUM(session_duration) AS total_session_duration, SUM(bounce_rate) AS total_bounce_rate  FROM browsers WHERE domain = ? AND date BETWEEN ? AND ? ORDER BY date ASC",
        [authorized.domain, startDate, endDate]
      );
    }

    if (rows.length === 0) {
      return res
        .status(404)
        .json("No browser records found for the specified date range.");
    }

    res.json(rows);
  } catch (error) {
    console.error("Error during fetching browsers:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
