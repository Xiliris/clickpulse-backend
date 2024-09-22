const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");
const { generateDateRange, mergeDataWithDateRange } = require('../../modules/dateRangeUtils');

router.get("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  let { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json("Please provide both startDate and endDate.");
  }

  try {
    const authorized = await authorize(id, user.username);

    if (!authorized) {
      return res.status(401).json("Unauthorized.");
    }

    // Query data for the given date range
    let [rows] = await database.query(
      "SELECT * FROM total_page WHERE domain = ? AND date BETWEEN ? AND ?",
      [authorized.domain, startDate, endDate]
    );

    // Generate the full date range
    const dates = generateDateRange(startDate, endDate);

    // If no rows are returned, generate default data with views: 0
    if (rows.length === 0) {
      rows = dates.map(date => ({
        date,
        total_page_visits: 0,
      }));
    }

    // Format the rows to ensure proper date formatting (YYYY-MM-DD)
    const formattedRows = rows.map(row => {
      const originalDate = new Date(row.date);
      originalDate.setDate(originalDate.getDate() + 1); // Adjust date if necessary
      return {
        ...row,
        date: originalDate.toISOString().slice(0, 10),
      };
    });

    // Merge data with date range
    const result = mergeDataWithDateRange(dates, formattedRows, 'date', ['total_page_visits'], 0);

    // Return the result
    res.json(result);
  } catch (error) {
    console.error("Error during fetching total views:", error.message);
    res.status(500).json("Internal server error.");
  }
});


module.exports = router;
