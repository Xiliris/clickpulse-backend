const { activateWebsite } = require("../../utils/analytics/activate-website");
const database = require('../../database/mysql');

const {
  entryPage,
  exitPage,
  visitedPages,
} = require("../../utils/analytics/pages");
const {
  os,
  browser,
  device,
  referrer,
} = require("../../utils/analytics/client");
const {
  bounce_rate,
  session_duration,
} = require("../../utils/analytics/engagement");

const totalPage = require("../../utils/analytics/total-page");

const { anchors, buttons } = require("../../utils/analytics/clicks");
const { location } = require("../../utils/analytics/location");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const data = {
    domain: req.body.domain,
    entry_page: req.body.entry_page || "/",
    exit_page: req.body.exit_page || "/",
    visited_pages: req.body.visited_pages || [],
    ip: req.body.ip || "0.0.0.0",
    country: req.body.country || "Unknown Country",
    country_code: req.body.country_code || "XX",
    os: req.body.os || "Not set",
    browser: req.body.browser || "Not set",
    device: req.body.device || "Not set",
    session_duration: req.body.session_duration || 0,
    bounce_rate: req.body.bounce_rate || true,
    buttons: req.body.buttons || [],
    anchors: req.body.anchors || [],
    referrer: req.body.referrer || "Direct / None",
  };

  if (!data.domain) return res.status(401).send("Domain is missing");

  try {
    await database.query('INSERT INTO temp_logs (message) VALUES (?)', [data])

    await res.status(204).json(data);

    await location(
      data.domain,
      data.country,
      data.session_duration,
      data.bounce_rate,
      data.country_code
    );

    const pageVisitDuration =
      data.visited_pages.length > 0
        ? data.session_duration / data.visited_pages.length
        : data.session_duration;

    // Entry and Exit pages
    await entryPage(
      data.domain,
      data.entry_page,
      pageVisitDuration,
      data.bounce_rate
    );
    await exitPage(
      data.domain,
      data.exit_page,
      pageVisitDuration,
      data.bounce_rate
    );

    // Client information
    await os(data.domain, data.os, pageVisitDuration, data.bounce_rate);
    await browser(
      data.domain,
      data.browser,
      pageVisitDuration,
      data.bounce_rate
    );
    await device(data.domain, data.device, pageVisitDuration, data.bounce_rate);
    await referrer(
      data.domain,
      data.referrer,
      pageVisitDuration,
      data.bounce_rate
    );

    // Engagement data
    await bounce_rate(data.domain, data.bounce_rate);
    await session_duration(data.domain, data.session_duration);
    await totalPage(data.domain, data.visited_pages.length + 1);

    // Visited Pages
    if (data.visited_pages.length === 0) {
      await visitedPages(
        data.domain,
        data.entry_page,
        pageVisitDuration,
        data.bounce_rate
      );
    } else {
      const visitedPagesPromises = data.visited_pages.map((visitedPage) => {
        if (visitedPage) {
          return visitedPages(
            data.domain,
            visitedPage,
            pageVisitDuration,
            data.bounce_rate
          );
        }
      });
      await Promise.all(visitedPagesPromises);
    }

    // Buttons
    if (Array.isArray(data.buttons)) {
      const buttonPromises = data.buttons.map((button) =>
        buttons(data.domain, button.id, button.content, button.clicks)
      );
      await Promise.all(buttonPromises);
    }

    // Anchors
    if (Array.isArray(data.anchors)) {
      const anchorPromises = data.anchors.map((anchor) =>
        anchors(data.domain, anchor.id, anchor.content, anchor.clicks)
      );
      await Promise.all(anchorPromises);
    }
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
