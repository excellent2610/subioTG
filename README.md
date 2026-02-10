# SubioTG Ops Console

SubioTG Ops Console is a production-ready, enterprise-style static SPA built to run directly from the filesystem or GitHub Pages. It models a real operations console: routing, settings management, state persistence, mock API fetches, and a UI architecture split into clear domains.

## Highlights
- 100% static deployment (HTML/CSS/JS only)
- ES modules with a custom router and centralized store
- Dark theme by default, with a light theme toggle
- Responsive sidebar + top navbar layout
- Charts, tables, and interactive UI components
- Works from `file://` or GitHub Pages without a backend

## Architecture Overview
The app follows a classic enterprise frontend architecture:
- `components/` - reusable UI elements such as the navbar, sidebar, toast, and modal
- `pages/` - page-level UI composition and business logic
- `services/` - data access and mock API abstractions
- `store/` - global state, hydration, and persistence
- `utils/` - shared helpers and DOM utilities

Navigation is handled by a lightweight hash-based router, so every page works on static hosting without server rewrites.

## Folder Structure
```
H:\Projects\subioTG
├── index.html
├── pages
│   ├── dashboard.html
│   ├── settings.html
│   └── about.html
├── assets
│   ├── css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── js
│   │   ├── app.js
│   │   ├── router.js
│   │   ├── store
│   │   │   ├── state.js
│   │   │   └── persistence.js
│   │   ├── services
│   │   │   ├── storageService.js
│   │   │   └── mockApiService.js
│   │   ├── components
│   │   │   ├── navbar.js
│   │   │   ├── sidebar.js
│   │   │   ├── modal.js
│   │   │   └── toast.js
│   │   ├── pages
│   │   │   ├── dashboardPage.js
│   │   │   ├── settingsPage.js
│   │   │   └── aboutPage.js
│   │   └── utils
│   │       ├── dom.js
│   │       ├── helpers.js
│   │       └── constants.js
│   └── img
│       └── logo.svg
├── data
│   └── mockData.json
└── README.md
```

## How to Run Locally (No Server Required)
1. Open File Explorer and go to `H:\Projects\subioTG`.
2. Double-click `index.html`.
3. The app should open in your browser. You can navigate between Dashboard, Settings, and About without reloading.
4. Optional: open `pages\dashboard.html` to verify static redirects are working.

## How to Verify Everything Works Without a Server
1. With the app open from `index.html`, open the browser DevTools.
2. Go to the Console tab.
3. Confirm there are no errors.
4. Click the theme toggle, open the modal, and switch routes to confirm UI interactions.

## Git Initialization (First-Time Users)
1. Open PowerShell.
2. Run `cd H:\Projects\subioTG`.
3. Run `git init`.
4. Run `git add .`.
5. Run `git commit -m "Initial commit"`.

## Create a GitHub Repository
1. Open `https://github.com` and log in.
2. Click the `+` icon in the top-right corner, then select `New repository`.
3. Name the repository `subioTG` (or any name you prefer).
4. Keep the repository public if you want GitHub Pages for free.
5. Click `Create repository`.

## Push Your Code to GitHub
1. Back in PowerShell, make sure you are still in `H:\Projects\subioTG`.
2. Run `git branch -M main`.
3. Copy the repository URL from GitHub (it looks like `https://github.com/yourname/subioTG.git`).
4. Run `git remote add origin <YOUR_REPOSITORY_URL>`.
5. Run `git push -u origin main`.

## Enable GitHub Pages
1. Open your GitHub repository in the browser.
2. Click `Settings`.
3. In the left sidebar, click `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select the `main` branch and `/ (root)` folder.
6. Click `Save`.
7. GitHub will show a Pages URL. It may take a minute to go live.

## Verify the Live Site
1. After GitHub Pages finishes deploying, open the Pages URL.
2. Confirm the dashboard loads, the chart renders, and routes switch without reloading.
3. If the chart is missing, hard refresh the page once.

## Notes
- The project uses only static assets and works directly on GitHub Pages.
- All data is mocked via `data/mockData.json`.
- The router uses hash-based navigation to avoid server-side rewrites.
