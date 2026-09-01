(function () {
  "use strict";

  if (window.OHMYZINE_OS_STAGE_HOST) return;

  var buttons = Array.prototype.slice.call(document.querySelectorAll(".js-article-toggle"));
  if (!buttons.length) return;

  function storageKey(button) {
    return "oh-my-zine:" + button.dataset.articleAction + ":" + button.dataset.articleId;
  }

  function readState(button) {
    try {
      return window.localStorage.getItem(storageKey(button)) === "1";
    } catch (error) {
      return button.getAttribute("aria-pressed") === "true";
    }
  }

  function writeState(button, isActive) {
    try {
      window.localStorage.setItem(storageKey(button), isActive ? "1" : "0");
    } catch (error) {
      // The control still works for the current page when storage is unavailable.
    }
  }

  function labelFor(button, isActive) {
    if (button.dataset.articleAction === "save") {
      return isActive ? "マイリストから削除" : "マイリストに追加";
    }
    return isActive ? "お気に入りから削除" : "お気に入りに追加";
  }

  function sync(articleId, action, isActive) {
    buttons.forEach(function (button) {
      if (button.dataset.articleId !== articleId || button.dataset.articleAction !== action) return;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.setAttribute("aria-label", labelFor(button, isActive));
      button.textContent = isActive ? button.dataset.onSymbol : button.dataset.offSymbol;
    });
  }

  function announce(message) {
    var oldToast = document.querySelector(".fashion-action-toast");
    if (oldToast) oldToast.remove();

    var toast = document.createElement("div");
    toast.className = "fashion-action-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(function () {
      toast.classList.add("is-visible");
    }, 20);

    window.setTimeout(function () {
      toast.classList.remove("is-visible");
      window.setTimeout(function () { toast.remove(); }, 180);
    }, 1500);
  }

  buttons.forEach(function (button) {
    sync(button.dataset.articleId, button.dataset.articleAction, readState(button));

    button.addEventListener("click", function () {
      var nextState = button.getAttribute("aria-pressed") !== "true";
      writeState(button, nextState);
      sync(button.dataset.articleId, button.dataset.articleAction, nextState);

      if (button.dataset.articleAction === "save") {
        announce(nextState ? "マイリストに追加しました" : "マイリストから削除しました");
      } else {
        announce(nextState ? "お気に入りに追加しました" : "お気に入りから削除しました");
      }
    });
  });
}());

(function () {
  "use strict";

  if (window.OHMYZINE_OS_STAGE_HOST) return;

  var channelButtons = Array.prototype.slice.call(
    document.querySelectorAll("[data-fashion-channel]"),
  );
  var channelCards = Array.prototype.slice.call(
    document.querySelectorAll(".fashion-latest-rail [data-fashion-channels]"),
  );
  var caption = document.querySelector("#fashion-channel-caption");
  var categoryToggle = document.querySelector("[data-fashion-category-toggle]");
  var categoryMenu = document.querySelector("#fashion-category-menu");
  if (!channelButtons.length || !channelCards.length) return;

  var labels = {
    "on-air": "ON AIR",
    fashion: "FASHION",
    culture: "CULTURE",
    archive: "ARCHIVE / ALL ARTICLES",
    next: "NEXT ISSUE",
  };

  function isCategoryChannel(channel) {
    return channel === "fashion" || channel === "culture" || channel === "archive";
  }

  function closeCategoryMenu() {
    if (!categoryMenu || !categoryToggle) return;
    categoryMenu.hidden = true;
    categoryToggle.setAttribute("aria-expanded", "false");
  }

  function toggleCategoryMenu() {
    if (!categoryMenu || !categoryToggle) return;
    var willOpen = categoryMenu.hidden;
    categoryMenu.hidden = !willOpen;
    categoryToggle.setAttribute("aria-expanded", String(willOpen));
  }

  function selectChannel(channel) {
    var visibleCount = 0;

    channelButtons.forEach(function (button) {
      var isSelected = button.dataset.fashionChannel === channel;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    if (categoryToggle) {
      var categorySelected = isCategoryChannel(channel);
      categoryToggle.classList.toggle("is-active", categorySelected);
      categoryToggle.setAttribute("aria-pressed", String(categorySelected));
    }

    channelCards.forEach(function (card) {
      var channels = (card.dataset.fashionChannels || "").split(/\s+/);
      var isVisible = channels.indexOf(channel) !== -1;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (caption) {
      caption.textContent = labels[channel] + " / " + String(visibleCount).padStart(3, "0") +
        (visibleCount === 1 ? " ARTICLE" : " ARTICLES");
    }
  }

  channelButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectChannel(button.dataset.fashionChannel);
      closeCategoryMenu();
    });
  });

  if (categoryToggle) {
    categoryToggle.addEventListener("click", toggleCategoryMenu);
  }

  document.addEventListener("click", function (event) {
    if (!categoryMenu || categoryMenu.hidden) return;
    if (categoryMenu.contains(event.target) || categoryToggle.contains(event.target)) return;
    closeCategoryMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCategoryMenu();
  });

  selectChannel("on-air");
}());
