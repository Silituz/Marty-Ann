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
    <span class="frame-hero hero-prank"><span></span><i></i></span>
    <span class="frame-hero hero-shield"><span></span><i></i></span>
    <span class="frame-hero hero-shadow"><span></span><i></i></span>
    <span class="frame-hero hero-cape"><span></span><i></i></span>
    <span class="frame-hero hero-captain"><span></span><i></i></span>
    <span class="frame-hero hero-flyer"><span></span><i></i></span>
    <span class="frame-hero hero-green"><span></span><i></i></span>
  `;

  const downloadSelector = "#modalDownload, #download-photo, .modal-download, .download-photo, [data-download-photo]";
  const photoCount = 23;
  let currentPhotoNumber = 1;
  let wishObserverReady = false;
  let photoNavReady = false;

  const removeHeroExperimentStyles = () => {
    document.querySelectorAll("style").forEach(style => {
      const text = style.textContent || "";
      if (EXPERIMENT_STYLE_MARKERS.some(marker => text.includes(marker))) {
        style.remove();
      }
    });
  };

  const restoreChaosHeroes = stage => {
    if (!stage || stage.dataset.chaosHeroes === "true") return;
    stage.innerHTML = heroStageMarkup;
    stage.dataset.chaosHeroes = "true";
  };

  const keepChaosHeroes = () => {
    removeHeroExperimentStyles();
    document.querySelectorAll(".frame-hero-stage").forEach(restoreChaosHeroes);
  };

  const fileNameFrom = url => {
    try {
      return decodeURIComponent(new URL(url, window.location.href).pathname.split("/").pop() || "marty-ann-bild.jpg");
    } catch (_) {
      return "marty-ann-bild.jpg";
    }
  };

  const hideDownloadWhenEmpty = button => {
    if (!button) return;
    const href = button.getAttribute("href") || "";
    if (!href || href === "#") {
      button.hidden = true;
    }
  };

  const syncDownloadWithPreview = () => {
    const preview = document.querySelector("#photo-modal img, #photoModal img, .photo-modal img, .gallery-modal img, .lightbox img");
    const button = document.querySelector(downloadSelector);
    if (!preview || !button || !preview.src) {
      hideDownloadWhenEmpty(button);
      return;
    }

    button.href = preview.src;
    button.download = fileNameFrom(preview.src);
    button.hidden = false;
    button.setAttribute("aria-label", "Bild herunterladen");
  };

  const forceDownload = async link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    try {
      const response = await fetch(href, { mode: "cors" });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = link.getAttribute("download") || fileNameFrom(href);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1200);
    } catch (_) {
      window.location.href = href;
    }
  };

  const cleanFavoritePersonEmoji = () => {
    document.querySelectorAll("#wishCompleteModal p").forEach(element => {
      if (element.textContent && element.textContent.includes("favorite person")) {
        element.textContent = element.textContent.replace(/\s*[\u{1F970}\u{1F60D}]\s*/gu, " ").replace(/\s+/g, " ").trim();
      }
    });
  };

  const observeWishPanel = () => {
    if (wishObserverReady) return;
    const panel = document.querySelector("#wishCompleteModal .secret-card");
    if (!panel) return;
    wishObserverReady = true;
    new MutationObserver(cleanFavoritePersonEmoji).observe(panel, {
      childList: true,
      subtree: true,
      characterData: true
    });
  };

  const injectLightFeatureStyles = () => {
    if (document.querySelector("#martyLightFeatureStyles")) return;

    const style = document.createElement("style");
    style.id = "martyLightFeatureStyles";
    style.textContent = `
      #photoModal { position: relative; }
      .modal-gallery-nav {
        position: absolute;
        top: calc(50% - 23px);
        right: 8px;
        left: 8px;
        z-index: 9;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
      }
      .modal-nav-button {
        display: grid;
        width: 42px;
        height: 54px;
        place-items: center;
        border: 2px solid rgba(255, 248, 241, 0.45);
        border-radius: 8px;
        color: #120810;
        background: linear-gradient(135deg, rgba(255, 209, 102, 0.96), rgba(255, 122, 24, 0.96));
        box-shadow: 4px 5px 0 rgba(16, 9, 24, 0.78), 0 0 18px rgba(255, 122, 24, 0.35);
        font-size: 2rem;
        font-weight: 950;
        line-height: 1;
        pointer-events: auto;
        cursor: pointer;
      }
      .modal-nav-button:hover,
      .modal-nav-button:focus-visible { filter: brightness(1.12); transform: translateY(-2px); }
      .modal-nav-button:active { transform: translateY(1px) scale(0.96); }

      .ending-modal .ending-badge,
      #wishCompleteModal .wish-heart {
        position: relative;
        display: grid;
        width: 86px;
        height: 86px;
        place-items: center;
        justify-self: center;
        overflow: visible;
        border-radius: 50%;
        font-size: 0 !important;
        line-height: 1;
      }
      .ending-modal .ending-badge::before,
      .ending-modal .ending-badge::after,
      #wishCompleteModal .wish-heart::before,
      #wishCompleteModal .wish-heart::after {
        position: absolute;
        content: "";
        pointer-events: none;
      }
      .ending-modal.ending-good .ending-badge {
        background: radial-gradient(circle, rgba(255, 244, 168, 0.34), rgba(88, 231, 255, 0.12) 58%, transparent 64%);
        animation: goodBadgeFloat 2.7s ease-in-out infinite;
      }
      .ending-modal.ending-good .ending-badge::before {
        content: "\\2605";
        color: #fff4a8;
        text-shadow: 0 0 16px rgba(255, 236, 158, 0.98), 0 0 34px rgba(88, 231, 255, 0.6), 3px 3px 0 #100918;
        font-size: 4.1rem;
        animation: goodStarShine 1.8s ease-in-out infinite;
      }
      .ending-modal.ending-good .ending-badge::after {
        top: -2px;
        left: 50%;
        width: 56px;
        height: 18px;
        border: 3px solid rgba(255, 248, 241, 0.9);
        border-radius: 50%;
        box-shadow: 0 0 16px rgba(255, 236, 158, 0.86);
        transform: translateX(-50%) rotate(-8deg);
        animation: haloTilt 2.2s ease-in-out infinite;
      }
      .ending-modal.ending-normal .ending-badge::before {
        content: "\\2726";
        color: #ffd166;
        text-shadow: 0 0 14px rgba(255, 209, 102, 0.86), 0 0 24px rgba(88, 231, 255, 0.3), 3px 3px 0 #100918;
        font-size: 4.2rem;
        animation: normalCompassPulse 2.8s ease-in-out infinite;
      }
      .ending-modal.ending-normal .ending-badge::after {
        inset: 9px;
        border: 2px solid rgba(88, 231, 255, 0.42);
        border-radius: 50%;
        background: linear-gradient(90deg, transparent 48%, rgba(255, 248, 241, 0.42) 49% 51%, transparent 52%), linear-gradient(0deg, transparent 48%, rgba(255, 248, 241, 0.34) 49% 51%, transparent 52%);
        animation: normalCompassTurn 7.5s linear infinite;
      }
      .ending-modal.ending-villain .ending-badge {
        border-radius: 8px;
        animation: villainGlitch 1.65s steps(2, end) infinite;
      }
      .ending-modal.ending-villain .ending-badge::before {
        content: "!";
        color: #ffb24a;
        text-shadow: 0 0 12px rgba(255, 122, 24, 0.96), 4px 0 0 rgba(200, 25, 46, 0.62), -3px 3px 0 #100918;
        font-size: 4.8rem;
        font-weight: 950;
        animation: villainWarningPulse 0.92s ease-in-out infinite;
      }
      .ending-modal.ending-villain .ending-badge::after {
        inset: 12px 20px;
        border: 3px solid rgba(255, 122, 24, 0.65);
        border-radius: 7px;
        clip-path: polygon(50% 0, 100% 88%, 0 88%);
        transform: translateY(6px);
        animation: villainTriangleFlicker 1.1s ease-in-out infinite;
      }
      #wishCompleteModal .wish-heart::before {
        content: "\\2665";
        color: #ff7a18;
        text-shadow: 0 0 16px rgba(255, 122, 24, 0.95), 3px 3px 0 #100918;
        font-size: 3.8rem;
        animation: secretHeartBeat 1.25s ease-in-out infinite;
      }
      #wishCompleteModal .wish-heart::after {
        inset: 12px;
        border: 2px dashed rgba(255, 209, 102, 0.58);
        border-radius: 50%;
        animation: secretOrbit 8s linear infinite;
      }
    `;
    document.head.append(style);
  };

  const renderPhotoNumber = async number => {
    currentPhotoNumber = ((number - 1 + photoCount) % photoCount) + 1;
    const modalPreview = document.querySelector("#modalPreview");
    const modalCaption = document.querySelector("#modalCaption");

    if (typeof window.resolveImage === "function" && modalPreview) {
      const src = await window.resolveImage(currentPhotoNumber);
      if (src) {
        modalPreview.classList.add("has-image");
        modalPreview.innerHTML = "";
        const image = document.createElement("img");
        image.src = encodeURI(src);
        image.alt = "Birthday photo preview";
        modalPreview.append(image);
        if (modalCaption) modalCaption.textContent = src.replace("assets/", "");
      }
    }

    syncDownloadWithPreview();
  };

  const setupPhotoNavigation = () => {
    if (photoNavReady) return;
    const modal = document.querySelector("#photoModal");
    if (!modal) return;
    photoNavReady = true;

    const nav = document.createElement("div");
    nav.className = "modal-gallery-nav";
    nav.innerHTML = `
      <button class="modal-nav-button" type="button" data-gallery-step="-1" aria-label="Vorheriges Bild">‹</button>
      <button class="modal-nav-button" type="button" data-gallery-step="1" aria-label="Nächstes Bild">›</button>
    `;
    modal.append(nav);
  };

  const setupLightEnhancements = () => {
    keepChaosHeroes();
    injectLightFeatureStyles();
    cleanFavoritePersonEmoji();
    observeWishPanel();
    setupPhotoNavigation();
    syncDownloadWithPreview();
  };

  keepChaosHeroes();

  const baseScript = document.createElement("script");
  baseScript.src = "https://cdn.jsdelivr.net/gh/Silituz/Marty-Ann@a6f231b1ffa68ea111ac905746e2db7a92c6edc1/script.js";
  baseScript.async = false;
  baseScript.onload = setupLightEnhancements;
  baseScript.onerror = setupLightEnhancements;
  document.currentScript.after(baseScript);

  document.addEventListener("DOMContentLoaded", setupLightEnhancements);
  window.addEventListener("load", setupLightEnhancements);

  document.addEventListener("click", event => {
    keepChaosHeroes();

    const navButton = event.target.closest("[data-gallery-step]");
    if (navButton) {
      event.preventDefault();
      event.stopPropagation();
      renderPhotoNumber(currentPhotoNumber + Number(navButton.dataset.galleryStep || 0));
      return;
    }

    const downloadLink = event.target.closest(downloadSelector);
    if (downloadLink) {
      syncDownloadWithPreview();
      event.preventDefault();
      forceDownload(downloadLink);
      return;
    }

    const photoTarget = event.target.closest("[data-photo-key], .photo-card, .gallery-card, .memory-card");
    if (photoTarget) {
      const key = Number(photoTarget.dataset.photoKey || "");
      if (key) currentPhotoNumber = key;
      setTimeout(syncDownloadWithPreview, 80);
      setTimeout(syncDownloadWithPreview, 250);
    }
  }, true);
})();
