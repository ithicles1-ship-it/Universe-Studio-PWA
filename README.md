# Universe Studio v21 — iPhone & Desktop PWA

This folder contains a GitHub Pages-ready, installable copy of **Universe Studio v21**.

## Install on GitHub Pages

1. On GitHub, create a **new repository** (e.g. `Universe-Studio-PWA`). A free GitHub Pages deployment usually needs a **public** repository.
2. Choose **Add file → Upload files** in the new repo, and upload the **contents of this folder** into the repository root, not the ZIP itself. Make sure `index.html`, `sw.js`, `manifest.webmanifest`, `icons/`, and `.nojekyll` are present.
3. In the repo, select **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**.
4. GitHub will provide a URL resembling `https://YOUR-USERNAME.github.io/Universe-Studio-PWA/`.
5. On an iPhone, open that HTTPS link in **Safari → Share / Page Menu → Add to Home Screen → Open as Web App**.
6. On Mac, visit the same URL in Firefox and bookmark it. It remains usable in a desktop browser.

### What gets saved where?

- **App code:** GitHub repository and GitHub Pages (public if published as a Pages site).
- **Universe results, rosters, rivalries, awards and schedules:** browser/device IndexedDB and local storage, not GitHub.
- **Offline app shell:** service-worker cache, separate from your Universe save.
- **Backups:** your exported JSON files, wherever you decide to save them.

The iPhone and Mac do **not** automatically sync. For manual transfer, use **Export Universe** on the source, then AirDrop/iCloud Drive/Files, followed by **Import Universe** on the destination. Importing can replace local records: back up both devices first.

### Existing desktop save

Opening the original HTML with `file://` and opening this GitHub Pages URL are different storage locations. On your Mac, export from the existing v21 HTML **before** switching, then import into the hosted version.

### Important privacy warning

The v21 standalone HTML already contains **embedded example/starter Universe records** (including wrestlers, rivalry history and match information), so **that embedded data becomes publicly readable if you upload this build to a public repository**. It does not automatically upload your subsequently saved private changes. Remove or replace starter data in the published build before uploading if you do not want that initial material to be public. Do not commit exported Universe JSON backups or API keys.

### Offline operation

Open the GitHub Pages URL online at least once to allow the service worker to cache the 5 MB application. On later launches it can work offline, subject to the device retaining the service-worker cache. Hosted AI APIs always require connectivity; Ollama running on the Mac is not accessible as `localhost` from the phone.

### Mobile feature notes

This is the original, desktop-first Universe Studio v21 interface with PWA packaging. It is **not** a verified mobile redesign. Booking, simple forms, JSON import/export and basic editing should be feasible, but the large match editor, touch-only hover controls, drag-and-drop, 3D painting, large image processing, and folder selection may be limited or require mobile-specific development. Test on the actual iPhone before relying on it for booking.

### Updating the app

Replace `index.html` in the repository, **increment the `VERSION` constant in `sw.js`**, and publish both. Previous browser save data is preserved as long as the site URL/origin and app schema remain compatible. Export a backup before every major upgrade.

### No GitHub sync

The app has no GitHub write APIs, no GitHub authentication, and no backend sync service. `sw.js` caches only app shell files, never user save data.
