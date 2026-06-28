let animeList = [];
let editIndex = null;

async function fetchTopAnime() {
  const url = "https://api.jikan.moe/v4/top/anime?limit=6"; // Only 6 (We Have Only 6 Slots)

  try {
    const response = await fetch(url);
    const data = await response.json();
    animeList = data.data.map((anime) => ({
      name: anime.title_english || anime.title,
      studio: anime.studios[0]?.name || "Unknown Studio",
      progress: `${anime.episodes || "?"} Eps`,
      status: anime.airing ? "Active" : "Finished",
      type: anime.type || "TV",
      score: anime.score ?? "N/A",
      imageUrl: anime.images?.jpg?.image_url || "",
    }));

    displayAnimeCards(animeList);
    displayAnimeTable();
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
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-600/10 text-purple-400 border border-purple-500/10">⭐ ${anime.score}</span>
                </div>
                <div class="w-14 h-14 overflow-hidden rounded-xl border border-gray-800 flex-shrink-0">
                    <img src="${anime.imageUrl}" alt="${anime.name}" class="w-full h-full object-cover">
                </div>
            </div>
        `;
    gridContainer.innerHTML += cardHTML;
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
    tableBody.innerHTML += rowHTML;
  });
}

function editAnime(index) {
    editIndex = index; 
    const anime = animeList[index];
    
    document.getElementById('animeName').value = anime.name;
    document.getElementById('animeStudio').value = anime.studio;
    document.getElementById('animeProgress').value = anime.progress;
    document.getElementById('animeStatus').value = anime.status;
    
    document.querySelector('.form-title').innerText = "Edit Anime Title";
    const saveBtn = document.querySelector('.btn-save') || document.getElementById('saveAnimeBtn');
    if (saveBtn) saveBtn.innerText = "Update Title";
    
    const addFormContainer = document.getElementById("addFormContainer");
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
  const saveBtn = document.querySelector(".btn-save");
  const addFormContainer = document.getElementById("addFormContainer");

  if (addBtn && addFormContainer) {
    addBtn.addEventListener("click", () => {
      editIndex = null;
      document.querySelector(".form-title").innerText = "Add New Title";
      if (saveBtn) saveBtn.innerText = "Save Title";

      document.getElementById("animeName").value = "";
      document.getElementById("animeStudio").value = "";
      document.getElementById("animeProgress").value = "";
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
      if (!nameInput || !studioInput || !progressInput) {
        alert("Make Sure All The Inputs Are Not Empty");
        return;
      }

      const currentAnimeData = {
        name: nameInput,
        studio: studioInput,
        progress: progressInput,
        status: statusInput,
        type: "TV",
        score: "N/A",
        imageUrl: "",
      };
      if (editIndex !== null) {
        animeList[editIndex] = currentAnimeData;
        editIndex = null;
      } else {
        animeList.unshift(currentAnimeData); // Making Sure It Appear In First Place
      }

      displayAnimeTable(); // Rendering
      displayAnimeCards(animeList);
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
}

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    sidebar.classList.toggle("flex");
  });
}

// Old Features

// const animeData = [
//   {
//     id: 1,
//     name: "Oshi no Ko",
//     character: "Ai Hoshino",
//     progress: "Season 2 Completed",
//     status: "Finished",
//     statusClass: "bg-green-500/10 text-green-400",
//   },
//   {
//     id: 2,
//     name: "Frieren: Beyond Journey's End",
//     character: "Frieren",
//     progress: "Ep 28 / 28",
//     status: "Finished",
//     statusClass: "bg-green-500/10 text-green-400",
//   },
//   {
//     id: 3,
//     name: "Wuthering Waves (Gaming)",
//     character: "Changli & Yinlin",
//     progress: "Data Bank Lv.21",
//     status: "Active",
//     statusClass: "bg-yellow-500/10 text-yellow-400",
//   },
//   {
//     id: 4,
//     name: "Jujutsu Kaisen",
//     character: "Gojo Satoru",
//     progress: "Ch. 260 (Manga)",
//     status: "On Hold",
//     statusClass: "bg-blue-500/10 text-blue-400",
//   },
// ];

// const menuBtn = document.getElementById("menuBtn");
// const sidebar = document.getElementById("sidebar");
// const addBtn = document.getElementById("addBtn");
// const cancelBtn = document.getElementById("cancelBtn");
// const addFormContainer = document.getElementById("addFormContainer");

// if (menuBtn && sidebar) {
//   menuBtn.addEventListener("click", () => {
//     if (sidebar.style.display === "flex") {
//       sidebar.style.display = "none";
//     } else {
//       sidebar.style.display = "flex";
//     }
//   });
// }

// const tableBody = document.querySelector("tbody");

// function renderTable() {
//   tableBody.innerHTML = "";

//   animeData.forEach((anime) => {
//     let statusColorClass = "";
//     if (anime.status === "Finished") {
//       statusColorClass = "bg-green-500/10 text-green-400";
//     } else if (anime.status === "Active") {
//       statusColorClass = "bg-yellow-500/10 text-yellow-400";
//     } else if (anime.status === "On Hold") {
//       statusColorClass = "bg-blue-500/10 text-blue-400";
//     }

//     const row = document.createElement("tr");
//     row.className = "hover:bg-gray-800/20 transition duration-200";

//     row.innerHTML = `
//             <td class="p-4 pl-6 font-semibold text-gray-200">${anime.title || anime.name}</td>
//             <td class="p-4 text-purple-400">${anime.character}</td>
//             <td class="p-4 text-gray-400">${anime.progress}</td>
//             <td class="p-4">
//                 <span class="px-2.5 py-1 text-xs font-medium rounded-md ${statusColorClass}">
//                     ${anime.status}
//                 </span>
//             </td>
//     <td class="p-4 pr-6 text-right space-x-2">
//         <button class="text-gray-500 hover:text-purple-400 transition" onclick="editAnime(${anime.id})">
//             <i class="fas fa-edit"></i>
//         </button>
//         <button class="text-gray-500 hover:text-red-400 transition" onclick="deleteAnime(${anime.id})">
//             <i class="fas fa-trash"></i>
//         </button>
//     </td>
// `;

//     tableBody.appendChild(row);
//   });
// }

// renderTable();

// window.deleteAnime = function (id) {
//   const index = animeData.findIndex((item) => item.id === id);

//   if (index !== -1) {
//     animeData.splice(index, 1);
//     renderTable();
//   }
// };

// window.editAnime = function (id) {
//   const anime = animeData.find((item) => item.id === id);
//   alert(`${anime.title || anime.name}`);
// };

// if (addBtn && addFormContainer) {
//   addBtn.addEventListener("click", () => {
//     addFormContainer.style.display = "block";
//     addFormContainer.scrollIntoView({ behavior: "smooth" });
//   });
// }

// if (cancelBtn && addFormContainer) {
//   cancelBtn.addEventListener("click", () => {
//     addFormContainer.style.display = "none";
//     clearFormInputs();
//   });
// }

// function clearFormInputs() {
//   document.getElementById("animeName").value = "";
//   document.getElementById("animeChar").value = "";
//   document.getElementById("animeProgress").value = "";
//   document.getElementById("animeStatus").value = "Finished";
// }

// const saveBtn = document.getElementById("saveBtn");

// if (saveBtn) {
//   saveBtn.addEventListener("click", () => {
//     const nameValue = document.getElementById("animeName").value.trim();
//     const charValue = document.getElementById("animeChar").value.trim();
//     const progressValue = document.getElementById("animeProgress").value.trim();
//     const statusValue = document.getElementById("animeStatus").value;

//     if (nameValue === "" || charValue === "" || progressValue === "") {
//       alert("Please fill in all fields!");
//       return;
//     }

//     const newAnime = {
//       id: Date.now(),
//       title: nameValue,
//       character: charValue,
//       progress: progressValue,
//       status: statusValue,
//     };

//     animeData.push(newAnime);

//     renderTable();
//     addFormContainer.style.display = "none";
//     clearFormInputs();
//   });
// }
