const database = require("../../database/mysql");

async function trackMetric(domain, value, session, bounce, table, column) {
  const date = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await database.query(
      `SELECT * FROM ${table} WHERE domain = ? AND ${column} = ? AND date = ?`,
      [domain, value, date]
    );

    if (rows.length === 0) {
      // Insert new row if no record exists for the given domain, value, and date
      await database.query(
        `INSERT INTO ${table} (domain, ${column}, session_duration, bounce_rate, visits, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [domain, value, session, bounce, 1, date]
      );
    } else {
      // Update the existing row
      await database.query(
        `UPDATE ${table} 
         SET visits = visits + 1, 
             session_duration = session_duration + ?, 
             bounce_rate = bounce_rate + ?
         WHERE domain = ? AND ${column} = ? AND date = ?`,
        [session, bounce, domain, value, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table} update:`, error.message);
  }
}

async function device(domain, device, session, isBounce) {
  await trackMetric(
    domain,
    device,
    session,
    isBounce ? 1 : 0,
    "devices",
    "device"
  );
}

async function browser(domain, browser, session, isBounce) {
  await trackMetric(
    domain,
    browser,
    session,
    isBounce ? 1 : 0,
    "browsers",
    "browser"
  );
}

async function os(domain, os, session, isBounce) {
  await trackMetric(
    domain,
    os,
    session,
    isBounce ? 1 : 0,
    "operating_systems",
    "os"
  );
}

module.exports = {
  device,
  browser,
  os,
};
