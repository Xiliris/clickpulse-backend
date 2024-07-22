const router = require("express").Router();

router.post("/", (req, res) => {
  res.send("Login route");
});

module.exports = router;
