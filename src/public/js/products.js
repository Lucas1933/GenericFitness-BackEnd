const limitBtns = Array.from(
  document.getElementById("limitContainer").children
);
const sortingBtns = Array.from(
  document.getElementById("sortingContainer").children
);

limitBtns.forEach((eachBtn) => {
  eachBtn.addEventListener("click", (event) => {
    if (window.location.search.length == 0) {
      const defaultLink =
        window.location.pathname +
        "?" +
        eachBtn.getAttribute("value") +
        "&page=1&sort=undefined";
      eachBtn.setAttribute("href", defaultLink);
    } else {
      const updatedURL = window.location.search.split(/[&]/);
      updatedURL[0] = "?" + eachBtn.getAttribute("value");
      const newLimitLink = window.location.pathname + updatedURL.join("&");
      eachBtn.setAttribute("href", newLimitLink);
    }
  });
});

sortingBtns.forEach((eachBtn) => {
  eachBtn.addEventListener("click", (event) => {
    /* event.preventDefault(); */
    if (window.location.search.length == 0) {
      const defaultLink =
        window.location.pathname +
        "?limit=10&page=1&" +
        eachBtn.getAttribute("value");
      eachBtn.setAttribute("href", defaultLink);
    } else {
      const updatedURL = window.location.search.split(/[&]/);
      updatedURL[updatedURL.length - 1] = eachBtn.getAttribute("value");
      const newSortingLink = window.location.pathname + updatedURL.join("&");
      eachBtn.setAttribute("href", newSortingLink);
    }
  });
});
