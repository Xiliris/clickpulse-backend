const { verifyToken } = require("../utils/jwt");

function authenticate(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json("Unauthorized.");
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    if (!decoded) return res.status(401).json("Unauthorized.");
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json("Unauthorized.");
  }
}

module.exports = authenticate;
