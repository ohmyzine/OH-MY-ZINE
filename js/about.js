(() => {
  "use strict";

  if (window.OHMYZINE_OS_STAGE_HOST) return;

  const video = document.querySelector(".profile-motion video");
  const source = video?.querySelector("source[data-src]");

  if (video && source) {
    let loaded = false;
    const loadVideo = () => {
      if (loaded) return;
      loaded = true;
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
      video.load();

      video.play().catch(() => {
        // Autoplay can be blocked. The first frame still remains visible.
      });
    };

    if (!("IntersectionObserver" in window)) {
      loadVideo();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          loadVideo();
          observer.disconnect();
        },
        { rootMargin: "320px 0px" },
      );

      observer.observe(video);
    }
  }

  const tabs = [...document.querySelectorAll("[data-about-panel]")];
  const panels = [...document.querySelectorAll(".about-copy-panel")];

  const selectPanel = (tab) => {
    const targetId = tab.dataset.aboutPanel;

    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    panels.forEach((panel) => {
      const selected = panel.id === targetId;
      panel.classList.toggle("is-active", selected);
      panel.hidden = !selected;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPanel(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + step + tabs.length) % tabs.length];
      next.focus();
      selectPanel(next);
    });
  });

  const cookieButton = document.querySelector("#cookie-counter");
  const cookieCount = document.querySelector("#cookie-count");
  const cookieKey = "oh-my-zine-cookie-count";
  let count = Number.parseInt(localStorage.getItem(cookieKey) || "0", 10);

  if (!Number.isFinite(count) || count < 0) count = 0;
  if (cookieCount) cookieCount.textContent = count.toLocaleString("ja-JP");

  cookieButton?.addEventListener("click", () => {
    count += 1;
    localStorage.setItem(cookieKey, String(count));
    if (cookieCount) cookieCount.textContent = count.toLocaleString("ja-JP");
    cookieButton.classList.remove("is-counting");
    window.requestAnimationFrame(() => cookieButton.classList.add("is-counting"));
  });

  const newsletterButton = document.querySelector("#newsletter-banner");
  const newsletterStatus = document.querySelector("#newsletter-status");

  newsletterButton?.addEventListener("click", () => {
    newsletterButton.classList.toggle("is-registered");
    const registered = newsletterButton.classList.contains("is-registered");
    if (newsletterStatus) {
      newsletterStatus.textContent = registered
        ? "THANK YOU / 準備中です"
        : "CLICK TO SIGN UP →";
    }
  });
})();
