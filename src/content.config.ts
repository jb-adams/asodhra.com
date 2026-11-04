import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	// Lore wiki pages, rendered by Starlight under /lore/.
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

	// One file per novel. The body is the synopsis shown on the novel's page.
	novels: defineCollection({
		loader: glob({ pattern: '*.md', base: './src/content/novels' }),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string(),
				// Position in the Dream Stalker Trilogy, shown as "Book I", "Book II"...
				book: z.number().int().positive(),
				cover: image().optional(),
			}),
	}),

	// Chapters live in src/content/chapters/<novel-id>/, ordered by `chapter`.
	chapters: defineCollection({
		loader: glob({ pattern: '*/*.md', base: './src/content/chapters' }),
		schema: z.object({
			title: z.string(),
			novel: reference('novels'),
			chapter: z.number().int().positive(),
		}),
	}),
};
