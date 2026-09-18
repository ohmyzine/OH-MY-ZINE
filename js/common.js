(() => {
  "use strict";

  if (window.OHMYZINE_OS_STAGE_HOST) return;

  if (document.documentElement.dataset.sharedUiReady === "true") return;
  document.documentElement.dataset.sharedUiReady = "true";

  const fallbackArticles = [
    {
      title: "OHMYZINE vs VSH",
      url: "article-vhs.html",
      category: "FASHION / VHS / CULTURE",
      image: "images/vhs-thumbnail.webp",
      description: "VHSプレイヤーを導入して、ファッション目線でVHSに惹かれた理由を辿る記事。",
    },
    {
      title: "NewJeans『Attention』のファッションを読み解く",
      url: "article.html",
      category: "FASHION / MUSIC / Y2K",
      image: "images/attention-main.jpg",
      description: "スポーツウェア、HIPHOP、R&B。その背景にあるカルチャーを辿ります。",
    },
  ];

  let articles = fallbackArticles;
  const sharedUi = window.OhMyZineSharedUI ||= {};

  function isPhonePresentation() {
    return document.documentElement.classList.contains("ohmy-native-phone-stage")
      || document.documentElement.classList.contains("ohmy-os-stage-frame");
  }

  function getActiveTitlebar() {
    if (document.documentElement.classList.contains("ohmy-native-phone-stage")) {
      const phoneTitlebar = document.querySelector(".phone-fashion-header .shared-titlebar");
      if (phoneTitlebar) return phoneTitlebar;
    }

    return document.querySelector(".desktop-site-titlebar") || document.querySelector(".shared-titlebar");
  }

  function normalizePhoneFashionChrome() {
    if (!document.documentElement.classList.contains("ohmy-native-phone-stage")) return;

    const phoneHeader = document.querySelector(".phone-fashion-header");
    if (!phoneHeader) return;

    const brandText = phoneHeader.querySelector(".shared-brand > span")?.textContent?.trim()
      || "OH_MY_ZINE.EXE";
    const activeHref = phoneHeader.querySelector(".shared-tabs [aria-current='page']")
      ?.getAttribute("href");

    phoneHeader.closest(".phone-fashion-base")?.classList.add("shared-app-window");

    /* Exact FASHION phone header markup is the one source for every page. */
    phoneHeader.innerHTML = `
      <header class="system-bar subpage-systembar shared-titlebar">
        <a class="system-title subpage-brand shared-brand" href="index.html">
          <img class="shared-brand-icon" src="images/oh-my-zine-archive-icon.png?v=magazine3" alt="">
          <span></span>
        </a>
        <div class="system-controls subpage-window-controls shared-window-controls" aria-label="ウィンドウ操作">
          <button type="button" data-window-action="minimize" aria-label="最小化" aria-pressed="false">—</button>
          <button type="button" data-window-action="maximize" aria-label="最大化" aria-pressed="false">□</button>
          <button type="button" data-window-action="close" aria-label="閉じる" aria-pressed="false">×</button>
        </div>
      </header>

      <nav class="site-nav subpage-tabs shared-tabs" aria-label="メインメニュー">
        <a href="index.html">HOME</a>
        <a href="fashion.html">FASHION</a>
        <a href="magazine.html">MAGAZINE COLLECTION</a>
        <a href="photo.html">PHOTO</a>
        <a href="about.html">ABOUT</a>
      </nav>
    `;

    phoneHeader.querySelector(".shared-brand > span").textContent = brandText;
    if (activeHref) {
      phoneHeader.querySelector(`.shared-tabs a[href="${activeHref}"]`)
        ?.setAttribute("aria-current", "page");
    }
  }

  normalizePhoneFashionChrome();

  function createSharedToolbar() {
    const titlebar = getActiveTitlebar();
    const controls = titlebar?.querySelector(".shared-window-controls");
    if (!titlebar || !controls) return {};

    let actions = titlebar.querySelector(".shared-system-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "shared-system-actions";
      titlebar.append(actions);
    }

    let visitor = actions.querySelector(".shared-visitor-counter");
    if (isPhonePresentation()) {
      visitor?.remove();
      visitor = null;
    } else if (!visitor) {
      visitor = document.createElement("span");
      visitor.className = "shared-visitor-counter";
      visitor.append("VISITOR ");
      const count = document.createElement("b");
      count.dataset.visitorCount = "";
      count.textContent = "000001";
      visitor.append(count);
      actions.append(visitor);
    }

    let searchToggle = actions.querySelector(".shared-search-toggle");
    if (!searchToggle) {
      searchToggle = document.createElement("button");
      searchToggle.className = "shared-search-toggle";
      searchToggle.type = "button";
      searchToggle.setAttribute("aria-label", "記事を検索");
      searchToggle.setAttribute("aria-controls", "shared-search-panel");
      searchToggle.setAttribute("aria-expanded", "false");
      searchToggle.dataset.searchToggle = "";
      searchToggle.append(document.createElement("span"));
      actions.append(searchToggle);
    }

    actions.append(controls);

    let searchPanel = document.querySelector("#shared-search-panel");
    if (!searchPanel) {
      searchPanel = document.createElement("form");
      searchPanel.id = "shared-search-panel";
      searchPanel.className = "shared-search-panel";
      searchPanel.setAttribute("role", "search");
      searchPanel.hidden = true;
      searchPanel.innerHTML = `
        <label for="shared-search-input">SEARCH ARTICLES</label>
        <div class="shared-search-input-row">
          <input id="shared-search-input" type="search" placeholder="キーワードを入力" autocomplete="off">
          <button type="submit">GO</button>
        </div>
        <div class="shared-search-results" aria-live="polite"></div>
      `;
      titlebar.insertAdjacentElement("afterend", searchPanel);
    }

    return { searchToggle, searchPanel };
  }

  async function updateVisitorCount() {
    const counters = document.querySelectorAll("[data-visitor-count]");
    const showCount = !isPhonePresentation() && counters.length > 0;
    const totalKey = "oh-my-zine-local-visits";
    const fallbackSessionKey = "oh-my-zine-visitor-counted-v1";
    const globalSessionKey = "oh-my-zine-global-visitor-counted-v1";
    const counterEndpoint = "https://counterapi.com/api/oh-my-zine.com/view/site-visits";

    const renderCount = (count) => {
      if (!showCount) return;
      const display = String(Math.max(1, count)).padStart(6, "0");
      counters.forEach((counter) => {
        counter.textContent = display;
      });
    };

    let fallbackCount = 1;
    try {
      const stored = Number.parseInt(localStorage.getItem(totalKey) || "0", 10);
      fallbackCount = Number.isFinite(stored) ? stored : 0;

      const alreadyCounted = sessionStorage.getItem(globalSessionKey) === "true";
      if (!alreadyCounted) sessionStorage.setItem(globalSessionKey, "true");

      if (alreadyCounted && !showCount) return;

      const query = new URLSearchParams({ startNumber: "1" });
      if (alreadyCounted) query.set("readOnly", "true");
      const response = await fetch(`${counterEndpoint}?${query}`, {
        cache: "no-store",
        mode: "cors",
      });
      if (!response.ok) throw new Error(`Visitor counter request failed: ${response.status}`);

      const payload = await response.json();
      const globalCount = Number.parseInt(String(payload.value), 10);
      if (!Number.isFinite(globalCount)) throw new Error("Visitor counter returned an invalid value");

      localStorage.setItem(totalKey, String(globalCount));
      renderCount(globalCount);
      return;
    } catch (error) {
      // file:// preview or a temporary network failure falls back locally.
    }

    try {
      if (sessionStorage.getItem(fallbackSessionKey) !== "true") {
        fallbackCount += 1;
        localStorage.setItem(totalKey, String(fallbackCount));
        sessionStorage.setItem(fallbackSessionKey, "true");
      } else if (fallbackCount < 1) {
        fallbackCount = 1;
      }
    } catch (error) {
      fallbackCount = 1;
    }

    renderCount(fallbackCount);
  }

  function setupSearch(searchToggle, searchPanel) {
    if (!searchToggle || !searchPanel) return;
    const input = searchPanel.querySelector("input[type='search']");
    const results = searchPanel.querySelector(".shared-search-results");

    const matchesFor = (query) => {
      const normalized = query.trim().toLocaleLowerCase("ja");
      if (!normalized) return [];
      return articles.filter((article) =>
        [article.title, article.category, article.description]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("ja")
          .includes(normalized),
      );
    };

    const render = () => {
      if (!input || !results) return;
      results.replaceChildren();
      if (!input.value.trim()) return;
      const matches = matchesFor(input.value).slice(0, 5);
      if (!matches.length) {
        const message = document.createElement("p");
        message.textContent = "NO ARTICLES FOUND";
        results.append(message);
        return;
      }
      matches.forEach((article) => {
        const link = document.createElement("a");
        link.href = article.url;
        link.textContent = article.title;
        results.append(link);
      });
    };

    const setOpen = (isOpen) => {
      searchPanel.hidden = !isOpen;
      searchToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) {
        input?.blur();
        return;
      }

      /* iPhone browsers zoom a scaled page when focus is moved into the
         search field programmatically. Keep the field fully usable, but let
         phone visitors tap it themselves so opening the toolbar never zooms. */
      if (!document.documentElement.classList.contains("ohmy-native-phone-stage")) {
        input?.focus();
      }
    };

    sharedUi.setSearchOpen = setOpen;

    searchToggle.addEventListener("click", () => setOpen(searchPanel.hidden));
    input?.addEventListener("input", render);
    searchPanel.addEventListener("submit", (event) => {
      event.preventDefault();
      const first = matchesFor(input?.value || "")[0];
      if (first) window.location.href = first.url;
      else render();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !searchPanel.hidden) {
        setOpen(false);
        searchToggle.focus();
      }
    });
  }

  function setupCursor() {
    const cursor = document.querySelector("#soft-cursor");
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("custom-cursor-ready");
    document.addEventListener("pointermove", (event) => {
      cursor.style.transform = `translate3d(${event.clientX - 16}px, ${event.clientY - 10}px, 0)`;
      cursor.hidden = false;
    });
    document.addEventListener("pointerover", (event) => {
      cursor.classList.toggle(
        "is-hovering",
        Boolean(event.target.closest("a, button, label, input, .shared-titlebar")),
      );
    });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
    document.documentElement.addEventListener("mouseleave", () => {
      cursor.hidden = true;
    });
  }

  function setupMaterialHeadings() {
    const palettes = {
      rhinestone: ["#ff2b91", "#ed167b", "#ff68ae", "#d80f69", "#ff9bc9", "#f03a96"],
      paper: ["#e8e2d4", "#d8e5d0", "#d9e0e9", "#ead4df", "#e5d9bf", "#d8d4e5"],
    };
    const paperInks = ["#273238", "#4b4651", "#344852", "#52443f"];
    const paperFonts = ["Arial Black", "Courier New", "Georgia", "Trebuchet MS"];
    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

    document.querySelectorAll("[data-material-heading]").forEach((heading) => {
      const word = heading.textContent.trim();
      const material = heading.dataset.materialHeading;
      const colors = palettes[material] || palettes.paper;
      const characters = [...word];
      const shuffledIndices = characters
        .map((_, index) => index)
        .sort(() => Math.random() - 0.5);
      const diceIndices = new Set(
        material === "paper" ? shuffledIndices.slice(0, Math.min(2, characters.length)) : [],
      );
      const chunkyIndices = new Set(
        material === "rhinestone" ? shuffledIndices.slice(0, Math.min(3, characters.length)) : [],
      );
      heading.setAttribute("aria-label", word);
      heading.replaceChildren();

      characters.forEach((character, index) => {
        const letter = document.createElement("span");
        letter.className = "material-letter";
        if (diceIndices.has(index)) letter.classList.add("is-die");
        if (chunkyIndices.has(index)) letter.classList.add("is-chunky");
        letter.textContent = character;
        letter.setAttribute("aria-hidden", "true");
        letter.style.setProperty("--material-color", randomItem(colors));
        letter.style.setProperty(
          "--material-rotate",
          `${randomBetween(material === "paper" ? -5.2 : -2.8, material === "paper" ? 5.2 : 2.8).toFixed(2)}deg`,
        );
        letter.style.setProperty(
          "--material-y",
          `${randomBetween(material === "paper" ? -7 : -5, material === "paper" ? 7 : 5).toFixed(1)}px`,
        );
        letter.style.setProperty(
          "--material-scale",
          randomBetween(material === "paper" ? 0.94 : 0.97, material === "paper" ? 1.07 : 1.04).toFixed(3),
        );

        if (material === "paper") {
          letter.style.setProperty("--material-ink", randomItem(paperInks));
          letter.style.setProperty("--material-font", `"${randomItem(paperFonts)}"`);
        }

        heading.append(letter);
      });
    });
  }

  function setupTabKeychain() {
    const keychain = document.querySelector(".hanging-keychain");
    if (!keychain) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const swing = () => {
      keychain.classList.remove("is-tab-swinging");
      void keychain.offsetWidth;
      keychain.classList.add("is-tab-swinging");
    };

    requestAnimationFrame(swing);

    const draggableTitlebar = getActiveTitlebar();
    let titlebarPressed = false;

    draggableTitlebar?.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button, input, label")) return;
      titlebarPressed = true;
    });

    const settleAfterDrag = () => {
      if (!titlebarPressed) return;
      titlebarPressed = false;
      window.setTimeout(swing, 0);
    };

    draggableTitlebar?.addEventListener("pointerup", settleAfterDrag);
    draggableTitlebar?.addEventListener("pointercancel", settleAfterDrag);

    document.querySelectorAll(".shared-tabs a").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === "_blank" ||
          link.hasAttribute("download") ||
          href.startsWith("#")
        ) {
          return;
        }

        if (reducedMotion) return;
        event.preventDefault();
        swing();
        window.setTimeout(() => window.location.assign(link.href), 300);
      });
    });
  }


  function setupSharedWindowDrag() {
    const page = document.body;
    const systemBar = getActiveTitlebar();
    const softCursor = document.querySelector("#soft-cursor");
    const windowFrame = systemBar?.closest(".magazine-window, .subpage-app-frame");
    const legacyHeader = systemBar?.closest(".subpage-header");
    const magazineWindow = windowFrame || legacyHeader;
    const positionTarget = windowFrame || page;

    if (!systemBar || !magazineWindow) {
      return;
    }

    if (windowFrame) {
      windowFrame.classList.add("shared-drag-window");
      page.classList.add("shared-drag-frame");
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
      positionTarget.style.setProperty("--window-x", `${x}px`);
      positionTarget.style.setProperty("--window-y", `${y}px`);
    }

    function resetWindowPosition() {
      setWindowPosition(0, 0);
    }

    systemBar?.addEventListener("pointerdown", (event) => {
      if (
        event.button !== 0 ||
        event.target.closest("button, input, label") ||
        magazineWindow?.classList.contains("is-maximized") ||
        page.classList.contains("is-subpage-maximized")
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

    sharedUi.resetWindowPosition = resetWindowPosition;
  }

  function setupSharedWindowControls() {
    const page = document.body;
    const isSubpage = page.classList.contains("subpage");
    const isArticlePage = page.classList.contains("article-page-shell");
    if (!isSubpage && !isArticlePage) return;

    const appWindow = document.querySelector(".shared-app-window");
    if (!appWindow) return;

    const phoneHeader = document.documentElement.classList.contains("ohmy-native-phone-stage")
      ? document.querySelector(".phone-fashion-header")
      : null;
    const controlsRoot = phoneHeader || document.querySelector(".desktop-site-titlebar") || document;
    const minimizeButton = controlsRoot.querySelector('[data-window-action="minimize"], #window-minimize');
    const maximizeButton = controlsRoot.querySelector('[data-window-action="maximize"], #window-maximize');
    const closeButton = controlsRoot.querySelector('[data-window-action="close"], #window-close');
    const setPressed = (button, pressed) => {
      if (button) button.setAttribute("aria-pressed", String(pressed));
    };

    const ensureClosedScreen = () => {
      let screen = document.querySelector("#closed-screen");
      if (screen) return screen;
      screen = document.createElement("section");
      screen.id = "closed-screen";
      screen.className = "closed-screen";
      screen.hidden = true;
      const status = document.createElement("p");
      status.textContent = "PROGRAM CLOSED";
      const title = document.createElement("h2");
      title.textContent = "OH MY ZINE";
      const reopen = document.createElement("button");
      reopen.id = "window-reopen";
      reopen.type = "button";
      reopen.textContent = "OPEN OH_MY_ZINE.EXE";
      screen.append(status, title, reopen);
      document.body.append(screen);
      return screen;
    };

    const reopenWindow = () => {
      const screen = document.querySelector("#closed-screen");
      if (screen) screen.hidden = true;
      appWindow.hidden = false;
      setPressed(closeButton, false);
      closeButton?.focus();
    };

    const closeWindow = () => {
      const screen = ensureClosedScreen();
      if (isSubpage) {
        page.classList.remove("is-subpage-minimized", "is-subpage-maximized");
        setPressed(minimizeButton, false);
        setPressed(maximizeButton, false);
      }
      sharedUi.setSearchOpen?.(false);
      appWindow.hidden = true;
      screen.hidden = false;
      setPressed(closeButton, true);
      const reopen = screen.querySelector("#window-reopen");
      if (reopen && !reopen.dataset.boundReopen) {
        reopen.dataset.boundReopen = "true";
        reopen.addEventListener("click", reopenWindow);
      }
      reopen?.focus();
    };

    if (isSubpage) {
      minimizeButton?.addEventListener("click", () => {
        const next = !page.classList.contains("is-subpage-minimized");
        page.classList.toggle("is-subpage-minimized", next);
        setPressed(minimizeButton, next);
        setPressed(closeButton, false);
      });
      maximizeButton?.addEventListener("click", () => {
        const next = !page.classList.contains("is-subpage-maximized");
        if (next) sharedUi.resetWindowPosition?.();
        page.classList.toggle("is-subpage-maximized", next);
        page.classList.remove("is-subpage-minimized");
        setPressed(maximizeButton, next);
        setPressed(minimizeButton, false);
        setPressed(closeButton, false);
      });
    }
    closeButton?.addEventListener("click", closeWindow);
  }

  function setupArticleReader() {
    const progress = document.querySelector("[data-reading-progress]");
    const sources = document.querySelectorAll(".image-source");
    if (!progress && !sources.length) return;

    const updateProgress = () => {
      if (!progress) return;
      const page = document.documentElement;
      const distance = Math.max(1, page.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / distance));
      progress.style.transform = `scaleX(${ratio})`;
    };

    sources.forEach((source) => {
      const match = source.textContent.match(/https?:\/\/\S+/);
      if (!match) return;

      const url = match[0];
      const before = source.textContent.slice(0, match.index);
      const after = source.textContent.slice((match.index || 0) + url.length);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = url;
      source.replaceChildren(before, link, after);
    });

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  async function loadSearchArticles() {
    try {
      const response = await fetch("data/articles.json", { cache: "no-store" });
      if (!response.ok) return articles;
      const loaded = await response.json();
      if (Array.isArray(loaded) && loaded.length) articles = loaded;
    } catch (error) {
      // file:// preview uses the built-in fallback article.
    }

    return articles;
  }

  const toolbar = createSharedToolbar();
  updateVisitorCount();
  setupSearch(toolbar.searchToggle, toolbar.searchPanel);
  setupCursor();
  setupMaterialHeadings();
  setupTabKeychain();
  setupSharedWindowDrag();
  const articleDataPromise = loadSearchArticles();
  sharedUi.getArticles = () => articleDataPromise;
  setupSharedWindowControls();
  setupArticleReader();
})();
