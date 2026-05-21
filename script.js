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

  const setupLightEnhancements = () => {
    keepChaosHeroes();
    cleanFavoritePersonEmoji();
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

    const downloadLink = event.target.closest(downloadSelector);
    if (downloadLink) {
      syncDownloadWithPreview();
      event.preventDefault();
      forceDownload(downloadLink);
      return;
    }

    if (event.target.closest("[data-photo-key], .photo-card, .gallery-card, .memory-card")) {
      setTimeout(syncDownloadWithPreview, 80);
      setTimeout(syncDownloadWithPreview, 250);
    }
  }, true);
})();
