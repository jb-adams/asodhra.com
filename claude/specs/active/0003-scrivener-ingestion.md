# Spec: Scrivener Ingestion

## Objective

Build the website's chapter pages from the Scrivener projects that are backed up to GitHub, one private repo per novel. When a novel's repo is pushed, a GitHub Action converts its manuscript to the site's Markdown and opens a pull request on the site repo. Merging that pull request publishes the chapters.

A novel is published only if its repo has this GitHub Action. Novels that are still drafts don't get one.

## What the Rotten Gods project looks like

Based on `cyllenian-jba/rotten-god-00` (`rotten-god-00.scriv`, Scrivener 3.4, project format version 23):

- The **Manuscript** folder (Scrivener's Draft folder) holds 32 chapter folders in reading order: `Prologue`, `Chapter 1` to `Chapter 30`, and `Final Chapter`. Each holds 1 to 3 scene documents, 55 in all, each with a title such as "Morning Meditation". The chapter folders themselves have no text.
- Each scene's text is in `Files/Data/<scene ID>/content.rtf`. The RTF is simple: paragraphs, curly quotes, apostrophes and italics. There are no footnotes, comments, inline annotations, links, images or lists.
- Outside the Manuscript, the binder also holds material that must never be published: `Garden`, `Notes`, `Old`, `Template Sheets`, the Atticus front and back matter, `Research`, and earlier drafts (`Draft1`, `Draft2`) in the Trash.

## Tasks

### Task 1: Converter

A script in the site repo reads a `.scriv` project and writes the novel's chapter files:

```
npm run sync:novel -- --project <path/to/project.scriv> --novel rotten-gods
```

- It reads only the binder's Draft folder. Everything else in the project is ignored, including Notes, Research, Trash and snapshots.
- Each folder directly inside the Draft folder becomes one chapter, in binder order. Each text document inside it is a scene. Anything with "Include in Compile" unchecked is skipped, as are empty scenes.
- Scenes are converted from RTF to Markdown and joined with `---`, which the site draws as the three-star scene break. Scene titles are not shown on the site.
- The RTF conversion handles what the manuscript uses: paragraphs, italics, bold, curly quotes and other special characters. Characters that mean something in Markdown (such as `*` and `_`) are escaped so they appear as written.
- **If a scene contains anything else**, such as an image, footnote, comment, annotation or link, the script stops with an error naming the scene, rather than guessing. Nothing unexpected is published, and nothing is silently dropped.
- It writes `src/content/chapters/<novel>/<slug>.md` for each chapter, removes chapter files that are no longer in the manuscript, and leaves other novels' chapters alone.
- It runs the same way on a laptop as in GitHub Actions, so a sync can be tried locally before any automation exists.

### Task 2: Chapter pages

- **Titles:** a chapter's title is its folder's name: "Prologue", "Chapter 1", ..., "Final Chapter".
- **Display:** the page and the novel's table of contents currently show a chapter number beside the title, which would read "Chapter 1 · Chapter 1". The number is dropped wherever the title already says it. The `chapter` field remains, but only to set the reading order.
- **URLs:** each chapter's URL comes from its title: `/novels/rotten-gods/prologue/`, `/novels/rotten-gods/chapter-1/`, ..., `/novels/rotten-gods/final-chapter/`.
- **Stable URLs:** each chapter file records its Scrivener folder's ID in a `scrivener` frontmatter field. On later syncs, the script finds the existing file by that ID and keeps its file name, even if the folder is renamed or moved. Readers' bookmarks keep working.
- **Placeholders:** the two placeholder chapters in `src/content/chapters/rotten-gods/` are removed.
- **Docs:** the chapter section of `CLAUDE.md` is updated to say chapters are generated, so they shouldn't be edited by hand.

### Task 3: Point-of-view header images

Each chapter can open with an image showing its point-of-view character. These are set in the site repo, not in Scrivener:

- One image per character, in `src/assets/pov/`.
- One small file per novel naming each chapter's point-of-view character, keyed by the chapter's file name (for example `chapter-1: pyoshara`).
- A chapter without a point-of-view entry, or whose character has no image yet, shows no image.

Syncing never touches these files, so the images survive every sync.

### Task 4: Automation

- **Reusable workflow in the site repo** (`.github/workflows/sync-novel.yml`). It checks out the novel repo and the site repo, runs the converter, and opens or updates a pull request on the site repo from a branch named `sync/<novel>`.
  - The pull request lists which chapters were added, changed or removed.
  - Each novel keeps one sync pull request open, and later pushes update it.
  - A push that doesn't change the manuscript, such as edits to notes, opens nothing.
- **Small workflow in each published novel's repo** (`.github/workflows/publish.yml`), about 10 lines. It runs on every push to `main`, or by hand from the Actions tab. It calls the site's workflow, passing the novel's site ID (`rotten-gods`) and the `.scriv` path.
- **Access:**
  - **Site repo:** the novel repos can't write to the site repo on their own. You create a fine-grained access token limited to `jb-adams/asodhra.com`, with read and write access to contents and pull requests. It's stored as a secret named `SITE_SYNC_TOKEN` in each novel repo. I'll write step-by-step instructions.
  - **Novel repo:** the workflow reads it with its own built-in token.
  - **Calling the site's workflow:** this works because the site repo is public, which GitHub Pages needs on a free plan.

### Task 5: Lore (later, in its own spec)

Lore follows the same pattern once its Scrivener repo exists. The binder's folders become the `/lore/` folders, and Scrivener links between documents may become links between lore pages. It gets its own spec after I've seen the lore project's structure. The converter from Task 1 is written so that lore can reuse it.

## Details

- **Safety:** what can be published is limited by design to the Draft folder, minus anything excluded from compile. Every change still goes through a pull request you review before it's live.
- **Verification:**
  - Run the converter on `rotten-god-00` locally.
  - Compare each scene's word count in Scrivener and on the site.
  - Spot-check italics, quotes and scene breaks in several chapters.
  - Build the site.
  - Open a real pull request from the novel repo to test the whole flow.
- **No new tools to install:** the RTF conversion is written for Scrivener's RTF rather than using Pandoc. This keeps the build self-contained and lets the script refuse anything it doesn't recognize.
- **Scrivener open during a push:** the converter reads only what's committed. A backup pushed mid-edit simply syncs whatever text was saved.

## Open questions

1. **Chapter titles.** Is "Prologue / Chapter 1 ... Chapter 30 / Final Chapter" what readers should see? Or would you like chapter names on the site? Those could come from a site-side list without renaming the Scrivener folders.
2. **Publishing all at once, or gradually?** Should merging the pull request publish the whole novel? Or would you like to release chapters gradually, for example through Chapter 5 first, with a setting in the novel's workflow?
3. **Point of view per chapter, or per scene?** Does a chapter ever switch point of view between scenes? If so, the image could go at each scene break instead of only at the top of the chapter.
4. **GitHub accounts.** The novel repo is under `cyllenian-jba` and the site under `jb-adams`. Are these both your accounts? The access token must be created by an account that can write to `jb-adams/asodhra.com`.
