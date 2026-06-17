# Manish Chawla Portfolio

React + Vite portfolio for `manishchawla.com`.

## Included

- React + Vite project
- Central content file for easy updates
- Smooth appearing-on-scroll animation
- Safe loader
- Light/dark mode toggle
- GitHub Pages deployment workflow
- Pull Request build checks
- Custom domain support with `public/CNAME`

## Main editable content file

Most future copy/content updates should happen here:

```text
src/content/portfolioContent.js
```

Use this file to update:

- Navigation
- Hero text
- CTAs
- Featured work
- Web Experience section
- Case studies
- Skills
- AI section
- Timeline
- Contact info
- Footer text

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Custom domain

This project is configured for:

```text
manishchawla.com
```

Important files:

```text
vite.config.js
public/CNAME
```

`vite.config.js` uses:

```js
base: "/"
```

because the final site is served from the root of `manishchawla.com`.

## GitHub Pages

Go to your repo settings:

```text
https://github.com/ommanish/mc-portfolio/settings/pages
```

Set:

```text
Source: GitHub Actions
Custom domain: manishchawla.com
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio project setup"
git branch -M main
git remote add origin https://github.com/ommanish/mc-portfolio.git
git push -u origin main
```

## Future update workflow

```bash
git checkout -b feature/update-content
# update src/content/portfolioContent.js
npm run build
git add .
git commit -m "Update portfolio content"
git push -u origin feature/update-content
```

Then open a Pull Request into `main`.

Merging to `main` deploys the site.
