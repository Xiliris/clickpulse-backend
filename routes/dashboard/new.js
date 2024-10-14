const router = require("express").Router();
const { verifyToken } = require("../../utils/jwt");
const database = require("../../database/mysql");

router.post("/", async (req, res) => {
  const { token, domain } = req.body;

  if (!token) return res.status(400).json("Missing token.");

  const user = verifyToken(token);

  if (!user) return res.status(400).json("Invalid token.");

  try {
    const [rows] = await database.query(
      "SELECT * FROM websites WHERE domain = ?",
      [domain]
    );
    const websiteExists = rows.length > 0;

    if (websiteExists) return res.status(400).json("Website already exists.");

    await database.query("INSERT INTO websites (domain, owner) VALUES (?, ?)", [
      domain,
      user.username,
    ]);

    res.status(200).json("Website created.");
  } catch (e) {
    console.error(e);
    res.status(500).json("An error occurred.");
  }
});

module.exports = router;
