const router = require("express").Router();
const { verifyToken } = require("../../utils/jwt");

router.post("/", (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json("Missing token.");

  const decoded = verifyToken(token);

  if (!decoded) return res.status(400).json("Invalid token.");

  const user = {
    username: decoded.username,
    id: 1,
  };

  res.status(200).json(user);
});

module.exports = router;
