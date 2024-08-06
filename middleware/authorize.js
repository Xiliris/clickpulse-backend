const database = require("../database/mysql");

async function authorize(id, owner) {
  try {
    const [rows] = await database.query("SELECT * FROM websites WHERE id = ? AND owner = ?", [id, owner]);

    if (rows.length === 0) {
      return false;
    }

    return rows[0];
  } catch (error) {
    console.error("Error during fetching entry:", error.message);
    res.status(500).json("Internal server error.");
  }
}

module.exports = authorize;
