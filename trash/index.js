const rawData = [];
const fetchData = async () => {
  const results = await fetch(
    "https://fluffy-space-pancake-jjw6v9qp6xjpfpw6g-3000.app.github.dev/api/movie",
  );
  const data = await results.json();
  rawData.push(...data)
  console.log(rawData)
  return data;
};


const grid = document.getElementById("grid-container");
const countDisplay = document.getElementById("countDisplay");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");

// MODAL ELEMENTS
const modalOverlay = document.getElementById("modal-overlay");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalContent = document.getElementById("modal-content");
const modalBody = document.getElementById("modal-body");
const modalGlow = document.getElementById("modal-glow");

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

function createCard(char) {
  const isHero = char.hero;
  const gradientClass = isHero ? "hero-gradient" : "villain-gradient";
  const badgeColor = isHero
    ? "bg-yellow-400 text-yellow-900"
    : "bg-purple-500 text-white";
  const statusText = isHero ? "HERO" : "VILLAIN";

  return `
                <div class="character-card rounded-2xl p-5 md:p-6 relative group overflow-hidden cursor active:scale-95 transition-transform" 
                     onclick="openModal(${char.id})"
                     data-hero="${isHero}">
                    
                    <div class="absolute inset-0 bg-gradient-to-br ${isHero ? "from-yellow-500/20" : "from-purple-600/20"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div class="relative w-14 h-14 md:w-16 md:h-16 rounded-full ${gradientClass} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                        <span class="font-black text-lg md:text-xl text-white tracking-widest">${getInitials(char.name)}</span>
                    </div>

                    <span class="absolute top-5 right-5 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full ${badgeColor} z-10">
                        ${statusText}
                    </span>

                    <div class="relative z-10">
                        <h3 class="text-xl md:text-2xl font-bold mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:${gradientClass} transition-all">
                            ${char.name}
                        </h3>
                        <p class="text-gray-400 text-xs md:text-sm flex items-center gap-2">
                            <svg class="w-3 h-3 md:w-4 md:h-4 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M7 1a1 1 0 011-1h4a1 1 0 011 1v1h4a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h4V1zM3 7h14v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
                            ${char.movie}
                        </p>
                    </div>
                </div>
            `;
}

// --- FUNCIONES MODAL ---
function openModal(id) {
  const char = rawData.find((c) => c.id === id);
  if (!char) return;

  const isHero = char.hero;
  const gradientClass = isHero ? "hero-gradient" : "villain-gradient";
  const badgeColor = isHero
    ? "bg-yellow-400 text-yellow-900"
    : "bg-purple-500 text-white";
  const statusText = isHero ? "HERO" : "VILLAIN";
  const glowColor = isHero ? "bg-yellow-500" : "bg-purple-600";
  const borderColor = isHero
    ? "rgba(255, 215, 0, 0.3)"
    : "rgba(114, 9, 183, 0.3)";

  modalContent.style.borderColor = borderColor;
  modalGlow.className = `absolute top-0 left-0 w-full h-48 opacity-40 blur-[60px] -z-0 ${glowColor}`;

  modalBody.innerHTML = `
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-full ${gradientClass} flex items-center justify-center mb-4 md:mb-6 shadow-2xl ring-4 ring-white/10">
                    <span class="font-black text-3xl md:text-5xl text-white tracking-widest">${getInitials(char.name)}</span>
                </div>
                
                <h2 class="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">${char.name}</h2>
                <span class="text-[10px] md:text-[12px] font-bold tracking-wider px-3 py-1 rounded-full ${badgeColor} mb-6 inline-block">
                    ${statusText}
                </span>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left bg-black/30 p-4 rounded-2xl border border-white/5">
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Película</p>
                        <p class="text-white font-semibold text-sm md:text-base">${char.movie}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">ID Archivo</p>
                        <p class="text-white font-mono opacity-80 text-sm md:text-base">#${String(char.id).padStart(4, "0")}</p>
                    </div>
                    <div class="md:col-span-2 border-t border-white/10 pt-3 mt-1">
                         <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha de Registro</p>
                         <p class="text-white text-sm">${formatDate(char.createdAt)}</p>
                    </div>
                </div>
            `;

  gsap.to(modalOverlay, { autoAlpha: 1, duration: 0.1 });
  gsap.fromTo(
    modalContent,
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" },
  );
  gsap.fromTo(modalBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 });
}

function closeModal() {
  gsap.to(modalContent, {
    scale: 0.9,
    opacity: 0,
    y: 20,
    duration: 0.2,
    ease: "power2.in",
  });
  gsap.to(modalBackdrop, { opacity: 0, duration: 0.2 });
  gsap.to(modalOverlay, { autoAlpha: 0, delay: 0.2 });
}

modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// --- RENDER ---
function render(data) {
  grid.innerHTML = data.map((char) => createCard(char)).join("");
  countDisplay.innerText = data.length;
  countDisplay.classList.remove("text-white");
  void countDisplay.offsetWidth;
  countDisplay.classList.add("text-white");

  gsap.from(".character-card", {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.03,
    ease: "power2.out",
  });

  // TILT EFFECT (SOLO DESKTOP)
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".character-card").forEach((card) => {
      card.addEventListener("mousemove", handleHover);
      card.addEventListener("mouseleave", handleLeave);

      // Cursor
      card.addEventListener("mouseenter", () => {
        const cf = document.getElementById("cursor-follower");
        if (cf) {
          cf.style.width = "50px";
          cf.style.height = "50px";
          cf.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        }
      });
      card.addEventListener("mouseleave", () => {
        const cf = document.getElementById("cursor-follower");
        if (cf) {
          cf.style.width = "20px";
          cf.style.height = "20px";
          cf.style.backgroundColor = "transparent";
        }
      });
    });
  }
}

function handleHover(e) {
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const xPct = x / rect.width - 0.5;
  const yPct = y / rect.height - 0.5;
  gsap.to(this, {
    rotationX: -yPct * 20,
    rotationY: xPct * 20,
    transformPerspective: 1000,
    scale: 1.02,
    duration: 0.4,
    ease: "power2.out",
  });
}
function handleLeave(e) {
  gsap.to(this, {
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    duration: 0.7,
    ease: "elastic.out(1, 0.5)",
  });
}

// Custom Cursor Logic
const cursorFollower = document.getElementById("cursor-follower");
const cursorDot = document.getElementById("cursor-dot");

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.15 });
  });
}

// Search & Filter
let currentFilter = "all";
let searchQuery = "";

function filterData() {
  let filtered = rawData.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery) ||
      char.movie.toLowerCase().includes(searchQuery);
    const matchesType =
      currentFilter === "all"
        ? true
        : currentFilter === "hero"
          ? char.hero === true
          : char.hero === false;
    return matchesSearch && matchesType;
  });
  render(filtered);
}

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  filterData();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.remove("bg-white", "text-black");
      b.classList.add("text-gray-400", "hover:text-white", "hover:bg-white/10");
    });
    btn.classList.remove(
      "text-gray-400",
      "hover:text-white",
      "hover:bg-white/10",
    );
    btn.classList.add("bg-white", "text-black");
    currentFilter = btn.dataset.filter;
    filterData();
  });
});

window.addEventListener("load", async () => {
  rawData = await fetchData()
  const tl = gsap.timeline();
  tl.from(".title-anim", {
    y: -30,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
  })
    .from(".subtitle-anim", { y: 10, opacity: 0, duration: 0.8 }, "-=0.5")
    .from(
      ".controls-anim",
      { scale: 0.95, opacity: 0, duration: 0.5 },
      "-=0.3",
    );
  render(rawData);
});
