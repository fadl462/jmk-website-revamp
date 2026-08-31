# JMK Consulting Group — Premium Revamp

This version is intentionally deployable as a **static GitHub Pages site**.

## Important
GitHub Pages was previously configured to serve the repository root while `index.html` attempted to load `/src/main.jsx`. That file contains JSX/React module syntax and requires a Vite build step; GitHub Pages does not transform it automatically. The result is a blank page.

The root now contains a self-contained HTML/CSS/JavaScript implementation, so it can be served directly from the `main` branch root without npm, Vite, or a build command.

## GitHub Pages
Set:
- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

Then wait for the Pages deployment to finish and hard-refresh the site.

The `src/` folder is retained as the original React source concept, but the live GitHub Pages entry point is the root `index.html`.
