const router = require("express").Router();
const database = require("../../database/mysql");

router.post("/", async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json("Missing code.");

  try {
    const [rows] = await database.query("SELECT * FROM verify_users WHERE code = ?", [code]);

    if (rows.length === 0) {
      return res.status(400).json("Invalid code.");
    }

    await database.query("UPDATE verify_users SET active = 1 WHERE code = ?", [code]);

    res.status(200).json("User verified.");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
