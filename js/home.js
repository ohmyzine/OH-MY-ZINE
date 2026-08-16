(() => {
  "use strict";

  const recommendationGrid = document.querySelector("#recommendation-grid");
  const shuffleButton = document.querySelector("#recommendation-shuffle");
  const magazineWindow = document.querySelector(".magazine-window");
  const minimizeButton = document.querySelector("#window-minimize");
  const maximizeButton = document.querySelector("#window-maximize");
  const closeButton = document.querySelector("#window-close");
  const reopenButton = document.querySelector("#window-reopen");
  const closedScreen = document.querySelector("#closed-screen");
  const systemBar = document.querySelector(".system-bar");
  const softCursor = document.querySelector("#soft-cursor");
  const portalBrand = document.querySelector(".portal-brand");

  const fallbackArticles = [
    {
      title: "NewJeans『Attention』のファッションを読み解く",
      url: "article.html",
      category: "FASHION / MUSIC / Y2K",
      image: "images/attention-main.jpg",
      description:
        "スポーツウェア、HIPHOP、R&B。その背景にあるカルチャーを辿ります。",
    },
  ];

  let articles = fallbackArticles;

  function setRandomBrandLogo() {
    if (!portalBrand) {
      return;
    }

    const logos = [
      {
        src: "images/oh-my-zine-soft-logo.png",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-rough-horizontal.png",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-cookie.png",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-toy.png",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-textile-paper.png",
        isStacked: false,
      },
    ];
    let previousIndex = -1;

    try {
      previousIndex = Number.parseInt(
        sessionStorage.getItem("oh-my-zine-last-logo") || "-1",
        10,
      );
    } catch (error) {
      previousIndex = -1;
    }

    const availableIndexes = logos
      .map((logo, index) => index)
      .filter((index) => index !== previousIndex);
    const selectedIndex = availableIndexes[
      Math.floor(Math.random() * availableIndexes.length)
    ] ?? 0;
    const selectedLogo = logos[selectedIndex];

    portalBrand.src = selectedLogo.src;
    portalBrand.classList.toggle("is-stacked", selectedLogo.isStacked);

    try {
      sessionStorage.setItem("oh-my-zine-last-logo", String(selectedIndex));
    } catch (error) {
      // The logo still changes when session storage is unavailable.
    }
  }

  function setWindowMinimized(isMinimized) {
    if (!magazineWindow || !minimizeButton || !maximizeButton) {
      return;
    }

    magazineWindow.classList.toggle("is-minimized", isMinimized);
    minimizeButton.setAttribute("aria-pressed", String(isMinimized));

    if (isMinimized) {
      magazineWindow.classList.remove("is-maximized");
      document.body.classList.remove("window-maximized");
      maximizeButton.setAttribute("aria-pressed", "false");
      window.OhMyZineSharedUI?.setSearchOpen?.(false);
    }
  }

  function setWindowMaximized(isMaximized) {
    if (!magazineWindow || !minimizeButton || !maximizeButton) {
      return;
    }

    magazineWindow.classList.toggle("is-maximized", isMaximized);
    document.body.classList.toggle("window-maximized", isMaximized);
    maximizeButton.setAttribute("aria-pressed", String(isMaximized));

    if (isMaximized) {
      magazineWindow.classList.remove("is-minimized");
      minimizeButton.setAttribute("aria-pressed", "false");
    }
  }

  function closeMagazineWindow() {
    if (!magazineWindow || !closedScreen) {
      return;
    }

    window.OhMyZineSharedUI?.setSearchOpen?.(false);
    setWindowMinimized(false);
    setWindowMaximized(false);
    magazineWindow.hidden = true;
    closedScreen.hidden = false;
    reopenButton?.focus();
  }

  function reopenMagazineWindow() {
    if (!magazineWindow || !closedScreen) {
      return;
    }

    closedScreen.hidden = true;
    magazineWindow.hidden = false;
    minimizeButton?.focus();
  }

  let windowPositionX = 0;
  let windowPositionY = 0;
  let dragState = null;
  let didWindowDrag = false;

  function setWindowPosition(x, y) {
    if (!magazineWindow) {
      return;
    }

    windowPositionX = x;
    windowPositionY = y;
    magazineWindow.style.setProperty("--window-x", `${x}px`);
    magazineWindow.style.setProperty("--window-y", `${y}px`);
  }

  function resetWindowPosition() {
    setWindowPosition(0, 0);
  }

  systemBar?.addEventListener("pointerdown", (event) => {
    if (
      event.button !== 0 ||
      event.target.closest("button, input, label") ||
      magazineWindow?.classList.contains("is-maximized")
    ) {
      return;
    }

    const rect = magazineWindow?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      startWindowX: windowPositionX,
      startWindowY: windowPositionY,
      width: rect.width,
    };
    didWindowDrag = false;

    systemBar.setPointerCapture(event.pointerId);
    magazineWindow?.classList.add("is-dragging");
    softCursor?.classList.add("is-dragging");
    event.preventDefault();
  });

  systemBar?.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (Math.abs(deltaX) + Math.abs(deltaY) > 5) {
      didWindowDrag = true;
    }

    const visibleEdge = 130;
    const nextLeft = Math.min(
      window.innerWidth - visibleEdge,
      Math.max(-(dragState.width - visibleEdge), dragState.startLeft + deltaX),
    );
    const nextTop = Math.min(
      window.innerHeight - 44,
      Math.max(0, dragState.startTop + deltaY),
    );

    setWindowPosition(
      dragState.startWindowX + nextLeft - dragState.startLeft,
      dragState.startWindowY + nextTop - dragState.startTop,
    );
  });

  function endWindowDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    dragState = null;
    magazineWindow?.classList.remove("is-dragging");
    softCursor?.classList.remove("is-dragging");
  }

  systemBar?.addEventListener("pointerup", endWindowDrag);
  systemBar?.addEventListener("pointercancel", endWindowDrag);
  systemBar?.addEventListener("click", (event) => {
    if (didWindowDrag) {
      event.preventDefault();
      didWindowDrag = false;
    }
  });

  function shuffled(items) {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }

    return result;
  }

  function createArticleCard(article) {
    const link = document.createElement("a");
    link.className = "recommendation-card";
    link.href = article.url;

    const image = document.createElement("img");
    image.src = article.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";

    const copy = document.createElement("span");
    copy.className = "recommendation-copy";

    const category = document.createElement("small");
    category.textContent = article.category;

    const title = document.createElement("strong");
    title.textContent = article.title;

    const description = document.createElement("span");
    description.textContent = article.description;

    copy.append(category, title, description);
    link.append(image, copy);

    return link;
  }

  function createSoonCard() {
    const card = document.createElement("div");
    card.className = "recommendation-card recommendation-soon";

    const number = document.createElement("b");
    number.textContent = "02";

    const copy = document.createElement("span");
    copy.className = "recommendation-copy";

    const label = document.createElement("small");
    label.textContent = "NEXT PICK";

    const title = document.createElement("strong");
    title.textContent = "NEW ARTICLE SOON";

    const description = document.createElement("span");
    description.textContent = "記事が増えると、ここにもランダムで表示されます。";

    copy.append(label, title, description);
    card.append(number, copy);

    return card;
  }

  function renderRecommendations() {
    if (!recommendationGrid) {
      return;
    }

    recommendationGrid.replaceChildren();

    const selected = shuffled(articles).slice(0, 2);
    selected.forEach((article) => {
      recommendationGrid.append(createArticleCard(article));
    });

    while (recommendationGrid.children.length < 2) {
      recommendationGrid.append(createSoonCard());
    }
  }

  async function loadArticles() {
    try {
      const loadedArticles = window.OhMyZineSharedUI?.getArticles
        ? await window.OhMyZineSharedUI.getArticles()
        : await fetch("data/articles.json", { cache: "no-store" }).then((response) => {
            if (!response.ok) throw new Error("記事一覧を読み込めませんでした");
            return response.json();
          });

      if (Array.isArray(loadedArticles) && loadedArticles.length > 0) {
        articles = loadedArticles;
      }
    } catch (error) {
      console.info("既定の記事一覧を表示します", error);
    }

    renderRecommendations();
  }

  shuffleButton?.addEventListener("click", renderRecommendations);
  minimizeButton?.addEventListener("click", () => {
    setWindowMinimized(!magazineWindow?.classList.contains("is-minimized"));
  });
  maximizeButton?.addEventListener("click", () => {
    const willMaximize = !magazineWindow?.classList.contains("is-maximized");

    if (willMaximize) {
      resetWindowPosition();
    }

    setWindowMaximized(willMaximize);
  });
  closeButton?.addEventListener("click", closeMagazineWindow);
  reopenButton?.addEventListener("click", reopenMagazineWindow);
  setRandomBrandLogo();
  loadArticles();


  const DB_NAME = "oh-my-zine-photo-cabinet";
  const STORE_NAME = "photos";
  const MAX_FILE_SIZE = 12 * 1024 * 1024;
  const MAX_PHOTOS = 30;

  const photoInput = document.querySelector("#photo-vault-input");
  const photoImage = document.querySelector("#photo-vault-image");
  const photoCount = document.querySelector("#photo-count");
  const photoPrevious = document.querySelector("#photo-previous");
  const photoNext = document.querySelector("#photo-next");
  const photoDelete = document.querySelector("#photo-delete");
  const photoMessage = document.querySelector("#photo-vault-message");

  let savedPhotos = [];
  let currentPhotoIndex = 0;
  let currentObjectUrl = "";

  function openPhotoDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.addEventListener("upgradeneeded", () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      });

      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async function readSavedPhotos() {
    const database = await openPhotoDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.addEventListener("success", () => {
        database.close();
        resolve(request.result.sort((a, b) => a.createdAt - b.createdAt));
      });

      request.addEventListener("error", () => {
        database.close();
        reject(request.error);
      });
    });
  }

  async function savePhoto(file) {
    const database = await openPhotoDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const request = transaction.objectStore(STORE_NAME).add({
        blob: file,
        name: file.name,
        createdAt: Date.now() + Math.random(),
      });

      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
      transaction.addEventListener("complete", () => database.close());
    });
  }

  async function removePhoto(id) {
    const database = await openPhotoDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const request = transaction.objectStore(STORE_NAME).delete(id);

      request.addEventListener("success", resolve);
      request.addEventListener("error", () => reject(request.error));
      transaction.addEventListener("complete", () => database.close());
    });
  }

  function showPhotoMessage(message) {
    if (photoMessage) {
      photoMessage.textContent = message;
    }
  }

  function renderPhoto() {
    if (!photoImage || !photoCount || !photoPrevious || !photoNext || !photoDelete) {
      return;
    }

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = "";
    }

    const hasPhotos = savedPhotos.length > 0;
    photoPrevious.disabled = !hasPhotos;
    photoNext.disabled = !hasPhotos;
    photoDelete.disabled = !hasPhotos;

    if (!hasPhotos) {
      photoImage.src = "images/free-skater-close.jpg";
      photoImage.alt = "スケートボードを持つ人の写真";
      photoCount.textContent = "SAMPLE";
      return;
    }

    currentPhotoIndex = Math.min(currentPhotoIndex, savedPhotos.length - 1);
    const photo = savedPhotos[currentPhotoIndex];
    currentObjectUrl = URL.createObjectURL(photo.blob);
    photoImage.src = currentObjectUrl;
    photoImage.alt = photo.name || "マイフォトキャビネットの写真";
    photoCount.textContent = `${currentPhotoIndex + 1} / ${savedPhotos.length}`;
  }

  async function refreshPhotoVault() {
    try {
      savedPhotos = await readSavedPhotos();
      renderPhoto();
    } catch (error) {
      showPhotoMessage("このブラウザでは写真を保存できません");
      console.info("写真倉庫を開けませんでした", error);
    }
  }

  photoInput?.addEventListener("change", async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = Math.max(0, MAX_PHOTOS - savedPhotos.length);
    const acceptedFiles = selectedFiles
      .filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE)
      .slice(0, remainingSlots);

    if (acceptedFiles.length === 0) {
      showPhotoMessage("12MB以下の画像を選んでください");
      event.target.value = "";
      return;
    }

    try {
      for (const file of acceptedFiles) {
        await savePhoto(file);
      }

      savedPhotos = await readSavedPhotos();
      currentPhotoIndex = Math.max(0, savedPhotos.length - acceptedFiles.length);
      renderPhoto();
      showPhotoMessage(`写真を${acceptedFiles.length}枚保存しました`);
    } catch (error) {
      showPhotoMessage("保存容量が足りない可能性があります");
      console.info("写真を保存できませんでした", error);
    }

    event.target.value = "";
  });

  photoPrevious?.addEventListener("click", () => {
    if (savedPhotos.length === 0) {
      return;
    }

    currentPhotoIndex =
      (currentPhotoIndex - 1 + savedPhotos.length) % savedPhotos.length;
    renderPhoto();
  });

  photoNext?.addEventListener("click", () => {
    if (savedPhotos.length === 0) {
      return;
    }

    currentPhotoIndex = (currentPhotoIndex + 1) % savedPhotos.length;
    renderPhoto();
  });

  photoDelete?.addEventListener("click", async () => {
    const photo = savedPhotos[currentPhotoIndex];

    if (!photo) {
      return;
    }

    try {
      await removePhoto(photo.id);
      savedPhotos = await readSavedPhotos();
      currentPhotoIndex = Math.max(0, currentPhotoIndex - 1);
      renderPhoto();
      showPhotoMessage("写真を削除しました");
    } catch (error) {
      showPhotoMessage("写真を削除できませんでした");
      console.info("写真を削除できませんでした", error);
    }
  });

  window.addEventListener("beforeunload", () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }
  });

  refreshPhotoVault();
})();
