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

const logPath = () => {
  const path = window.location.pathname;
  if (!data.visited_pages.includes(path)) {
    data.visited_pages.push(path);
  }
};

const trackClicks = (event) => {
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
      data[storeId].push({ id: id, content: innerText, clicks: 1 });
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Clickpulse script loaded!");
  document.addEventListener("click", trackClicks);

  try {
    const locationInfo = await fetchLocationInfo();
    data.ip = locationInfo.ip;
    data.country = locationInfo.country;
    data.country_code = locationInfo.country_code;
  } catch (error) {
    console.error("Failed to fetch location info:", error);
  }

  const { protocol, hostname } = window.location;
  const port = window.location.port ? `:${window.location.port}` : "";
  data.domain = `${protocol}//${hostname}`;
  data.entry_page = window.location.pathname;
  data.os = os;
  data.browser = browser;
  data.device = device;
  data.unique = unique();
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

  console.log(data);

  window.addEventListener("popstate", logPath);
});

window.addEventListener("beforeunload", () => {
  data.session_end = Date.now();
  const session_duration = (data.session_end - data.session_start) / 1000;

  data.bounce_rate = data.visited_pages.length === 1 && session_duration < 15;
  data.session_duration = session_duration;
  delete data.session_start;
  delete data.session_end;
  data.exit_page = window.location.pathname;

  const sendData = async () => {
    try {
      const response = await fetch("https://api.clickpulse.xyz/dashboard/collect", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error("Failed to send data:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  sendData();
});
