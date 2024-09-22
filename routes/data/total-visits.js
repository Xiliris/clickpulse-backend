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
      "SELECT date, views FROM total_page WHERE domain = ? AND date BETWEEN ? AND ?",
      [authorized.domain, startDate, endDate]
    );

    const formattedRows = rows.map((row) => {
      const originalDate = new Date(row.date);
      originalDate.setDate(originalDate.getDate() + 1);
      return {
        date: originalDate.toISOString().slice(0, 10),
        total_visits: row.views,
      };
    });
    console.log(startDate, endDate);

    const dates = generateDateRange(startDate, endDate);

    const result = mergeDataWithDateRange(
      dates,
      formattedRows,
      "date",
      ["total_visits"],
      0
    );

    res.json(result);
  } catch (error) {
    console.error("Error during fetching total-views:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
