// Function to get the OS
function getOS(userAgent) {
  if (/Windows NT 10.0/.test(userAgent)) {
    return "Windows 10";
  } else if (/Windows NT 6.2/.test(userAgent)) {
    return "Windows 8";
  } else if (/Windows NT 6.1/.test(userAgent)) {
    return "Windows 7";
  } else if (/Mac OS X/.test(userAgent)) {
    return "Mac OS X";
  } else if (/Linux/.test(userAgent)) {
    return "Linux";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else if (/iPhone/.test(userAgent)) {
    return "iOS";
  }
  return "Unknown OS";
}

// Function to get the Browser
function getBrowser(userAgent) {
  if (/Chrome/.test(userAgent) && !/Edge/.test(userAgent)) {
    return "Chrome";
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    return "Safari";
  } else if (/Firefox/.test(userAgent)) {
    return "Firefox";
  } else if (/MSIE|Trident/.test(userAgent)) {
    return "Internet Explorer";
  } else if (/Edge/.test(userAgent)) {
    return "Edge";
  }
  return "Unknown Browser";
}

// Function to get the Device
function getDevice(userAgent) {
  if (/Mobi/.test(userAgent)) {
    return "Mobile";
  }
  return "Desktop";
}

const userAgent = navigator.userAgent;

export const os = getOS(userAgent);
export const browser = getBrowser(userAgent);
export const device = getDevice(userAgent);
