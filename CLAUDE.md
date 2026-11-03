# asodhra.com

A free static website for novels and lore set in the fantasy world of Asodhra, hosted on GitHub Pages at the custom domain `asodhra.com`.

## Status

Not yet scaffolded. The decisions below describe the intended setup.

## Tech decisions

- **Framework: [Astro](https://astro.build), in TypeScript.** It's built for content-heavy static sites and ships no JavaScript by default, so long chapters load fast and read well on phones.
- **Content: Markdown/MDX in Astro content collections.** Chapters and lore entries live under `src/content/`, and their frontmatter is checked against schemas in `src/content.config.ts`.
  - Cross-links between entries (a character's faction, the chapter they first appear in) use `reference()`, so a broken link fails the build.
- **Lore wiki: [Starlight](https://starlight.astro.build)** (Astro's docs theme). It provides the sidebar, search, dark mode and previous/next links.
- **Novels: plain Astro pages** with a cleaner reading layout, not the Starlight wiki layout. Novels and lore share one project.
- **Search: [Pagefind](https://pagefind.app).** The index is built at build time and runs in the browser, with no server.
- **Interactivity:** only where needed (for example a map or a timeline), added to that one page. Everywhere else stays static HTML.
- **Hosting: GitHub Pages**, deployed by the official `withastro/action` GitHub Action on every push to `main`.
- **Domain:** `asodhra.com`, set by a `CNAME` file in `public/`.

## Alternatives considered

- **VitePress:** aimed at technical docs, and harder to adapt into a reading site.
- **Next.js (static export):** much more framework than a static content site needs, and some features don't work when exported as static files.
- **Eleventy:** TypeScript is an add-on there rather than built in, and content isn't typed.
