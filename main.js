let animeList = JSON.parse(localStorage.getItem("animeList")) || [];
let editIndex = null;
const saveBtn =
  document.querySelector(".btn-save") ||
  document.getElementById("saveAnimeBtn");
const addFormContainer = document.getElementById("addFormContainer");

async function fetchTopAnime() {
  if (animeList.length > 0) {
    displayAnimeTable();
    displayAnimeCards(animeList);
    return;
  }

  const url = "https://api.jikan.moe/v4/top/anime?limit=6";

  try {
    const response = await fetch(url);
    const data = await response.json();
    animeList = data.data.map((anime) => ({
      name: anime.title_english || anime.title,
      studio: anime.studios[0]?.name || "Unknown Studio",
      progress: `${anime.episodes || "Ongoing"} Eps`, // Or progress: (anime.episodes || "Ongoing") + "Eps", (Old)
      status: anime.airing ? "Active" : "Finished",
      type: anime.type || "TV",
      score: anime.score ?? "N/A",
      imageUrl:
        anime.images?.jpg?.image_url ||
        "https://placehold.co/150x150/0f111a/a855f7?text=Anime",
    }));
    displayAnimeCards(animeList);
    displayAnimeTable();
    saveToLocalStorage();
  } catch (error) {
    console.error("Error fetching anime:", error);
  }
}

function displayAnimeCards(animeList) {
  const gridContainer = document.getElementById("anime-grid");
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  animeList.forEach((anime) => {
    const cardHTML = `
    <div class="bg-[#161925] border border-gray-800/60 p-5 rounded-2xl flex items-center justify-between hover:border-purple-500/30 transition-all duration-300">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">${anime.type} • ${anime.progress}</p>
          <h3 class="text-base font-bold text-gray-100 line-clamp-1">${anime.name}</h3>
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-600/10 text-purple-400 border border-purple-500/10">${anime.score}</span>
        </div>
        <div class="w-14 h-14 overflow-hidden rounded-xl border border-gray-800 flex-shrink-0">
          <img src="${anime.imageUrl}" alt="${anime.name}" class="w-full h-full object-cover">
        </div>
    </div>
    `;
    gridContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
}

function displayAnimeTable() {
  const tableBody = document.getElementById("anime-table-body");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  animeList.forEach((anime, index) => {
    let statusClass = "bg-gray-500/10 text-gray-400";

    if (anime.status === "Active")
      statusClass = "bg-green-500/10 text-green-400";
    if (anime.status === "Finished")
      statusClass = "bg-blue-500/10 text-blue-400";
    if (anime.status === "On Hold")
      statusClass = "bg-yellow-500/10 text-yellow-400";

    const rowHTML = `
        <tr class="border-b border-gray-800/40 hover:bg-gray-800/20 transition-colors">
          <td class="p-4 pl-6 font-semibold text-gray-200">${anime.name}</td>
          <td class="p-4 text-gray-400">${anime.studio}</td>
          <td class="p-4 text-purple-400">${anime.progress}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded-md text-xs font-medium ${statusClass}">${anime.status}</span>
          </td>
          <td class="p-4 pr-6 text-right space-x-2">
            <button class="text-gray-500 hover:text-purple-400 transition-colors" onclick="editAnime(${index})"><i class="fas fa-edit"></i></button>
            <button class="text-gray-500 hover:text-red-400 transition-colors" onclick="deleteAnime(${index})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    tableBody.insertAdjacentHTML("beforeend", rowHTML);
  });
}

function editAnime(index) {
  editIndex = index;
  const anime = animeList[index];

  document.getElementById("animeName").value = anime.name;
  document.getElementById("animeStudio").value = anime.studio;
  document.getElementById("animeProgress").value = anime.progress;
  document.getElementById("animeStatus").value = anime.status;
  document.getElementById("typeInput").value = anime.type;
  document.getElementById("scoreInput").value =
    anime.score === "N/A" ? "" : anime.score;
  document.getElementById("imageUrlInput").value = (
    anime.imageUrl || ""
  ).includes("placehold.co")
    ? ""
    : anime.imageUrl;

  document.querySelector(".form-title").innerText = "Edit Anime Title";

  if (saveBtn) saveBtn.innerText = "Update Title";

  if (addFormContainer) {
    addFormContainer.style.display = "block";
    addFormContainer.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTopAnime();

  const addBtn =
    document.getElementById("addAnimeBtn") ||
    document.querySelector(".btn-add");

  if (addBtn && addFormContainer) {
    addBtn.addEventListener("click", () => {
      editIndex = null;
      document.querySelector(".form-title").innerText = "Add New Title";
      if (saveBtn) saveBtn.innerText = "Save Title";

      document.getElementById("animeName").value = "";
      document.getElementById("animeStudio").value = "";
      document.getElementById("animeProgress").value = "";
      document.getElementById("typeInput").value = "TV";
      document.getElementById("animeStatus").value = "Active";
      document.getElementById("scoreInput").value = "";
      document.getElementById("imageUrlInput").value = "";
      addFormContainer.style.display = "block";
      addFormContainer.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (saveBtn && addFormContainer) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevents The Website Form Refreshing

      const nameInput = document.getElementById("animeName").value;
      const studioInput = document.getElementById("animeStudio").value;
      const progressInput = document.getElementById("animeProgress").value;
      const statusInput = document.getElementById("animeStatus").value;
      const typeInput = document.getElementById("typeInput").value;
      const scoreInput = document.getElementById("scoreInput").value;
      const imageUrlInput = document.getElementById("imageUrlInput").value;

      if (!nameInput || !studioInput || !progressInput) {
        alert("Make Sure All The Inputs Are Not Empty");
        return;
      }

      const currentAnimeData = {
        name: nameInput,
        studio: studioInput,
        progress: progressInput,
        status: statusInput,
        type: typeInput || "TV",
        score: scoreInput || "N/A",
        imageUrl:
          imageUrlInput ||
          "https://placehold.co/150x150/0f111a/a855f7?text=Anime",
      };

      if (editIndex !== null) {
        animeList[editIndex] = currentAnimeData;
        editIndex = null;
      } else {
        animeList.unshift(currentAnimeData);
      }

      displayAnimeTable();
      displayAnimeCards(animeList);
      saveToLocalStorage();
      addFormContainer.style.display = "none";
    });
  }

  const cancelBtn = document.getElementById("cancelBtn");

  if (cancelBtn && addFormContainer) {
    cancelBtn.addEventListener("click", () => {
      addFormContainer.style.display = "none";
    });
  }
});

function deleteAnime(index) {
  animeList.splice(index, 1);
  displayAnimeTable();
  displayAnimeCards(animeList);
  saveToLocalStorage();
}

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    sidebar.classList.toggle("flex");
  });
}

function saveToLocalStorage() {
  localStorage.setItem("animeList", JSON.stringify(animeList));
}
