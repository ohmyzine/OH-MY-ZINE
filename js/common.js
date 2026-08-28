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

  function getActiveTitlebar() {
    if (document.documentElement.classList.contains("ohmy-native-phone-stage")) {
      const phoneTitlebar = document.querySelector(".phone-fashion-header .shared-titlebar");
      if (phoneTitlebar) return phoneTitlebar;
    }

    return document.querySelector(".desktop-site-titlebar") || document.querySelector(".shared-titlebar");
  }

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
    if (!visitor) {
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

  function updateVisitorCount() {
    const counters = document.querySelectorAll("[data-visitor-count]");
    if (!counters.length) return;

    let count = 1;
    try {
      const totalKey = "oh-my-zine-local-visits";
      const sessionKey = "oh-my-zine-visitor-counted-v1";
      const stored = Number.parseInt(localStorage.getItem(totalKey) || "0", 10);
      count = Number.isFinite(stored) ? stored : 0;

      if (sessionStorage.getItem(sessionKey) !== "true") {
        count += 1;
        localStorage.setItem(totalKey, String(count));
        sessionStorage.setItem(sessionKey, "true");
      } else if (count < 1) {
        count = 1;
      }
    } catch (error) {
      count = 1;
    }

    const display = String(count).padStart(6, "0");
    counters.forEach((counter) => {
      counter.textContent = display;
    });
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
})();
