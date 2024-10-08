const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");
const { addDayDate } = require("../../modules/dateRangeUtils");

// New GET request for buttons
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
        "SELECT * FROM buttons WHERE domain = ? ORDER BY date DESC",
        [authorized.domain]
      );

      endDate = addDayDate(rows[0].date);
      startDate = addDayDate(rows[rows.length - 1].date);
    }

    [rows] = await database.query(
      "SELECT elementId, content, SUM(clicks) AS clicks FROM buttons WHERE domain = ? AND date BETWEEN ? AND ? GROUP BY elementId, content ORDER BY clicks DESC",
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json("No button records found for the specified date range.");
    }

    fromatedResponse = rows.map((row) => ({
      content: row.content,
      id: row.elementId,
      clicks: row.clicks,
    }));

    res.json(fromatedResponse);
  } catch (error) {
    console.error("Error during fetching buttons:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
