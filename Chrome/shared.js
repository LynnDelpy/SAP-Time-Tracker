// Settings and helpers shared by the background, content, popup and settings scripts

// Pages the tracker runs on. Covers both the current S/4HANA Public Cloud
// domain (*.s4hana.cloud.sap) and the older one (*.s4hana.ondemand.com).
const SAP_URL_PATTERNS = [
  'https://*.s4hana.cloud.sap/*',
  'https://*.s4hana.ondemand.com/*'
];

// The SAP busy indicator — time is counted while one of these is visible
const SAP_SELECTORS = ['.sapUiLocalBusyIndicatorAnimation.sapUiLocalBusyIndicatorAnimStandard'];

// Default leaderboard server (see server/). Can be overridden in Settings.
const DEFAULT_LEADERBOARD_SERVER = 'https://sap.satan.lgbt';

function getLeaderboardServer(customServer) {
  return (customServer || DEFAULT_LEADERBOARD_SERVER).trim().replace(/\/$/, '');
}

// Converts data saved by SAP Time Tracker 1.x (totalTime + today_<year>_<month>_<day> keys)
function convertLegacyData(data) {
  const dailyData = {};
  for (const key in data) {
    const match = key.match(/^today_(\d+)_(\d+)_(\d+)$/);
    if (match) {
      dailyData[new Date(match[1], match[2] - 1, match[3]).toDateString()] = data[key];
    }
  }
  const today = new Date().toDateString();
  return {
    todaySeconds: dailyData[today] || 0,
    totalSeconds: data.totalTime || 0,
    lastReset: today,
    dailyData
  };
}
