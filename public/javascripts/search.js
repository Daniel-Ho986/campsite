// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById("searchInput").addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//       const searchQuery = e.target.value.trim();
//       fetchCampgrounds(searchQuery);
//     }
//   });

//   function fetchCampgrounds(query = "", page = 1) {
//     const url = query ? `/campgrounds/search?query=${query}&page=${page}` : `/campgrounds?page=${page}`;

//     fetch(url, {
//       headers: {
//         'X-Requested-With': 'XMLHttpRequest'
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         const campgroundContainer = document.getElementById("campground-container");
//         const paginationContainer = document.getElementById('pagination-container');
//         campgroundContainer.innerHTML = "";

//         if (data.campgrounds.length > 0) {
//           data.campgrounds.forEach((campground, index) => {
//             const col = document.createElement("div");
//             col.className = "campground-col col-lg-4 col-md-6 col-sm-12 mb-3 d-flex justify-content-center";
//             col.innerHTML = `
//               <div class="card loading" style="width: 18rem">
//                 <a class="img-link" href="campgrounds/${campground._id}">
//                   <img class="index-img card-img-top" src="${campground.images.length ? campground.images[0].url : '/images/defaultImage.jpg'}" alt="${campground.title} Image 1" />
//                 </a>
//                 <div class="card-body">
//                   <a class="title-link" href="campgrounds/${campground._id}">
//                     <h5 class="card-title">${campground.title}</h5>
//                   </a>
//                   <p class="card-text">${campground.description.substring(0, 100)}...</p>
//                   <p class="card-text"><small class="text-muted">${campground.location}</small></p>
//                 </div>
//               </div>
//             `;
//             campgroundContainer.appendChild(col);
//             setTimeout(() => {
//               col.querySelector(".card").classList.remove("loading");
//             }, (index + 1) * 500);
//           });

//           paginationContainer.style.display = 'block'; // Show pagination
//           updatePagination(data.totalPages, page, query);
//         } else {
//           const noResult = document.createElement("div");
//           noResult.className = "col-12";
//           noResult.innerHTML = `<p>No campgrounds found</p>`;
//           campgroundContainer.appendChild(noResult);

//           paginationContainer.style.display = 'none'; // Hide pagination
//         }
//       })
//       .catch(error => console.error("Error fetching campgrounds:", error));
//   }

//   function updatePagination(totalPages, currentPage, query) {
//     const paginationContainer = document.getElementById('pagination-container');
//     if (!paginationContainer) {
//       console.error('Pagination container not found');
//       return;
//     }

//     paginationContainer.innerHTML = ''; // Ensure the container is empty before adding new content

//     const ul = document.createElement('ul');
//     ul.className = 'pagination justify-content-center';

//     // Previous button
//     const previousPageItem = document.createElement('li');
//     previousPageItem.className = `page-item ${currentPage > 1 ? '' : 'disabled'}`;
//     const previousPageLink = document.createElement('a');
//     previousPageLink.className = 'page-link';
//     previousPageLink.href = `?page=${currentPage - 1}`;
//     previousPageLink.textContent = 'Previous';
//     previousPageLink.addEventListener('click', function (e) {
//       e.preventDefault();
//       if (currentPage > 1) {
//         fetchCampgrounds(query, currentPage - 1);
//       }
//     });

//     previousPageItem.appendChild(previousPageLink);
//     ul.appendChild(previousPageItem);

//     // Page numbers
//     for (let i = 1; i <= totalPages; i++) {
//       const pageItem = document.createElement('li');
//       pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
//       const pageLink = document.createElement('a');
//       pageLink.className = 'page-link';
//       pageLink.href = `#`;
//       pageLink.textContent = i;
//       pageLink.addEventListener('click', function (e) {
//         e.preventDefault();
//         fetchCampgrounds(query, i);
//       });

//       pageItem.appendChild(pageLink);
//       ul.appendChild(pageItem);
//     }

//     // Next button
//     const nextPageItem = document.createElement('li');
//     nextPageItem.className = `page-item ${currentPage < totalPages ? '' : 'disabled'}`;
//     const nextPageLink = document.createElement('a');
//     nextPageLink.className = 'page-link';
//     nextPageLink.href = `?page=${currentPage + 1}`;
//     nextPageLink.textContent = 'Next';
//     nextPageLink.addEventListener('click', function (e) {
//       e.preventDefault();
//       if (currentPage < totalPages) {
//         fetchCampgrounds(query, currentPage + 1);
//       }
//     });

//     nextPageItem.appendChild(nextPageLink);
//     ul.appendChild(nextPageItem);

//     paginationContainer.appendChild(ul);
//   }
// });


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("searchInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const searchQuery = e.target.value.trim();
      fetchCampgrounds(searchQuery);
    }
  });

  function fetchCampgrounds(query = "", page = 1) {
    const url = query ? `/campgrounds/search?query=${query}&page=${page}` : `/campgrounds?page=${page}`;

    fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .then(data => {
        const campgroundContainer = document.getElementById("campground-container");
        const paginationContainer = document.getElementById('pagination-container');
        campgroundContainer.innerHTML = "";

        if (data.campgrounds.length > 0) {
          data.campgrounds.forEach((campground, index) => {
            const col = document.createElement("div");
            col.className = "campground-col col-lg-4 col-md-6 col-sm-12 mb-3 d-flex justify-content-center";
            col.innerHTML = `
              <div class="card loading" style="width: 18rem">
                <a class="img-link" href="campgrounds/${campground._id}">
                  <img class="index-img card-img-top" src="${campground.images.length ? campground.images[0].url : '/images/defaultImage.jpg'}" alt="${campground.title} Image 1" />
                </a>
                <div class="card-body">
                  <a class="title-link" href="campgrounds/${campground._id}">
                    <h5 class="card-title">${campground.title}</h5>
                  </a>
                  <p class="card-text">${campground.description.substring(0, 100)}...</p>
                  <p class="card-text"><small class="text-muted">${campground.location}</small></p>
                </div>
              </div>
            `;
            campgroundContainer.appendChild(col);
            setTimeout(() => {
              col.querySelector(".card").classList.remove("loading");
            }, (index + 1) * 500);
          });

          paginationContainer.style.display = 'block'; // Show pagination
          updatePagination(data.totalPages, page, query);
        } else {
          const noResult = document.createElement("div");
          noResult.className = "col-12 text-center";
          noResult.innerHTML = `<p class="no-campgrounds">No campgrounds found</p>`;
          campgroundContainer.appendChild(noResult);

          paginationContainer.style.display = 'none'; // Hide pagination
        }
      })
      .catch(error => console.error("Error fetching campgrounds:", error));
  }

  function updatePagination(totalPages, currentPage, query) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
      console.error('Pagination container not found');
      return;
    }

    paginationContainer.innerHTML = ''; // Ensure the container is empty before adding new content

    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';

    // Previous button
    const previousPageItem = document.createElement('li');
    previousPageItem.className = `page-item ${currentPage > 1 ? '' : 'disabled'}`;
    const previousPageLink = document.createElement('a');
    previousPageLink.className = 'page-link';
    previousPageLink.href = `?page=${currentPage - 1}`;
    previousPageLink.textContent = 'Previous';
    previousPageLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        fetchCampgrounds(query, currentPage - 1);
      }
    });

    previousPageItem.appendChild(previousPageLink);
    ul.appendChild(previousPageItem);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement('li');
      pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
      const pageLink = document.createElement('a');
      pageLink.className = 'page-link';
      pageLink.href = `#`;
      pageLink.textContent = i;
      pageLink.addEventListener('click', function (e) {
        e.preventDefault();
        fetchCampgrounds(query, i);
      });

      pageItem.appendChild(pageLink);
      ul.appendChild(pageItem);
    }

    // Next button
    const nextPageItem = document.createElement('li');
    nextPageItem.className = `page-item ${currentPage < totalPages ? '' : 'disabled'}`;
    const nextPageLink = document.createElement('a');
    nextPageLink.className = 'page-link';
    nextPageLink.href = `?page=${currentPage + 1}`;
    nextPageLink.textContent = 'Next';
    nextPageLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        fetchCampgrounds(query, currentPage + 1);
      }
    });

    nextPageItem.appendChild(nextPageLink);
    ul.appendChild(nextPageItem);

    paginationContainer.appendChild(ul);
  }
});
