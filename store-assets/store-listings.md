# Store listings — SAP Time Tracker v2.0

Screenshots in this folder:

| Folder | Contents |
|---|---|
| `chrome-web-store/en`, `chrome-web-store/de` | 5 screenshots, 1280×800 (24-bit PNG, no alpha) + small promo tile 440×280 |
| `firefox-addons/en`, `firefox-addons/de` | 6 screenshots, 1280×800 (#6 shows the Firefox-only Detection settings) |
| `raw/<browser>/<lang>` | Unedited 2× captures of every popup state and the settings page |

All data in the screenshots is made up (user "Alex M.", fictional leaderboard names).

---

## Chrome Web Store

### Summary (max. 132 characters)

The Chrome Web Store takes the summary from `"description"` in `manifest.json`. Current value (74 chars):

> Tracks the time wasted in SAP S/4HANA while waiting for the busy indicator

Suggested replacement (119 chars):

> Counts every second SAP S/4HANA keeps you waiting on the busy indicator — with daily stats and an optional leaderboard.

German (116 chars, needs `_locales/de/messages.json` — see note at the end):

> Zählt jede Sekunde, die Sie in SAP S/4HANA auf die Ladeanzeige warten – mit Tagesstatistik und optionaler Rangliste.

### Category

Productivity → Tools (or Workflow & Planning)

### Description — English

```text
Ever wondered how much of your workday disappears into SAP's busy indicator? SAP Time Tracker measures it for you — automatically, second by second.

As soon as the S/4HANA busy indicator appears, the timer starts. When it disappears, the timer stops. No buttons, no setup: open SAP and work as usual.

WHAT YOU GET
• Wasted Time Today and Wasted Time Total, one click away
• A live timer on the toolbar icon while SAP is loading
• Daily bar chart for the last 7, 14 or 30 days, the last year or all time — hover a bar for the exact time
• Optional sound when the busy indicator appears (use your own MP3)
• English and German interface, picked automatically from your browser
• Export and import all your data as JSON

LEADERBOARD (OPTIONAL)
Compare your wasted time with other SAP users. Enter a display name in the settings to join — the popup shows the top 10 plus your own rank. Prefer to keep it within your team? The leaderboard server is open source and runs with a single Docker command; just enter your server's URL in the settings. You can also switch the leaderboard off completely.

WORKS WITH
All SAP S/4HANA Cloud systems (*.s4hana.ondemand.com) out of the box.

PRIVACY
Your statistics are stored locally in your browser. Only when you enter a display name are that name and your wasted time (today and total) sent to the leaderboard server — no SAP content, no URLs, no business data. Leave the name empty or turn the leaderboard off and nothing is uploaded.

Open source: https://github.com/Nyyks/SAP-Time-Tracker
```

### Description — German

```text
Haben Sie sich schon einmal gefragt, wie viel Ihres Arbeitstags in der SAP-Ladeanzeige verschwindet? SAP Time Tracker misst es für Sie – automatisch und auf die Sekunde genau.

Sobald die Ladeanzeige in S/4HANA erscheint, startet der Timer. Verschwindet sie, stoppt er. Keine Knöpfe, keine Einrichtung: SAP öffnen und wie gewohnt arbeiten.

FUNKTIONEN
• Heute und insgesamt verschwendete Zeit, nur einen Klick entfernt
• Live-Timer am Erweiterungssymbol, während SAP lädt
• Tagesstatistik als Balkendiagramm: 7, 14 oder 30 Tage, letztes Jahr oder gesamter Zeitraum – Maus über einen Balken zeigt die genaue Zeit
• Optionaler Sound, wenn die Ladeanzeige erscheint (eigene MP3-Datei)
• Deutsche und englische Oberfläche, automatisch passend zum Browser
• Alle Daten als JSON exportieren und importieren

RANGLISTE (OPTIONAL)
Vergleichen Sie Ihre verschwendete Zeit mit anderen SAP-Nutzern. Legen Sie in den Einstellungen einen Anzeigenamen fest, um teilzunehmen – das Popup zeigt die Top 10 und Ihren eigenen Rang. Lieber nur im eigenen Team? Der Ranglisten-Server ist Open Source und läuft mit einem einzigen Docker-Befehl; tragen Sie einfach die URL Ihres Servers in den Einstellungen ein. Die Rangliste lässt sich auch komplett ausschalten.

KOMPATIBILITÄT
Alle SAP S/4HANA Cloud-Systeme (*.s4hana.ondemand.com) funktionieren sofort.

DATENSCHUTZ
Ihre Statistiken werden lokal in Ihrem Browser gespeichert. Nur wenn Sie einen Anzeigenamen eingeben, werden dieser Name und Ihre verschwendete Zeit (heute und insgesamt) an den Ranglisten-Server gesendet – keine SAP-Inhalte, keine URLs, keine Geschäftsdaten. Ohne Anzeigenamen oder mit ausgeschalteter Rangliste wird nichts hochgeladen.

Open Source: https://github.com/Nyyks/SAP-Time-Tracker
```

### Privacy practices tab

**Single purpose**

> Measures how long the user waits for the SAP S/4HANA busy indicator and shows it as statistics, with an optional leaderboard.

**Permission justifications**

| Permission | Justification |
|---|---|
| `storage` | Saves the tracked times, daily statistics and settings locally. |
| Host `https://*.s4hana.ondemand.com/*` | The content script checks S/4HANA pages once per second for the busy indicator element to start and stop the timer. It does not read or send any page content. |
| Host `https://*/*`, `http://*/*` | Lets the extension reach the leaderboard server. Its URL is user-configurable (default `https://sap.satan.lgbt`, or any self-hosted server). |

**Remote code:** No.

**Data usage:** If the leaderboard is used, the display name (possibly a real name → *Personally identifiable information*) and wait-time totals (*User activity*, matching the `browsingActivity` declared for Firefox) go to the leaderboard server. Tick the three certifications: not sold, not used for unrelated purposes, not used for creditworthiness. Declaring data collection means a **privacy policy URL** is required. The PRIVACY paragraph above, placed in a `PRIVACY.md` in the repo, is enough.

---

## Firefox Add-ons (AMO)

AMO lets you add a German translation of the name, summary and description directly in the Developer Hub.

**Category:** Other (or Alerts & Updates)

### Summary — English (max. 250 characters)

> Counts every second SAP S/4HANA keeps you waiting on the busy indicator. See today's and total wasted time and daily charts, and compare yourself on an optional, self-hostable leaderboard.

### Summary — German

> Zählt jede Sekunde, die SAP S/4HANA Sie mit der Ladeanzeige warten lässt. Heute und insgesamt verschwendete Zeit, Tagesstatistik und eine optionale, selbst hostbare Rangliste.

### Description

Use the Chrome descriptions above and replace the **WORKS WITH** / **KOMPATIBILITÄT** block with:

```text
WORKS WITH
All SAP S/4HANA Cloud systems (*.s4hana.ondemand.com) out of the box. Running SAP on-premise or on your own domain? Add your own URLs (wildcards allowed) and busy indicator selectors under Settings → Detection.

WHY "ACCESS YOUR DATA FOR ALL WEBSITES"?
So the add-on also works on custom SAP URLs and self-hosted leaderboard servers. On every page it first checks the address against your SAP URL list and does nothing on pages that don't match.
```

```text
KOMPATIBILITÄT
Alle SAP S/4HANA Cloud-Systeme (*.s4hana.ondemand.com) funktionieren sofort. SAP on-premise oder unter eigener Domain? Fügen Sie unter Einstellungen → Erkennung eigene URLs (mit Platzhaltern) und Ladeanzeige-Selektoren hinzu.

WARUM ZUGRIFF AUF „ALLE WEBSITES"?
Damit das Add-on auch mit eigenen SAP-URLs und selbst gehosteten Ranglisten-Servern funktioniert. Auf jeder Seite wird zuerst die Adresse mit Ihrer SAP-URL-Liste verglichen – auf allen anderen Seiten tut das Add-on nichts.
```

### Screenshot captions

| # | English | Deutsch |
|---|---|---|
| 1 | Today's and total wasted time, live status, daily chart and leaderboard in one popup | Heute und insgesamt verschwendete Zeit, Live-Status, Tagesstatistik und Rangliste in einem Popup |
| 2 | Daily statistics — hover a bar for the exact time | Tagesstatistik – Maus über einen Balken zeigt die genaue Zeit |
| 3 | Optional leaderboard with your own rank | Optionale Rangliste mit Ihrem eigenen Rang |
| 4 | Sound notification and leaderboard settings | Sound-Hinweis und Ranglisten-Einstellungen |
| 5 | Available in English and German | Auf Deutsch und Englisch verfügbar |
| 6 | Custom SAP URLs and busy indicator selectors | Eigene SAP-URLs und Ladeanzeige-Selektoren |

---

## Notes

- **German listing in the Chrome Web Store:** the dashboard only offers a language once the extension declares it. That means adding `"default_locale": "en"` and `_locales/en|de/messages.json` (with `name` and `description`) to the Chrome build. Until then, upload only the English set.
- **Broad host permissions on Chrome** (`https://*/*`) often cause a longer review. The leaderboard server already sends CORS headers (`app.use(cors())`), so those two entries can probably be dropped — test the leaderboard without them before submitting.
