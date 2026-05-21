(() => {
  const EXPERIMENT_STYLE_MARKERS = [
    "separatedWebPatrol",
    "heroStrideA",
    "separatedPrankDash",
    "separatedFlyerLoop",
    "separatedShieldRun"
  ];

  const removeHeroExperimentStyles = () => {
    document.querySelectorAll("style").forEach((style) => {
      if (EXPERIMENT_STYLE_MARKERS.some((marker) => style.textContent.includes(marker))) {
        style.remove();
      }
    });
  };

  const keepOriginalHeroes = () => {
    removeHeroExperimentStyles();
    requestAnimationFrame(removeHeroExperimentStyles);
    setTimeout(removeHeroExperimentStyles, 50);
    setTimeout(removeHeroExperimentStyles, 250);
    setTimeout(removeHeroExperimentStyles, 800);
    setTimeout(removeHeroExperimentStyles, 1800);
  };

  keepOriginalHeroes();

  const baseScript = document.createElement("script");
  baseScript.src = "https://cdn.jsdelivr.net/gh/Silituz/Marty-Ann@a6f231b1ffa68ea111ac905746e2db7a92c6edc1/script.js";
  baseScript.async = false;
  baseScript.addEventListener("load", keepOriginalHeroes, { once: true });
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
    keepOriginalHeroes();

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
      keepOriginalHeroes();
      observePreview();
      hideDownload();
    });
  } else {
    keepOriginalHeroes();
    observePreview();
    hideDownload();
  }

  window.addEventListener("load", keepOriginalHeroes, { once: true });
})();