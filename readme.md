# SAP Wasted Time Tracker

A browser extension that tracks the time wasted waiting for the busy indicator in SAP S/4HANA.

By default all S/4HANA Public Cloud systems (`*.s4hana.ondemand.com`) work.

## Download

- **Firefox**: https://addons.mozilla.org/de/firefox/addon/sap-time-tracker/
- **Chrome / Edge**: https://chromewebstore.google.com/detail/sap-time-tracker/mojlhimcfdjepgcfablifakkdemanbik

## Features

### Time Tracking
- Automatically starts and stops the timer when the SAP busy indicator is visible
- **Wasted Time Today** — resets at midnight
- **Wasted Time Total** — cumulative since installation
- Live badge on the extension icon showing the current session time

### Statistics Dashboard
- Bar chart in the popup showing daily wasted time
- Hover over a bar to see the exact time for that day
- Timespan selector: Last 7 days, 14 days, 30 days, Last year, All time
- Today's bar is highlighted in orange

### Leaderboard
- Global leaderboard showing all users ranked by total wasted time
- Your entry is highlighted with a "you" badge
- If you're outside the top 10, your rank is shown below a separator
- Stats are uploaded automatically when the loading timer stops and every 5 minutes
- The server is pinged on startup — if unreachable, uploads and the leaderboard are disabled for that session
- Self-hostable (see [Server](#server) below)

### Settings
- **Language** — English or German for the popup and settings page (defaults to the browser language)
- **Sound notifications** — play a custom MP3 when the busy indicator appears
- **Leaderboard** — enable/disable the feature, set your display name, configure a custom server URL
- **Data management** — export and import all data (including daily stats) as JSON, reset all data
- **Detection** (Firefox only) — custom URLs and busy indicator selectors for systems outside the S/4HANA Public Cloud

## Usage

1. Open any `*.s4hana.ondemand.com` page
2. The timer starts automatically when the busy indicator appears and stops when it disappears
3. Click the extension icon to see your stats, the daily chart, and the leaderboard
4. Open **⚙️ Settings** to configure sound notifications, your leaderboard name, or data management

## Server

The leaderboard requires a backend server. A self-hostable server is included in the `server/` folder.

### Running with Docker Compose

```bash
cd server
docker compose up -d
```

The server runs on port `3000` by default. SQLite data is persisted in `./server/data/`.

### API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/stats` | Submit a user's stats |
| `DELETE` | `/api/user/:username` | Remove a user (sent when the display name changes) |
| `GET` | `/api/leaderboard` | Get top 100 users ranked by total time |
| `GET` | `/health` | Health check |

The default public server is `https://sap.satan.lgbt`. You can point the extension to your own instance in **Settings → Leaderboard → Server URL**.

## Monitored Elements

The extension checks every second whether the SAP busy indicator is rendered:

- `.sapUiLocalBusyIndicatorAnimation.sapUiLocalBusyIndicatorAnimStandard`

## Changelog

### v2.0
- Rebuilt on the [Dynamics Wasted Time Tracker](https://github.com/Nyyks/dynamics-wasted-time) codebase
- New popup with today/total stats, daily chart and leaderboard
- Live badge on the extension icon
- Language setting (English / German) — no more mixed-language UI
- Sound notification when the busy indicator appears (replaces the looping music)
- Stats and settings from v1.x are migrated automatically; v1.x exports can still be imported
