const jwt = require("jsonwebtoken");

const { JSON_PRIVATE_KEY, JSON_PUBLIC_KEY } = process.env;

function signToken(username) {
  if (!username) return null;
  try {
    const payload = { username };
    const jwtToken = jwt.sign(payload, JSON_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    return jwtToken;
  } catch (error) {
    console.error("Error during signing:", error.message);
    return null;
  }
}

function verifyToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JSON_PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    return decoded;
  } catch (error) {
    console.error("Error during verification:", error.message);
    return null;
  }
}

module.exports = { signToken, verifyToken };
