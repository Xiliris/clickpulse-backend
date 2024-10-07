import { os, browser, device } from "./utils/browser-info.mjs";
import unique from "./utils/unique.mjs";
import fetchLocationInfo from "./utils/location-info.mjs";

const data = {
  domain: null,
  unique: null,

  entry_page: null,
  exit_page: null,
  visited_pages: [],

  ip: null,
  country: null,
  country_code: null,

  os: null,
  browser: null,
  device: null,

  session_duration: null,
  session_start: null,
  session_end: null,
  bounce_rate: false,

  referrer: document.referrer,

  buttons: [],
  anchors: [],
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Clickpulse script loaded!");
  document.addEventListener("click", (event) => {
    const clickedElement = event.target.closest("a, button");

    if (clickedElement) {
      const tagName = clickedElement.tagName;
      const storeId = tagName === "BUTTON" ? "buttons" : "anchors";
      const innerText = clickedElement.innerText.trim();
      const id = clickedElement.id || null;

      const existingEntry = data[storeId].find(
        (entry) => entry.id === id && entry.content === innerText
      );

      if (existingEntry) {
        existingEntry.clicks++;
      } else {
        data[storeId].push({
          id: id,
          content: innerText,
          clicks: 1,
        });
      }
    }
  });

  const locationInfo = await fetchLocationInfo();
  const { protocol, hostname } = window.location;
  const port = window.location.port ? `:${window.location.port}` : "";

  data.domain = `${protocol}//${hostname}${port}`;
  data.unique = unique();

  data.entry_page = window.location.pathname;

  data.ip = locationInfo.ip;
  data.country = locationInfo.country;
  data.country_code = locationInfo.country_code;

  data.os = os;
  data.browser = browser;
  data.device = device;

  data.session_start = Date.now();

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function (...args) {
    originalPushState.apply(window.history, args);
    logPath();
  };

  window.history.replaceState = function (...args) {
    originalReplaceState.apply(window.history, args);
    logPath();
  };

  window.addEventListener("popstate", () => {
    logPath();
  });
});

window.addEventListener("beforeunload", () => {
  data.session_end = Date.now();

  const session_duration = (data.session_end - data.session_start) / 1000;

  if (session_duration < 15) {
    data.bounce_rate = true;
  }

  data.session_duration = session_duration;

  delete data.session_start;
  delete data.session_end;

  data.exit_page = window.location.pathname;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "https://api.clickpulse.xyz/dashboard/collect",
      JSON.stringify(data)
    );
  } else {
    fetch("https://api.clickpulse.xyz/dashboard/collect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
});

const logPath = () => {
  const path = window.location.pathname;

  if (!data.visited_pages.includes(path)) {
    data.visited_pages.push(path);
  }
};
