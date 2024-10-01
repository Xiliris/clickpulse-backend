const {
  entryPage,
  exitPage,
  visitedPages,
} = require("../../utils/analytics/pages");
const { os, browser, device } = require("../../utils/analytics/client");
const {
  bounce_rate,
  session_duration,
} = require("../../utils/analytics/engagement");
const totalPage = require("../../utils/analytics/total-page");

const router = require("express").Router();
router.post("/", async (req, res) => {
  console.log("HIT");
  const data = {
    domain: req.body.domain,
    unique: req.body.unique,
    entry_page: req.body.entry_page,
    exit_page: req.body.exit_page,
    visited_pages: req.body.visited_pages || [],
    ip: req.body.ip,
    country: req.body.country,
    country_code: req.body.country_code,
    os: req.body.os,
    browser: req.body.browser,
    device: req.body.device,
    session_duration: req.body.session_duration,
    bounce_rate: req.body.bounce_rate,
  };

  /*if (data.unique) return;
   */
  try {
    await entryPage(
      data.domain,
      data.entry_page,
      data.session_duration,
      data.bounce_rate
    );
    await exitPage(
      data.domain,
      data.exit_page,
      data.session_duration,
      data.bounce_rate
    );
    await os(data.domain, data.os, data.session_duration, data.bounce_rate);
    await browser(
      data.domain,
      data.browser,
      data.session_duration,
      data.bounce_rate
    );
    await device(
      data.domain,
      data.device,
      data.session_duration,
      data.bounce_rate
    );
    await bounce_rate(data.domain, data.bounce_rate);
    await session_duration(data.domain, data.session_duration);
    await totalPage(data.domain, data.visited_pages.length + 1);

    if (data.visited_pages.length === 0) {
      await visitedPages(
        data.domain,
        data.entry_page,
        data.session_duration,
        data.bounce_rate
      );
    } else {
      for (const visitedPage of data.visited_pages) {
        if (visitedPage) {
          await visitedPages(
            data.domain,
            visitedPage,
            data.session_duration,
            data.bounce_rate
          );
        }
      }
    }

    res.status(200).send("Data processed");
  } catch (error) {
    console.error("Error processing data:", error.message);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
