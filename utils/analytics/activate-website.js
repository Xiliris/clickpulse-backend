const database = require("../../database/mysql");
async function activateWebsite(domain) {
  try {
    const [result] = await database.query(
      `UPDATE websites SET active = true WHERE domain = ?`,
      [domain]
    );
    if (result.affectedRows <= 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  activateWebsite,
};
