const FAVORITES_KEY = "querypick-favorites";
const RECENT_KEY = "querypick-recent";
const MAX_RECENT = 10;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

// ── Favorites ──

export function getFavorites(): string[] {
  return readList(FAVORITES_KEY);
}

export function toggleFavorite(itemId: string): string[] {
  const list = getFavorites();
  const idx = list.indexOf(itemId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(itemId);
  }
  writeList(FAVORITES_KEY, list);
  return [...list];
}

export function isFavorite(itemId: string): boolean {
  return getFavorites().includes(itemId);
}

// ── Recent ──

export function getRecent(): string[] {
  return readList(RECENT_KEY);
}

export function addRecent(itemId: string): string[] {
  const list = getRecent().filter((id) => id !== itemId);
  list.unshift(itemId);
  const trimmed = list.slice(0, MAX_RECENT);
  writeList(RECENT_KEY, trimmed);
  return trimmed;
}
