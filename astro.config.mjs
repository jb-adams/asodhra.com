// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://asodhra.com',
	integrations: [
		starlight({
			title: 'Asodhra',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jb-adams/asodhra.com' }],
			sidebar: [
				{
					label: 'Lore',
					items: [{ autogenerate: { directory: 'lore' } }],
				},
			],
		}),
	],
});
