const database = require("../../database/mysql");

async function updateClicks(domain, elId, content, clicks, table) {
  let date = new Date().toISOString().slice(0, 10);
  let elementId = elId ? elId : "none";
  try {
    const [rows] = await database.query(
      `SELECT * FROM ${table} WHERE domain = ? AND elementId = ? AND content = ? AND date = ?`,
      [domain, elementId, content, date]
    );

    if (rows.length === 0) {
      await database.query(
        `INSERT INTO ${table} (domain, elementId, content, clicks, date) VALUES (?, ?, ?, ?, ?)`,
        [domain, elementId, content, clicks, date]
      );
    } else {
      await database.query(
        `UPDATE ${table} 
           SET clicks = clicks + ? 
           WHERE domain = ? AND elementId = ? AND content = ? AND date = ?`,
        [clicks, domain, elementId, content, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table} update:`, error.message);
  }
}

async function anchors(domain, elementId, content, clicks) {
  await updateClicks(domain, elementId, content, clicks, "anchors");
}

async function buttons(domain, elementId, content, clicks) {
  await updateClicks(domain, elementId, content, clicks, "buttons");
}

module.exports = {
  anchors,
  buttons,
};
