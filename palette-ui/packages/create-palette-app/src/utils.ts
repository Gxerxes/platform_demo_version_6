export function toAppSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toPackageName(slug: string): string {
  return `@palette/${slug}`;
}

export function toDisplayName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function renderTemplate(content: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`__${key}__`, value),
    content,
  );
}

export function isValidAppSlug(slug: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(slug);
}
