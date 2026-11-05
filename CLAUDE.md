# asodhra.com

A free static website for the world of Asodhra, a literary universe developed by Jeremy Bruce Adams (the author) and owned by Brass Jungle (the self-publishing imprint). The novels set within Asodhra are geared toward fans of epic fantasy and cosmic & eldritch horror. Every story set in Asodhra belongs to *The Asodhran Sagas*, the catch-all name for the world's fiction. Currently these include The Dream Stalker Trilogy (*Rotten Gods* and *Heaven's Chains*).

Both full novels and lore articles are included in this site. The site is hosted on GitHub Pages at the custom domain `asodhra.com`.

## Development

- `npm run dev`: local dev server. See @AGENTS.md for running it in the background.
- `npm run check`: type-check `.astro` and `.ts` files.
- `npm run build`: build the static site to `dist/`, including the Pagefind search index.

## Layout

- `src/content/novels/<novel-id>.md`: one file per novel (title, description, `book` number in the trilogy, optional `cover` image). The body is the synopsis.
- `src/assets/covers/`: cover images, referenced from novel frontmatter. The current files are 313×500 copies from Amazon; replace them with the originals at the same paths.
- `src/content/chapters/<novel-id>/<NN-slug>.md`: chapters. Frontmatter has `novel` (a reference to the novel's id) and `chapter` (its number). The file name becomes the URL: `/novels/<novel-id>/<NN-slug>/`.
- `src/content/docs/lore/`: lore wiki pages, rendered by Starlight at `/lore/`. The sidebar is generated from the folder structure.
- `src/pages/`: the home page and novel/chapter routes, rendered with Starlight's `StarlightPage` component.
- `src/styles/theme.css`: the site theme (colors, fonts, ornaments, home page and reading styles).
- `src/components/SiteTitle.astro`: overrides Starlight's site title to add the Novels/Lore header links.
- `docs/HOMEPAGE.md`: the home page copy. `src/pages/index.astro` holds the same text; change both together.
- `src/components/SectionArt.astro`: a full-width background image behind a home page section, with an optional light-mode image. Set images in the `art` object (and the `hooks` cards) at the top of `src/pages/index.astro`; put the files in `src/assets/home/`. With no image, a section shows a theme background.
- `public/favicon.svg`: the browser tab icon, a gold four-pointed star.
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

The world of Asodhra draws on the Silk Roads, Southeast Asia, and the Caribbean (jungle temples, opulent cities like Jaipur and Varanasi, desert monasteries). Beyond this, eldritch horrors lurk in the underworld and create fantastical dream paradises to imprison the souls of their followers.

There are two color themes: one for light mode and another for dark mode. Both palettes can be found in `src/styles/theme.css`.

### Common Theming

- **Fonts:** Cinzel for headings and labels (the cover's carved capitals), Literata for body text (designed for long reading on screens). Both are self-hosted via Fontsource.
- **Ornament:** scene breaks (`---` in Markdown renders as three stars), heading flourishes. Chapters open with a drop cap.
- **Book Covers:** shown on the home page cards and beside each novel's synopsis, with a blurred wash of the cover behind the novel's title, tinted crimson in dark mode and cerulean in light mode.
- Every text color passes WCAG AA (4.5:1) against its background; keep it that way when changing colors. The placeholder cover looks the same in both modes, like print.

### Light Mode Theme: The Sorkarian Order

The protagonist belongs to a secret society known as the Sorkarian Order, a group of assassin priests who fight the rotten gods. They wear cerulean jackets embroidered with gold.

- **sorkarian**: sandstone background. navy and cerulean. gold accents

### Dark Theme: The Crimson Isles

Taken from the cover of *Rotten Gods*, the Crimson Isles Dark Theme features a blood-red sky, a fiery eye with a dark pupil, and gold title lettering

- **crimsonisles**: night background. dark crimson and near-black red. gold accents.

## Alternatives considered

- **VitePress:** aimed at technical docs, and harder to adapt into a reading site.
- **Next.js (static export):** much more framework than a static content site needs, and some features don't work when exported as static files.
- **Eleventy:** TypeScript is an add-on there rather than built in, and content isn't typed.
