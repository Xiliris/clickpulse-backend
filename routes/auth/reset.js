const router = require("express").Router();
const database = require("../../database/mysql");
const createToken = require("../../modules/createToken");
const sendEmail = require("../../modules/sendChangePasswordEmail");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json("Missing email field.");

  const [users] = await database.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length <= 0)
    return res.status(404).json("User with that email not found.");

  const [existingTokens] = await database.query(
    "SELECT * FROM change_password_tokens WHERE email = ?",
    [email]
  );

  if (existingTokens.length > 0) {
    const token = existingTokens[0];
    const currentTime = new Date();

    if (new Date(token.expires_at) < currentTime) {
      await database.query(
        "DELETE FROM change_password_tokens WHERE email = ?",
        [email]
      );
    } else {
      return res.status(400).json("Email already sent.");
    }
  }

  const resetToken = createToken(32);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await database.query(
    "INSERT INTO change_password_tokens (email, token, expires_at) VALUES (?, ?, ?)",
    [email, resetToken, expiresAt]
  );

  sendEmail(email, resetToken);

  res.status(200).json("Email with reset token was successfully sent.");
});

module.exports = router;
