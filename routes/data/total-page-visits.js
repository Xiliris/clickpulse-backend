const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");
const {
  generateDateRange,
  mergeDataWithDateRange,
} = require("../../modules/dateRangeUtils");

router.get("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
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
      "SELECT date, page_views FROM total_page WHERE domain = ? AND date BETWEEN ? AND ?",
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json("No data found for the specified date range.");
    }

    const formattedRows = rows.map((row) => {
      const originalDate = new Date(row.date);
      originalDate.setDate(originalDate.getDate() + 1);
      return {
        date: originalDate.toISOString().slice(0, 10),
        total_page_visits: row.page_views,
      };
    });

    const dates = generateDateRange(startDate, endDate);

    const result = mergeDataWithDateRange(
      dates,
      formattedRows,
      "date",
      ["total_page_visits"],
      0
    );

    res.json(result);
  } catch (error) {
    console.error("Error during fetching total-views:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
