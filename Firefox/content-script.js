// Content script that runs on SAP S/4HANA pages (or the custom URLs set in Settings)

let wasVisible = false;
let audioElement = null;

function urlMatches(url, patterns) {
  return patterns.some(pattern => {
    try {
      return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')).test(url);
    } catch {
      return false;
    }
  });
}

// A busy indicator counts as visible while it is rendered (offsetParent is null for hidden elements)
function isBusyIndicatorVisible(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.offsetParent !== null) {
      return true;
    }
  }
  return false;
}

async function playNotificationSound() {
  const data = await browser.storage.local.get(['soundUrl', 'soundEnabled']);
  if (!data.soundEnabled || !data.soundUrl) return;
  try {
    if (!audioElement) audioElement = new Audio();
    audioElement.src = data.soundUrl;
    audioElement.volume = 0.5;
    audioElement.play().catch(() => {});
  } catch (e) {}
}

browser.storage.local.get(['customUrls', 'customSelectors']).then((result) => {
  const urlPatterns = result.customUrls && result.customUrls.length ? result.customUrls : SAP_URL_PATTERNS;
  const selectors = result.customSelectors && result.customSelectors.length ? result.customSelectors : SAP_SELECTORS;
  if (!urlMatches(window.location.href, urlPatterns)) return;

  function checkAndNotify() {
    if (isBusyIndicatorVisible(selectors)) {
      if (!wasVisible) {
        wasVisible = true;
        playNotificationSound();
      }
      // Resend loadingStarted every tick while visible so a missed message doesn't
      // leave the timer stopped and the background script gets a keep-alive ping.
      browser.runtime.sendMessage({ action: 'loadingStarted' }).catch(() => {});
    } else if (wasVisible) {
      wasVisible = false;
      browser.runtime.sendMessage({ action: 'loadingStopped' }).catch(() => {});
    }
  }

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getLoadingStatus') {
      sendResponse({ isVisible: isBusyIndicatorVisible(selectors) });
    }
  });

  window.addEventListener('beforeunload', () => {
    if (wasVisible) {
      browser.runtime.sendMessage({ action: 'loadingStopped' }).catch(() => {});
    }
  });

  setInterval(checkAndNotify, 1000);
  checkAndNotify();
});
