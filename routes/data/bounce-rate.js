const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

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
      `SELECT date, SUM(bounces) AS totalBounces, SUM(requests) AS totalRequests
       FROM bounce_rate 
       WHERE domain = ? AND date BETWEEN ? AND ? 
       GROUP BY date 
       ORDER BY date`,
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      return res.status(404).json("No data found for the specified date range.");
    }

    const bounceRatesByDate = rows.map(row => {
      const bounceRate = ((row.totalBounces / row.totalRequests) * 100).toFixed(1);
      return {
        date: row.date,
        bounceRate: bounceRate + "%",
        bounces: row.totalBounces,
        requests: row.totalRequests
      };
    });

    res.json(bounceRatesByDate);
  } catch (error) {
    console.error("Error during fetching bounce-rate data:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
