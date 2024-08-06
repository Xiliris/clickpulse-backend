const database = require("../../database/mysql");

async function session_duration(domain, duration) {
  try {
    const [rows] = await database.query("SELECT * FROM session_duration WHERE domain = ? AND date = ?", [
      domain,
      new Date().toISOString().slice(0, 10),
    ]);

    if (rows.length === 0) {
      await database.query("INSERT INTO session_duration (domain, duration, requests, date) VALUES (?, ?, ?, ?)", [
        domain,
        duration,
        1, // Set requests to 1 for a new record
        new Date().toISOString().slice(0, 10), // Format the date as YYYY-MM-DD
      ]);
    } else {
      await database.query(
        "UPDATE session_duration SET duration = duration + ?, requests = requests + 1 WHERE domain = ? AND date = ?",
        [duration, domain, new Date().toISOString().slice(0, 10)]
      );
    }
  } catch (error) {
    console.error("Error during session duration:", error.message);
  }
}

async function bounce_rate(domain, isBounce) {
  try {
    const [rows] = await database.query("SELECT * FROM bounce_rate WHERE domain = ? AND date = ?", [
      domain,
      new Date().toISOString().slice(0, 10),
    ]);

    if (rows.length === 0) {
      await database.query("INSERT INTO bounce_rate (domain, bounces, requests, date) VALUES (?, ?, ?, ?)", [
        domain,
        isBounce ? 1 : 0, // Set bounces to 1 if it's a bounce, otherwise 0
        1, // Set requests to 1 for a new record
        new Date().toISOString().slice(0, 10), // Format the date as YYYY-MM-DD
      ]);
    } else {
      await database.query(
        "UPDATE bounce_rate SET bounces = bounces + ?, requests = requests + 1 WHERE domain = ? AND date = ?",
        [isBounce ? 1 : 0, domain, new Date().toISOString().slice(0, 10)]
      );
    }
  } catch (error) {
    console.error("Error during bounce rate:", error.message);
  }
}

module.exports = {
  session_duration,
  bounce_rate,
};
