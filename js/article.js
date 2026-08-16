(() => {
  "use strict";

  const progress = document.querySelector("[data-reading-progress]");

  const updateProgress = () => {
    if (!progress) return;
    const page = document.documentElement;
    const distance = Math.max(1, page.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / distance));
    progress.style.transform = `scaleX(${ratio})`;
  };

  document.querySelectorAll(".image-source").forEach((source) => {
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
})();
