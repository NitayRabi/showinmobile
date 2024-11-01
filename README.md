# ShowInMobile

Showcase a site in a mobile frame, with options to "whitelabel" the display and presnt in fullscreen. [See it live](https://showinmobile.app)

## Contribution

1. Install the repo using `yarn`:

```bash
yarn install
```

2. Run the development server using `yarn`:

```bash
yarn dev
```

## Known issues


- [ ] `x-frame-options`: The site allows showcasing websites that enable rendering via an iframe. This can be worked around by:  
  -  (You're the owner of the site) update x-frame-options to support `https://showinmobile.app`
  -  Offering an Electron native app with a webview type solution.
  -  Offering a Chrome extension.
  -  Creating a proxy server (hard, questionably legal and secure, and costly).

Built with [Next.js](https://nextjs.org/)
