(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    if (!document.documentElement.classList.contains("ohmy-native-phone-stage")) {
      return;
    }

    const page = document.querySelector("body.magazine-store-page");
    const toggle = document.querySelector(".magazine-mobile-menu-button");
    const panel = document.querySelector("#magazine-category-panel");
    const close = document.querySelector(".magazine-category-close");
    const backdrop = document.querySelector(".magazine-category-backdrop");
    const storebar = document.querySelector(".magazine-mobile-storebar");

    if (!page || !toggle || !panel || !close || !backdrop || !storebar) {
      return;
    }

    const syncDrawerTop = () => {
      const top = Math.max(0, Math.round(storebar.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty("--magazine-category-drawer-top", `${top}px`);
    };

    const setOpen = (open) => {
      if (open) {
        syncDrawerTop();
      }
      page.classList.toggle("is-magazine-category-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));
      backdrop.hidden = !open;
      if (open) {
        close.focus({ preventScroll: true });
      } else {
        document.documentElement.style.removeProperty("--magazine-category-drawer-top");
        toggle.focus({ preventScroll: true });
      }
    };

    panel.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;

    toggle.addEventListener("click", () => setOpen(true));
    close.addEventListener("click", () => setOpen(false));
    backdrop.addEventListener("click", () => setOpen(false));
    window.addEventListener("resize", () => {
      if (page.classList.contains("is-magazine-category-open")) {
        syncDrawerTop();
      }
    });

    panel.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
      }
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && page.classList.contains("is-magazine-category-open")) {
        setOpen(false);
      }
    });
  });
})();
