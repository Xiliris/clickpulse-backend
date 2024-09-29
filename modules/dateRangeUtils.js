function generateDateRange(startDate, endDate) {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

  const start = new Date(Date.UTC(startYear, startMonth - 1, startDay)); // Month is 0-based in JavaScript
  const end = new Date(Date.UTC(endYear, endMonth - 1, endDay));

  const dates = [];

  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(new Date(d).toISOString().slice(0, 10)); // 'YYYY-MM-DD' format
  }

  return dates;
}

function mergeDataWithDateRange(dates, data, dateKey, valueKeys, defaultValue) {
  // Convert dateKey to 'YYYY-MM-DD' format for comparison
  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10); // Ensure format is 'YYYY-MM-DD'
  };

  // Create a map with formatted date strings
  const dataMap = new Map(
    data.map((item) => [formatDate(item[dateKey]), item])
  );

  // Merge data with date range
  return dates.map((date) => {
    const item = dataMap.get(date);
    if (item) {
      return {
        date,
        ...Object.fromEntries(valueKeys.map((key) => [key, item[key]])),
      };
    }
    return {
      date,
      ...Object.fromEntries(valueKeys.map((key) => [key, defaultValue])),
    };
  });
}

function standardizeDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDayDate(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

module.exports = {
  generateDateRange,
  mergeDataWithDateRange,
  standardizeDate,
  addDayDate,
};
