const router = require("express").Router();
const database = require("../../database/mysql");

router.post("/", async (req, res) => {
  const { id } = req.body;

  try {
    const [rows] = await database.query("SELECT * FROM websites where id = ?", [
      id,
    ]);

    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
