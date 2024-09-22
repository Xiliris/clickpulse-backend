function generateDateRange(startDate, endDate) {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

  const start = new Date(Date.UTC(startYear, startMonth - 1, startDay));
  const end = new Date(Date.UTC(endYear, endMonth - 1, endDay));

  const dates = [];

  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(new Date(d).toISOString().slice(0, 10));
  }

  return dates;
}

function mergeDataWithDateRange(dates, data, dateKey, valueKeys, defaultValue) {
  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  const dataMap = new Map(
    data.map((item) => [formatDate(item[dateKey]), item])
  );

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

module.exports = { generateDateRange, mergeDataWithDateRange };
