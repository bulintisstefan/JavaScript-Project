const API_URL = "http://localhost:3000/games";

const modalEditBtn = document.getElementById("modalEditBtn");
const gameCardTemplate = document.getElementById("gameCardTemplate");

const gamesContainer = document.getElementById("gamesContainer");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const noResultsEl = document.getElementById("noResults");

const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const platformFilter = document.getElementById("platformFilter");
const sortSelect = document.getElementById("sortSelect");

const modal = document.getElementById("gameModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalGenre = document.getElementById("modalGenre");
const modalYear = document.getElementById("modalYear");
const modalPlatforms = document.getElementById("modalPlatforms");
const modalStars = document.getElementById("modalStars");
const modalRatingValue = document.getElementById("modalRatingValue");
const modalRatingCount = document.getElementById("modalRatingCount");
const modalDescription = document.getElementById("modalDescription");
const modalLink = document.getElementById("modalLink");
const modalTrailerBtn = document.getElementById("modalTrailerBtn");
const modalTrailerWrapper = document.getElementById("modalTrailerWrapper");
const modalTrailer = document.getElementById("modalTrailer");

const addGameBtn = document.getElementById("addGameBtn");
const addModal = document.getElementById("addModal");
const addModalBackdrop = document.getElementById("addModalBackdrop");
const addModalClose = document.getElementById("addModalClose");
const addForm = document.getElementById("addForm");
const addTitle = document.getElementById("addTitle");
const addGenre = document.getElementById("addGenre");
const addYear = document.getElementById("addYear");
const addPlatforms = document.getElementById("addPlatforms");
const addStock = document.getElementById("addStock");
const addImage = document.getElementById("addImage");
const addLink = document.getElementById("addLink");
const addDescription = document.getElementById("addDescription");
const addCancelBtn = document.getElementById("addCancelBtn");
const addStatus = document.getElementById("addStatus");

const editModal = document.getElementById("editModal");
const editModalBackdrop = document.getElementById("editModalBackdrop");
const editModalClose = document.getElementById("editModalClose");
const editForm = document.getElementById("editForm");
const editTitle = document.getElementById("editTitle");
const editGenre = document.getElementById("editGenre");
const editYear = document.getElementById("editYear");
const editPlatforms = document.getElementById("editPlatforms");
const editStock = document.getElementById("editStock");
const editImage = document.getElementById("editImage");
const editLink = document.getElementById("editLink");
const editDescription = document.getElementById("editDescription");
const editCancelBtn = document.getElementById("editCancelBtn");
const editStatus = document.getElementById("editStatus");

let allGames = [];
let filteredGames = [];
let currentGame = null;
let currentEditedGame = null;

function fetchGames() {
  fetch(API_URL)
    .then(function (res) {
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }
      return res.json();
    })
    .then(function (data) {
      if (Array.isArray(data)) {
        allGames = data;
      } else {
        allGames = data.games || [];
      }
      filteredGames = allGames.slice();
      populateFilters(allGames);
      renderGames(filteredGames);
    })
    .catch(function () {
      errorEl.style.display = "block";
    })
    .finally(function () {
      loadingEl.style.display = "none";
    });
}

function populateFilters(games) {
  const genres = {};
  const platforms = {};

  for (let i = 0; i < games.length; i++) {
    const g = games[i];

    if (g.genre) {
      genres[g.genre] = true;
    }

    if (Array.isArray(g.platforms)) {
      for (let j = 0; j < g.platforms.length; j++) {
        platforms[g.platforms[j]] = true;
      }
    }
  }

  const genreList = Object.keys(genres).sort();
  const platformList = Object.keys(platforms).sort();

  for (let i = 0; i < genreList.length; i++) {
    const opt = document.createElement("option");
    opt.value = genreList[i];
    opt.textContent = genreList[i];
    genreFilter.appendChild(opt);
  }

  for (let i = 0; i < platformList.length; i++) {
    const opt = document.createElement("option");
    opt.value = platformList[i];
    opt.textContent = platformList[i];
    platformFilter.appendChild(opt);
  }
}

function renderGames(games) {
  gamesContainer.innerHTML = "";

  if (games.length === 0) {
    noResultsEl.style.display = "block";
    return;
  } else {
    noResultsEl.style.display = "none";
  }

  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    const fragment = gameCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".game-card");

    let ratingValue = null;
    if (game.rating && game.rating.mean !== undefined) {
      ratingValue = game.rating.mean;
    }
    const ratingPct = ratingValue ? Math.round(ratingValue * 100) : null;
    const ratingCount = ratingValue ? game.rating.count : null;

    const imgEl = card.querySelector(".game-img");
    imgEl.src = sanitize(game.image);
    imgEl.alt = escapeHtml(game.title);

    const titleEl = card.querySelector(".game-title");
    titleEl.textContent = game.title || "";

    const genreEl = card.querySelector(".game-genre");
    genreEl.textContent = game.genre || "N/A";

    const yearEl = card.querySelector(".game-year");
    yearEl.textContent = game.year || "-";

    const platformsTextEl = card.querySelector(".game-platforms-text");
    if (Array.isArray(game.platforms)) {
      platformsTextEl.textContent = game.platforms.join(", ");
    } else {
      platformsTextEl.textContent = "N/A";
    }

    const ratingChip = card.querySelector(".game-rating-chip");
    const ratingPctSpan = card.querySelector(".game-rating-pct");
    const ratingCountSmall = card.querySelector(".game-rating-count");

    if (ratingValue) {
      ratingChip.style.display = "flex";
      ratingPctSpan.textContent = ratingPct + "%";
      ratingCountSmall.textContent = formatCount(ratingCount);
    } else {
      ratingChip.style.display = "none";
    }

    const badgesRow = card.querySelector(".badges-row");
    badgesRow.innerHTML = "";

    if (Array.isArray(game.platforms)) {
      for (let p = 0; p < game.platforms.length; p++) {
        const span = document.createElement("span");
        span.className = "badge badge-platform";
        span.textContent = game.platforms[p];
        badgesRow.appendChild(span);
      }
    }

    if (ratingValue) {
      const scoreSpan = document.createElement("span");
      scoreSpan.className = "badge badge-outline";
      scoreSpan.textContent = "Score: " + ratingPct + "%";
      badgesRow.appendChild(scoreSpan);
    }

    const deleteBtn = card.querySelector(".card-delete-btn");
    deleteBtn.setAttribute("data-id", game.id);

    card.addEventListener("click", (function (g) {
      return function () {
        openModal(g);
      };
    })(game));

    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = this.getAttribute("data-id");
      handleDeleteGame(id);
    });

    gamesContainer.appendChild(fragment);
  }
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const genre = genreFilter.value;
  const platform = platformFilter.value;
  const sortBy = sortSelect.value;

  filteredGames = [];

  for (let i = 0; i < allGames.length; i++) {
    const g = allGames[i];

    let matchesSearch = false;
    if (
      searchTerm === "" ||
      (g.title && g.title.toLowerCase().includes(searchTerm)) ||
      (g.genre && g.genre.toLowerCase().includes(searchTerm))
    ) {
      matchesSearch = true;
    }

    if (!matchesSearch && Array.isArray(g.platforms)) {
      for (let j = 0; j < g.platforms.length; j++) {
        if (g.platforms[j].toLowerCase().includes(searchTerm)) {
          matchesSearch = true;
          break;
        }
      }
    }

    const matchesGenre = genre === "" || g.genre === genre;
    const matchesPlatform =
      platform === "" ||
      (Array.isArray(g.platforms) && g.platforms.indexOf(platform) !== -1);

    if (matchesSearch && matchesGenre && matchesPlatform) {
      filteredGames.push(g);
    }
  }

  if (sortBy === "ratingDesc") {
    filteredGames.sort(function (a, b) {
      const aa = a.rating ? a.rating.mean : 0;
      const bb = b.rating ? b.rating.mean : 0;
      return bb - aa;
    });
  }

  if (sortBy === "yearDesc") {
    filteredGames.sort(function (a, b) {
      return (b.year || 0) - (a.year || 0);
    });
  }

  if (sortBy === "yearAsc") {
    filteredGames.sort(function (a, b) {
      return (a.year || 0) - (b.year || 0);
    });
  }

  renderGames(filteredGames);
}

function openModal(game) {
  currentGame = game;

  modalImage.src = sanitize(game.image);
  modalTitle.textContent = game.title;
  modalGenre.textContent = game.genre || "Gen necunoscut";

  if (game.year) {
    modalYear.textContent = "Lansat în " + game.year;
  } else {
    modalYear.textContent = "An necunoscut";
  }

  if (Array.isArray(game.platforms)) {
    modalPlatforms.textContent = game.platforms.join(", ");
  } else {
    modalPlatforms.textContent = "Platforme necunoscute";
  }

  modalStars.innerHTML = "";

  if (game.rating && game.rating.mean !== undefined) {
    const starsValue = game.rating.mean * 5;
    const fullStars = Math.round(starsValue);

    for (let i = 1; i <= 5; i++) {
      const span = document.createElement("span");
      if (i <= fullStars) span.className = "star filled";
      else span.className = "star empty";
      span.textContent = "★";
      modalStars.appendChild(span);
    }

    modalRatingValue.textContent =
      Math.round(game.rating.mean * 100) + "% score";
    modalRatingCount.textContent = game.rating.count + " reviews";
  } else {
    modalRatingValue.textContent = "Fără rating";
    modalRatingCount.textContent = "";
  }

  modalDescription.textContent =
    game.description || "Nu există o descriere disponibilă.";

  modalLink.href = game.link || "#";

  let trailerUrl = null;
  if (game.video) {
    if (game.video.gameplay) trailerUrl = game.video.gameplay;
    else if (game.video.micro_trailer) trailerUrl = game.video.micro_trailer;
  }

  if (trailerUrl) {
    modalTrailerWrapper.style.display = "none";
    modalTrailerBtn.style.display = "inline-flex";
    modalTrailerBtn.onclick = function () {
      modalTrailerWrapper.style.display = "block";
      modalTrailer.src = trailerUrl;
    };
  } else {
    modalTrailerWrapper.style.display = "none";
    modalTrailerBtn.style.display = "none";
    modalTrailer.src = "";
  }

  modalEditBtn.onclick = function () {
    openEditModal(game);
  };

  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  modalTrailer.src = "";
}

function openEditModal(game) {
  currentEditedGame = game;

  editTitle.value = game.title || "";
  editGenre.value = game.genre || "";
  editYear.value = game.year || "";
  editPlatforms.value = Array.isArray(game.platforms)
    ? game.platforms.join(", ")
    : "";
  editStock.value = game.stock || 0;
  editImage.value = game.image || "";
  editLink.value = game.link || "";
  editDescription.value = game.description || "";

  editStatus.style.display = "none";
  editModal.classList.add("show");
}

function closeEditModal() {
  editModal.classList.remove("show");
  currentEditedGame = null;
}

editModalBackdrop.addEventListener("click", closeEditModal);
editModalClose.addEventListener("click", closeEditModal);
editCancelBtn.addEventListener("click", closeEditModal);

editForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentEditedGame) return;

  const updatedGame = {
    id: currentEditedGame.id,
    title: editTitle.value,
    genre: editGenre.value,
    year: Number(editYear.value),
    platforms: editPlatforms.value.split(",").map(function (p) {
      return p.trim();
    }),
    stock: Number(editStock.value),
    image: editImage.value,
    link: editLink.value,
    description: editDescription.value,
    rating: currentEditedGame.rating,
    video: currentEditedGame.video,
  };

  fetch(API_URL + "/" + currentEditedGame.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedGame),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (saved) {
      for (let i = 0; i < allGames.length; i++) {
        if (allGames[i].id === saved.id) {
          allGames[i] = saved;
          break;
        }
      }

      applyFilters();

      if (currentGame && currentGame.id === saved.id) {
        openModal(saved);
      }

      editStatus.style.display = "block";
      editStatus.textContent = "Salvat!";
      setTimeout(closeEditModal, 600);
    })
    .catch(function () {
      editStatus.style.display = "block";
      editStatus.textContent = "Eroare!";
    });
});

function handleDeleteGame(gameId) {
  let game = null;
  for (let i = 0; i < allGames.length; i++) {
    if (allGames[i].id === gameId) {
      game = allGames[i];
      break;
    }
  }

  const title = game ? game.title : "acest joc";
  const confirmDelete = confirm("Sigur vrei să ștergi '" + title + "'?");
  if (!confirmDelete) return;

  fetch(API_URL + "/" + gameId, {
    method: "DELETE",
  })
    .then(function (res) {
      if (!res.ok) {
        throw new Error("HTTP Error");
      }

      allGames = allGames.filter(function (g) {
        return g.id !== gameId;
      });

      applyFilters();

      if (currentGame && currentGame.id === gameId) {
        closeModal();
      }
    })
    .catch(function () {
      alert("Eroare la ștergere!");
    });
}

function openAddModal() {
  addForm.reset();
  addStock.value = 3;
  addStatus.style.display = "none";
  addModal.classList.add("show");
}

function closeAddModal() {
  addModal.classList.remove("show");
}

addGameBtn.addEventListener("click", openAddModal);
addModalBackdrop.addEventListener("click", closeAddModal);
addModalClose.addEventListener("click", closeAddModal);
addCancelBtn.addEventListener("click", closeAddModal);

addForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = addTitle.value;
  if (!title) {
    addStatus.style.display = "block";
    addStatus.textContent = "Titlul este obligatoriu.";
    return;
  }

  const newGame = {
    title: title,
    genre: addGenre.value,
    year: Number(addYear.value),
    platforms: addPlatforms.value.split(",").map(function (p) {
      return p.trim();
    }),
    stock: Number(addStock.value),
    image: addImage.value,
    description: addDescription.value,
    link: addLink.value,
    rating: { mean: 0, count: 0 },
    mobile: false,
    video: {},
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newGame),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (created) {
      allGames.push(created);
      applyFilters();

      addStatus.style.display = "block";
      addStatus.textContent = "Joc adăugat!";
      setTimeout(closeAddModal, 600);
    })
    .catch(function () {
      addStatus.style.display = "block";
      addStatus.textContent = "Eroare!";
    });
});

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sanitize(url) {
  if (!url) return "";
  return url.replace(/(https?:\/\/[a-z0-9.-]+)\1+/gi, "$1");
}

function formatCount(count) {
  if (!count && count !== 0) return "";
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "k";
  return count.toString();
}

searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);
platformFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (modal.classList.contains("show")) closeModal();
    if (editModal.classList.contains("show")) closeEditModal();
    if (addModal.classList.contains("show")) closeAddModal();
  }
});

fetchGames();
