import { getCollection } from 'astro:content';

export async function getNovels() {
	const novels = await getCollection('novels');
	return novels.sort((a, b) => a.data.order - b.data.order);
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
