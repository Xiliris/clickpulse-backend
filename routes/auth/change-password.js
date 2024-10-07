const router = require("express").Router();
const bcrypt = require("bcrypt");
const database = require("../../database/mysql");
const hashPassword = require("../../modules/hashPassword");
const authenticate = require("../../middleware/authenticate");

router.post("/", authenticate, async (req, res) => {
  const { old_password, new_password } = req.body;
  const username = req.user.username;

  if (old_password === new_password) {
    return res
      .status(400)
      .json("New password cannot be the same as the old password.");
  }

  const [user] = await database.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (!user) {
    return res.status(404).json("User not found.");
  }

  const validPassword = await bcrypt.compare(old_password, user[0].password);
  if (!validPassword) {
    return res.status(400).json("Invalid old password.");
  }

  const hashedPassword = await hashPassword(new_password);

  try {
    await database.query("UPDATE users SET password = ? WHERE username = ?", [
      hashedPassword,
      username,
    ]);
    return res.status(200).json("Password was changed successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json("Internal server error.");
  }
});

module.exports = router;
