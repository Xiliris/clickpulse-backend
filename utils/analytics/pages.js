const database = require("../../database/mysql");

async function trackPageViews(
  domain,
  path,
  sessionDuration,
  bounceRate,
  table
) {
  const date = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await database.query(
      `SELECT * FROM ?? WHERE domain = ? AND path = ? AND date = ?`,
      [table, domain, path, date]
    );

    if (rows.length === 0) {
      await database.query(
        `INSERT INTO ?? (domain, path, views, session_duration, bounce_rate, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [table, domain, path, 1, sessionDuration, bounceRate, date]
      );
    } else {
      await database.query(
        `UPDATE ?? 
         SET views = views + 1, 
             session_duration = session_duration + ?, 
             bounce_rate = bounce_rate + ?
         WHERE domain = ? AND path = ? AND date = ?`,
        [table, sessionDuration, bounceRate, domain, path, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table} tracking:`, error.message);
  }
}

async function entryPage(domain, path, sessionDuration, bounceRate) {
  await trackPageViews(domain, path, sessionDuration, bounceRate, "entry_page");
}

async function exitPage(domain, path, sessionDuration, bounceRate) {
  await trackPageViews(domain, path, sessionDuration, bounceRate, "exit_page");
}

async function visitedPages(domain, path, sessionDuration, bounceRate) {
  await trackPageViews(
    domain,
    path,
    sessionDuration,
    bounceRate,
    "visited_page"
  );
}

module.exports = {
  entryPage,
  exitPage,
  visitedPages,
};
