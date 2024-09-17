const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

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
      "SELECT * FROM exit_page WHERE domain = ? AND date BETWEEN ? AND ?",
      [authorized.domain, startDate, endDate]
    );

    if (rows.length === 0) {
      return res.status(404).json("No exit page records found for the specified date range.");
    }

    res.json(rows);
  } catch (error) {
    console.error("Error during fetching exit page:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
