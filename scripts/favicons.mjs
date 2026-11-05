// Makes the favicon fallbacks from public/favicon.svg. Run `npm run favicons`
// after editing the SVG, and commit the results.
//
// - public/favicon.ico: 16, 32 and 48px, for browsers without SVG favicons.
// - public/apple-touch-icon.png: 180px, for iPhone and iPad home screens. iOS
//   rounds the corners itself and turns transparency black, so the tile's
//   corners are filled with its background color.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = new URL('../public/favicon.svg', import.meta.url);
const tileColor = '#140b0a';
const svg = await readFile(source);

/** Renders the SVG (drawn on a 32px grid) at `size` pixels square. */
function png(size, { flatten = false } = {}) {
	let image = sharp(svg, { density: (72 * size) / 32 }).resize(size, size);
	if (flatten) image = image.flatten({ background: tileColor });
	return image.png().toBuffer();
}

/** Packs PNG images into an ICO file (PNG-compressed entries, 32-bit). */
function ico(images) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(images.length, 4);

	let offset = header.length + 16 * images.length;
	const entries = images.map(({ size, data }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size >= 256 ? 0 : size, 0);
		entry.writeUInt8(size >= 256 ? 0 : size, 1);
		entry.writeUInt16LE(1, 4); // color planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += data.length;
		return entry;
	});

	return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })));
await writeFile(new URL('../public/favicon.ico', import.meta.url), ico(images));
await writeFile(new URL('../public/apple-touch-icon.png', import.meta.url), await png(180, { flatten: true }));

console.log('Wrote public/favicon.ico and public/apple-touch-icon.png');
