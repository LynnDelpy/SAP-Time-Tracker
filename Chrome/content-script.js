// Content script that runs on SAP S/4HANA pages

let wasVisible = false;
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

function checkAndNotify() {
  if (isBusyIndicatorVisible()) {
    if (!wasVisible) {
      wasVisible = true;
      playNotificationSound();
    }
    // Resend loadingStarted every tick while visible so a missed message doesn't
    // leave the timer stopped and the service worker gets a keep-alive ping.
    chrome.runtime.sendMessage({ action: 'loadingStarted' }).catch(() => {});
  } else if (wasVisible) {
    wasVisible = false;
    chrome.runtime.sendMessage({ action: 'loadingStopped' }).catch(() => {});
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
  if (request.action === 'getLoadingStatus') {
    sendResponse({ isVisible: isBusyIndicatorVisible() });
  }
});

window.addEventListener('beforeunload', () => {
  if (wasVisible) {
    chrome.runtime.sendMessage({ action: 'loadingStopped' }).catch(() => {});
  }
});

setInterval(checkAndNotify, 1000);
checkAndNotify();
