# GitHub Pages setup for ommanish/mc-portfolio

## Repo

```text
https://github.com/ommanish/mc-portfolio
```

## Domain

```text
https://manishchawla.com
```

## Required config

### vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
});
```

### public/CNAME

```text
manishchawla.com
```

## GitHub Pages settings

Go to:

```text
Settings → Pages
```

Use:

```text
Source: GitHub Actions
Custom domain: manishchawla.com
```

## DNS records

For apex domain:

```text
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```

For www:

```text
CNAME www ommanish.github.io
```

## CI/CD behavior

- Pull request to `main`: runs build check only
- Push/merge to `main`: builds and deploys to GitHub Pages
