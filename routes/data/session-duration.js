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

    const [rows] = await database.query("SELECT * FROM session_duration WHERE domain = ? AND date = ?", [
      authorized.domain,
      date,
    ]);

    if (rows.length === 0) {
      return res.status(404).json("Session duration page not found.");
    }

    const duration = rows[0].duration;
    const requests = rows[0].requests;

    const averageSessionDuration = duration / requests;

    res.json({ duration: formatDuration(averageSessionDuration) });
  } catch (error) {
    console.error("Error during fetching session-duration:", error.message);
    res.status(500).json("Internal server error.");
  }
});

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
}

module.exports = router;
