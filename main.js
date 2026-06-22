const animeData = [
  {
    id: 1,
    name: "Oshi no Ko",
    character: "Ai Hoshino",
    progress: "Season 2 Completed",
    status: "Finished",
    statusClass: "bg-green-500/10 text-green-400",
  },
  {
    id: 2,
    name: "Frieren: Beyond Journey's End",
    character: "Frieren",
    progress: "Ep 28 / 28",
    status: "Finished",
    statusClass: "bg-green-500/10 text-green-400",
  },
  {
    id: 3,
    name: "Wuthering Waves (Gaming)",
    character: "Changli & Yinlin",
    progress: "Data Bank Lv.21",
    status: "Active",
    statusClass: "bg-yellow-500/10 text-yellow-400",
  },
  {
    id: 4,
    name: "Jujutsu Kaisen",
    character: "Gojo Satoru",
    progress: "Ch. 260 (Manga)",
    status: "On Hold",
    statusClass: "bg-blue-500/10 text-blue-400",
  },
];

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const addFormContainer = document.getElementById("addFormContainer");

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    if (sidebar.style.display === "flex") {
      sidebar.style.display = "none";
    } else {
      sidebar.style.display = "flex";
    }
  });
}

const tableBody = document.querySelector("tbody");

function renderTable() {
  tableBody.innerHTML = "";

  animeData.forEach((anime) => {
    let statusColorClass = "";
    if (anime.status === "Finished") {
      statusColorClass = "bg-green-500/10 text-green-400";
    } else if (anime.status === "Active") {
      statusColorClass = "bg-yellow-500/10 text-yellow-400";
    } else if (anime.status === "On Hold") {
      statusColorClass = "bg-blue-500/10 text-blue-400";
    }

    const row = document.createElement("tr");
    row.className = "hover:bg-gray-800/20 transition duration-200";

    row.innerHTML = `
            <td class="p-4 pl-6 font-semibold text-gray-200">${anime.title || anime.name}</td> 
            <td class="p-4 text-purple-400">${anime.character}</td>
            <td class="p-4 text-gray-400">${anime.progress}</td>
            <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-md ${statusColorClass}">
                    ${anime.status}
                </span>
            </td>
            <td class="p-4 pr-6 text-right space-x-2">
                <button class="text-gray-500 hover:text-purple-400 transition" onclick="editAnime(${anime.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-gray-500 hover:text-red-400 transition" onclick="deleteAnime(${anime.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

    tableBody.appendChild(row);
  });
}

renderTable();

window.deleteAnime = function (id) {
  const index = animeData.findIndex((item) => item.id === id);

  if (index !== -1) {
    animeData.splice(index, 1);
    renderTable();
  }
};

window.editAnime = function (id) {
  const anime = animeData.find((item) => item.id === id);
  alert(`${anime.title || anime.name}`);
};

if (addBtn && addFormContainer) {
  addBtn.addEventListener("click", () => {
    addFormContainer.style.display = "block";
    addFormContainer.scrollIntoView({ behavior: "smooth" });
  });
}

if (cancelBtn && addFormContainer) {
  cancelBtn.addEventListener("click", () => {
    addFormContainer.style.display = "none";
    clearFormInputs();
  });
}

function clearFormInputs() {
  document.getElementById("animeName").value = "";
  document.getElementById("animeChar").value = "";
  document.getElementById("animeProgress").value = "";
  document.getElementById("animeStatus").value = "Finished";
}

const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const nameValue = document.getElementById("animeName").value.trim();
    const charValue = document.getElementById("animeChar").value.trim();
    const progressValue = document.getElementById("animeProgress").value.trim();
    const statusValue = document.getElementById("animeStatus").value;

    if (nameValue === "" || charValue === "" || progressValue === "") {
      alert("Please fill in all fields!");
      return;
    }

    const newAnime = {
      id: Date.now(),
      title: nameValue,
      character: charValue,
      progress: progressValue,
      status: statusValue,
    };

    animeData.push(newAnime);

    renderTable();
    addFormContainer.style.display = "none";    
    clearFormInputs();
  });
}
