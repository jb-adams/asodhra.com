// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://asodhra.com',
	integrations: [
		starlight({
			title: 'Asodhra',
			customCss: [
				'@fontsource-variable/cinzel',
				'@fontsource-variable/literata/opsz.css',
				'@fontsource-variable/literata/opsz-italic.css',
				'./src/styles/theme.css',
			],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
			},
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
