const router = require("express").Router();
const database = require("../../database/mysql");
const hashPassword = require("../../modules/hashPassword");

router.post("/", async (req, res) => {
  const { token, password, confirm_password } = req.body;

  console.log(req.body);

  if (password !== confirm_password) {
    return res.status(400).json("Passwords do not match");
  }

  const [tokens] = await database.query(
    "SELECT * FROM change_password_tokens WHERE token = ?",
    [token]
  );

  if (tokens.length <= 0) {
    return res.status(400).json("Invalid reset token");
  }

  const tokenDetails = tokens[0];

  const tokenExpiry = new Date(tokenDetails.created_at);
  const now = new Date();
  const expiryDuration = 24 * 60 * 60 * 1000;
  if (now - tokenExpiry > expiryDuration) {
    await database.query("DELETE FROM change_password_tokens WHERE token = ?", [
      token,
    ]);

    return res.status(400).json("Reset token has expired");
  }

  await database.query("DELETE FROM change_password_tokens WHERE token = ?", [
    token,
  ]);

  const email = tokenDetails.email;
  const hashedPassword = await hashPassword(password);
  console.log(hashPassword);

  await database.query("UPDATE users SET password = ? WHERE email = ?", [
    hashedPassword,
    email,
  ]);

  res.status(200).json("Password was changed successfully");
});

module.exports = router;
