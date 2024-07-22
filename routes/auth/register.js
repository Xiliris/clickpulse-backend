const router = require("express").Router();
const userSchema = require("../../schemas/user-schema");
const hashPassword = require("../../modules/hashPassword");
const createCode = require("../../modules/createCode");
const validateEmail = require("../../modules/validateEmail");
const sendVerifyEmail = require("../../modules/sendVerifyEmail");

router.post("/", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).send("Missing fields.");

    if (!validateEmail(email)) return res.status(400).send("Invalid email.");

    const hashedPassword = await hashPassword(password);
    const code = createCode(5);

    const userExists = await userSchema.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).send("User already exists.");
    }

    const user = new userSchema({
      email,
      username,
      password: hashedPassword,
      active: false,
      code,
    });
    await sendVerifyEmail(email, code);
    await user.save();

    res.status(201).send("User created.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
