import slugify from 'slugify';

/**
 * Convert a string to a URL-friendly slug
 * Example: "New York" -> "new-york"
 */
export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

