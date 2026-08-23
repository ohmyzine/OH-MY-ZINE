(() => {
  if (window.OHMYZINE_OS_STAGE_HOST) return;

  const page = document.body;
  const appWindow = document.querySelector(".shared-app-window");
  const isSubpage = page.classList.contains("subpage");
  if (!appWindow) return;

  const minimizeButton = document.querySelector('[data-window-action="minimize"]');
  const maximizeButton = document.querySelector('[data-window-action="maximize"]');
  const closeButton = document.querySelector('[data-window-action="close"], #window-close');
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
    window.OhMyZineSharedUI?.setSearchOpen?.(false);
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
      if (next) window.OhMyZineSharedUI?.resetWindowPosition?.();
      page.classList.toggle("is-subpage-maximized", next);
      page.classList.remove("is-subpage-minimized");
      setPressed(maximizeButton, next);
      setPressed(minimizeButton, false);
      setPressed(closeButton, false);
    });
  }
  closeButton?.addEventListener("click", closeWindow);
})();
