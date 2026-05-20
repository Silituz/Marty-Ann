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
const wishCompleteModal = document.querySelector("#wishCompleteModal");
const wishCompleteClose = document.querySelector("#wishCompleteClose");
const reasonText = document.querySelector("#reasonText");
const reasonButtons = [...document.querySelectorAll(".reason-token")];
const frameHeroStage = document.querySelector(".frame-hero-stage");

function injectDynamicStyles() {
  if (document.querySelector("#martyDynamicStyles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "martyDynamicStyles";
  style.textContent = `
    .music-note-button span {
      transform: translateY(-1px);
      font-size: 1.45rem;
      font-weight: 900;
      line-height: 1;
    }

    .ending-modal {
      border-color: rgba(255, 122, 24, 0.58);
      background:
        radial-gradient(circle at 50% 0%, rgba(255, 122, 24, 0.3), transparent 13rem),
        linear-gradient(145deg, rgba(9, 12, 25, 0.98), rgba(38, 9, 17, 0.98));
    }

    .ending-card {
      position: relative;
      overflow: hidden;
      padding: 28px 10px 10px;
    }

    .ending-card::before,
    .ending-card::after {
      position: absolute;
      content: "";
      pointer-events: none;
    }

    .ending-card::before {
      inset: 12px;
      border: 1px solid rgba(255, 248, 241, 0.16);
      border-radius: 8px;
      background:
        linear-gradient(90deg, transparent 49%, rgba(255, 248, 241, 0.1) 50%, transparent 51%),
        linear-gradient(0deg, transparent 49%, rgba(255, 248, 241, 0.1) 50%, transparent 51%);
    }

    .ending-card::after {
      top: 16px;
      right: 18px;
      width: 86px;
      height: 22px;
      background: linear-gradient(135deg, rgba(255, 209, 102, 0.64), rgba(255, 122, 24, 0.34));
      clip-path: polygon(0 0, 74% 0, 64% 44%, 100% 44%, 42% 100%, 52% 56%, 0 56%);
      opacity: 0.62;
      transform: rotate(11deg);
    }

    .ending-badge {
      position: relative;
      z-index: 1;
      display: grid;
      width: 80px;
      height: 76px;
      place-items: center;
      justify-self: center;
      color: #ffef9a;
      text-shadow: 0 0 16px rgba(255, 209, 102, 0.86), 3px 3px 0 #100918;
      font-size: 3.4rem;
      font-weight: 950;
      line-height: 1;
    }

    .ending-card .eyebrow,
    .ending-card h2,
    .ending-card p {
      position: relative;
      z-index: 1;
    }

    .ending-card h2 {
      color: #ffef9a;
      text-shadow: 2px 2px 0 #100918, 4px 4px 0 var(--red);
    }

    .ending-modal.ending-good {
      border-color: rgba(255, 209, 102, 0.72);
      background:
        radial-gradient(circle at 50% 0%, rgba(255, 209, 102, 0.38), transparent 13rem),
        radial-gradient(circle at 18% 82%, rgba(88, 231, 255, 0.18), transparent 10rem),
        linear-gradient(145deg, rgba(9, 12, 25, 0.98), rgba(44, 14, 18, 0.98));
    }

    .ending-modal.ending-normal {
      border-color: rgba(255, 122, 24, 0.48);
      background:
        radial-gradient(circle at 50% 0%, rgba(255, 122, 24, 0.24), transparent 12rem),
        linear-gradient(145deg, rgba(10, 15, 31, 0.98), rgba(24, 35, 68, 0.96));
    }

    .ending-modal.ending-villain {
      border-color: rgba(200, 25, 46, 0.62);
      background:
        radial-gradient(circle at 50% 0%, rgba(200, 25, 46, 0.28), transparent 12rem),
        radial-gradient(circle at 18% 86%, rgba(255, 122, 24, 0.18), transparent 10rem),
        linear-gradient(145deg, rgba(5, 7, 18, 0.99), rgba(36, 9, 28, 0.98));
    }

    .ending-modal.ending-normal .ending-badge {
      color: #ffd166;
      text-shadow: 0 0 12px rgba(255, 122, 24, 0.72), 3px 3px 0 #100918;
    }

    .ending-modal.ending-villain .ending-badge {
      color: var(--orange);
      text-shadow: 0 0 10px rgba(255, 122, 24, 0.78), 3px 3px 0 #100918, -3px 3px 0 var(--red);
    }

    .ending-modal.ending-normal .ending-card h2 {
      color: #ffd166;
      text-shadow: 2px 2px 0 #100918, 3px 3px 0 var(--blue);
    }

    .ending-modal.ending-villain .ending-card h2 {
      color: #ffb24a;
      text-shadow: 2px 2px 0 #100918, 4px 4px 0 #5b1020;
    }
  `;
  document.head.append(style);
}

injectDynamicStyles();

if (musicButton) {
  musicButton.classList.add("music-note-button");
  const musicIcon = musicButton.querySelector("span");

  if (musicIcon) {
    musicIcon.textContent = "♫";
  }
}

const sceneChoices = {
  1: {
    yes: "Long live the Heroes",
    no: "Villain Button",
    replies: ["Are you sure?", "But you have a good heart.", "Okay, you win, hero."],
    burst: "HERO"
  },
  2: {
    yes: "Follow the Signal",
    no: "Cut the Signal",
    replies: ["The signal dodged that.", "It says: too sparkly to ignore.", "Signal restored. Swinging on."],
    burst: "PING"
  },
  3: {
    yes: "Charge Orange Power",
    no: "Low Battery",
    replies: ["Orange power refuses to quit.", "Tiny hero found a charger.", "Fully charged. Moving on."],
    burst: "ZAP"
  },
  4: {
    yes: "Keep the Spark",
    no: "Dim the Spark",
    replies: ["The spark blinked dramatically.", "It is too cute to dim.", "Spark protected. Next panel."],
    burst: "GLOW"
  },
  5: {
    yes: "Patrol With Them",
    no: "Skip Patrol",
    replies: ["Patrol says: request denied.", "A tiny shield blocks the skip.", "Patrol complete. Forward!"],
    burst: "BAM"
  },
  6: {
    yes: "Follow the Web Route",
    no: "Wrong Turn",
    replies: ["The web pulls you back.", "No shortcuts in hero traffic.", "Route corrected. Swinging on."],
    burst: "WEB"
  },
  7: {
    yes: "Rescue the Smile",
    no: "Not Today",
    replies: ["The smile filed an appeal.", "Appeal accepted instantly.", "Smile rescue approved."],
    burst: "YES"
  },
  8: {
    yes: "Final Swing",
    no: "Stay Here",
    replies: ["The web line is already attached.", "Tiny heroes are counting down.", "Final swing launched."],
    burst: "SWING"
  },
  9: {
    yes: "Deliver the Surprise",
    no: "Hold the Package",
    replies: ["Package is wiggling.", "It says: open birthday mode.", "Delivered with comic drama."],
    burst: "POW"
  }
};

const storySceneNumbers = Object.keys(sceneChoices).map(Number);
const positiveSceneChoices = new Set();
const negativeSceneChoices = new Set();
const endingPanels = {
  good: {
    title: "Good Ending: Golden Hero Moment",
    text: "You carried the birthday mission with a bright hero heart. May Marty-Ann feel warmly celebrated today, gently appreciated from far away, and surrounded by little reasons to smile."
  },
  normal: {
    title: "Normal Ending: Sweet Web Detour",
    text: "A tiny bit of mischief joined the route, but that only made the story cuter. The birthday wish still arrives safely, wrapped in kindness, orange sparks, and a soft smile."
  },
  villain: {
    title: "Villain Ending: Mischief With Heart",
    text: "You pressed every suspicious button like a very stylish birthday villain. Luckily, even this route has a soft heart: the surprise still arrives with charm, laughter, and a very kind wish."
  }
};

const galleryItems = Array.from({ length: 22 }, (_, index) => index + 1);
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
let endingShownThisRun = false;
let endingModal;
let endingClose;
let endingCard;
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

  target.classList.add("is-photo-clickable");

  if (target.tagName !== "BUTTON") {
    target.setAttribute("role", "button");
    target.tabIndex = 0;
  }

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

function applySceneChoiceLabels() {
  document.querySelectorAll(".question-screen").forEach((screen) => {
    const screenNumber = Number(screen.dataset.screen);
    const sceneChoice = sceneChoices[screenNumber];
    const yesButton = screen.querySelector("[data-next]");
    const noButton = screen.querySelector("[data-no]");

    if (yesButton && sceneChoice) {
      yesButton.textContent = sceneChoice.yes;
    }

    if (noButton && sceneChoice) {
      noButton.textContent = sceneChoice.no;
      noButton.disabled = false;
    }
  });
}

function setupWishCompletePanel() {
  if (!wishCompleteModal) {
    return;
  }

  wishCompleteModal.setAttribute("aria-label", "Secret Wish Panel");
  wishCompleteModal.classList.add("wish-complete-modal");
  renderWishCompletePanel();
}

function setupEndingPanel() {
  endingModal = document.createElement("dialog");
  endingModal.className = "secret-modal ending-modal";
  endingModal.setAttribute("aria-label", "Birthday ending panel");
  endingModal.innerHTML = `
    <button class="modal-close" id="endingClose" type="button" aria-label="Close">x</button>
    <div class="secret-card ending-card">
      <span class="ending-badge" aria-hidden="true">★</span>
      <p class="eyebrow">Birthday Ending</p>
      <h2></h2>
      <p></p>
    </div>
  `;
  document.body.append(endingModal);
  endingClose = endingModal.querySelector("#endingClose");
  endingCard = endingModal.querySelector(".ending-card");

  endingClose.addEventListener("click", (event) => {
    event.stopPropagation();
    endingModal.close();
  });

  endingModal.addEventListener("click", (event) => {
    if (event.target === endingModal) {
      endingModal.close();
    }
  });
}

function markSceneChoice(screenNumber, choiceType) {
  if (!sceneChoices[screenNumber]) {
    return;
  }

  if (choiceType === "negative") {
    negativeSceneChoices.add(screenNumber);
    return;
  }

  positiveSceneChoices.add(screenNumber);
}

function resetSceneChoices() {
  positiveSceneChoices.clear();
  negativeSceneChoices.clear();
}

function getEndingType() {
  const touchedEveryVillainButton = storySceneNumbers.every((screenNumber) => (
    negativeSceneChoices.has(screenNumber)
  ));

  if (touchedEveryVillainButton) {
    return "villain";
  }

  if (negativeSceneChoices.size > 0) {
    return "normal";
  }

  return "good";
}

function renderWishCompletePanel() {
  if (!wishCompleteModal) {
    return;
  }

  const card = wishCompleteModal.querySelector(".secret-card");
  wishCompleteModal.classList.remove("ending-good", "ending-normal", "ending-villain");

  if (card) {
    card.classList.add("wish-complete-card");
    card.innerHTML = `
      <span class="wish-heart" aria-hidden="true">&hearts;</span>
      <p class="eyebrow">Secret Wish Panel</p>
      <h2>A hero-level reminder</h2>
      <p>
        But the most important thing is something you must never forget:
        that you are someone&rsquo;s favorite person &#129392;
      </p>
    `;
  }
}

function renderEndingPanel() {
  if (!endingModal || !endingCard) {
    return;
  }

  const endingType = getEndingType();
  const ending = endingPanels[endingType];

  endingModal.classList.remove("ending-good", "ending-normal", "ending-villain");
  endingModal.classList.add(`ending-${endingType}`);
  endingCard.querySelector("h2").textContent = ending.title;
  endingCard.querySelector("p:last-child").textContent = ending.text;
}

function openEndingPanel() {
  if (
    !endingModal
    || endingShownThisRun
    || typeof endingModal.showModal !== "function"
    || endingModal.open
  ) {
    return;
  }

  endingShownThisRun = true;
  renderEndingPanel();
  endingModal.showModal();
}

function openWishCompletePanel() {
  if (
    wishCompleteModal
    && typeof wishCompleteModal.showModal === "function"
    && !wishCompleteModal.open
  ) {
    renderWishCompletePanel();
    wishCompleteModal.showModal();
  }
}

function setScreen(nextScreen) {
  currentScreen = Math.max(0, Math.min(nextScreen, screens.length - 1));

  screens.forEach((screen, index) => {
    screen.classList.toggle("active", index === currentScreen);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === Math.min(currentScreen, dots.length - 1));
  });

  if (currentScreen === screens.length - 1) {
    setTimeout(openEndingPanel, 380);
  }
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
    showToast("Music play.");
  } catch {
    musicButton.classList.remove("playing");
    showToast("Add assets/birthday-song.mp3 later, then tap music again.");
  }
}

function sweetenNo(button) {
  const noCount = Number(button.dataset.noCount || "0") + 1;
  const screen = button.closest(".screen");
  const screenNumber = Number(screen?.dataset.screen || currentScreen);
  const sceneChoice = sceneChoices[screenNumber] || {
    yes: "Next",
    no: "No",
    replies: ["Are you sure?", "The web says try again.", "Okay, moving on."],
    burst: "WEB"
  };
  const replyIndex = Math.min(noCount - 1, sceneChoice.replies.length - 1);
  const x = Math.round(Math.random() * 44 - 22);
  const y = Math.round(Math.random() * 18 - 9);
  const tilt = Math.round(Math.random() * 10 - 5);

  markSceneChoice(screenNumber, "negative");
  button.dataset.noCount = String(noCount);
  button.textContent = sceneChoice.replies[replyIndex];
  button.classList.add("is-playful");
  button.style.setProperty("--no-x", `${x}px`);
  button.style.setProperty("--no-y", `${y}px`);
  button.style.setProperty("--no-tilt", `${tilt}deg`);
  createBurst(button, sceneChoice.burst);
  flashFrameFight();

  if (noCount < sceneChoice.replies.length) {
    showToast(sceneChoice.replies[replyIndex]);
    return;
  }

  button.classList.remove("is-playful");
  button.classList.add("is-glow");
  button.disabled = true;
  showToast(sceneChoice.replies[replyIndex]);
  setTimeout(() => setScreen(currentScreen + 1), 780);
}

function showReason(button) {
  if (!reasonText) {
    return;
  }

  reasonText.textContent = button.dataset.reason;
  button.classList.add("is-found");
  createBurst(button, "WISH");

  if (
    reasonButtons.length > 0
    && reasonButtons.every((reasonButton) => reasonButton.classList.contains("is-found"))
  ) {
    openWishCompletePanel();
  }
}

function resetWishes() {
  reasonButtons.forEach((button) => button.classList.remove("is-found"));

  if (reasonText) {
    reasonText.textContent = "Tap a word to reveal a birthday wish.";
  }
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
    showReason(reasonButton);
    return;
  }

  if (photoButton) {
    openPhoto(photoButton.dataset.photo || photoButton.dataset.photoKey);
    return;
  }

  if (noButton) {
    sweetenNo(noButton);
    return;
  }

  if (nextButton) {
    const screen = nextButton.closest(".screen");
    const screenNumber = Number(screen?.dataset.screen || currentScreen);

    markSceneChoice(screenNumber, "positive");
    createBurst(nextButton);
    flashFrameFight();
    setScreen(currentScreen + 1);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const photoButton = event.target.closest("[data-photo], [data-photo-key]");

  if (!photoButton) {
    return;
  }

  event.preventDefault();
  openPhoto(photoButton.dataset.photo || photoButton.dataset.photoKey);
});

musicButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMusic();
});

restartButton.addEventListener("click", () => {
  applySceneChoiceLabels();

  document.querySelectorAll(".answer.no, .answer[data-no-count]").forEach((button) => {
    button.classList.remove("is-playful", "is-glow", "next");
    button.classList.add("no");
    button.style.removeProperty("--no-x");
    button.style.removeProperty("--no-y");
    button.style.removeProperty("--no-tilt");
    button.dataset.no = "";
    delete button.dataset.noCount;
  });

  resetWishes();
  resetSceneChoices();
  endingShownThisRun = false;

  if (wishCompleteModal && wishCompleteModal.open) {
    wishCompleteModal.close();
  }

  if (endingModal && endingModal.open) {
    endingModal.close();
  }

  setScreen(0);
});

modalClose.addEventListener("click", () => modal.close());

galleryButton.addEventListener("click", (event) => {
  event.stopPropagation();
  buildGallery();

  if (typeof galleryModal.showModal === "function") {
    galleryModal.showModal();
  }
});

galleryClose.addEventListener("click", () => galleryModal.close());

if (secretClose) {
  secretClose.addEventListener("click", () => secretModal.close());
}

if (wishCompleteClose) {
  wishCompleteClose.addEventListener("click", (event) => {
    event.stopPropagation();
    wishCompleteModal.close();
  });
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

if (wishCompleteModal) {
  wishCompleteModal.addEventListener("close", resetWishes);

  wishCompleteModal.addEventListener("click", (event) => {
    if (event.target === wishCompleteModal) {
      wishCompleteModal.close();
    }
  });
}

setScreen(0);
applySceneChoiceLabels();
setupWishCompletePanel();
setupEndingPanel();
hydratePhotos();
