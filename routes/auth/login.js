const router = require("express").Router();
const bcrypt = require("bcrypt");
const database = require("../../database/mysql");
const { signToken } = require("../../utils/jwt");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json("Missing fields.");

  try {
    const [rows] = await database.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(400).json("User does not exist.");

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json("Invalid password.");

    const token = signToken(user.username);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
