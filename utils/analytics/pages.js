const database = require("../../database/mysql");

async function entryPage(domain, path) {
  try {
    const [rows] = await database.query("SELECT * FROM entry_page WHERE domain = ? AND path = ?", [domain, path]);

    if (rows.length === 0) {
      await database.query("INSERT INTO entry_page (domain, path, views, date) VALUES (?, ?, ?, ?)", [
        domain,
        path,
        1,
        new Date().toISOString().slice(0, 10),
      ]);
    } else {
      await database.query("UPDATE entry_page SET views = views + 1 WHERE domain = ? AND path = ?", [domain, path]);
    }
  } catch (error) {
    console.error("Error during entry page:", error.message);
  }
}

async function exitPage(domain, path) {
  try {
    const [rows] = await database.query("SELECT * FROM exit_page WHERE domain = ? AND path = ?", [domain, path]);

    if (rows.length === 0) {
      await database.query("INSERT INTO exit_page (domain, path, views, date) VALUES (?, ?, ?, ?)", [
        domain,
        path,
        1,
        new Date().toISOString().slice(0, 10),
      ]);
    } else {
      await database.query("UPDATE exit_page SET views = views + 1 WHERE domain = ? AND path = ?", [domain, path]);
    }
  } catch (error) {
    console.error("Error during exit page:", error.message);
  }
}

async function visitedPages(domain, path) {
  try {
    const [rows] = await database.query("SELECT * FROM visited_page WHERE domain = ? AND path = ?", [domain, path]);

    if (rows.length === 0) {
      await database.query("INSERT INTO visited_page (domain, path, views, date) VALUES (?, ?, ?, ?)", [
        domain,
        path,
        1,
        new Date().toISOString().slice(0, 10),
      ]);
    } else {
      await database.query("UPDATE visited_page SET views = views + 1 WHERE domain = ? AND path = ?", [domain, path]);
    }
  } catch (error) {
    console.error("Error during visited pages:", error.message);
  }
}

module.exports = {
  entryPage,
  exitPage,
  visitedPages,
};
