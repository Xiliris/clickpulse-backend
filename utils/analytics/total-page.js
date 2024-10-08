const database = require("../../database/mysql");

async function totalPage(domain, pageViews) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const views = 1;

    const [rows] = await database.query(
      "SELECT * FROM total_page WHERE domain = ? AND date = ?",
      [domain, today]
    );

    if (rows.length === 0) {
      await database.query(
        "INSERT INTO total_page (domain, total_visits, total_page_visits, date) VALUES (?, ?, ?, ?)",
        [domain, views, pageViews, today]
      );
    } else {
      await database.query(
        "UPDATE total_page SET total_visits = total_visits + ?, total_page_visits = total_page_visits + ? WHERE domain = ? AND date = ?",
        [views, pageViews, domain, today]
      );
    }
  } catch (error) {
    console.error("Error during total page:", error.message);
  }
}

module.exports = totalPage;
