const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");
const {
  generateDateRange,
  mergeDataWithDateRange,
} = require("../../modules/dateRangeUtils");

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json("Please provide both startDate and endDate.");
  }

  try {
    const authorized = await authorize(id, user.username);

    if (!authorized) {
      return res.status(401).json("Unauthorized.");
    }

    const [rows] = await database.query(
      "SELECT date, SUM(duration) AS total_duration, COUNT(requests) AS total_requests FROM session_duration WHERE domain = ? AND date BETWEEN ? AND ? GROUP BY date",
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      const dates = generateDateRange(startDate, endDate);
      const result = mergeDataWithDateRange(
        dates,
        [],
        "date",
        ["averageDuration"],
        null
      );
      return res.json(result);
    }

    const formattedRows = rows.map((row) => {
      const averageSessionDuration = row.total_duration / row.total_requests;
      return {
        date: row.date,
        visit_duration: averageSessionDuration,
      };
    });

    const dates = generateDateRange(startDate, endDate);

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
