const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../keys/private.pem"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../keys/public.pem"),
  "utf8"
);

function signToken(username) {
  if (!username) return null;
  try {
    const payload = { username };
    const jwtToken = jwt.sign(payload, privateKey, {
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
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
    return decoded;
  } catch (error) {
    console.error("Error during verification:", error.message);
    return null;
  }
}

module.exports = { signToken, verifyToken };
