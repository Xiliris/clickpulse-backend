const database = require("../../database/mysql");

async function device(domain, device) {
  try {
    const [rows] = await database.query("SELECT * FROM devices WHERE domain = ? AND device = ?", [domain, device]);

    if (rows.length === 0) {
      await database.query("INSERT INTO devices (domain, device, views, date) VALUES (?, ?, ?, ?)", [
        domain,
        device,
        1,
        new Date().toISOString().slice(0, 10),
      ]);
    } else {
      await database.query("UPDATE devices SET views = views + 1 WHERE domain = ? AND device = ?", [domain, device]);
    }
  } catch (error) {
    console.error("Error during device:", error.message);
  }
}

async function browser(domain, browser) {
  try {
    const [rows] = await database.query("SELECT * FROM browsers WHERE domain = ? AND browser = ?", [domain, browser]);

    if (rows.length === 0) {
      await database.query("INSERT INTO browsers (domain, browser, views, date) VALUES (?, ?, ?, ?)", [
        domain,
        browser,
        1,
        new Date().toISOString().slice(0, 10),
      ]);
    } else {
      await database.query("UPDATE browsers SET views = views + 1 WHERE domain = ? AND browser = ?", [domain, browser]);
    }
  } catch (error) {
    console.error("Error during browser:", error.message);
  }
}

async function os(domain, os) {
  try {
    const [rows] = await database.query("SELECT * FROM operating_systems WHERE domain = ? AND os = ?", [domain, os]);

    if (rows.length === 0) {
      await database.query("INSERT INTO operating_systems (domain, os, views, date) VALUES (?, ?, ?, ?)", [
        domain,
        os,
        1,
        new Date().toISOString().slice(0, 10),
      ]);
    } else {
      await database.query("UPDATE operating_systems SET views = views + 1 WHERE domain = ? AND os = ?", [domain, os]);
    }
  } catch (error) {
    console.error("Error during operating_systems:", error.message);
  }
}

module.exports = {
  device,
  browser,
  os,
};
