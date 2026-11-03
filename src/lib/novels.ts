import { getCollection } from 'astro:content';

export async function getNovels() {
	const novels = await getCollection('novels');
	return novels.sort((a, b) => a.data.book - b.data.book);
}

export async function getChapters(novelId: string) {
	const chapters = await getCollection('chapters', ({ data }) => data.novel.id === novelId);
	return chapters.sort((a, b) => a.data.chapter - b.data.chapter);
}

// A chapter's URL segment is its file name, e.g. `01-arrival` for
// src/content/chapters/<novel-id>/01-arrival.md.
export function chapterSlug(chapterId: string) {
	return chapterId.split('/').at(-1)!;
}

const numerals: [number, string][] = [
	[10, 'X'],
	[9, 'IX'],
	[5, 'V'],
	[4, 'IV'],
	[1, 'I'],
];

// Book numbers as on the covers: 1 -> I, 2 -> II. Only needs to cover a series.
export function romanNumeral(n: number) {
	let out = '';
	for (const [value, numeral] of numerals) {
		while (n >= value) {
			out += numeral;
			n -= value;
		}
	}
	return out;
}
