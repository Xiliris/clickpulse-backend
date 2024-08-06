const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

router.get("/:id/:date", authenticate, async (req, res) => {
  const { id, date } = req.params;
  const user = req.user;

  try {
    const authorized = await authorize(id, user.username);

    if (!authorized) {
      return res.status(401).json("Unauthorized.");
    }

    const [rows] = await database.query("SELECT * FROM bounce_rate WHERE domain = ? AND date = ?", [
      authorized.domain,
      date,
    ]);

    if (rows.length === 0) {
      return res.status(404).json("Bounce rate page not found.");
    }

    const requests = rows[0].requests;
    const bounces = rows[0].bounces;

    const bounceRate = ((bounces / requests) * 100).toFixed(1) + "%";

    res.json({ bounces: bounceRate });
  } catch (error) {
    console.error("Error during fetching bounce-rate:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
