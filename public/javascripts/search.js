function filterCampgrounds() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const campgrounds = document.querySelectorAll(".card");

  campgrounds.forEach((campground) => {
    const title = campground
      .querySelector(".card-title")
      .innerText.toLowerCase();
    const description = campground
      .querySelector(".card-text")
      .innerText.toLowerCase();
    const location = campground
      .querySelector(".text-muted")
      .innerText.toLowerCase();

    if (
      title.includes(searchInput) ||
      description.includes(searchInput) ||
      location.includes(searchInput)
    ) {
      campground.style.display = "block";
    } else {
      campground.style.display = "none";
    }
  });
}

document
  .getElementById("searchInput")
  .addEventListener("input", filterCampgrounds);
