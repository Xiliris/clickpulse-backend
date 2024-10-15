const router = require("express").Router();
const { verifyToken } = require("../../utils/jwt");
const database = require("../../database/mysql");

router.post("/", async (req, res) => {
  const { token, domain } = req.body;

  if (!token) return res.status(400).json("Missing token.");
  if (!domain) return res.status(400).json("Missing domain.");

  const user = verifyToken(token);
  if (!user) return res.status(400).json("Invalid token.");

  try {
    const [websiteExists] = await database.query(
      "SELECT * FROM websites WHERE domain = ?",
      [domain]
    );

    if (websiteExists.length <= 0) {
      return res.status(404).json("Domain not found.");
    }

    await Promise.all([
      database.query("DELETE FROM anchors WHERE domain = ?", [domain]),
      database.query("DELETE FROM bounce_rate WHERE domain = ?", [domain]),
      database.query("DELETE FROM browsers WHERE domain = ?", [domain]),
      database.query("DELETE FROM buttons WHERE domain = ?", [domain]),
      database.query("DELETE FROM devices WHERE domain = ?", [domain]),
      database.query("DELETE FROM entry_page WHERE domain = ?", [domain]),
      database.query("DELETE FROM exit_page WHERE domain = ?", [domain]),
      database.query("DELETE FROM location WHERE domain = ?", [domain]),
      database.query("DELETE FROM operating_systems WHERE domain = ?", [
        domain,
      ]),
      database.query("DELETE FROM referrer WHERE domain = ?", [domain]),
      database.query("DELETE FROM session_duration WHERE domain = ?", [domain]),
      database.query("DELETE FROM total_page WHERE domain = ?", [domain]),
      database.query("DELETE FROM visited_page WHERE domain = ?", [domain]),
      database.query("DELETE FROM websites WHERE domain = ?", [domain]),
    ]);

    res.status(200).json("Website deleted successfully.");
  } catch (e) {
    console.error(e);
    res.status(500).json("An error occurred.");
  }
});

module.exports = router;
