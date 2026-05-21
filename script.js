(() => {
  const EXPERIMENT_STYLE_MARKERS = [
    "separatedWebPatrol",
    "heroStrideA",
    "separatedPrankDash",
    "separatedFlyerLoop",
    "separatedShieldRun"
  ];

  const heroStageMarkup = `
    <span class="impact-puff puff-one">BAM</span>
    <span class="impact-puff puff-two">ZAP</span>
    <span class="frame-hero hero-web"><span></span><i></i></span>
    <span class="frame-hero hero-mystic"><span></span><i></i></span>
    <span class="frame-hero hero-red"><span></span><i></i></span>
    <span class="frame-hero hero-shadow"><span></span><i></i></span>
    <span class="frame-hero hero-metal"><span></span><i></i></span>
    <span class="frame-hero hero-green"><span></span><i></i></span>
    <span class="frame-hero hero-shield"><span></span><i></i></span>
    <span class="frame-hero hero-hammer"><span></span><i></i></span>
  `;

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
  const imageCache = new Map();
  const photoCount = 23;
  let currentPhotoNumber = 1;
  let lastEndingEffectKey = "";

  const removeHeroExperimentStyles = () => {
    document.querySelectorAll("style").forEach((style) => {
      if (EXPERIMENT_STYLE_MARKERS.some((marker) => style.textContent.includes(marker))) {
        style.remove();
      }
    });
  };

  const restoreChaosHeroes = () => {
    removeHeroExperimentStyles();

    const stage = document.querySelector(".frame-hero-stage");

    if (!stage || stage.dataset.heroMode === "solo-chaos") {
      return;
    }

    stage.innerHTML = heroStageMarkup;
    stage.dataset.heroMode = "solo-chaos";
  };

  const keepChaosHeroes = () => {
    restoreChaosHeroes();
    requestAnimationFrame(restoreChaosHeroes);
    setTimeout(restoreChaosHeroes, 50);
    setTimeout(restoreChaosHeroes, 250);
    setTimeout(restoreChaosHeroes, 800);
    setTimeout(restoreChaosHeroes, 1800);
  };

  keepChaosHeroes();

  const baseScript = document.createElement("script");
  baseScript.src = "https://cdn.jsdelivr.net/gh/Silituz/Marty-Ann@a6f231b1ffa68ea111ac905746e2db7a92c6edc1/script.js";
  baseScript.async = false;
  baseScript.addEventListener("load", () => {
    keepChaosHeroes();
    setupExtraFeatures();
  }, { once: true });
  document.currentScript.after(baseScript);

  const fileNameFrom = (src) => {
    const cleanSrc = src.split("?")[0].split("#")[0];
    const name = decodeURIComponent(cleanSrc.split("/").pop() || "marty-ann-photo");
    return name.includes(".") ? name : `${name}.jpg`;
  };

  const imageCandidates = (numberOrPath) => {
    if (typeof numberOrPath === "string" && numberOrPath.includes("/")) {
      return [numberOrPath];
    }

    const number = Number(numberOrPath);
    return imageNamePatterns.flatMap((pattern) => (
      imageExtensions.map((extension) => `assets/${pattern(number)}.${extension}`)
    ));
  };

  const tryImage = (src) => {
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
  };

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

  const hideDownload = () => {
    const downloadButton = document.querySelector("#modalDownload");

    if (!downloadButton) {
      return;
    }

    downloadButton.hidden = true;
    downloadButton.removeAttribute("href");
    downloadButton.removeAttribute("download");
  };

  const syncDownload = () => {
    const modalPreview = document.querySelector("#modalPreview");
    const downloadButton = document.querySelector("#modalDownload");
    const image = modalPreview?.querySelector("img");
    const src = image?.getAttribute("src");

    if (!downloadButton || !src) {
      hideDownload();
      return;
    }

    downloadButton.href = src;
    downloadButton.download = fileNameFrom(src);
    downloadButton.hidden = false;
  };

  async function forceDownload(src, filename) {
    const response = await fetch(src, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Image download failed");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  const renderPhotoPreview = async (photoNumber) => {
    const modal = document.querySelector("#photoModal");
    const modalPreview = document.querySelector("#modalPreview");
    const modalCaption = document.querySelector("#modalCaption");

    if (!modal || !modalPreview) {
      return;
    }

    currentPhotoNumber = ((photoNumber - 1 + photoCount) % photoCount) + 1;
    modal.dataset.currentPhoto = String(currentPhotoNumber);
    modalPreview.classList.add("is-switching");

    const src = await resolveImage(currentPhotoNumber);

    modalPreview.classList.remove("is-switching");

    if (src) {
      modalPreview.classList.add("has-image");
      modalPreview.innerHTML = "";

      const image = document.createElement("img");
      image.src = encodeURI(src);
      image.alt = `Birthday photo ${currentPhotoNumber}`;
      modalPreview.append(image);

      if (modalCaption) {
        modalCaption.textContent = src.replace("assets/", "");
      }
    } else {
      modalPreview.classList.remove("has-image");
      modalPreview.innerHTML = "Photo coming soon";

      if (modalCaption) {
        modalCaption.textContent = `Photo ${currentPhotoNumber} has no image file yet.`;
      }
    }

    syncDownload();

    if (!modal.open && typeof modal.showModal === "function") {
      modal.showModal();
    }
  };

  const navigatePhoto = (direction) => {
    renderPhotoPreview(currentPhotoNumber + direction);
  };

  const setupGalleryNavigation = () => {
    const modal = document.querySelector("#photoModal");
    const modalPreview = document.querySelector("#modalPreview");

    if (!modal || !modalPreview || modal.querySelector(".modal-gallery-nav")) {
      return;
    }

    const nav = document.createElement("div");
    nav.className = "modal-gallery-nav";
    nav.innerHTML = `
      <button class="modal-nav-button modal-prev" type="button" aria-label="Previous photo">‹</button>
      <button class="modal-nav-button modal-next" type="button" aria-label="Next photo">›</button>
    `;
    modalPreview.after(nav);

    nav.querySelector(".modal-prev")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigatePhoto(-1);
    });

    nav.querySelector(".modal-next")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigatePhoto(1);
    });
  };

  const cleanFavoritePersonEmoji = () => {
    const modal = document.querySelector("#wishCompleteModal");
    const text = modal?.querySelector(".secret-card p:last-child");

    if (!text) {
      return;
    }

    text.textContent = text.textContent.replace(/\s*🥰\s*/gu, "").trim();
  };

  const startEndingEffect = (type) => {
    const key = `${type}-${Date.now()}`;
    lastEndingEffectKey = key;

    const effect = document.createElement("div");
    effect.className = `ending-effect ending-effect-${type}`;
    effect.setAttribute("aria-hidden", "true");

    const count = type === "villain" ? 14 : 18;

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.style.setProperty("--x", `${Math.round(Math.random() * 260 - 130)}px`);
      particle.style.setProperty("--y", `${Math.round(Math.random() * 220 - 130)}px`);
      particle.style.setProperty("--delay", `${(Math.random() * 0.3).toFixed(2)}s`);
      effect.append(particle);
    }

    document.body.append(effect);
    setTimeout(() => {
      if (lastEndingEffectKey === key) {
        lastEndingEffectKey = "";
      }
      effect.remove();
    }, 1850);
  };

  const watchEndingModals = () => {
    const maybeStart = () => {
      const modal = document.querySelector("dialog.ending-modal[open]");

      if (!modal) {
        return;
      }

      const type = modal.classList.contains("ending-villain")
        ? "villain"
        : modal.classList.contains("ending-normal")
          ? "normal"
          : "good";
      const effectKey = `${type}-${modal.getAttribute("open")}-${modal.dataset.effectRun || ""}`;

      if (modal.dataset.effectRun === effectKey) {
        return;
      }

      modal.dataset.effectRun = effectKey;
      startEndingEffect(type);
    };

    new MutationObserver(maybeStart).observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "open"]
    });
    maybeStart();
  };

  const observePreview = () => {
    const modal = document.querySelector("#photoModal");
    const modalPreview = document.querySelector("#modalPreview");

    if (!modalPreview) {
      return;
    }

    new MutationObserver(syncDownload).observe(modalPreview, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"]
    });

    modal?.addEventListener("close", hideDownload);
  };

  const setupExtraFeatures = () => {
    setupGalleryNavigation();
    cleanFavoritePersonEmoji();
    watchEndingModals();

    const wishModal = document.querySelector("#wishCompleteModal");

    if (wishModal) {
      new MutationObserver(cleanFavoritePersonEmoji).observe(wishModal, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  };

  document.addEventListener("click", async (event) => {
    keepChaosHeroes();

    const downloadButton = event.target.closest("#modalDownload");

    if (!downloadButton) {
      const photoTarget = event.target.closest("[data-photo], [data-photo-key]");

      if (photoTarget) {
        const photoKey = Number(photoTarget.dataset.photoKey);

        if (Number.isFinite(photoKey) && photoKey > 0) {
          currentPhotoNumber = photoKey;
        }

        setTimeout(syncDownload, 180);
        setTimeout(syncDownload, 520);
        setTimeout(syncDownload, 1000);
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const previewImage = document.querySelector("#modalPreview img");
    const src = downloadButton.getAttribute("href") || previewImage?.getAttribute("src");

    if (!src || src === "#") {
      return;
    }

    const filename = downloadButton.getAttribute("download") || fileNameFrom(src);

    try {
      await forceDownload(src, filename);
    } catch {
      const fallback = document.createElement("a");
      fallback.href = src;
      fallback.download = filename;
      fallback.style.display = "none";
      document.body.append(fallback);
      fallback.click();
      fallback.remove();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    const modal = document.querySelector("#photoModal");

    if (!modal?.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigatePhoto(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigatePhoto(1);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      keepChaosHeroes();
      observePreview();
      hideDownload();
      setupExtraFeatures();
    });
  } else {
    keepChaosHeroes();
    observePreview();
    hideDownload();
    setupExtraFeatures();
  }

  window.addEventListener("load", () => {
    keepChaosHeroes();
    setupExtraFeatures();
  }, { once: true });
})();