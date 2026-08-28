(() => {
  "use strict";

  const STAGE_PARAMETER = "ohmy_stage";
  const DESKTOP_STAGE_WIDTH = 1440;
  const PHONE_OVERVIEW_STAGE_WIDTH = 960;
  const PHONE_READING_STAGE_WIDTH = 560;
  const STAGE_BREAKPOINT = 1100;
  const currentUrl = new URL(window.location.href);
  const currentPage = currentUrl.pathname.split("/").pop()?.toLowerCase() || "index.html";
  const isPhoneOverview =
    currentPage === "index.html" ||
    currentPage === "about.html" ||
    currentPage === "magazine.html";
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

      html.ohmy-native-phone-stage .shared-app-window,
      html.ohmy-native-phone-stage .phone-fashion-base {
        display: block !important;
        min-height: 0 !important;
        height: auto !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-base {
        width: 100% !important;
        max-width: none !important;
        min-height: 33.333vh !important;
        margin: 0 auto !important;
        position: relative;
        overflow: hidden !important;
        border-style: solid !important;
        border-color: #6b6e73 !important;
        background: #d5d7da !important;
        box-shadow:
          0 2.5vw 5.357143vw rgba(25, 22, 20, 0.28),
          inset 0 0.178571vw 0 rgba(255, 255, 255, 0.9) !important;
      }

      html.ohmy-native-phone-stage .shared-page-base {
        flex: none !important;
        min-height: 0 !important;
        height: auto !important;
      }

      html.ohmy-native-phone-stage body.home-page .home-page-base {
        /* Match FASHION immediately below the divider, then blend back into
           HOME's original surface across the existing opening gap. */
        background:
          linear-gradient(
            to bottom,
            #e7ebed 0,
            #dde1e3 1.458333vw,
            #d5d7da var(--phone-content-start-gap),
            #d5d7da 100%
          ) !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-base > .desktop-site-chrome,
      html.ohmy-native-phone-stage body.subpage .phone-fashion-base > .subpage-header.desktop-site-chrome {
        display: none !important;
      }

      html.ohmy-native-phone-stage body.home-page .phone-fashion-header,
      html.ohmy-native-phone-stage body.subpage .shared-app-window > .phone-fashion-header {
        display: block !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-header .shared-window-controls button[data-window-action="close"] {
        border-color: #8c2c27 !important;
        color: #fff !important;
        background: linear-gradient(180deg, #f8a59e 0%, #d9534b 46%, #972019 52%, #cb443c 100%) !important;
        box-shadow:
          inset 1px 1px 0 rgba(255, 255, 255, 0.72),
          0 1px 1px rgba(75, 24, 20, 0.32) !important;
        text-shadow: 0 -1px 0 #791914 !important;
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

      /* FASHION's 560px phone frame is the source for every phone page. */
      html.ohmy-native-phone-stage body.home-page,
      html.ohmy-native-phone-stage body.subpage {
        --shared-app-width: 100%;
        --shared-titlebar-height: 8.571429vw;
        --shared-tab-height: 7.857143vw;
        /* HOME uses a 960px phone stage: 28 / 960 = 2.916667vw. */
        --phone-content-start-gap: 2.916667vw;
        /* Preserve FASHION's 560px-stage divider weight on every phone page. */
        --phone-nav-dark-divider: 1.071429vw;
        --phone-nav-light-divider: 0.892857vw;
        --phone-nav-light-color: #cbd1d4;
      }

      html.ohmy-native-phone-stage body.home-page .home-main,
      html.ohmy-native-phone-stage body.subpage {
        padding-inline: 1.428571vw !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-base {
        border-width: 0.357143vw !important;
        border-radius: 3.035714vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-titlebar,
      html.ohmy-native-phone-stage body.subpage .shared-titlebar {
        min-height: var(--shared-titlebar-height) !important;
        padding-inline: 1.785714vw !important;
        border-bottom-width: 0.178571vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-brand,
      html.ohmy-native-phone-stage body.subpage .shared-brand {
        min-width: 0;
        min-height: 7.857143vw !important;
        padding-block: 1.785714vw !important;
        gap: 1.25vw !important;
        font-size: 1.964286vw !important;
        letter-spacing: 0.04em !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-brand .shared-brand-icon,
      html.ohmy-native-phone-stage body.subpage .shared-brand .shared-brand-icon {
        width: 3.571429vw !important;
        height: 3.571429vw !important;
        flex-basis: 3.571429vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-brand > span,
      html.ohmy-native-phone-stage body.subpage .shared-brand > span {
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      html.ohmy-native-phone-stage body.home-page .shared-window-controls button,
      html.ohmy-native-phone-stage body.subpage .shared-window-controls button {
        width: 5.714286vw !important;
        min-width: 5.714286vw !important;
        height: 5.714286vw !important;
        min-height: 5.714286vw !important;
        border-width: 0.178571vw !important;
        border-radius: 0.357143vw !important;
        font-size: 1.785714vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-window-controls,
      html.ohmy-native-phone-stage body.subpage .shared-window-controls {
        gap: 0.892857vw !important;
      }

      html.ohmy-native-phone-stage .shared-visitor-counter {
        display: none !important;
      }

      html.ohmy-native-phone-stage .shared-system-actions {
        gap: 4px !important;
      }

      html.ohmy-native-phone-stage .shared-search-toggle {
        width: 6.428571vw !important;
        min-width: 6.428571vw !important;
        height: 6.428571vw !important;
        min-height: 6.428571vw !important;
        border-width: 0.178571vw !important;
        border-radius: 0.357143vw !important;
      }

      html.ohmy-native-phone-stage .shared-search-toggle > span {
        width: 1.785714vw;
        height: 1.785714vw;
        top: 1.785714vw;
        left: 1.785714vw;
        border-width: 0.357143vw;
      }

      html.ohmy-native-phone-stage .shared-search-toggle > span::after {
        width: 1.25vw;
        height: 0.357143vw;
        right: -1.071429vw;
        bottom: -0.714286vw;
      }

      html.ohmy-native-phone-stage .shared-search-panel {
        width: calc(100% - 16px);
        right: 8px;
        padding: 14px;
      }

      html.ohmy-native-phone-stage .shared-search-panel label {
        font-size: 12px;
      }

      html.ohmy-native-phone-stage .shared-search-input-row {
        grid-template-columns: minmax(0, 1fr) 52px;
        gap: 8px;
      }

      html.ohmy-native-phone-stage .shared-search-input-row input,
      html.ohmy-native-phone-stage .shared-search-input-row button {
        min-height: 44px;
        font-size: 16px;
      }

      html.ohmy-native-phone-stage .shared-search-results a,
      html.ohmy-native-phone-stage .shared-search-results p {
        padding: 12px;
        font-size: 14px;
        line-height: 1.6;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs,
      html.ohmy-native-phone-stage body.subpage .shared-tabs {
        grid-template-columns: repeat(5, minmax(0, 1fr));
        padding-inline: 1.428571vw;
        border-bottom: var(--phone-nav-dark-divider) solid #59656b !important;
        box-shadow:
          inset 0 1px 0 #fff,
          0 var(--phone-nav-light-divider) 0 var(--phone-nav-light-color) !important;
        overflow: hidden;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs > a,
      html.ohmy-native-phone-stage body.home-page .shared-tabs > span,
      html.ohmy-native-phone-stage body.subpage .shared-tabs > a,
      html.ohmy-native-phone-stage body.subpage .shared-tabs > span {
        min-width: 0;
        height: var(--shared-tab-height) !important;
        min-height: var(--shared-tab-height) !important;
        padding-inline: 0.535714vw !important;
        white-space: normal;
        text-align: center;
        font-size: 2.142857vw !important;
        line-height: 1.15 !important;
        letter-spacing: 0.01em !important;
        border-width: 0.178571vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs > :first-child,
      html.ohmy-native-phone-stage body.subpage .shared-tabs > :first-child {
        border-radius: 1.428571vw 0 0 1.428571vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs > :last-child,
      html.ohmy-native-phone-stage body.subpage .shared-tabs > :last-child {
        border-radius: 0 1.428571vw 1.428571vw 0 !important;
      }

      html.ohmy-native-phone-stage body.home-page:not(.window-maximized) .home-main,
      html.ohmy-native-phone-stage body.subpage:not(.is-subpage-maximized) {
        padding-top: 0 !important;
      }

      html.ohmy-native-phone-stage body.subpage .subpage-main {
        padding-top: 0 !important;
      }

      /* Start each page's own content frame directly below the tabs. */
      html.ohmy-native-phone-stage body.subpage .phone-fashion-header + .shared-page-base > .content-window,
      html.ohmy-native-phone-stage body.subpage .phone-fashion-header + .shared-page-base > .subpage-main > .content-window,
      html.ohmy-native-phone-stage body.subpage .phone-fashion-header + .subpage-main > .content-window {
        margin-top: 0 !important;
      }

      /* Use HOME's visible opening ratio on both the 960px overview stage and
         the 560px reading stage, then start the first title frame there. */
      html.ohmy-native-phone-stage body.subpage .content-window > .content-window-body {
        padding-top: var(--phone-content-start-gap) !important;
      }

      /* ABOUT keeps the blue dotted wallpaper inside one flat, quiet frame. */
      html.ohmy-native-phone-stage body.about-page-shell .about-window {
        padding: 4.285714vw 1.458333vw 1.458333vw !important;
        box-sizing: border-box;
        background: #eef0f2 !important;
        box-shadow: none !important;
      }

      html.ohmy-native-phone-stage body.about-page-shell .about-window > .content-window-body {
        padding-top: 1.458333vw !important;
        box-sizing: border-box;
        border: 0 !important;
        box-shadow: none !important;
      }

      html.ohmy-native-phone-stage body.not-found-page .phone-fashion-header + .subpage-main > .content-window {
        padding-top: var(--phone-content-start-gap) !important;
      }

      html.ohmy-native-phone-stage body.home-page .phone-fashion-header + .home-page-base {
        padding-top: var(--phone-content-start-gap) !important;
        box-sizing: border-box;
      }

      /* Articles had a second inner top padding, so their title frame started
         lower than HOME even after the outer gap was unified. */
      html.ohmy-native-phone-stage body.article-page-shell .article-window-body > .article-body {
        padding-top: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-page-base {
        position: relative;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-reading-progress {
        margin-bottom: -4px !important;
      }

      html.ohmy-native-phone-stage body.home-page .portal-banner {
        min-height: 280px !important;
        margin-top: 0 !important;
        padding-block: 52px !important;
      }

      html.ohmy-native-phone-stage body.home-page .magazine-grid {
        padding-block: 31px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .magazine-grid {
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr) minmax(0, 0.9fr) !important;
        grid-template-areas: "left center contents" !important;
        gap: 12px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .left-column,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .center-column,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column {
        min-width: 0 !important;
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
        aspect-ratio: 1.05 / 1 !important;
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

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .photo-controls.photo-controls-viewer {
        grid-template-columns: 42px minmax(0, 1fr) 42px !important;
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
        max-height: 48% !important;
        font-size: 15px !important;
        line-height: 1.25 !important;
        overflow: hidden !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .left-column .about-card h2 {
        font-size: 23px !important;
        line-height: 1.4 !important;
        overflow-wrap: anywhere !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .left-column .about-card > p:not(.micro-label) {
        font-size: 17px !important;
        line-height: 1.65 !important;
        overflow-wrap: anywhere !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page :is(.photo-cabinet-link, .photo-controls span) {
        font-size: 13px !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-widget-header h2 {
        font-size: 14px !important;
        line-height: 1.25 !important;
        overflow-wrap: anywhere !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-info-panel {
        font-size: 12px !important;
        line-height: 1.45 !important;
        overflow-wrap: anywhere !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-widget-counts > div {
        grid-template-columns: minmax(0, 1fr) auto !important;
        gap: 7px !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-widget-counts :is(dt, dd) {
        min-width: 0 !important;
        font-size: 12px !important;
        line-height: 1.25 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-widget-counts dt span,
      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-widget-counts dd span {
        font-size: 10px !important;
        line-height: 1.2 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .right-column .magazine-widget-counts dd strong {
        font-size: 24px !important;
        line-height: 1 !important;
      }

      html.ohmy-native-phone-stage.ohmy-phone-overview body.home-page .window-footer {
        font-size: 14px !important;
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
