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

const noReplies = [
  "No? The web says try Next",
  "That No got tangled",
  "Cute hero answer loading",
  "No is swinging away",
  "Birthday mission says Next",
  "Almost a comic-book yes"
];

const galleryItems = [
  "assets/photo-01.jpg",
  "assets/photo-02.jpg",
  "assets/photo-03.jpg",
  "assets/photo-04.jpg",
  "assets/photo-05.jpg",
  "assets/photo-06.jpg",
  "assets/photo-07.jpg",
  "assets/photo-08.jpg",
  "assets/photo-09.jpg"
];

let currentScreen = 0;
let toastTimer;
let galleryBuilt = false;
let secretClicks = Number(sessionStorage.getItem("martySecretClicks") || "0");
let secretUnlocked = sessionStorage.getItem("martySecretUnlocked") === "true";

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

function clearHeroEffects(zone) {
  if (!zone) {
    return;
  }

  zone.classList.remove("is-tugging", "is-smashing", "is-shattering", "is-cheering");
}

function createButtonFragments(button) {
  const zone = button.closest(".hero-answer-zone");

  if (!zone) {
    return;
  }

  const buttonRect = button.getBoundingClientRect();
  const zoneRect = zone.getBoundingClientRect();

  for (let i = 0; i < 9; i += 1) {
    const fragment = document.createElement("span");
    const column = i % 3;
    const row = Math.floor(i / 3);

    fragment.className = "button-fragment";
    fragment.style.left = `${buttonRect.left - zoneRect.left + 36 + column * 44}px`;
    fragment.style.top = `${buttonRect.top - zoneRect.top + 12 + row * 10}px`;
    fragment.style.setProperty("--fx", `${Math.round(Math.random() * 120 - 60)}px`);
    fragment.style.setProperty("--fy", `${Math.round(-34 - Math.random() * 74)}px`);
    fragment.style.setProperty("--fr", `${Math.round(Math.random() * 240 - 120)}deg`);

    zone.append(fragment);
    setTimeout(() => fragment.remove(), 820);
  }
}

function playHeroNoEffect(button, noCount) {
  const zone = button.closest(".hero-answer-zone");

  if (!zone) {
    return;
  }

  clearHeroEffects(zone);

  if (noCount % 3 === 1) {
    zone.classList.add("is-tugging");
  } else if (noCount % 3 === 2) {
    zone.classList.add("is-smashing");
  } else {
    zone.classList.add("is-shattering");
    createButtonFragments(button);
  }

  setTimeout(() => clearHeroEffects(zone), 900);
}

function playHeroNextEffect(button) {
  const zone = button.closest(".hero-answer-zone");

  if (!zone) {
    return;
  }

  clearHeroEffects(zone);
  zone.classList.add("is-cheering");
  setTimeout(() => clearHeroEffects(zone), 720);
}

function countSecretMoment() {
  if (secretUnlocked) {
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
  playHeroNoEffect(button, noCount);

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

function openPhoto(src) {
  modalPreview.textContent = src.includes("photo") ? src.replace("assets/", "").replace(".jpg", "") : "Photo coming soon";
  modalCaption.textContent = `Add ${src} later to show the real picture here.`;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function buildGallery() {
  if (galleryBuilt) {
    return;
  }

  galleryItems.forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.photo = src;
    button.setAttribute("aria-label", `Future photo ${index + 1}`);
    button.textContent = `Photo ${index + 1}`;
    galleryGrid.append(button);
  });

  galleryBuilt = true;
}

document.addEventListener("click", (event) => {
  const photoButton = event.target.closest("[data-photo]");
  const nextButton = event.target.closest("[data-next]");
  const noButton = event.target.closest("[data-no]");
  const reasonButton = event.target.closest("[data-reason]");

  if (reasonButton) {
    countSecretMoment();
    showReason(reasonButton);
    return;
  }

  if (photoButton) {
    countSecretMoment();
    openPhoto(photoButton.dataset.photo);
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
    playHeroNextEffect(nextButton);
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
    reasonText.textContent = "Tap a token to reveal a birthday wish.";
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
