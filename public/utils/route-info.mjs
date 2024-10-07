const route_data = {
  domain: window.location.hostname, // Store the domain
  visited_pages: [], // To keep track of visited pages
  entry_page: window.location.pathname, // Set the entry page
  exit_page: "", // To be set on page unload
};

// Log current path
const logPath = () => {
  const path = window.location.pathname;
  console.log(`Path: ${path}`);

  // Add path to visited pages if it's not already there
  if (!data.visited_pages.includes(path)) {
    data.visited_pages.push(path);
  }
};

// Initialize visited pages
logPath();

// Listen for changes to history state
window.addEventListener("popstate", () => {
  logPath();
});

// Override pushState and replaceState to track page changes
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

// Set exit_page on beforeunload
window.addEventListener("beforeunload", () => {
  data.exit_page = window.location.pathname;
  console.log("Data on unload:", route_data);
});

// Export data
export default route_info;
