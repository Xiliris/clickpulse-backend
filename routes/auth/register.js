const router = require("express").Router();
const database = require("../../database/mysql");
const hashPassword = require("../../modules/hashPassword");
const createCode = require("../../modules/createCode");
const validateEmail = require("../../modules/validateEmail");
const sendVerifyEmail = require("../../modules/sendVerifyEmail");

router.post("/", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json("Missing fields.");
    }

    if (!validateEmail(email)) {
      return res.status(400).json("Invalid email.");
    }

    const [user] = await database.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);

    if (user.length > 0) {
      return res.status(400).json("User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    let code;
    let codeExists;

    do {
      code = createCode(5);
      const [rows] = await database.query("SELECT * FROM verify_users WHERE code = ?", [code]);
      codeExists = rows.length > 0;
    } while (codeExists);

    await database.query("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [
      email,
      username,
      hashedPassword,
    ]);

    await database.query("INSERT INTO verify_users (code, username) VALUES (?, ?)", [code, username]);

    await sendVerifyEmail(email, code);

    res.status(200).json("User created.");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error.");
  }
});

module.exports = router;
