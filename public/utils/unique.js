function unique() {
  const storedItem = window.localStorage.getItem("unique");

  if (storedItem) {
    const { value, timestamp } = JSON.parse(storedItem);
    const now = new Date().getTime();

    if (now - timestamp < 24 * 60 * 60 * 1000) {
      return true;
    } else {
      window.localStorage.removeItem("unique");
    }
  }

  const newItem = {
    value: true,
    timestamp: new Date().getTime(),
  };

  window.localStorage.setItem("unique", JSON.stringify(newItem));
  return false;
}

export default unique;
