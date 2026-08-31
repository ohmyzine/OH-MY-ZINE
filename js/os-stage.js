(() => {
  "use strict";

  const STAGE_PARAMETER = "ohmy_stage";
  const DESKTOP_STAGE_WIDTH = 1440;
  const PHONE_OVERVIEW_STAGE_WIDTH = 960;
  const PHONE_READING_STAGE_WIDTH = 560;
  const STAGE_BREAKPOINT = 1100;
  const currentUrl = new URL(window.location.href);
  const currentPage = currentUrl.pathname.split("/").pop()?.toLowerCase() || "index.html";
  const isArticlePage =
    currentPage === "article.html" ||
    currentPage === "article-vhs.html";
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
  const isLocalPhonePreview =
    /^(?:localhost|127\.0\.0\.1)$/.test(window.location.hostname) &&
    currentUrl.searchParams.get("ohmy_phone_preview") === "1";

  if (isTouchPhone || isLocalPhonePreview) {
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
    if (isArticlePage) {
      document.documentElement.classList.add("ohmy-article-copy-preparing");
    }

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
        border: 0 !important;
        background: #d5d7da !important;
        box-shadow:
          0 0 0 var(--phone-frame-stroke) #6b6e73,
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
           HOME's original surface across the compact HOME-only opening gap. */
        background:
          linear-gradient(
            to bottom,
            #e7ebed 0,
            #dde1e3 calc(var(--phone-home-content-start-gap) / 2),
            #d5d7da var(--phone-home-content-start-gap),
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
        border: 0 !important;
        color: #fff !important;
        background: linear-gradient(180deg, #f8a59e 0%, #d9534b 46%, #972019 52%, #cb443c 100%) !important;
        box-shadow:
          inset 0 0 0 var(--phone-shared-stroke) #8c2c27,
          inset var(--phone-chrome-unit) var(--phone-chrome-unit) 0 rgba(255, 255, 255, 0.72),
          0 var(--phone-chrome-unit) var(--phone-chrome-unit) rgba(75, 24, 20, 0.32) !important;
        text-shadow: 0 calc(var(--phone-chrome-unit) * -1) 0 #791914 !important;
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

      /* HOME's visible phone chrome is the source for every phone page. */
      html.ohmy-native-phone-stage body.home-page,
      html.ohmy-native-phone-stage body.subpage {
        --shared-app-width: 100%;
        --shared-titlebar-height: 8.571429vw;
        --shared-tab-height: 7.857143vw;
        --phone-window-top-gap: 2.142857vw;
        /* HOME uses a 960px phone stage: 28 / 960 = 2.916667vw. */
        --phone-content-start-gap: 2.916667vw;
        --phone-home-content-start-gap: calc(var(--phone-content-start-gap) / 3);
        /* Copy HOME's source pixels into viewport units. FASHION and PHOTO use
           the same ratios on their 560px canvas, so the final phone chrome is
           identical without changing either page's content width. */
        --phone-shared-stroke: 0.104167vw;
        --phone-frame-stroke: 0.208333vw;
        --phone-chrome-unit: 0.104167vw;
        --phone-nav-dark-divider: 0.625vw;
        --phone-nav-light-divider: 0.208333vw;
        --phone-nav-light-color: #cbd1d4;
      }

      html.ohmy-native-phone-stage body.home-page .home-main,
      html.ohmy-native-phone-stage body.subpage {
        padding-top: var(--phone-window-top-gap) !important;
        padding-inline: 1.428571vw !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-base {
        border-radius: 3.035714vw !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-titlebar,
      html.ohmy-native-phone-stage body.subpage .shared-titlebar {
        min-height: var(--shared-titlebar-height) !important;
        padding-inline: 1.785714vw !important;
        border-bottom: 0 !important;
        box-shadow:
          inset 0 calc(var(--phone-shared-stroke) * -1) 0 #777d84,
          inset 0 var(--phone-chrome-unit) 0 rgba(255, 255, 255, 0.96),
          inset 0 calc(var(--phone-chrome-unit) * -1) 0 rgba(255, 255, 255, 0.55) !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-brand,
      html.ohmy-native-phone-stage body.subpage .shared-brand {
        min-width: 0;
        min-height: 7.857143vw !important;
        padding-block: 1.785714vw !important;
        gap: 1.25vw !important;
        font-size: 1.964286vw !important;
        letter-spacing: 0.04em !important;
        text-shadow: 0 var(--phone-chrome-unit) 0 #fff !important;
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

      /* One phone titlebar control system for HOME and every subpage.
         PC keeps its original 25px search / 23px window-control ratio. */
      html.ohmy-native-phone-stage .phone-fashion-header .shared-system-actions {
        display: flex !important;
        flex: 0 0 auto !important;
        align-items: center !important;
        gap: 0.892857vw !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-header .shared-window-controls {
        display: flex !important;
        flex: 0 0 auto !important;
        align-items: center !important;
        gap: 0.892857vw !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-header .shared-window-controls button {
        width: 5.714286vw !important;
        min-width: 5.714286vw !important;
        height: 5.714286vw !important;
        min-height: 5.714286vw !important;
        flex: 0 0 5.714286vw !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        border: 0 !important;
        border-radius: 0.357143vw !important;
        font-size: 1.785714vw !important;
        box-shadow:
          inset 0 0 0 var(--phone-shared-stroke) #71787d,
          inset var(--phone-chrome-unit) var(--phone-chrome-unit) 0 #fff,
          0 var(--phone-chrome-unit) var(--phone-chrome-unit) rgba(43, 48, 51, 0.18) !important;
      }

      html.ohmy-native-phone-stage .shared-visitor-counter {
        display: none !important;
      }

      html.ohmy-native-phone-stage .phone-fashion-header .shared-search-toggle {
        width: 6.428571vw !important;
        min-width: 6.428571vw !important;
        height: 6.428571vw !important;
        min-height: 6.428571vw !important;
        flex: 0 0 6.428571vw !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        border: 0 !important;
        border-radius: 0.357143vw !important;
        box-shadow:
          inset 0 0 0 var(--phone-shared-stroke) #71787d,
          inset var(--phone-chrome-unit) var(--phone-chrome-unit) 0 #fff,
          0 var(--phone-chrome-unit) var(--phone-chrome-unit) rgba(43, 48, 51, 0.18) !important;
      }

      html.ohmy-native-phone-stage .shared-search-toggle > span {
        width: 2.5vw;
        height: 2.5vw;
        top: 1.428571vw;
        left: 1.428571vw;
        border: 0;
        box-shadow: inset 0 0 0 calc(var(--phone-chrome-unit) * 3) #333c46;
      }

      html.ohmy-native-phone-stage .shared-search-toggle > span::after {
        width: 1.785714vw;
        height: calc(var(--phone-chrome-unit) * 3);
        right: -1.428571vw;
        bottom: -0.892857vw;
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
        padding-bottom: var(--phone-nav-dark-divider) !important;
        border-bottom: 0 !important;
        box-shadow:
          inset 0 var(--phone-chrome-unit) 0 #fff,
          inset 0 calc(var(--phone-nav-dark-divider) * -1) 0 #59656b,
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
        box-sizing: border-box !important;
        border: 0 !important;
        box-shadow:
          inset 0 0 0 var(--phone-shared-stroke) #718b95,
          inset 0 var(--phone-chrome-unit) 0 rgba(255, 255, 255, 0.76),
          inset 0 calc(var(--phone-chrome-unit) * -4) 0 rgba(35, 71, 84, 0.15) !important;
        text-shadow: 0 calc(var(--phone-chrome-unit) * -1) 0 #425b68 !important;
      }

      html.ohmy-native-phone-stage body.home-page .shared-tabs > a[aria-current="page"],
      html.ohmy-native-phone-stage body.subpage .shared-tabs > a[aria-current="page"] {
        box-shadow:
          inset 0 0 0 var(--phone-shared-stroke) #718b95,
          inset 0 calc(var(--phone-chrome-unit) * 2) 0 #fff,
          inset 0 calc(var(--phone-chrome-unit) * -3) 0 #d8eef5,
          0 var(--phone-chrome-unit) calc(var(--phone-chrome-unit) * 2) rgba(61, 76, 82, 0.34) !important;
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
        padding-top: var(--phone-window-top-gap) !important;
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
        padding: var(--phone-content-start-gap) 1.458333vw 1.458333vw !important;
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
        padding-top: var(--phone-home-content-start-gap) !important;
        box-sizing: border-box;
      }

      /* The red-circled article opening gap comes from common.css' main
         padding-top: 50px. Compact that exact outer gap to one third. */
      html.ohmy-native-phone-stage body.article-page-shell .subpage-main.article-page {
        padding-top: calc(50px / 3) !important;
      }

      /* Keep the article window itself flush; the opening gap is owned by
         .subpage-main above, not by the orange article frame. */
      html.ohmy-native-phone-stage body.article-page-shell .article-window > .article-window-body {
        padding-top: 0 !important;
      }

      /* Articles had a second inner top padding, so their title frame started
         lower than HOME even after the outer gap was unified. */
      html.ohmy-native-phone-stage body.article-page-shell .article-window-body > .article-body {
        padding-top: 0 !important;
      }

      /* Phone article reader: keep the dense magazine feeling while restoring
         a comfortable reading size, rhythm and useful two-column photo groups. */
      html.ohmy-native-phone-stage body.article-page-shell .article-window-body > .article-body {
        width: 100% !important;
        max-width: none !important;
        padding: 0 0 6.428571vw !important;
        box-sizing: border-box !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-intro {
        margin: 2.142857vw 1.785714vw 4.285714vw !important;
        padding: 2.857143vw !important;
        border-radius: 2.142857vw !important;
        box-shadow: none !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-opening-grid {
        display: block !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-logo-frame {
        min-height: 0 !important;
        margin-block: 1.428571vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-object-title {
        height: 18.571429vw !important;
        margin: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-display-title {
        margin: 2.142857vw 0 1.428571vw !important;
        font-size: 6.428571vw !important;
        line-height: 1.28 !important;
        letter-spacing: -0.035em !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-opening-copy .article-subtitle {
        margin: 0 0 2.142857vw !important;
        font-size: 3.75vw !important;
        line-height: 1.55 !important;
        letter-spacing: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-publish-meta {
        margin: 1.428571vw 0 2.5vw !important;
        gap: 1.071429vw !important;
        font-size: 2.5vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-visual-layout {
        min-height: 0 !important;
        display: grid !important;
        grid-template-columns: minmax(0, 1.72fr) minmax(21.428571vw, 0.72fr) !important;
        gap: 2.142857vw !important;
        align-items: start !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single {
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single img {
        width: 100% !important;
        min-height: 0 !important;
        height: auto !important;
        aspect-ratio: 16 / 10 !important;
        object-fit: cover !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-panel {
        width: auto !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 2.142857vw !important;
        position: static !important;
        border-radius: 1.428571vw !important;
        box-shadow: none !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-title,
      html.ohmy-native-phone-stage body.article-page-shell .article-share-line {
        font-size: 2.5vw !important;
        line-height: 1.45 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-list {
        gap: 1.071429vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-list span {
        padding: 1.071429vw 1.428571vw !important;
        font-size: 2.321429vw !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > p,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > h2,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > h3,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > blockquote,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .toc,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-figure,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .image-comparison,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-ending,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-newsletter,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-back-top-wrap {
        width: auto !important;
        max-width: none !important;
        margin-right: 4.285714vw !important;
        margin-left: 4.285714vw !important;
        box-sizing: border-box !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede {
        margin-top: 3.571429vw !important;
        padding: 3.571429vw !important;
        display: block !important;
        border: 1px solid #dcc7c0 !important;
        border-radius: 1.785714vw !important;
        background: #fff8f5 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede p,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > p,
      html.ohmy-native-phone-stage body.article-page-shell blockquote p,
      html.ohmy-native-phone-stage body.article-page-shell .article-ending {
        color: #293940 !important;
        font-size: 3.571429vw !important;
        line-height: 1.72 !important;
        letter-spacing: 0 !important;
        text-align: left !important;
        line-break: strict !important;
        word-break: normal !important;
        overflow-wrap: break-word !important;
        text-wrap: pretty !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede p,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > p {
        margin-top: 0 !important;
        margin-bottom: 4.285714vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede p:last-child {
        margin-bottom: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > h2 {
        margin-top: 11.428571vw !important;
        margin-bottom: 4.285714vw !important;
        padding: 2.5vw 2.857143vw !important;
        font-size: 5.714286vw !important;
        line-height: 1.35 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > h3 {
        margin-top: 8.571429vw !important;
        margin-bottom: 3.571429vw !important;
        padding-bottom: 1.785714vw !important;
        font-size: 4.642857vw !important;
        line-height: 1.45 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc {
        margin-top: 6.428571vw !important;
        margin-bottom: 8.571429vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc-title {
        min-height: 6.428571vw !important;
        font-size: 2.5vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc li {
        min-height: 8.571429vw !important;
        grid-template-columns: 8.571429vw 1fr !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc li::before {
        font-size: 2.321429vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc a {
        padding: 2.142857vw 2.5vw !important;
        font-size: 3.392857vw !important;
        line-height: 1.55 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-figure {
        margin-top: 6.428571vw !important;
        margin-bottom: 7.857143vw !important;
        padding: 1.428571vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-figure figcaption,
      html.ohmy-native-phone-stage body.article-page-shell .article-figure .figure-caption,
      html.ohmy-native-phone-stage body.article-page-shell .comparison-year {
        font-size: 2.857143vw !important;
        line-height: 1.65 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .image-source {
        font-size: 2.5vw !important;
        line-height: 1.55 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .image-comparison {
        margin-top: 7.857143vw !important;
        margin-bottom: 9.285714vw !important;
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 2.142857vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .comparison-item {
        min-width: 0 !important;
        padding: 1.071429vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .comparison-item img {
        width: 100% !important;
        height: 52.142857vw !important;
        object-fit: cover !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .comparison-caption {
        grid-column: 1 / -1 !important;
        padding: 2.142857vw 2.5vw !important;
        font-size: 2.857143vw !important;
        line-height: 1.65 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell blockquote,
      html.ohmy-native-phone-stage body.article-page-shell .article-ending {
        padding: 3.571429vw 4.285714vw !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell blockquote cite {
        font-size: 2.5vw !important;
        line-height: 1.6 !important;
      }

      /* ARTICLE CONTENT ONLY: copy the desktop editorial composition into the
         existing phone window. The phone window, chrome and zoom system above
         deliberately stay untouched. */
      html.ohmy-native-phone-stage body.article-page-shell .article-window-body > .article-body {
        padding: 0 0 38px !important;
        color: #26211f !important;
        background: #fff !important;
        border-radius: 0 0 15px 15px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-intro {
        margin: 10px 8px 18px !important;
        padding: 16px 18px 12px !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: #f4c4b0 !important;
        box-shadow: 0 0 0 6px #fff !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-opening-grid {
        display: grid !important;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr) !important;
        gap: 12px !important;
        align-items: start !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-opening-copy {
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-column-label {
        margin: 0 0 7px !important;
        font-size: 9px !important;
        letter-spacing: 0.18em !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-logo-frame {
        width: min(100%, 150px) !important;
        min-height: 0 !important;
        margin: 0 0 8px !important;
        padding: 7px 9px 6px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-logo-frame .article-object-title {
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        display: block !important;
        object-fit: contain !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-display-title {
        max-width: 9.7em !important;
        margin: 0 0 7px !important;
        font-size: 14px !important;
        line-height: 1.28 !important;
        letter-spacing: -0.035em !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-opening-copy .article-subtitle {
        max-width: 28em !important;
        margin: 0 0 7px !important;
        font-size: 8px !important;
        line-height: 1.8 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-publish-meta {
        margin: 6px 0 0 !important;
        gap: 3px !important;
        font-size: 6px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-publish-meta > * {
        padding: 3px 4px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-visual-layout {
        width: 100% !important;
        min-height: 0 !important;
        display: block !important;
        position: relative !important;
        aspect-ratio: 16 / 9 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single,
      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single img {
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        aspect-ratio: auto !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single {
        margin: 0 !important;
        display: grid !important;
        place-items: center !important;
        background: #dfaa94 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single img {
        object-fit: contain !important;
        object-position: center !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-hero-single figcaption {
        left: 5px !important;
        bottom: 5px !important;
        padding: 3px 4px !important;
        font-size: 5.5px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-panel {
        width: min(74px, calc(100% - 12px)) !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 5px 5px 4px !important;
        position: absolute !important;
        right: 6px !important;
        bottom: 6px !important;
        border: 1px solid rgba(79, 51, 40, 0.38) !important;
        border-radius: 6px !important;
        background: rgba(255, 245, 239, 0.93) !important;
        box-shadow: 0 2px 7px rgba(45, 26, 20, 0.24) !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-title {
        margin: 0 0 4px !important;
        font-size: 6px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-list {
        gap: 2px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-tags-list span {
        padding: 2px 3px !important;
        font-size: 5.5px !important;
        line-height: 1.3 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-share-line {
        display: none !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede {
        margin: 12px 5.47% 0 !important;
        padding: 14px 15px 4px !important;
        display: block !important;
        border: 1px solid #dfd3cc !important;
        border-radius: 9px 9px 5px 5px !important;
        background: #fffdfb !important;
        box-shadow: 0 1px 0 rgba(118, 96, 87, 0.16) !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede p,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > p,
      html.ohmy-native-phone-stage body.article-page-shell blockquote p,
      html.ohmy-native-phone-stage body.article-page-shell .article-ending {
        color: #26211f !important;
        font-size: 15px !important;
        line-height: 2 !important;
        letter-spacing: 0 !important;
        text-align: left !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-lede p {
        margin: 0 0 14px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > p,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > h2,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > h3,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > blockquote,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .toc,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-figure,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .image-comparison,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-ending,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-newsletter,
      html.ohmy-native-phone-stage body.article-page-shell .article-body > .article-back-top-wrap {
        width: auto !important;
        max-width: none !important;
        margin-right: 5.47% !important;
        margin-left: 5.47% !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > p {
        margin-top: 0 !important;
        margin-bottom: 18px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > h2 {
        margin-top: 48px !important;
        margin-bottom: 18px !important;
        padding: 9px 11px !important;
        font-size: clamp(21px, 6.5vw, 29px) !important;
        line-height: 1.4 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-body > h3 {
        margin-top: 36px !important;
        margin-bottom: 14px !important;
        padding-bottom: 7px !important;
        font-size: 19px !important;
        line-height: 1.5 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc {
        margin-top: 32px !important;
        margin-bottom: 40px !important;
        border-radius: 6px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc-title {
        min-height: 24px !important;
        font-size: 9px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc li {
        min-height: 36px !important;
        grid-template-columns: 36px 1fr !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc li::before {
        font-size: 8px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .toc a {
        padding: 8px 10px !important;
        font-size: 13px !important;
        line-height: 1.65 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-figure {
        margin-top: 30px !important;
        margin-bottom: 40px !important;
        padding: 6px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-figure img,
      html.ohmy-native-phone-stage body.article-page-shell .comparison-item img {
        width: 100% !important;
        height: auto !important;
        object-fit: contain !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .image-comparison {
        margin-top: 36px !important;
        margin-bottom: 44px !important;
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .comparison-item {
        min-width: 0 !important;
        padding: 5px !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .comparison-caption {
        grid-column: 1 / -1 !important;
        padding: 8px 10px !important;
        font-size: 10px !important;
        line-height: 1.75 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-page-base {
        position: relative;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-reading-progress {
        width: 100vw !important;
        height: 4px !important;
        margin: 0 !important;
        position: fixed !important;
        inset: 0 0 auto 0 !important;
        z-index: 10000 !important;
        transform: none !important;
      }

      html.ohmy-native-phone-stage body.home-page .portal-banner {
        min-height: 230px !important;
        margin-top: 0 !important;
        padding-block: 36px !important;
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

      html.ohmy-native-phone-stage body.article-page-shell .article-window-body > .pc-article-exact-wrap {
        width: 100%;
        height: 1px;
        position: relative;
        overflow: hidden;
        background: #fff;
        opacity: 0;
        transition: opacity 90ms ease-out;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-window {
        transition: opacity 90ms ease-out;
      }

      html.ohmy-native-phone-stage.ohmy-article-copy-preparing body.article-page-shell .article-window {
        opacity: 0 !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-window-body.pc-article-exact-pending > .article-body,
      html.ohmy-native-phone-stage body.article-page-shell .article-window-body.pc-article-exact-mounted > .article-body {
        display: none !important;
      }

      html.ohmy-native-phone-stage body.article-page-shell .article-window-body.pc-article-exact-mounted > .pc-article-exact-wrap {
        opacity: 1;
      }

      html.ohmy-native-phone-stage body.article-page-shell .pc-article-exact-frame {
        width: 1440px;
        height: 1px;
        max-width: none;
        position: absolute;
        inset: 0 auto auto 0;
        display: block;
        border: 0;
        background: #fff;
        transform-origin: 0 0;
      }

    `;
    document.head.append(phoneStageSizing);

    if (isArticlePage) {
      const mountExactDesktopArticle = () => {
        const articleWindowBody = document.querySelector(".article-window-body");
        const originalArticle = articleWindowBody?.querySelector(":scope > .article-body");

        if (
          !articleWindowBody ||
          !originalArticle ||
          articleWindowBody.querySelector(":scope > .pc-article-exact-wrap")
        ) {
          document.documentElement.classList.remove("ohmy-article-copy-preparing");
          return;
        }

        const desktopViewportWidth = 1440;
        const desktopArticleWidth = 1060;
        const articleClone = articleWindowBody.cloneNode(true);

        articleClone.classList.remove("pc-article-exact-mounted");
        articleClone.querySelectorAll("img").forEach((image) => {
          image.loading = "eager";
          image.decoding = "async";
        });

        const escapeAttribute = (value) =>
          String(value)
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");

        const stylesheetMarkup = Array.from(
          document.querySelectorAll('link[rel~="stylesheet"]'),
        )
          .map(
            (stylesheet) =>
              `<link rel="stylesheet" href="${escapeAttribute(stylesheet.href)}">`,
          )
          .join("");
        const baseHref = escapeAttribute(new URL(".", window.location.href).href);
        const bodyClasses = escapeAttribute(document.body.className);

        const exactWrap = document.createElement("div");
        exactWrap.className = "pc-article-exact-wrap";
        exactWrap.setAttribute("data-pc-article-copy", "true");

        const exactFrame = document.createElement("iframe");
        exactFrame.className = "pc-article-exact-frame";
        exactFrame.title = "PC版の記事デザイン";
        exactFrame.loading = "eager";
        exactFrame.setAttribute("scrolling", "no");
        const exactArticleDocument = `<!doctype html>
          <html lang="ja">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=${desktopViewportWidth}, initial-scale=1">
              <base href="${baseHref}">
              ${stylesheetMarkup}
              <style>
                html,
                body {
                  width: ${desktopViewportWidth}px !important;
                  min-width: ${desktopViewportWidth}px !important;
                  max-width: none !important;
                  min-height: 0 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: hidden !important;
                  background: #fff !important;
                }

                .article-window-body {
                  width: ${desktopArticleWidth}px !important;
                  max-width: ${desktopArticleWidth}px !important;
                  margin: 0 !important;
                  padding: 34px !important;
                  box-sizing: border-box !important;
                  background: #e7ebed !important;
                }

                /* Copy the PC article frame into the scaled phone article:
                   the grey outer gutter, white outline and peach page must
                   remain visible instead of stretching edge to edge. */
                .article-window-body > .article-body {
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 auto !important;
                  position: relative !important;
                  overflow: hidden !important;
                  border: 1px solid rgba(255, 255, 255, 0.96) !important;
                  border-radius: 23px 23px 17px 17px !important;
                  box-shadow:
                    0 0 0 7px rgba(255, 255, 255, 0.14),
                    0 0 0 8px rgba(255, 255, 255, 0.74) !important;
                  box-sizing: border-box !important;
                }

                /* Phone-only adjustment requested for the Attention opener.
                   The desktop page remains untouched: these rules live only
                   inside the scaled phone article copy. */
                .article-opening-grid {
                  align-items: center !important;
                }

                .article-visual-layout {
                  align-self: center !important;
                  justify-self: center !important;
                }

                /* VHS uses the transparent badge by itself. The desktop
                   source page has the same VHS-only rule, but inline styles
                   are not copied into this exact phone article document. */
                body.vhs-article .article-logo-frame {
                  padding: 0 !important;
                  background: transparent !important;
                  border: 0 !important;
                  border-radius: 0 !important;
                  box-shadow: none !important;
                  transform: none !important;
                }

                body.vhs-article .article-logo-frame::before {
                  content: none !important;
                }

                /* Keep the VHS headline inside the left column, then place the
                   thumbnail a little lower and centered in the right column. */
                body.vhs-article .article-opening-copy {
                  width: 100% !important;
                  max-width: 390px !important;
                  min-width: 0 !important;
                }

                body.vhs-article .article-display-title {
                  width: 100% !important;
                  max-width: 100% !important;
                }

                body.vhs-article .article-display-title > span {
                  display: block !important;
                  max-width: 100% !important;
                  white-space: normal !important;
                  overflow-wrap: anywhere !important;
                }

                body.vhs-article .article-visual-layout {
                  width: 100% !important;
                  margin: 24px auto 0 !important;
                  align-self: center !important;
                  justify-self: center !important;
                }

                .article-lede {
                  margin-left: 0 !important;
                  margin-right: 0 !important;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  width: 100% !important;
                  max-width: none !important;
                  box-sizing: border-box !important;
                }

                /* VHS uses the exact same phone lede geometry as Attention.
                   Keep the article content different, but never let its white
                   introduction sheet fall back to the narrower legacy width. */
                body.vhs-article .article-lede {
                  margin-left: 0 !important;
                  margin-right: 0 !important;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  width: 100% !important;
                  max-width: none !important;
                  box-sizing: border-box !important;
                }

                /* The desktop article is scaled into the phone window, so its
                   original type becomes a little too small. Increase only the
                   copied phone article; the real desktop page is unchanged. */
                .article-lede p,
                .article-body > p {
                  font-size: 17px !important;
                  line-height: 1.95 !important;
                }

                /* Keep the white intro sheet unchanged while giving its text a
                   small, even inset on phone screens. */
                .article-lede p {
                  display: block !important;
                  width: 92% !important;
                  max-inline-size: 92% !important;
                  max-width: 92% !important;
                  margin-left: auto !important;
                  margin-right: auto !important;
                  text-align: left !important;
                  text-align-last: auto !important;
                }

                .toc-title {
                  font-size: 12px !important;
                }

                .toc li {
                  min-height: 48px !important;
                }

                .toc li::before {
                  font-size: 11px !important;
                }

                .toc a {
                  padding-top: 13px !important;
                  padding-bottom: 13px !important;
                  font-size: 15px !important;
                }

                /* Keep VHS single-photo figures slightly larger than the PC
                   source, without making them dominate the phone article. */
                body.vhs-article .article-body > .article-figure {
                  width: min(560px, calc(100% - 80px)) !important;
                  margin-right: auto !important;
                  margin-left: auto !important;
                }

                .soft-cursor,
                .article-reading-progress {
                  display: none !important;
                }
              </style>
            </head>
            <body class="${bodyClasses}">
              ${articleClone.outerHTML}
            </body>
          </html>`;

        let desktopArticleHeight = 1;
        let contentResizeObserver = null;
        let outerResizeObserver = null;
        let exactArticleInitialized = false;
        let exactArticlePollFrame = 0;

        const syncExactArticleSize = () => {
          const availableWidth = articleWindowBody.clientWidth;
          const scale = Math.max(0.01, availableWidth / desktopArticleWidth);

          exactFrame.style.transform = `scale(${scale})`;
          exactFrame.style.height = `${desktopArticleHeight}px`;
          exactWrap.style.height = `${desktopArticleHeight * scale}px`;
          exactWrap.style.setProperty("--pc-article-scale", String(scale));
        };

        const showResponsiveFallback = () => {
          window.cancelAnimationFrame(exactArticlePollFrame);
          articleWindowBody.classList.remove(
            "pc-article-exact-pending",
            "pc-article-exact-mounted",
          );
          exactWrap.remove();
          outerResizeObserver?.disconnect();
          document.documentElement.classList.remove("ohmy-article-copy-preparing");
        };

        const initializeExactArticle = async () => {
          if (exactArticleInitialized) return true;

          const frameDocument = exactFrame.contentDocument;
          const frameWindow = exactFrame.contentWindow;
          const copiedArticle = frameDocument?.querySelector(".article-window-body");
          const copiedStyles = frameDocument
            ? Array.from(frameDocument.querySelectorAll('link[rel~="stylesheet"]'))
            : [];
          const copiedStylesReady =
            copiedStyles.length === 0 || copiedStyles.every((stylesheet) => stylesheet.sheet);

          if (!frameDocument || !frameWindow || !copiedArticle || !copiedStylesReady) {
            return false;
          }

          exactArticleInitialized = true;
          window.cancelAnimationFrame(exactArticlePollFrame);

          const measureCopiedArticle = () => {
            desktopArticleHeight = Math.max(
              1,
              Math.ceil(copiedArticle.getBoundingClientRect().height),
            );
            syncExactArticleSize();
          };

          frameDocument.querySelectorAll(".image-source").forEach((source) => {
            const match = source.textContent.match(/https?:\/\/\S+/);
            if (!match) return;

            const url = match[0];
            const before = source.textContent.slice(0, match.index);
            const after = source.textContent.slice((match.index || 0) + url.length);
            const link = frameDocument.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = url;
            source.replaceChildren(before, link, after);
          });

          frameDocument.addEventListener("click", (event) => {
            const anchor = event.target.closest?.('a[href^="#"]');
            if (!anchor) return;

            event.preventDefault();
            const hash = anchor.getAttribute("href");
            const target = hash === "#top" ? null : frameDocument.querySelector(hash);
            const wrapTop = exactWrap.getBoundingClientRect().top + window.scrollY;
            const scale = articleWindowBody.clientWidth / desktopArticleWidth;
            const targetTop = target
              ? wrapTop + target.getBoundingClientRect().top * scale
              : 0;

            window.scrollTo({ top: targetTop, behavior: "smooth" });
          });

          contentResizeObserver = new frameWindow.ResizeObserver(measureCopiedArticle);
          contentResizeObserver.observe(copiedArticle);
          exactFrame._pcArticleResizeObserver = contentResizeObserver;
          exactFrame._pcArticleOuterResizeObserver = outerResizeObserver;

          Array.from(frameDocument.images).forEach((image) => {
            if (image.complete) return;
            image.addEventListener("load", measureCopiedArticle, { once: true });
            image.addEventListener("error", measureCopiedArticle, { once: true });
          });

          measureCopiedArticle();
          articleWindowBody.classList.remove("pc-article-exact-pending");
          articleWindowBody.classList.add("pc-article-exact-mounted");
          document.documentElement.classList.remove("ohmy-article-copy-preparing");

          /* Reveal as soon as the already-cached PC stylesheets are applied.
             Font and image completion may refine height afterwards, but must
             never hold the phone on an empty article window. */
          Promise.resolve(frameDocument.fonts?.ready)
            .then(measureCopiedArticle)
            .catch(() => {});
          return true;
        };

        exactFrame.addEventListener(
          "load",
          () => {
            void initializeExactArticle();
          },
          { once: true },
        );

        /* Register the load handler before Safari is allowed to start loading
           srcdoc. Otherwise a fast cached load can leave the responsive
           fallback visible instead of the exact desktop article copy. */
        articleWindowBody.classList.add("pc-article-exact-pending");
        exactFrame.srcdoc = exactArticleDocument;
        exactWrap.append(exactFrame);
        articleWindowBody.append(exactWrap);

        outerResizeObserver = new ResizeObserver(syncExactArticleSize);
        outerResizeObserver.observe(articleWindowBody);
        syncExactArticleSize();

        /* srcdoc becomes queryable before its external images finish. Polling
           that document makes the PC-copy layout deterministic even when the
           iframe load event is delayed by a slow image or browser cache. */
        let pollAttempts = 0;
        const pollForExactArticle = () => {
          if (exactArticleInitialized) return;

          const copiedArticle = exactFrame.contentDocument?.querySelector(
            ".article-window-body",
          );
          if (copiedArticle) {
            void initializeExactArticle();
            return;
          }

          pollAttempts += 1;
          if (pollAttempts >= 240) {
            showResponsiveFallback();
            return;
          }

          exactArticlePollFrame = window.requestAnimationFrame(pollForExactArticle);
        };

        exactArticlePollFrame = window.requestAnimationFrame(pollForExactArticle);
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountExactDesktopArticle, {
          once: true,
        });
      } else {
        mountExactDesktopArticle();
      }
    }

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
