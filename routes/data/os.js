const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const router = require("express").Router();
const database = require("../../database/mysql");

router.get("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  try {
    const authorized = await authorize(id, user.username);

    if (!authorized) {
      return res.status(401).json("Unauthorized.");
    }

    const [rows] = await database.query("SELECT * FROM operating_systems WHERE domain = ?", [authorized.domain]);

    if (rows.length === 0) {
      return res.status(404).json("OS page not found.");
    }

    res.json(rows);
  } catch (error) {
    console.error("Error during fetching os:", error.message);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
