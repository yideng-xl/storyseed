import { getImageUrl } from '../services/pollinations'

const STORAGE_KEY = 'storyseed_history'
const MAX_HISTORY = 10

export function saveStory(story) {
  try {
    const history = getHistory()
    const entry = {
      id: story.id,
      title: story.title,
      titleEn: story.titleEn,
      prompt: story.prompt,
      artStyleKey: story.artStyleKey,
      seed: story.seed,
      createdAt: story.createdAt,
      pages: story.pages.map((p) => ({
        pageNumber: p.pageNumber,
        illustrationPrompt: p.illustrationPrompt,
        chinese: p.chinese,
        english: p.english,
      })),
    }
    const updated = [entry, ...history.filter((h) => h.id !== entry.id)].slice(0, MAX_HISTORY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.warn('Failed to save story to history:', e)
  }
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function deleteStory(id) {
  try {
    const history = getHistory().filter((h) => h.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Failed to delete story:', e)
  }
}

export function hydrateStory(entry) {
  return {
    ...entry,
    pages: entry.pages.map((p, idx) => ({
      ...p,
      imageUrl: getImageUrl(p.illustrationPrompt, entry.artStyleKey, entry.seed, idx),
    })),
  }
}
