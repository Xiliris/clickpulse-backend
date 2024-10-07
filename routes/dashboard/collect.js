const { activateWebsite } = require("../../utils/analytics/activate-website");

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
    unique: req.body.unique,
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

  if (data.unique) return;
  if (!data.domain) return;
  await activateWebsite(data.domain);

  try {
    await location(
      data.domain,
      data.country,
      data.session_duration,
      data.bounce_rate,
      data.country_code
    );

    await entryPage(
      data.domain,
      data.entry_page,
      data.session_duration / data.visited_pages.length,
      data.bounce_rate
    );
    await exitPage(
      data.domain,
      data.exit_page,
      data.session_duration / data.visited_pages.length,
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
    await referrer(
      data.domain,
      data.referrer,
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
        data.session_duration / (data.visited_pages.length + 1),
        data.bounce_rate
      );
    } else {
      for (const visitedPage of data.visited_pages) {
        if (visitedPage) {
          await visitedPages(
            data.domain,
            visitedPage,
            data.session_duration / (data.visited_pages.length + 1),
            data.bounce_rate
          );
        }
      }
    }

    if (Array.isArray(data.buttons)) {
      for (const button of data.buttons) {
        await buttons(
          data.domain,
          button.elementId,
          button.content,
          button.clicks
        );
      }
    }

    if (Array.isArray(data.anchors)) {
      for (const anchor of data.anchors) {
        await anchors(
          data.domain,
          anchor.elementId,
          anchor.content,
          anchor.clicks
        );
      }
    }

    res.status(200).send("Data processed");
  } catch (error) {
    console.error("Error processing data:", error.message);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
