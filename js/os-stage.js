(() => {
  "use strict";

  const STAGE_PARAMETER = "ohmy_stage";
  const DESKTOP_STAGE_WIDTH = 1440;
  const STAGE_BREAKPOINT = 1100;
  const currentUrl = new URL(window.location.href);
  const screenShortEdge = Math.min(window.screen.width, window.screen.height);
  const screenLongEdge = Math.max(window.screen.width, window.screen.height);
  const reportsMobile =
    navigator.userAgentData?.mobile === true ||
    /iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent);
  const isTouchPhone =
    navigator.maxTouchPoints > 0 &&
    (reportsMobile || (screenShortEdge <= 600 && screenLongEdge <= 1000));

  if (isTouchPhone) {
    const viewport = document.querySelector('meta[name="viewport"]');
    const visibleWidth = window.visualViewport
      ? window.visualViewport.width * window.visualViewport.scale
      : document.documentElement.clientWidth || window.innerWidth;
    const initialScale = Math.min(1, visibleWidth / DESKTOP_STAGE_WIDTH);

    viewport?.setAttribute(
      "content",
      [
        `width=${DESKTOP_STAGE_WIDTH}`,
        `initial-scale=${initialScale.toFixed(6)}`,
        "minimum-scale=0.1",
        "maximum-scale=5",
        "user-scalable=yes",
      ].join(", "),
    );
    document.documentElement.classList.add("ohmy-native-phone-stage");

    const phoneStageSizing = document.createElement("style");
    phoneStageSizing.id = "ohmy-native-phone-stage-sizing";
    phoneStageSizing.textContent = `
      html.ohmy-native-phone-stage body.home-page .home-main,
      html.ohmy-native-phone-stage body.subpage {
        min-height: 0 !important;
        height: auto !important;
      }

      html.ohmy-native-phone-stage .shared-app-window {
        display: block !important;
        min-height: 0 !important;
        height: auto !important;
      }

      html.ohmy-native-phone-stage .shared-page-base {
        flex: none !important;
        min-height: 0 !important;
        height: auto !important;
      }

      html.ohmy-native-phone-stage body.home-page,
      html.ohmy-native-phone-stage body.subpage {
        --shared-titlebar-height: 80px;
      }

      html.ohmy-native-phone-stage .shared-titlebar {
        min-height: 80px !important;
        padding-inline: 26px !important;
        font-size: 20px !important;
      }

      html.ohmy-native-phone-stage .shared-brand {
        gap: 12px !important;
        padding-block: 0 !important;
      }

      html.ohmy-native-phone-stage .shared-brand .shared-brand-icon {
        width: 34px !important;
        height: 34px !important;
        flex-basis: 34px !important;
      }

      html.ohmy-native-phone-stage .shared-window-controls {
        gap: 8px !important;
      }

      html.ohmy-native-phone-stage .shared-window-controls button {
        width: 38px !important;
        height: 34px !important;
        font-size: 15px !important;
      }
    `;
    document.head.append(phoneStageSizing);
    return;
  }

  if (currentUrl.searchParams.get(STAGE_PARAMETER) === "1") {
    document.documentElement.classList.add("ohmy-os-stage-frame");
    return;
  }

  const stageQuery = window.matchMedia(`(max-width: ${STAGE_BREAKPOINT}px)`);

  if (!stageQuery.matches) {
    stageQuery.addEventListener?.("change", (event) => {
      if (event.matches) window.location.reload();
    });
    return;
  }

  window.OHMYZINE_OS_STAGE_HOST = true;
  document.documentElement.classList.add("ohmy-os-stage-host");

  function withoutStageParameter(url) {
    const cleanUrl = new URL(url.href);
    cleanUrl.searchParams.delete(STAGE_PARAMETER);
    return cleanUrl;
  }

  function mountDesktopStage() {
    if (!document.body || document.querySelector("#ohmy-os-stage-viewport")) return;

    const stageViewport = document.createElement("div");
    stageViewport.id = "ohmy-os-stage-viewport";
    stageViewport.setAttribute("aria-label", "OHMYZINE デスクトップ画面");

    const stageFrame = document.createElement("iframe");
    stageFrame.id = "ohmy-os-stage-frame";
    stageFrame.title = `${document.title} — Desktop Stage`;
    stageFrame.loading = "eager";
    stageFrame.setAttribute("scrolling", "no");

    const frameUrl = new URL(window.location.href);
    frameUrl.searchParams.set(STAGE_PARAMETER, "1");
    stageFrame.src = frameUrl.href;
    stageViewport.append(stageFrame);
    document.body.replaceChildren(stageViewport);
    document.documentElement.classList.add("ohmy-os-stage-ready");

    let desktopHeight = 900;
    let measureTimer = 0;
    let resizeFrame = 0;

    function stageScale() {
      return stageViewport.clientWidth / DESKTOP_STAGE_WIDTH;
    }

    function applyStageSize() {
      const scale = stageScale();
      stageViewport.style.setProperty("--ohmy-stage-scale", String(scale));
      stageViewport.style.setProperty("--ohmy-stage-width", `${DESKTOP_STAGE_WIDTH}px`);
      stageViewport.style.setProperty("--ohmy-stage-height", `${desktopHeight}px`);
      stageViewport.style.height = `${Math.ceil(desktopHeight * scale)}px`;
      stageFrame.style.width = `${DESKTOP_STAGE_WIDTH}px`;
      stageFrame.style.height = `${desktopHeight}px`;
    }

    function measureFrame() {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        try {
          const frameDocument = stageFrame.contentDocument;
          if (!frameDocument?.documentElement || !frameDocument.body) return;

          const nextHeight = Math.max(
            900,
            frameDocument.documentElement.scrollHeight,
            frameDocument.documentElement.offsetHeight,
            frameDocument.body.scrollHeight,
            frameDocument.body.offsetHeight,
          );

          if (Math.abs(nextHeight - desktopHeight) > 1) {
            desktopHeight = nextHeight;
          }
          applyStageSize();
        } catch (error) {
          // The frame is same-origin for OHMYZINE pages. External pages are
          // promoted to the top window before measurement is needed.
        }
      });
    }

    function moveOuterPageToFrameTarget(frameDocument, target) {
      const scale = stageScale();
      const frameTop = stageViewport.getBoundingClientRect().top + window.scrollY;
      const targetTop = target.getBoundingClientRect().top + stageFrame.contentWindow.scrollY;
      window.scrollTo({ top: frameTop + targetTop * scale, behavior: "smooth" });
    }

    function connectFrameDocument() {
      let frameLocation;

      try {
        frameLocation = new URL(stageFrame.contentWindow.location.href);
      } catch (error) {
        return;
      }

      const outerClean = withoutStageParameter(new URL(window.location.href));
      const frameClean = withoutStageParameter(frameLocation);
      const outerRoute = `${outerClean.pathname}${outerClean.search}`;
      const frameRoute = `${frameClean.pathname}${frameClean.search}`;

      if (frameClean.origin === outerClean.origin && frameRoute !== outerRoute) {
        window.location.assign(frameClean.href);
        return;
      }

      const frameDocument = stageFrame.contentDocument;
      if (!frameDocument?.documentElement || !frameDocument.body) return;

      frameDocument.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0) return;

        const link = event.target.closest?.("a[href]");
        if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

        const destination = new URL(link.href, frameDocument.baseURI);
        const cleanDestination = withoutStageParameter(destination);
        const currentFrame = withoutStageParameter(new URL(stageFrame.contentWindow.location.href));
        const sameDocument =
          cleanDestination.origin === currentFrame.origin &&
          cleanDestination.pathname === currentFrame.pathname &&
          cleanDestination.search === currentFrame.search;

        if (sameDocument && cleanDestination.hash) {
          const target = frameDocument.getElementById(decodeURIComponent(cleanDestination.hash.slice(1)));
          if (!target) return;
          event.preventDefault();
          moveOuterPageToFrameTarget(frameDocument, target);
          window.history.replaceState(null, "", cleanDestination.hash);
          return;
        }

        if (!sameDocument) {
          event.preventDefault();
          window.location.assign(cleanDestination.href);
        }
      });

      window.clearInterval(measureTimer);
      measureTimer = window.setInterval(measureFrame, 750);

      frameDocument.fonts?.ready.then(measureFrame);
      frameDocument.querySelectorAll("img, video").forEach((media) => {
        if (!media.complete) media.addEventListener("load", measureFrame, { once: true });
      });

      measureFrame();
      window.setTimeout(measureFrame, 250);
    }

    stageFrame.addEventListener("load", connectFrameDocument);
    window.addEventListener("resize", () => {
      if (document.documentElement.clientWidth > STAGE_BREAKPOINT) {
        window.location.reload();
        return;
      }
      applyStageSize();
    });

    applyStageSize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountDesktopStage, { once: true });
  } else {
    mountDesktopStage();
  }
})();
