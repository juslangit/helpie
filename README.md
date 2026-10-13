# HELPIE web app

A self-contained example web app that combines two versions of HELPIE, keeping the content of both word for word:

- **HELPIE 2024 Android app** (Andromo build, English): Feelings Game, emotion cards game rules, Stress
  Measurement, Health Status Survey, Chat Assistance, Therapist Consultation, Stress Support System.
- **Student Wellbeing Portal** at https://helpie.skpp111.edu.my (SK Putrajaya Presint 11(1), Malay and English;
  the newer version): emotion cards, spelling game, memory game, activities, Share Your Story, staff dashboard.

The app's "Know Your Emotions: Cards Game Theraphy" page and the portal's Activities page described the same four
activities, so they are one Activities page: the portal's text and Start button, plus the app's printed-card rules.

Everything happens inside this app. The only links that leave it are the outside services the original app pointed
to (1 Candy 1 Smile form, surveys, games, chat services, Wix website).

## Run it

Plain HTML, CSS and JavaScript, no build step and no server code:

```
python -m http.server 8765
```

then open http://127.0.0.1:8765.

## Demo storage and staff login (browser only)

This version is a demonstration and has **no server**. `js/api.js` keeps all data in the browser's `localStorage`
(key `helpie-demo-db-v1`):

- stories and activity logs (same fields as the school portal's records)
- the class list used by the story form
- staff accounts (passwords hashed with PBKDF2-SHA256, 150,000 rounds, random salt)

Staff use `#/staff` (the "Log masuk staf" button). On the first visit on a device it asks to create the first staff
account; after that it is a login page (5 wrong tries lock it for 30 seconds). The dashboard has the portal's
statistics, filters, story details with Reviewed / Follow-up / Delete, CSV export and class management, plus staff
accounts (add, delete, change password) and demo tools (add sample data, erase data). "Lupa kata laluan?" on the login
page erases all demo data on that device.

What this means in practice: each device has its own data. A story sent on a phone only appears on a dashboard opened
on that same phone and browser. Anyone with access to the device's browser storage can read the data, so this is not
suitable for real student data. For a real school, swap `js/api.js` for a version that calls a server; the rest of the
app uses only the `H.api` functions, so nothing else needs to change.

## Files

- `index.html`: page shell (top bar, side menu, language and theme switches)
- `js/portal-content.js`: the portal's words, emotion cards and story templates, extracted from its page
- `js/ui.js`: language, helpers, toasts, confetti, dialogs
- `js/api.js`: browser-only data store and staff accounts
- `js/apk.js`: the Android app's sections
- `js/portal.js`: the portal's sections (cards, spelling, memory, activities, story)
- `js/admin.js`: staff login and dashboard (`#/staff`)
- `js/app.js`: home screen, menu, page switching
- `css/style.css`: styles, light and dark
- `img/`, `icons/`, `manifest.webmanifest`, `sw.js`: pictures, icons, offline support.
  After changing any file, bump `VERSION` in `sw.js`.

## Still to decide

- **Therapist Consultation form** (from the Android app) is not connected anywhere; set `FORM_ENDPOINT` in `js/apk.js`.
- The Android app's pages are English only.
