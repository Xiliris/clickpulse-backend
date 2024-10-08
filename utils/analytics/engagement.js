const database = require("../../database/mysql");

async function trackMetricWithRequests(domain, value, table, valueColumn, dateColumn) {
  const date = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await database.query(
      `SELECT * FROM ${table} WHERE domain = ? AND ${dateColumn} = ?`,
      [domain, date]
    );

    if (rows.length === 0) {
      await database.query(
        `INSERT INTO ${table} (domain, ${valueColumn}, requests, ${dateColumn}) VALUES (?, ?, ?, ?)`,
        [domain, value, 1, date]
      );
    } else {
      await database.query(
        `UPDATE ${table} SET ${valueColumn} = ${valueColumn} + ?, requests = requests + 1 WHERE domain = ? AND ${dateColumn} = ?`,
        [value, domain, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table}:`, error.message);
  }
}

async function session_duration(domain, duration) {
  await trackMetricWithRequests(domain, duration, 'session_duration', 'duration', 'date');
}

async function bounce_rate(domain, isBounce) {
  await trackMetricWithRequests(domain, isBounce ? 1 : 0, 'bounce_rate', 'bounces', 'date');
}

module.exports = {
  session_duration,
  bounce_rate,
};
