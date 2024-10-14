const database = require("../../database/mysql");
async function activateWebsite(domain) {
  try {
    await database.query(`UPDATE websites SET active = true WHERE domain = ?`, [
      domain,
    ]);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  activateWebsite,
};
