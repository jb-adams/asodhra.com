// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { socials } from './src/lib/socials.ts';

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
				Footer: './src/components/Footer.astro',
				Header: './src/components/Header.astro',
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
				MobileMenuToggle: './src/components/MobileMenuToggle.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
			},
			social: [...socials],
			// Starlight links public/favicon.svg. These are fallbacks made from it by
			// `npm run favicons`: the ICO for browsers without SVG favicons (its
			// `sizes` keeps the others on the SVG), and the icon for iOS home screens.
			head: [
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
			],
			sidebar: [
				{
					label: 'Lore',
					items: [{ autogenerate: { directory: 'lore' } }],
				},
			],
		}),
	],
});
