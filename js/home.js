(() => {
  "use strict";

  if (window.OHMYZINE_OS_STAGE_HOST) return;

  const recommendationGrid = document.querySelector("#recommendation-grid");
  const shuffleButton = document.querySelector("#recommendation-shuffle");
  const magazineWindow = document.querySelector(".magazine-window");
  const controlsRoot = document.documentElement.classList.contains("ohmy-native-phone-stage")
    ? document.querySelector(".phone-fashion-header")
    : document.querySelector(".desktop-site-titlebar");
  const minimizeButton = controlsRoot?.querySelector('[data-window-action="minimize"], #window-minimize');
  const maximizeButton = controlsRoot?.querySelector('[data-window-action="maximize"], #window-maximize');
  const closeButton = controlsRoot?.querySelector('[data-window-action="close"], #window-close');
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
        src: "images/oh-my-zine-soft-logo.webp",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-rough-horizontal.webp",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-cookie.webp",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-toy.webp",
        isStacked: false,
      },
      {
        src: "images/oh-my-zine-textile-paper.webp",
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
      window.OhMyZineSharedUI?.resetWindowPosition?.();
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

(() => {
  "use strict";

  const widget = document.querySelector("#magazine-collection-widget");
  const infoButton = document.querySelector("#magazine-info-button");
  const infoPanel = document.querySelector("#magazine-info-panel");
  const closeButton = document.querySelector("#magazine-close-button");
  const readButton = document.querySelector("#magazine-read-button");
  const reviewDrawer = document.querySelector("#magazine-review-drawer");

  if (!widget || !closeButton) {
    return;
  }

  const setExpanded = (button, panel, expanded) => {
    if (!button || !panel) {
      return;
    }

    button.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
  };

  infoButton?.addEventListener("click", () => {
    const expanded = infoButton.getAttribute("aria-expanded") !== "true";
    setExpanded(infoButton, infoPanel, expanded);
  });

  readButton?.addEventListener("click", () => {
    const expanded = readButton.getAttribute("aria-expanded") !== "true";
    setExpanded(readButton, reviewDrawer, expanded);
    readButton.querySelector("span").textContent = expanded
      ? "CLOSE REVIEWS"
      : "READ REVIEWS";
    readButton.querySelector("b").textContent = expanded ? "▼" : "▶";
  });

  closeButton.addEventListener("click", () => {
    widget.hidden = true;
  });
})();

/* =========================
   FREE DESKTOP PET / PARODY INSTALLER
   A harmless in-page gimmick. No file is actually downloaded or installed.
========================= */
(() => {
  "use strict";

  const ad = document.querySelector("#desktop-pet-ad");
  if (!ad) return;

  const PET_POSITION_KEY = "oh-my-zine-desktop-pet-position-v1";
  let installer = null;
  let pet = null;
  let bubbleTimer = null;
  let sleepTimer = null;
  let reactionIndex = 0;

  const reactions = ["わん！", "なにこれ？", "まて〜！", "♡", "OH!", "ZINE?" ];

  const canStore = () => {
    try {
      localStorage.setItem("__omz_test__", "1");
      localStorage.removeItem("__omz_test__");
      return true;
    } catch (error) {
      return false;
    }
  };

  const storageAvailable = canStore();

  const clearTimers = () => {
    window.clearTimeout(bubbleTimer);
    window.clearTimeout(sleepTimer);
  };

  const scheduleSleep = () => {
    window.clearTimeout(sleepTimer);
    sleepTimer = window.setTimeout(() => {
      if (!pet || pet.classList.contains("is-dragging")) return;
      pet.classList.add("is-sleeping");
      showBubble("Zzz…", 3200);
    }, 9000);
  };

  const showBubble = (message, duration = 1800) => {
    if (!pet) return;
    const bubble = pet.querySelector(".desktop-pet-bubble");
    if (!bubble) return;
    bubble.textContent = message;
    bubble.hidden = false;
    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(() => {
      bubble.hidden = true;
    }, duration);
  };

  const wakePet = () => {
    if (!pet) return;
    pet.classList.remove("is-sleeping");
    scheduleSleep();
  };

  const react = () => {
    if (!pet) return;
    wakePet();
    pet.classList.remove("is-reacting");
    // Restart the animation even on repeated clicks.
    void pet.offsetWidth;
    pet.classList.add("is-reacting");
    showBubble(reactions[reactionIndex % reactions.length]);
    reactionIndex += 1;
  };

  const savePetPosition = () => {
    if (!pet || !storageAvailable) return;
    const rect = pet.getBoundingClientRect();
    localStorage.setItem(PET_POSITION_KEY, JSON.stringify({
      left: Math.round(rect.left),
      top: Math.round(rect.top),
    }));
  };

  const restorePetPosition = () => {
    if (!pet || !storageAvailable) return false;
    try {
      const saved = JSON.parse(localStorage.getItem(PET_POSITION_KEY) || "null");
      if (!saved || !Number.isFinite(saved.left) || !Number.isFinite(saved.top)) return false;
      const maxLeft = Math.max(8, window.innerWidth - 150);
      const maxTop = Math.max(8, window.innerHeight - 160);
      pet.style.left = `${Math.min(maxLeft, Math.max(8, saved.left))}px`;
      pet.style.top = `${Math.min(maxTop, Math.max(8, saved.top))}px`;
      pet.style.right = "auto";
      pet.style.bottom = "auto";
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkKeychainEncounter = () => {
    if (!pet) return;
    const keychain = document.querySelector(".hanging-keychain");
    if (!keychain) return;
    const a = pet.getBoundingClientRect();
    const b = keychain.getBoundingClientRect();
    const overlap = !(a.right < b.left - 45 || a.left > b.right + 45 || a.bottom < b.top - 45 || a.top > b.bottom + 45);
    if (overlap) {
      showBubble("!?", 2500);
      pet.classList.add("is-surprised");
      window.setTimeout(() => pet?.classList.remove("is-surprised"), 750);
    }
  };

  const enableDrag = (node) => {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;
    let moved = false;

    node.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest(".desktop-pet-close")) return;
      const rect = node.getBoundingClientRect();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      moved = false;
      node.classList.add("is-dragging");
      node.style.left = `${rect.left}px`;
      node.style.top = `${rect.top}px`;
      node.style.right = "auto";
      node.style.bottom = "auto";
      node.setPointerCapture?.(pointerId);
      wakePet();
      event.preventDefault();
    });

    node.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      const maxLeft = Math.max(4, window.innerWidth - node.offsetWidth - 4);
      const maxTop = Math.max(4, window.innerHeight - node.offsetHeight - 4);
      node.style.left = `${Math.min(maxLeft, Math.max(4, originLeft + dx))}px`;
      node.style.top = `${Math.min(maxTop, Math.max(4, originTop + dy))}px`;
    });

    const finishDrag = (event) => {
      if (pointerId !== event.pointerId) return;
      node.releasePointerCapture?.(pointerId);
      pointerId = null;
      node.classList.remove("is-dragging");
      if (moved) {
        savePetPosition();
        checkKeychainEncounter();
      } else {
        react();
      }
      scheduleSleep();
    };

    node.addEventListener("pointerup", finishDrag);
    node.addEventListener("pointercancel", finishDrag);
  };

  const spawnPet = ({ announce = true } = {}) => {
    if (pet) {
      pet.hidden = false;
      wakePet();
      if (announce) showBubble("ただいま！");
      return;
    }

    pet = document.createElement("div");
    pet.className = "desktop-pet is-entering";
    pet.setAttribute("role", "button");
    pet.setAttribute("tabindex", "0");
    pet.setAttribute("aria-label", "デスクトップペット。クリックするとリアクションします。ドラッグで移動できます。");
    pet.innerHTML = `
      <button class="desktop-pet-close" type="button" aria-label="デスクトップペットを閉じる">×</button>
      <span class="desktop-pet-bubble" hidden></span>
      <span class="desktop-pet-art" aria-hidden="true"></span>
      <small>OHMY_PET.EXE</small>
    `;
    document.body.appendChild(pet);

    const restored = restorePetPosition();
    if (!restored) {
      pet.style.right = "18px";
      pet.style.bottom = "18px";
    }

    enableDrag(pet);

    pet.querySelector(".desktop-pet-close")?.addEventListener("click", (event) => {
      event.stopPropagation();
      pet.hidden = true;
      clearTimers();
    });

    pet.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        react();
      }
    });

    window.setTimeout(() => pet?.classList.remove("is-entering"), 950);
    if (announce) window.setTimeout(() => showBubble("わん！"), 620);
    scheduleSleep();
  };

  const closeInstaller = () => {
    installer?.remove();
    installer = null;
  };

  const showCompleteDialog = () => {
    if (!installer) return;
    installer.classList.add("is-complete");
    const body = installer.querySelector(".pet-installer-body");
    if (!body) return;
    body.innerHTML = `
      <div class="pet-installer-complete-icon">✓</div>
      <div class="pet-installer-copy">
        <strong>Installation Complete!</strong>
        <span>Click [OK] to start.</span>
      </div>
      <button class="pet-installer-ok" type="button">OK</button>
    `;
    body.querySelector(".pet-installer-ok")?.addEventListener("click", () => {
      closeInstaller();
      spawnPet();
    });
    body.querySelector(".pet-installer-ok")?.focus();
  };

  const startProgress = () => {
    if (!installer) return;
    const bar = installer.querySelector(".pet-installer-progress > span");
    const percent = installer.querySelector(".pet-installer-percent");
    let value = 0;
    const tick = () => {
      if (!installer || !bar || !percent) return;
      value = Math.min(100, value + Math.ceil(Math.random() * 12));
      bar.style.width = `${value}%`;
      percent.textContent = `${value}%`;
      if (value < 100) {
        window.setTimeout(tick, 95 + Math.random() * 85);
      } else {
        window.setTimeout(showCompleteDialog, 360);
      }
    };
    window.setTimeout(tick, 220);
  };

  const openInstaller = () => {
    if (installer) return;
    if (pet && !pet.hidden) {
      react();
      return;
    }

    installer = document.createElement("div");
    installer.className = "pet-installer-layer";
    installer.innerHTML = `
      <section class="pet-installer-window" role="dialog" aria-modal="true" aria-labelledby="pet-installer-title">
        <header class="pet-installer-titlebar">
          <strong id="pet-installer-title">OHMY_PET.EXE</strong>
          <button class="pet-installer-x" type="button" aria-label="インストーラーを閉じる">×</button>
        </header>
        <div class="pet-installer-body">
          <span class="pet-installer-mini-dog" aria-hidden="true"></span>
          <div class="pet-installer-copy">
            <strong>Installing...</strong>
            <span>FREE DESKTOP PET / OH MY ZINE</span>
            <div class="pet-installer-progress" aria-label="インストール進捗"><span></span></div>
          </div>
          <b class="pet-installer-percent">0%</b>
        </div>
        <footer>※これはサイト内だけで動く演出です。実際のインストールは行いません。</footer>
      </section>
    `;
    document.body.appendChild(installer);

    installer.querySelector(".pet-installer-x")?.addEventListener("click", closeInstaller);
    installer.addEventListener("pointerdown", (event) => {
      if (event.target === installer) closeInstaller();
    });
    installer.querySelector(".pet-installer-x")?.focus();
    startProgress();
  };

  ad.addEventListener("click", (event) => {
    event.preventDefault();
    openInstaller();
  });

})();
