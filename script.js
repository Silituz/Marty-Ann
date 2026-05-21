(() => {
  const baseScript = document.createElement("script");
  baseScript.src = "https://cdn.jsdelivr.net/gh/Silituz/Marty-Ann@a6f231b1ffa68ea111ac905746e2db7a92c6edc1/script.js";
  baseScript.async = false;
  document.currentScript.after(baseScript);

  const fileNameFrom = (src) => {
    const cleanSrc = src.split("?")[0].split("#")[0];
    const name = decodeURIComponent(cleanSrc.split("/").pop() || "marty-ann-photo");
    return name.includes(".") ? name : `${name}.jpg`;
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

  document.addEventListener("click", async (event) => {
    const downloadButton = event.target.closest("#modalDownload");

    if (!downloadButton) {
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
})();
