const database = require("../../database/mysql");

async function trackMetric(domain, value, table, column) {
  const date = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await database.query(
      `SELECT * FROM ${table} WHERE domain = ? AND ${column} = ? AND date = ?`, 
      [domain, value, date]
    );

    if (rows.length === 0) {
      await database.query(
        `INSERT INTO ${table} (domain, ${column}, views, date) VALUES (?, ?, ?, ?)`, 
        [domain, value, 1, date]
      );
    } else {
      await database.query(
        `UPDATE ${table} SET views = views + 1 WHERE domain = ? AND ${column} = ? AND date = ?`, 
        [domain, value, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table}:`, error.message);
  }
}

async function device(domain, device) {
  await trackMetric(domain, device, 'devices', 'device');
}

async function browser(domain, browser) {
  await trackMetric(domain, browser, 'browsers', 'browser');
}

async function os(domain, os) {
  await trackMetric(domain, os, 'operating_systems', 'os');
}

module.exports = {
  device,
  browser,
  os,
};
