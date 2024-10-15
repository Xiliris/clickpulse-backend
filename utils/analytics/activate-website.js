const database = require("../../database/mysql");
async function activateWebsite(domain) {
  try {
    await database.query(`UPDATE websites SET active = true WHERE domain = ?`, [
      domain,
    ]);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  activateWebsite,
};
