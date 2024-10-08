const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");
const { addDayDate } = require("../../modules/dateRangeUtils");

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
      [rows] = await database.query(
        "SELECT * FROM location WHERE domain = ? ORDER BY date DESC",
        [authorized.domain]
      );

      endDate = addDayDate(rows[0].date);
      startDate = addDayDate(rows[rows.length - 1].date);
    }

    [rows] = await database.query(
      "SELECT country, SUM(visits) AS visits, SUM(session_duration) AS time_spent, SUM(bounce_rate) AS bounce_rate FROM location WHERE domain = ? AND date BETWEEN ? AND ? GROUP BY country ORDER BY visits DESC",
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json("No location records found for the specified date range.");
    }

    res.json(rows);
  } catch (error) {
    console.error("Error during fetching location:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
