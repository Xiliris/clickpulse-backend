const database = require("../../database/mysql");
async function activateWebsite(domain) {
  console.log(domain);
  try {
    database.query(
      `UPDATE websites SET active = true WHERE domain = ? AND active = false`,
      [domain]
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  activateWebsite,
};