const bcrypt = require("bcrypt");

function hashPassword(password) {
  const saltRounds = 10;

  return bcrypt.hash(password, saltRounds);
}

module.exports = hashPassword;
