/* ACTIVATE WEBSITE */

const router = require("express").Router();
router.post("/", async (req, res) => {
  const data = {
    domain: req.body.domain,
    entry_page: req.body.entry_page,
    exit_page: req.body.exit_page,
    visited_pages: req.body.visited_pages,
    ip: req.body.ip,
    country: req.body.country,
    country_code: req.body.country_code,
    os: req.body.os,
    browser: req.body.browser,
    device: req.body.device,
    session_duration: req.body.session_duration,
    bounce_rate: req.body.bounce_rate,
  };

  console.table(data);
});

module.exports = router;
