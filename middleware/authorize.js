const database = require("../database/mysql");

async function authorize(id, owner) {
  try {
    if (owner === "Clickpulse") {
      const [row] = await database.query(
        "SELECT * FROM websites WHERE id = ?",
        [id]
      );
      return row[0];
    }

    const [rows] = await database.query(
      "SELECT * FROM websites WHERE id = ? AND owner = ?",
      [id, owner]
    );

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
