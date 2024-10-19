const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");
const {
  generateDateRange,
  mergeDataWithDateRange,
  addDayDate,
} = require("../../modules/dateRangeUtils");

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
        "SELECT date, SUM(duration) AS total_duration, COUNT(requests) AS total_requests FROM session_duration WHERE domain = ? GROUP BY date ORDER BY date DESC",
        [authorized.domain]
      );
      endDate = addDayDate(rows[0].date);
      startDate = addDayDate(rows[rows.length - 1].date);
    } else {
      [rows] = await database.query(
        "SELECT date, SUM(duration) AS total_duration, COUNT(requests) AS total_requests FROM session_duration WHERE domain = ? AND date BETWEEN ? AND ? GROUP BY date",
        [authorized.domain, startDate, endDate]
      );
    }

    const dates = generateDateRange(startDate, endDate);

    if (rows.length === 0) {
      const result = mergeDataWithDateRange(
        dates,
        [],
        "date",
        ["visit_duration"],
        0
      );
      return res.json(result);
    }

    const formattedRows = rows.map((row) => {
      const originalDate = new Date(row.date);
      originalDate.setDate(originalDate.getDate());
      const averageSessionDuration = row.total_duration / row.total_requests;
      return {
        date: originalDate.toISOString().slice(0, 10),
        visit_duration: averageSessionDuration,
      };
    });

    const result = mergeDataWithDateRange(
      dates,
      formattedRows,
      "date",
      ["visit_duration"],
      0
    );

    res.json(result);
  } catch (error) {
    console.error("Error during fetching session duration:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
