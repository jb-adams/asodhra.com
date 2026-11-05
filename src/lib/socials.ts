// The site's social accounts, shown in the header (via Starlight's `social`
// config in astro.config.mjs) and in the footer. Replace each `#` with the
// account's URL once it exists. `icon` names one of Starlight's built-in icons.
export const socials = [
	{ label: 'YouTube', icon: 'youtube', href: '#' },
	{ label: 'TikTok', icon: 'tiktok', href: '#' },
	{ label: 'Instagram', icon: 'instagram', href: '#' },
] as const;
