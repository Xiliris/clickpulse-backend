const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const { startDate, endDate } = req.query;

  // Validate if both startDate and endDate are provided
  if (!startDate || !endDate) {
    return res.status(400).json("Please provide both startDate and endDate.");
  }

  try {
    const authorized = await authorize(id, user.username);

    if (!authorized) {
      return res.status(401).json("Unauthorized.");
    }

    // Fetching and aggregating data by browser
    const [rows] = await database.query(
      `SELECT browser, date, COUNT(*) AS totalViews
       FROM browsers
       WHERE domain = ? AND date BETWEEN ? AND ?
       GROUP BY browser, date
       ORDER BY date ASC`,
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      return res.status(404).json("No browser records found for the specified date range.");
    }

    res.json(rows);  
  } catch (error) {
    console.error("Error during fetching browsers:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
