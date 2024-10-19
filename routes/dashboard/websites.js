const router = require("express").Router();
const { verifyToken } = require("../../utils/jwt");
const database = require("../../database/mysql");

router.get("/:token", async (req, res) => {
  const token = req.params.token;
  const decoded = verifyToken(token);
  if (!decoded) return res.status(400).json("Invalid token.");

  try {
    if (decoded.username === "Clickpulse") {
      const [rows] = await database.query("SELECT * FROM websites");

      return res.json(rows);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error.");
  }

  try {
    const [rows] = await database.query(
      "SELECT * FROM websites WHERE owner = ?",
      [decoded.username]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error during fetching websites:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
