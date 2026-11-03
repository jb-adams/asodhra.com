# asodhra.com

A free static website for the Dream Stalker Trilogy by Jeremy Bruce Adams (*Rotten Gods*, *Heaven's Chains*) and lore of its world, Asodhra. Hosted on GitHub Pages at the custom domain `asodhra.com`.

## Development

- `npm run dev`: local dev server. See @AGENTS.md for running it in the background.
- `npm run check`: type-check `.astro` and `.ts` files.
- `npm run build`: build the static site to `dist/`, including the Pagefind search index.

## Layout

- `src/content/novels/<novel-id>.md`: one file per novel (title, description, `book` number in the trilogy). The body is the synopsis.
- `src/content/chapters/<novel-id>/<NN-slug>.md`: chapters. Frontmatter has `novel` (a reference to the novel's id) and `chapter` (its number). The file name becomes the URL: `/novels/<novel-id>/<NN-slug>/`.
- `src/content/docs/lore/`: lore wiki pages, rendered by Starlight at `/lore/`. The sidebar is generated from the folder structure.
- `src/pages/`: the home page and novel/chapter routes, rendered with Starlight's `StarlightPage` component.
- `src/styles/theme.css`: the site theme (colors, fonts, ornaments, home page and reading styles).
- `src/components/SiteTitle.astro`: overrides Starlight's site title to add the Novels/Lore header links.
- `src/assets/logo-*.svg`, `public/favicon.svg`: the four-pointed star mark.
- `src/content.config.ts`: collection schemas.

## Tech decisions

- **Framework: [Astro](https://astro.build), in TypeScript.** It's built for content-heavy static sites and ships no JavaScript by default, so long chapters load fast and read well on phones.
- **Content: Markdown/MDX in Astro content collections**, with frontmatter checked against schemas in `src/content.config.ts`.
  - Cross-links between entries use `reference()`. Astro only *logs* a broken reference and still builds, so code that resolves references must throw when `getEntry()` returns nothing (as `src/pages/novels/[novel]/[chapter].astro` does).
  - Import `z` from `astro/zod`. The copy in `astro:content` is deprecated.
- **Lore wiki: [Starlight](https://starlight.astro.build)** (Astro's docs theme). It provides the sidebar, search, dark mode and previous/next links.
- **Novels: Astro pages wrapped in `StarlightPage`** with the `splash` template (no sidebar) and a narrower reading column (`.asodhra-reading`). This gives every page the same header, search and light/dark switch. Chapter previous/next links use Starlight's `prev`/`next` frontmatter.
- **Search: [Pagefind](https://pagefind.app)**, run by Starlight at build time with no server. Starlight marks the content of every page for indexing; the home page opts out with `pagefind: false`.
- **Interactivity:** only where needed (for example a map or a timeline), added to that one page. Everywhere else stays static HTML.
- **Hosting: GitHub Pages**, deployed by `.github/workflows/deploy.yml` (`withastro/action`) on every push to `main`.
- **Domain:** `asodhra.com`, set as `site` in `astro.config.mjs` and in the repo's Settings → Pages → Custom domain. GitHub ignores a `CNAME` file when deploying from Actions, so the repo doesn't have one.

## Branding

Taken from the *Rotten Gods* cover: a blood-red sky, a fiery eye with a dark pupil, gold title lettering and four-pointed stars. The world draws on South and Southeast Asia and the Caribbean (jungle temples, opulent cities like Jaipur and Varanasi, a desert monastery) with eldritch horror and dream paradises.

- **Colors:** dark mode is night under the eye (near-black red background, gold accent); light mode is desert sandstone with crimson ink. Every text color passes WCAG AA (4.5:1) against its background; keep it that way when changing colors. The eye and book cards stay dark in both modes, like printed covers.
- **Fonts:** Cinzel for headings and labels (the cover's carved capitals), Literata for body text (designed for long reading on screens). Both are self-hosted via Fontsource.
- **Ornament:** the four-pointed star: logo, favicon, scene breaks (`---` in Markdown renders as three stars), heading flourishes. Chapters open with a drop cap.

## Alternatives considered

- **VitePress:** aimed at technical docs, and harder to adapt into a reading site.
- **Next.js (static export):** much more framework than a static content site needs, and some features don't work when exported as static files.
- **Eleventy:** TypeScript is an add-on there rather than built in, and content isn't typed.
