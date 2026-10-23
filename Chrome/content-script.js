// Content script that runs on SAP S/4HANA pages

let wasBusy = false;
let wasActive = false;
let audioElement = null;

// A busy indicator counts as visible while it is rendered (offsetParent is null for hidden elements)
function isBusyIndicatorVisible() {
  for (const selector of SAP_SELECTORS) {
    const el = document.querySelector(selector);
    if (el && el.offsetParent !== null) {
      return true;
    }
  }
  return false;
}

// The page counts as active while this tab is in the foreground (visible and not minimized).
// This is what drives the total "time on SAP" counter.
function isPageActive() {
  return document.visibilityState === 'visible';
}

function checkAndNotify() {
  // Busy indicator → "wasted" time spent waiting
  if (isBusyIndicatorVisible()) {
    if (!wasBusy) {
      wasBusy = true;
      playNotificationSound();
    }
    // Resend busyStarted every tick while visible so a missed message doesn't
    // leave the timer stopped and the service worker gets a keep-alive ping.
    chrome.runtime.sendMessage({ action: 'busyStarted' }).catch(() => {});
  } else if (wasBusy) {
    wasBusy = false;
    chrome.runtime.sendMessage({ action: 'busyStopped' }).catch(() => {});
  }

  // Foreground page → total time spent on SAP
  if (isPageActive()) {
    wasActive = true;
    chrome.runtime.sendMessage({ action: 'activeStarted' }).catch(() => {});
  } else if (wasActive) {
    wasActive = false;
    chrome.runtime.sendMessage({ action: 'activeStopped' }).catch(() => {});
  }
}

async function playNotificationSound() {
  const data = await chrome.storage.local.get(['soundUrl', 'soundEnabled']);
  if (!data.soundEnabled || !data.soundUrl) return;
  try {
    if (!audioElement) audioElement = new Audio();
    audioElement.src = data.soundUrl;
    audioElement.volume = 0.5;
    audioElement.play().catch(() => {});
  } catch (e) {}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({ isBusy: isBusyIndicatorVisible(), isActive: isPageActive() });
  }
});

// React immediately when the user switches to or away from this tab
document.addEventListener('visibilitychange', checkAndNotify);

window.addEventListener('beforeunload', () => {
  if (wasBusy) {
    chrome.runtime.sendMessage({ action: 'busyStopped' }).catch(() => {});
  }
  if (wasActive) {
    chrome.runtime.sendMessage({ action: 'activeStopped' }).catch(() => {});
  }
});

setInterval(checkAndNotify, 1000);
checkAndNotify();
