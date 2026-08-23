(() => {
  "use strict";

  if (window.OHMYZINE_OS_STAGE_HOST) return;

  const MANIFEST_URL = "data/photos.json";

  const grid = document.querySelector("#photo-grid");
  const empty = document.querySelector("#photo-empty");
  const total = document.querySelector("#photo-total");
  const message = document.querySelector("#photo-library-message");
  const loadedCount = document.querySelector("#photo-loaded-count");

  const viewer = document.querySelector("#photo-viewer");
  const viewerImage = document.querySelector("#photo-viewer-image");
  const viewerName = document.querySelector("#photo-viewer-name");
  const viewerCount = document.querySelector("#photo-viewer-count");
  const viewerClose = document.querySelector("#photo-viewer-close");
  const viewerPrev = document.querySelector("#photo-viewer-prev");
  const viewerNext = document.querySelector("#photo-viewer-next");

  let photos = [];
  let viewerIndex = 0;

  function setMessage(text) {
    if (message) message.textContent = text;
  }

  function normalizePhotoEntry(entry, index) {
    if (typeof entry === "string") {
      return {
        src: `images/photos/${entry}`,
        name: entry,
        alt: entry,
      };
    }

    const file = entry?.file || "";
    const src = entry?.src || (file ? `images/photos/${file}` : "");

    return {
      src,
      name: entry?.title || entry?.name || file || `PHOTO_${String(index + 1).padStart(3, "0")}`,
      alt: entry?.alt || entry?.title || entry?.name || file || `PHOTO ${index + 1}`,
      caption: entry?.caption || "",
      date: entry?.date || "",
    };
  }

  function renderGrid() {
    grid.querySelectorAll(".photo-tile").forEach((tile) => tile.remove());

    total.textContent = String(photos.length).padStart(3, "0");
    loadedCount.textContent = `${String(photos.length).padStart(3, "0")} PHOTOS`;
    empty.hidden = photos.length > 0;

    photos.forEach((photo, index) => {
      const tile = document.createElement("article");
      tile.className = "photo-tile";

      const open = document.createElement("button");
      open.type = "button";
      open.className = "photo-tile-open";
      open.setAttribute("aria-label", `${photo.name}を開く`);

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = index < 8 ? "eager" : "lazy";
      img.decoding = "async";

      const meta = document.createElement("span");
      meta.className = "photo-tile-name";
      meta.textContent = photo.name;

      open.append(img);
      tile.append(open, meta);
      grid.append(tile);

      open.addEventListener("click", () => openViewer(index));
    });
  }

  async function loadPhotos() {
    setMessage("LOADING PHOTO ARCHIVE...");

    try {
      const response = await fetch(MANIFEST_URL, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const entries = Array.isArray(data) ? data : Array.isArray(data.photos) ? data.photos : [];

      photos = entries
        .map(normalizePhotoEntry)
        .filter((photo) => photo.src);

      renderGrid();
      setMessage(photos.length ? "PUBLIC ARCHIVE / READY" : "PUBLIC ARCHIVE / EMPTY");
    } catch (error) {
      photos = [];
      renderGrid();
      setMessage("PHOTO ARCHIVE LOAD ERROR");
      console.info("PHOTO manifest load failed", error);
    }
  }

  function openViewer(index) {
    if (!photos.length) return;

    viewerIndex = Math.max(0, Math.min(index, photos.length - 1));
    renderViewer();

    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
  }

  function renderViewer() {
    const photo = photos[viewerIndex];
    if (!photo) return;

    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt;
    viewerName.textContent = photo.name;
    viewerCount.textContent = `${viewerIndex + 1} / ${photos.length}`;
  }

  function closeViewer() {
    if (viewer.open && typeof viewer.close === "function") viewer.close();
    else viewer.removeAttribute("open");
  }

  viewerClose?.addEventListener("click", closeViewer);

  viewerPrev?.addEventListener("click", () => {
    if (!photos.length) return;
    viewerIndex = (viewerIndex - 1 + photos.length) % photos.length;
    renderViewer();
  });

  viewerNext?.addEventListener("click", () => {
    if (!photos.length) return;
    viewerIndex = (viewerIndex + 1) % photos.length;
    renderViewer();
  });

  viewer?.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });

  window.addEventListener("keydown", (event) => {
    if (!viewer?.open) return;
    if (event.key === "ArrowLeft") viewerPrev?.click();
    if (event.key === "ArrowRight") viewerNext?.click();
    if (event.key === "Escape") closeViewer();
  });

  loadPhotos();
})();
