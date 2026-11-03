# asodhra.com

A free static website for novels and lore set in the fantasy world of Asodhra, hosted on GitHub Pages at the custom domain `asodhra.com`.

## Development

- `npm run dev`: local dev server. See @AGENTS.md for running it in the background.
- `npm run check`: type-check `.astro` and `.ts` files.
- `npm run build`: build the static site to `dist/`, including the Pagefind search index.

## Layout

- `src/content/novels/<novel-id>.md`: one file per novel (title, description, `order` on the home page). The body is the synopsis.
- `src/content/chapters/<novel-id>/<NN-slug>.md`: chapters. Frontmatter has `novel` (a reference to the novel's id) and `chapter` (its number). The file name becomes the URL: `/novels/<novel-id>/<NN-slug>/`.
- `src/content/docs/lore/`: lore wiki pages, rendered by Starlight at `/lore/`. The sidebar is generated from the folder structure.
- `src/pages/`: the home page and novel/chapter routes, using `src/layouts/ReadingLayout.astro`.
- `src/content.config.ts`: collection schemas.

## Tech decisions

- **Framework: [Astro](https://astro.build), in TypeScript.** It's built for content-heavy static sites and ships no JavaScript by default, so long chapters load fast and read well on phones.
- **Content: Markdown/MDX in Astro content collections**, with frontmatter checked against schemas in `src/content.config.ts`.
  - Cross-links between entries use `reference()`. Astro only *logs* a broken reference and still builds, so code that resolves references must throw when `getEntry()` returns nothing (as `src/pages/novels/[novel]/[chapter].astro` does).
  - Import `z` from `astro/zod`. The copy in `astro:content` is deprecated.
- **Lore wiki: [Starlight](https://starlight.astro.build)** (Astro's docs theme). It provides the sidebar, search, dark mode and previous/next links.
- **Novels: plain Astro pages** with a cleaner reading layout, not the Starlight wiki layout. Novels and lore share one project.
- **Search: [Pagefind](https://pagefind.app)**, run by Starlight at build time with no server. It indexes only elements marked `data-pagefind-body`, which Starlight adds to lore pages. Novel and chapter pages add it to their `<article>`.
- **Interactivity:** only where needed (for example a map or a timeline), added to that one page. Everywhere else stays static HTML.
- **Hosting: GitHub Pages**, deployed by `.github/workflows/deploy.yml` (`withastro/action`) on every push to `main`.
- **Domain:** `asodhra.com`, set as `site` in `astro.config.mjs` and in the repo's Settings → Pages → Custom domain. GitHub ignores a `CNAME` file when deploying from Actions, so the repo doesn't have one.

## Alternatives considered

- **VitePress:** aimed at technical docs, and harder to adapt into a reading site.
- **Next.js (static export):** much more framework than a static content site needs, and some features don't work when exported as static files.
- **Eleventy:** TypeScript is an add-on there rather than built in, and content isn't typed.
