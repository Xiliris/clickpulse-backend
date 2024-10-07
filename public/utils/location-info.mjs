// locationInfo.js
export async function fetchIPAddress() {
  const response = await fetch("https://api.ipify.org?format=json");
  if (!response.ok) {
    throw new Error(`Failed to fetch IP address: ${response.statusText}`);
  }
  const data = await response.json();
  return data.ip;
}

export async function fetchLocationData(ip) {
  const response = await fetch(`https://api.iplocation.net/?ip=${ip}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch location data: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchLocationInfo() {
  const ip = await fetchIPAddress();
  const locationData = await fetchLocationData(ip);
  return {
    ip,
    country: locationData.country_name,
    country_code: locationData.country_code2,
  };
}

export default fetchLocationInfo;
