(() => {
  "use strict";

  const STAGE_PARAMETER = "ohmy_stage";
  const DESKTOP_STAGE_WIDTH = 1440;
  const PHONE_OVERVIEW_STAGE_WIDTH = 820;
  const PHONE_READING_STAGE_WIDTH = 560;
  const STAGE_BREAKPOINT = 1100;
  const currentUrl = new URL(window.location.href);
  const currentPage = currentUrl.pathname.split("/").pop()?.toLowerCase() || "index.html";
  const isPhoneOverview = currentPage === "index.html";
  const screenShortEdge = Math.min(window.screen.width, window.screen.height);
  const screenLongEdge = Math.max(window.screen.width, window.screen.height);
  const reportsMobile =
    navigator.userAgentData?.mobile === true ||
    /iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent);
  const isTouchPhone =
    navigator.maxTouchPoints > 0 &&
    (reportsMobile || (screenShortEdge <= 600 && screenLongEdge <= 1000));

  if (isTouchPhone) {
    const phoneStageWidth = isPhoneOverview
      ? PHONE_OVERVIEW_STAGE_WIDTH
      : PHONE_READING_STAGE_WIDTH;
    const viewport = document.querySelector('meta[name="viewport"]');
    const visibleWidth = window.visualViewport
      ? window.visualViewport.width * window.visualViewport.scale
      : document.documentElement.clientWidth || window.innerWidth;
    const initialScale = Math.min(1, visibleWidth / phoneStageWidth);

    viewport?.setAttribute(
      "content",
      [
        `width=${phoneStageWidth}`,
        `initial-scale=${initialScale.toFixed(6)}`,
        "minimum-scale=0.1",
        "maximum-scale=5",
        "user-scalable=yes",
      ].join(", "),
    );
    document.documentElement.classList.add("ohmy-native-phone-stage");
    document.documentElement.classList.add(
      isPhoneOverview ? "ohmy-phone-overview" : "ohmy-phone-reading",
    );

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

      html.ohmy-native-phone-stage {
        -webkit-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
      }

      html.ohmy-native-phone-stage .soft-cursor {
        display: none !important;
      }

      html.ohmy-native-phone-stage :where(a[href], button, input, select, textarea, [role="button"], [role="tab"]) {
        touch-action: manipulation !important;
        -webkit-tap-highlight-color: rgba(32, 184, 224, 0.34) !important;
      }

      html.ohmy-native-phone-stage :where(a[href], button, input, select, textarea, [role="button"], [role="tab"]):focus-visible {
        outline: 3px solid #ff4f9a !important;
        outline-offset: 3px !important;
      }

      html.ohmy-native-phone-stage :where(a[href], button, [role="button"], [role="tab"]):active {
        filter: brightness(1.08) saturate(1.12) !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-titlebar,
      html.ohmy-native-phone-stage body.subpage .shared-titlebar {
        min-height: 56px !important;
        padding-inline: 24px 20px !important;
        font-size: 14px !important;
        letter-spacing: 0.06em !important;
        touch-action: pan-y pinch-zoom !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-brand,
      html.ohmy-native-phone-stage body.subpage .shared-brand {
        padding-block: 12px !important;
        gap: 9px !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-brand .shared-brand-icon,
      html.ohmy-native-phone-stage body.subpage .shared-brand .shared-brand-icon {
        width: 24px !important;
        height: 24px !important;
        flex-basis: 24px !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-window-controls,
      html.ohmy-native-phone-stage body.subpage .shared-window-controls {
        gap: 7px !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-window-controls button,
      html.ohmy-native-phone-stage body.subpage .shared-window-controls button {
        width: 32px !important;
        height: 30px !important;
        border-radius: 4px !important;
        font-size: 12px !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs,
      html.ohmy-native-phone-stage body.subpage .shared-tabs {
        padding-inline: 14px !important;
        border-bottom-width: 7px !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs > a,
      html.ohmy-native-phone-stage body.home-page .shared-tabs > span,
      html.ohmy-native-phone-stage body.subpage .shared-tabs > a,
      html.ohmy-native-phone-stage body.subpage .shared-tabs > span {
        min-height: 44px !important;
        padding: 12px 10px 9px !important;
        font-size: 13px !important;
        letter-spacing: 0.1em !important;
      }

      @media (orientation: portrait) {
        html.ohmy-native-phone-stage body.home-page:not(.window-maximized) .home-main,
        html.ohmy-native-phone-stage body.subpage:not(.is-subpage-maximized) {
          padding-top: 290px !important;
        }

        html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page:not(.window-maximized) .home-main {
          padding-top: 202px !important;
        }

        html.ohmy-native-phone-stage.ohmy-phone-reading body.home-page:not(.window-maximized) .home-main,
        html.ohmy-native-phone-stage.ohmy-phone-reading body.subpage:not(.is-subpage-maximized) {
          padding-top: 138px !important;
        }
      }

      html.ohmy-native-phone-stage body.home-page .portal-banner {
        min-height: 280px !important;
        margin-top: 28px !important;
        padding-block: 52px !important;
      }

      html.ohmy-native-phone-stage body.home-page .magazine-grid {
        padding-block: 31px !important;
      }

      html.ohmy-native-phone-stage body.home-page .left-column,
      html.ohmy-native-phone-stage body.home-page .center-column {
        gap: 30px !important;
      }

      html.ohmy-native-phone-stage body.home-page .right-column {
        gap: 23px !important;
      }

      html.ohmy-native-phone-stage body.home-page .photo-vault,
      html.ohmy-native-phone-stage body.home-page .photo-vault > img {
        min-height: 495px !important;
      }

      html.ohmy-native-phone-stage body.home-page .about-card {
        padding-block: 32px !important;
      }

      html.ohmy-native-phone-stage body.home-page .feature-body {
        padding-block: 25px !important;
      }

      html.ohmy-native-phone-stage body.home-page .feature-image {
        aspect-ratio: 16 / 10 !important;
      }

      html.ohmy-native-phone-stage body.home-page .recommendation-grid {
        padding-block: 20px !important;
        gap: 16px !important;
      }

      html.ohmy-native-phone-stage body.home-page .recommendation-card {
        aspect-ratio: 1.28 / 1 !important;
      }

      html.ohmy-native-phone-stage body.home-page .home-ad-stack {
        gap: 18px !important;
      }

      html.ohmy-native-phone-stage body.home-page .magazine-widget-shell {
        padding-block: 22px !important;
      }

      html.ohmy-native-phone-stage body.home-page .window-footer {
        min-height: 56px !important;
        padding-block: 8px !important;
      }

      html.ohmy-native-phone-stage body.home-page .panel-titlebar {
        height: 36px !important;
        padding-inline: 10px !important;
        font-size: 11px !important;
      }

      html.ohmy-native-phone-stage body.home-page .shuffle-button {
        min-height: 28px !important;
        padding: 4px 10px !important;
        font-size: 10px !important;
      }

      html.ohmy-native-phone-stage body.home-page .micro-label,
      html.ohmy-native-phone-stage body.home-page .issue-label,
      html.ohmy-native-phone-stage body.home-page .category-tag {
        font-size: 10px !important;
      }

      html.ohmy-native-phone-stage body.home-page .about-card h2 {
        font-size: 25px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage body.home-page .about-card > p:not(.micro-label),
      html.ohmy-native-phone-stage body.home-page .feature-copy {
        color: #24343c !important;
        font-size: 15px !important;
        line-height: 1.65 !important;
      }

      html.ohmy-native-phone-stage body.home-page .feature-body h1 {
        font-size: clamp(29px, 3.2vw, 42px) !important;
        line-height: 1.22 !important;
        text-wrap: balance !important;
      }

      html.ohmy-native-phone-stage body.home-page .pill-button,
      html.ohmy-native-phone-stage body.home-page .read-button,
      html.ohmy-native-phone-stage body.home-page .contents-button,
      html.ohmy-native-phone-stage body.home-page .magazine-read-button,
      html.ohmy-native-phone-stage body.home-page .magazine-shelf-button {
        min-height: 44px !important;
        font-size: 11px !important;
      }

      html.ohmy-native-phone-stage body.home-page .photo-controls {
        min-height: 42px !important;
      }

      html.ohmy-native-phone-stage body.home-page .photo-controls button {
        min-width: 34px !important;
        min-height: 30px !important;
        font-size: 11px !important;
      }

      html.ohmy-native-phone-stage body.home-page .magazine-shelf-copy {
        color: #31434c !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
      }

      html.ohmy-native-phone-stage body.home-page .recommendation-copy small {
        top: 7px !important;
        right: 7px !important;
        bottom: auto !important;
        font-size: 9px !important;
        opacity: 1 !important;
      }

      html.ohmy-native-phone-stage body.home-page .recommendation-copy strong {
        max-width: calc(100% - 14px) !important;
        left: 7px !important;
        right: 7px !important;
        bottom: 7px !important;
        color: #fff !important;
        background: rgba(10, 14, 20, 0.86) !important;
        font-size: 11px !important;
        line-height: 1.3 !important;
        opacity: 1 !important;
        white-space: normal !important;
        transform: none !important;
      }

      html.ohmy-native-phone-stage body.home-page .recommendation-card:active {
        outline: 4px solid #ff4f9a !important;
        outline-offset: -4px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .shared-titlebar {
        min-height: 66px !important;
        font-size: 18px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .shared-brand .shared-brand-icon {
        width: 30px !important;
        height: 30px !important;
        flex-basis: 30px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .shared-window-controls button {
        width: 40px !important;
        height: 38px !important;
        font-size: 17px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .shared-tabs > a,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .shared-tabs > span {
        min-height: 52px !important;
        padding: 15px 7px 11px !important;
        font-size: 16px !important;
        letter-spacing: 0.035em !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .panel-titlebar {
        height: 44px !important;
        font-size: 15px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .micro-label,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .issue-label,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .category-tag {
        font-size: 14px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .portal-copy p,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .photo-cabinet-link,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .photo-controls span {
        font-size: 16px !important;
        line-height: 1.4 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .about-card h2 {
        font-size: 29px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .about-card > p:not(.micro-label),
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .feature-copy,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-info-panel,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .recommendation-loading {
        color: #1f3038 !important;
        font-size: 21px !important;
        line-height: 1.55 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .feature-body h1 {
        font-size: 35px !important;
        line-height: 1.25 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .pill-button,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .read-button,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .contents-button,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-read-button,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-shelf-button {
        min-height: 52px !important;
        font-size: 17px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .photo-controls {
        min-height: 50px !important;
        font-size: 16px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .photo-controls button {
        min-width: 42px !important;
        min-height: 38px !important;
        font-size: 17px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-header h2,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-counts dt,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-counts dd,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-review-drawer {
        font-size: 17px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-counts dt b,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .contents-card strong,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .contents-number {
        font-size: 17px !important;
        line-height: 1.3 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-counts dt span,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-counts dd span,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .contents-card small {
        font-size: 13px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-widget-counts dd strong {
        font-size: 27px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .recommendation-copy small {
        font-size: 13px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .recommendation-copy strong {
        font-size: 17px !important;
        line-height: 1.3 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .window-footer {
        font-size: 14px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-body {
        max-width: none !important;
        padding-inline: 12px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-intro {
        margin-bottom: 32px !important;
        padding: 20px 16px 22px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-opening-grid,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-visual-layout,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-lede {
        grid-template-columns: 1fr !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-display-title {
        max-width: none !important;
        font-size: 29px !important;
        line-height: 1.3 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-opening-copy .article-subtitle {
        font-size: 16px !important;
        line-height: 1.65 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-lede {
        padding: 20px 16px 2px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-body > p,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-body blockquote p,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-ending {
        font-size: 18px !important;
        line-height: 1.85 !important;
        letter-spacing: 0.01em !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-body > h2 {
        margin-top: 58px !important;
        font-size: 28px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-body > h3 {
        font-size: 22px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .toc a {
        font-size: 16px !important;
        line-height: 1.55 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-publish-meta,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .article-figure figcaption,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .comparison-caption,
      html.ohmy-native-phone-stage.ohmy-phone-reading body.article-page-shell .image-source {
        font-size: 13px !important;
        line-height: 1.55 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > p {
        color: #283941 !important;
        font-size: 17px !important;
        line-height: 1.85 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede p,
      html.ohmy-native-phone-stage body.article-page-shell .article-intro > p:not(.ui-chip):not(.article-subtitle):not(.image-source) {
        color: #2d4049 !important;
        font-size: 16px !important;
        line-height: 1.8 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc li {
        min-height: 50px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc a {
        font-size: 15px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-publish-meta,
      html.ohmy-native-phone-stage body.article-page-shell .toc-title,
      html.ohmy-native-phone-stage body.article-page-shell .article-figure figcaption,
      html.ohmy-native-phone-stage body.article-page-shell .comparison-year,
      html.ohmy-native-phone-stage body.article-page-shell .image-source {
        font-size: 11px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-newsletter input,
      html.ohmy-native-phone-stage body.article-page-shell .article-newsletter button,
      html.ohmy-native-phone-stage body.article-page-shell .article-back-top,
      html.ohmy-native-phone-stage body.subpage .content-window-body button,
      html.ohmy-native-phone-stage body.subpage .content-window-body input,
      html.ohmy-native-phone-stage body.subpage .content-window-body select {
        min-height: 44px !important;
        font-size: 13px !important;
      }

      html.ohmy-native-phone-stage body.about-page-shell .profile-label,
      html.ohmy-native-phone-stage body.about-page-shell .profile-facts dt,
      html.ohmy-native-phone-stage body.about-page-shell .about-switcher span,
      html.ohmy-native-phone-stage body.about-page-shell .fake-ad small,
      html.ohmy-native-phone-stage body.about-page-shell .fake-ad span {
        font-size: 10px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage body.about-page-shell .profile-facts dd {
        font-size: 14px !important;
      }

      html.ohmy-native-phone-stage body.about-page-shell .about-body p {
        font-size: 17px !important;
        line-height: 1.85 !important;
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
