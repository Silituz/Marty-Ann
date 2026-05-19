const screens = [...document.querySelectorAll(".screen")];
const dots = [...document.querySelectorAll(".progress-dot")];
const toast = document.querySelector("#toast");
const song = document.querySelector("#song");
const musicButton = document.querySelector("#musicButton");
const restartButton = document.querySelector("#restartButton");
const modal = document.querySelector("#photoModal");
const modalPreview = document.querySelector("#modalPreview");
const modalCaption = document.querySelector("#modalCaption");
const modalClose = document.querySelector("#modalClose");
const galleryButton = document.querySelector("#galleryButton");
const galleryModal = document.querySelector("#galleryModal");
const galleryGrid = document.querySelector("#galleryGrid");
const galleryClose = document.querySelector("#galleryClose");
const secretModal = document.querySelector("#secretModal");
const secretClose = document.querySelector("#secretClose");
const reasonText = document.querySelector("#reasonText");
const frameHeroStage = document.querySelector(".frame-hero-stage");

const noReplies = [
  "No? The web says try Next",
  "That No got tangled",
  "Cute hero answer loading",
  "No is swinging away",
  "Birthday mission says Next",
  "Almost a comic-book yes"
];

const galleryItems = Array.from({ length: 9 }, (_, index) => index + 1);
const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
const imageNamePatterns = [
  (number) => `photo-${String(number).padStart(2, "0")}`,
  (number) => `photo-${number}`,
  (number) => `bild-${String(number).padStart(2, "0")}`,
  (number) => `bild-${number}`,
  (number) => `Bild-${number}`,
  (number) => `Bild ${number}`,
  (number) => `bild ${number}`,
  (number) => `bild${number}`,
  (number) => `Bild${number}`,
  (number) => `image-${String(number).padStart(2, "0")}`,
  (number) => `image-${number}`,
  (number) => String(number)
];

let currentScreen = 0;
let toastTimer;
let galleryBuilt = false;
let secretClicks = Number(sessionStorage.getItem("martySecretClicks") || "0");
let secretUnlocked = sessionStorage.getItem("martySecretUnlocked") === "true";
let secretShownThisVisit = false;
let secretReplayClicks = 0;
const imageCache = new Map();

function imageCandidates(numberOrPath) {
  if (typeof numberOrPath === "string" && numberOrPath.includes("/")) {
    return [numberOrPath];
  }

  const number = Number(numberOrPath);
  return imageNamePatterns.flatMap((pattern) => (
    imageExtensions.map((extension) => `assets/${pattern(number)}.${extension}`)
  ));
}

function tryImage(src) {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src) ? src : "");
  }

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      imageCache.set(src, true);
      resolve(src);
    };

    image.onerror = () => {
      imageCache.set(src, false);
      resolve("");
    };

    image.src = encodeURI(src);
  });
}

async function resolveImage(numberOrPath) {
  const candidates = imageCandidates(numberOrPath);

  for (const candidate of candidates) {
    const found = await tryImage(candidate);

    if (found) {
      return found;
    }
  }

  return "";
}

function placeImage(target, src, label) {
  target.classList.add("has-image");
  target.innerHTML = "";

  const image = document.createElement("img");
  image.src = encodeURI(src);
  image.alt = label;
  image.loading = "lazy";
  target.append(image);
}

async function hydratePhotoTarget(target) {
  const key = target.dataset.photoKey || target.dataset.photo;
  const label = target.getAttribute("aria-label") || target.textContent.trim() || "Birthday photo";
  const src = await resolveImage(key);

  if (src) {
    target.dataset.photo = src;
    placeImage(target, src, label);
  }
}

function hydratePhotos() {
  document.querySelectorAll("[data-photo-key]").forEach((target) => {
    hydratePhotoTarget(target);
  });
}

function setScreen(nextScreen) {
  currentScreen = Math.max(0, Math.min(nextScreen, screens.length - 1));

  screens.forEach((screen, index) => {
    screen.classList.toggle("active", index === currentScreen);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === Math.min(currentScreen, dots.length - 1));
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function createBurst(origin, label = "YES") {
  const rect = origin.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 12; i += 1) {
    const burst = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 58 + Math.random() * 34;

    burst.className = "burst";
    burst.textContent = i % 3 === 0 ? label : "!";
    burst.style.left = `${centerX}px`;
    burst.style.top = `${centerY}px`;
    burst.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    burst.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    document.body.append(burst);
    setTimeout(() => burst.remove(), 920);
  }
}

function flashFrameFight() {
  if (!frameHeroStage) {
    return;
  }

  frameHeroStage.classList.remove("is-brawling");
  requestAnimationFrame(() => {
    frameHeroStage.classList.add("is-brawling");
    setTimeout(() => frameHeroStage.classList.remove("is-brawling"), 920);
  });
}

function countSecretMoment() {
  if (secretUnlocked) {
    secretReplayClicks += 1;

    if (!secretShownThisVisit && secretReplayClicks >= 4 && secretModal && typeof secretModal.showModal === "function") {
      secretShownThisVisit = true;
      secretModal.showModal();
    }

    return;
  }

  secretClicks += 1;
  sessionStorage.setItem("martySecretClicks", String(secretClicks));

  if (secretClicks === 7) {
    showToast("You are close to a hidden birthday panel.");
  }

  if (secretClicks >= 10) {
    secretUnlocked = true;
    sessionStorage.setItem("martySecretUnlocked", "true");

    if (secretModal && typeof secretModal.showModal === "function") {
      secretShownThisVisit = true;
      secretModal.showModal();
    }
  }
}

async function toggleMusic() {
  if (!song) {
    return;
  }

  if (!song.getAttribute("src")) {
    showToast("Add music later as assets/birthday-song.mp3.");
    return;
  }

  if (!song.paused) {
    song.pause();
    musicButton.classList.remove("playing");
    showToast("Music paused.");
    return;
  }

  try {
    await song.play();
    musicButton.classList.add("playing");
    showToast("Music is ready. Replace the placeholder file when you want.");
  } catch {
    musicButton.classList.remove("playing");
    showToast("Add assets/birthday-song.mp3 later, then tap music again.");
  }
}

function sweetenNo(button) {
  const noCount = Number(button.dataset.noCount || "0") + 1;
  const x = Math.round(Math.random() * 44 - 22);
  const y = Math.round(Math.random() * 18 - 9);
  const tilt = Math.round(Math.random() * 10 - 5);

  button.dataset.noCount = String(noCount);
  button.textContent = noReplies[Math.floor(Math.random() * noReplies.length)];
  button.classList.add("is-playful");
  button.style.setProperty("--no-x", `${x}px`);
  button.style.setProperty("--no-y", `${y}px`);
  button.style.setProperty("--no-tilt", `${tilt}deg`);
  createBurst(button, "WEB");
  flashFrameFight();

  if (noCount < 3) {
    showToast("The No button got caught in a cute web.");
    return;
  }

  button.textContent = "Next";
  button.classList.remove("is-playful", "no");
  button.classList.add("is-glow", "next");
  button.dataset.next = "";
  button.removeAttribute("data-no");
  showToast("The web turned No into Next.");
}

function showReason(button) {
  if (!reasonText) {
    return;
  }

  reasonText.textContent = button.dataset.reason;
  button.classList.add("is-found");
  createBurst(button, "WISH");
}

async function openPhoto(photoReference) {
  const src = await resolveImage(photoReference);

  if (src) {
    placeImage(modalPreview, src, "Birthday photo preview");
    modalCaption.textContent = src.replace("assets/", "");
  } else {
    modalPreview.classList.remove("has-image");
    modalPreview.innerHTML = "Photo coming soon";
    modalCaption.textContent = "Add photos as photo-01.jpg, Bild 1.png, bild-1.webp, or similar in the assets folder.";
  }

  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function buildGallery() {
  if (galleryBuilt) {
    return;
  }

  galleryItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.photoKey = String(item);
    button.setAttribute("aria-label", `Future photo ${index + 1}`);
    button.innerHTML = `<span>Photo ${index + 1}</span>`;
    galleryGrid.append(button);
    hydratePhotoTarget(button);
  });

  galleryBuilt = true;
}

document.addEventListener("click", (event) => {
  const photoButton = event.target.closest("[data-photo], [data-photo-key]");
  const nextButton = event.target.closest("[data-next]");
  const noButton = event.target.closest("[data-no]");
  const reasonButton = event.target.closest("[data-reason]");

  if (reasonButton) {
    countSecretMoment();
    showReason(reasonButton);
    return;
  }

  if (photoButton) {
    openPhoto(photoButton.dataset.photo || photoButton.dataset.photoKey);
    return;
  }

  if (noButton) {
    countSecretMoment();
    sweetenNo(noButton);
    return;
  }

  if (nextButton) {
    countSecretMoment();
    createBurst(nextButton);
    flashFrameFight();
    setScreen(currentScreen + 1);
  }
});

musicButton.addEventListener("click", (event) => {
  event.stopPropagation();
  countSecretMoment();
  toggleMusic();
});

restartButton.addEventListener("click", () => {
  document.querySelectorAll(".answer.no, .answer[data-no-count]").forEach((button, index) => {
    const labels = ["No", "No", "No"];
    button.classList.remove("is-playful", "is-glow", "next");
    button.classList.add("no");
    button.style.removeProperty("--no-x");
    button.style.removeProperty("--no-y");
    button.style.removeProperty("--no-tilt");
    button.dataset.no = "";
    delete button.dataset.next;
    delete button.dataset.noCount;
    button.textContent = labels[index] || "No";
  });

  document.querySelectorAll(".reason-token").forEach((button) => button.classList.remove("is-found"));

  if (reasonText) {
    reasonText.textContent = "Tap a word to reveal a birthday wish.";
  }

  setScreen(0);
});

modalClose.addEventListener("click", () => modal.close());

galleryButton.addEventListener("click", (event) => {
  event.stopPropagation();
  countSecretMoment();
  buildGallery();

  if (typeof galleryModal.showModal === "function") {
    galleryModal.showModal();
  }
});

galleryClose.addEventListener("click", () => galleryModal.close());

if (secretClose) {
  secretClose.addEventListener("click", () => secretModal.close());
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

galleryModal.addEventListener("click", (event) => {
  if (event.target === galleryModal) {
    galleryModal.close();
  }
});

if (secretModal) {
  secretModal.addEventListener("click", (event) => {
    if (event.target === secretModal) {
      secretModal.close();
    }
  });
}

setScreen(0);
hydratePhotos();