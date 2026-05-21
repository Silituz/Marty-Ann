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
  baseScript.addEventListener("load", keepChaosHeroes, { once: true });
  document.currentScript.after(baseScript);

  const fileNameFrom = (src) => {
    const cleanSrc = src.split("?")[0].split("#")[0];
    const name = decodeURIComponent(cleanSrc.split("/").pop() || "marty-ann-photo");
    return name.includes(".") ? name : `${name}.jpg`;
  };

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

  document.addEventListener("click", async (event) => {
    keepChaosHeroes();

    const downloadButton = event.target.closest("#modalDownload");

    if (!downloadButton) {
      if (event.target.closest("[data-photo], [data-photo-key]")) {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      keepChaosHeroes();
      observePreview();
      hideDownload();
    });
  } else {
    keepChaosHeroes();
    observePreview();
    hideDownload();
  }

  window.addEventListener("load", keepChaosHeroes, { once: true });
})();