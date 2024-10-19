const router = require("express").Router();
const { verifyToken } = require("../../utils/jwt");
const database = require("../../database/mysql");

router.post("/", async (req, res) => {
  const { token, domain_id } = req.body;

  if (!token) return res.status(400).json("Missing token.");

  const user = verifyToken(token);

  if (!user) return res.status(400).json("Invalid token.");

  try {
    const [rows] = await database.query("SELECT * FROM websites WHERE id = ?", [
      domain_id,
    ]);

    if (rows.length === 0) {
      return res.status(400).json("Website does not exist.");
    }

    const website = rows[0];

    if (user.username === "Clickpulse") {
      return res.status(200).json({ access: true });
    }

    if (website.owner.toLowerCase() !== user.username.toLowerCase()) {
      return res.status(403).json({ access: false });
    }

    res.status(200).json({ access: true });
  } catch (e) {
    console.error(e);
    res.status(500).json("An error occurred.");
  }
});

module.exports = router;
