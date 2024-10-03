const database = require("../../database/mysql");

async function trackMetric(
  domain,
  value,
  session,
  bounce,
  table,
  column,
  countryCode
) {
  const date = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await database.query(
      `SELECT * FROM ${table} WHERE domain = ? AND ${column} = ? AND date = ?`,
      [domain, value, date]
    );

    if (rows.length === 0) {
      await database.query(
        `INSERT INTO ${table} (domain, ${column}, session_duration, bounce_rate, visits, date, country_code) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [domain, value, session, bounce, 1, date, countryCode]
      );
    } else {
      await database.query(
        `UPDATE ${table} 
           SET visits = visits + 1, 
               session_duration = session_duration + ?, 
               bounce_rate = bounce_rate + ?, 
               country_code = ? 
           WHERE domain = ? AND ${column} = ? AND date = ?`,
        [session, bounce, countryCode, domain, value, date]
      );
    }
  } catch (error) {
    console.error(`Error during ${table} update:`, error.message);
  }
}

async function location(domain, country, session, isBounce, countryCode) {
  await trackMetric(
    domain,
    country,
    session,
    isBounce ? 1 : 0,
    "location",
    "country",
    countryCode
  );
}

module.exports = {
  location,
};
