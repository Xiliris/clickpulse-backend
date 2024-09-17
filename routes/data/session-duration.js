const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;
  const user = req.user;

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
      return res.status(404).json("No session duration records found for the specified date range.");
    }

    const result = rows.map(row => {
      const averageSessionDuration = row.total_duration / row.total_requests;
      return {
        date: row.date,
        averageDuration: formatDuration(averageSessionDuration),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error during fetching session duration:", error.message);
    res.status(500).json("Internal server error.");
  }
});

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
}

module.exports = router;
