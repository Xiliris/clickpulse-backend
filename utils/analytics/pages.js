const database = require("../../database/mysql");

async function trackPageViews(domain, path, table) {
  const date = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await database.query(
      `SELECT * FROM ${table} WHERE domain = ? AND path = ? AND date = ?`,
      [domain, path, date]
    );

    if (rows.length === 0) {
      await database.query(
        `INSERT INTO ${table} (domain, path, views, date) VALUES (?, ?, ?, ?)`,
        [domain, path, 1, date]
      );
    } else {
      await database.query(
        `UPDATE ${table} SET views = views + 1 WHERE domain = ? AND path = ? AND date = ?`,
        [domain, path, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table} tracking:`, error.message);
  }
}

async function entryPage(domain, path) {
  await trackPageViews(domain, path, "entry_page");
}

async function exitPage(domain, path) {
  await trackPageViews(domain, path, "exit_page");
}

async function visitedPages(domain, path) {
  await trackPageViews(domain, path, "visited_page");
}

module.exports = {
  entryPage,
  exitPage,
  visitedPages,
};
