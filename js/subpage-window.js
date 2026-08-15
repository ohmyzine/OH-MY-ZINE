(() => {
  const page = document.body;
  const header = document.querySelector(".subpage-header");
  const main = document.querySelector(".subpage-main");
  const handles = document.querySelectorAll(".subpage-systembar");
  const controls = document.querySelectorAll("[data-window-action]");
  const softCursor = document.querySelector("#soft-cursor");

  if (!page.classList.contains("subpage") || !header || !main) return;

  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let activePointer = null;

  const applyOffset = () => {
    page.style.setProperty("--window-x", `${offsetX}px`);
    page.style.setProperty("--window-y", `${offsetY}px`);
  };

  const setPressed = (action, pressed) => {
    const button = document.querySelector(`[data-window-action="${action}"]`);
    if (button) button.setAttribute("aria-pressed", String(pressed));
  };

  const stopDrag = (event) => {
    if (activePointer === null || (event.pointerId !== undefined && event.pointerId !== activePointer)) return;
    activePointer = null;
    page.classList.remove("is-window-dragging");
    softCursor?.classList.remove("is-dragging");
  };

  handles.forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || page.classList.contains("is-subpage-maximized")) return;
      if (event.target.closest("a, button, input, select, textarea")) return;

      activePointer = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      originX = offsetX;
      originY = offsetY;
      page.classList.add("is-window-dragging");
      softCursor?.classList.add("is-dragging");
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointer) return;
      const limitX = Math.max(120, window.innerWidth - 120);
      const limitY = Math.max(80, window.innerHeight - 80);
      offsetX = Math.min(limitX, Math.max(-limitX, originX + event.clientX - startX));
      offsetY = Math.min(limitY, Math.max(-70, originY + event.clientY - startY));
      applyOffset();
    });

    handle.addEventListener("pointerup", stopDrag);
    handle.addEventListener("pointercancel", stopDrag);
  });

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.windowAction;

      if (action === "minimize") {
        const next = !page.classList.contains("is-subpage-minimized");
        page.classList.toggle("is-subpage-minimized", next);
        page.classList.remove("is-subpage-closed");
        setPressed("minimize", next);
        setPressed("close", false);
      }

      if (action === "maximize") {
        const next = !page.classList.contains("is-subpage-maximized");
        page.classList.toggle("is-subpage-maximized", next);
        page.classList.remove("is-subpage-minimized", "is-subpage-closed");
        setPressed("maximize", next);
        setPressed("minimize", false);
        setPressed("close", false);
      }

      if (action === "close") {
        const next = !page.classList.contains("is-subpage-closed");
        page.classList.toggle("is-subpage-closed", next);
        page.classList.remove("is-subpage-minimized");
        setPressed("close", next);
        setPressed("minimize", false);
      }
    });
  });

})();
