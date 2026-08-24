export function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function buildUrlWithParams(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const normalizedPath = normalizePath(path);

  if (!params) {
    return normalizedPath;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `${normalizedPath}?${query}` : normalizedPath;
}

export function resolveBaseURL(baseURL?: string, baseUrl?: string): string {
  return (baseURL ?? baseUrl ?? '').replace(/\/$/, '');
}
