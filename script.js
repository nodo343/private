const scene = document.getElementById("scene");
const neonField = document.getElementById("neonField");
const heartsField = document.getElementById("heartsField");
const photoField = document.getElementById("photoField");
const photoPicker = document.getElementById("photoPicker");
const statusText = document.getElementById("statusText");
const toggleMotion = document.getElementById("toggleMotion");

const appState = {
  running: true,
  photoTimer: null,
  objectUrls: [],
  photoUrls: [],
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createPlaceholder(label, toneA, toneB, accent) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${toneA}" />
          <stop offset="100%" stop-color="${toneB}" />
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="25%" r="55%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#bg)" />
      <rect width="800" height="1000" fill="url(#glow)" />
      <circle cx="180" cy="170" r="128" fill="${accent}" opacity="0.16" />
      <circle cx="625" cy="790" r="185" fill="${accent}" opacity="0.18" />
      <path
        d="M403 278c-36-52-119-34-135 25-10 38 7 70 40 101l95 89 94-89c34-31 52-63 41-101-16-59-100-76-135-25Z"
        fill="none"
        stroke="${accent}"
        stroke-width="18"
        opacity="0.45"
      />
      <path
        d="M148 640c84-57 179-67 305-17 96 39 169 43 223 9"
        fill="none"
        stroke="#dffbff"
        stroke-width="10"
        stroke-linecap="round"
        opacity="0.34"
      />
      <text
        x="66"
        y="848"
        font-family="Trebuchet MS, sans-serif"
        font-size="54"
        fill="#f6fcff"
        opacity="0.96"
      >
        i love you dea
      </text>
      <text
        x="66"
        y="912"
        font-family="Trebuchet MS, sans-serif"
        font-size="30"
        fill="${accent}"
        opacity="0.88"
        letter-spacing="3"
      >
        ${label}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const placeholderPhotos = [
  createPlaceholder("STARLIGHT", "#122339", "#060812", "#88f7ff"),
  createPlaceholder("MOONBEAM", "#3b1730", "#08070f", "#ff9aac"),
  createPlaceholder("SLOWDANCE", "#0d2a31", "#04050a", "#9ff5ff"),
  createPlaceholder("ALWAYS", "#381223", "#05050b", "#ff829c"),
  createPlaceholder("SOFT GLOW", "#1e153f", "#04050b", "#96f1ff"),
];

appState.photoUrls = placeholderPhotos;

function buildNeonField() {
  neonField.innerHTML = "";

  for (let index = 0; index < 34; index += 1) {
    const word = document.createElement("span");
    word.className = "neon-word";
    word.textContent = "i love you dea";
    word.style.setProperty("--left", `${randomBetween(-10, 74).toFixed(2)}%`);
    word.style.setProperty("--top", `${randomBetween(4, 88).toFixed(2)}%`);
    word.style.setProperty("--size", randomBetween(0.48, 2).toFixed(2));
    word.style.setProperty("--delay", `${randomBetween(-14, 0).toFixed(2)}s`);
    word.style.setProperty("--duration", `${randomBetween(7.5, 14.5).toFixed(2)}s`);
    word.style.setProperty("--rotate", `${randomBetween(-8, 8).toFixed(2)}deg`);
    word.style.setProperty("--offset-x", `${randomBetween(-28, 28).toFixed(0)}px`);
    word.style.setProperty("--offset-y", `${randomBetween(-22, 22).toFixed(0)}px`);
    neonField.appendChild(word);
  }
}

function buildHeartsField() {
  heartsField.innerHTML = "";

  for (let index = 0; index < 28; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.28 ? "❤" : "♡";
    heart.style.setProperty("--left", `${randomBetween(0, 95).toFixed(2)}%`);
    heart.style.setProperty("--size", `${randomBetween(1, 2.1).toFixed(2)}rem`);
    heart.style.setProperty("--delay", `${randomBetween(-12, 0).toFixed(2)}s`);
    heart.style.setProperty("--duration", `${randomBetween(6.6, 11.8).toFixed(2)}s`);
    heart.style.setProperty("--drift", `${randomBetween(-42, 42).toFixed(0)}px`);
    heart.style.setProperty("--drift-end", `${randomBetween(-60, 60).toFixed(0)}px`);
    heartsField.appendChild(heart);
  }
}

function createPhotoCard(source) {
  const card = document.createElement("figure");
  const image = document.createElement("img");

  card.className = "photo-card";
  card.style.setProperty("--left", `${randomBetween(2, 72).toFixed(2)}%`);
  card.style.setProperty("--top", `${randomBetween(50, 78).toFixed(2)}%`);
  card.style.setProperty("--width", `${randomBetween(108, 168).toFixed(0)}px`);
  card.style.setProperty("--rotate", `${randomBetween(-14, 14).toFixed(2)}deg`);
  card.style.setProperty("--mid-rotate", `${randomBetween(-6, 6).toFixed(2)}deg`);
  card.style.setProperty("--end-rotate", `${randomBetween(-8, 8).toFixed(2)}deg`);
  card.style.setProperty("--travel-x-mid", `${randomBetween(-24, 24).toFixed(0)}px`);
  card.style.setProperty("--travel-y-mid", `${randomBetween(-130, -230).toFixed(0)}px`);
  card.style.setProperty("--travel-x-end", `${randomBetween(-40, 40).toFixed(0)}px`);
  card.style.setProperty("--travel-y-end", `${randomBetween(-250, -420).toFixed(0)}px`);
  card.style.setProperty("--duration", `${randomBetween(5.8, 8.8).toFixed(2)}s`);

  image.src = source;
  image.alt = "Love memory";

  card.appendChild(image);
  card.addEventListener(
    "animationend",
    () => {
      card.remove();
    },
    { once: true },
  );

  return card;
}

function spawnPhotoCard() {
  if (!appState.running || appState.photoUrls.length === 0) {
    return;
  }

  const card = createPhotoCard(randomItem(appState.photoUrls));
  photoField.appendChild(card);
}

function startPhotoLoop() {
  if (appState.photoTimer) {
    window.clearInterval(appState.photoTimer);
  }

  appState.photoTimer = window.setInterval(spawnPhotoCard, 1400);
}

function revokeObjectUrls() {
  appState.objectUrls.forEach((url) => URL.revokeObjectURL(url));
  appState.objectUrls = [];
}

function setStatus(message) {
  statusText.textContent = message;
}

function loadPhotoFiles(files) {
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (imageFiles.length === 0) {
    return;
  }

  revokeObjectUrls();
  appState.objectUrls = imageFiles.map((file) => URL.createObjectURL(file));
  appState.photoUrls = [...appState.objectUrls];

  const suffix = imageFiles.length === 1 ? "" : "s";
  setStatus(`${imageFiles.length} photo${suffix} loaded. They are now floating through the animation.`);

  for (let index = 0; index < Math.min(imageFiles.length, 4); index += 1) {
    window.setTimeout(spawnPhotoCard, index * 220);
  }
}

function toggleAnimation() {
  appState.running = !appState.running;
  scene.classList.toggle("is-paused", !appState.running);
  toggleMotion.textContent = appState.running ? "Pause" : "Play";

  if (appState.running && photoField.childElementCount < 3) {
    spawnPhotoCard();
    spawnPhotoCard();
  }
}

function registerFileControls() {
  photoPicker.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    loadPhotoFiles(files);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    scene.addEventListener(eventName, (event) => {
      event.preventDefault();
      scene.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    scene.addEventListener(eventName, (event) => {
      event.preventDefault();
      scene.classList.remove("is-dragging");
    });
  });

  scene.addEventListener("drop", (event) => {
    const files = Array.from(event.dataTransfer?.files || []);
    loadPhotoFiles(files);
  });

  toggleMotion.addEventListener("click", toggleAnimation);
  window.addEventListener("beforeunload", revokeObjectUrls);
}

buildNeonField();
buildHeartsField();
registerFileControls();
startPhotoLoop();

window.setTimeout(() => {
  spawnPhotoCard();
  spawnPhotoCard();
  spawnPhotoCard();
}, 250);
