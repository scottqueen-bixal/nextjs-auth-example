export const DEFAULT_REDIRECT = "/dashboard";

/**
 * Safely extract redirect_uri from search params, handling arrays
 */
export function extractRedirectUri(searchParams: {
  [key: string]: string | string[] | undefined;
}): string | undefined {
  const value = searchParams.redirect_uri;
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Resolve and validate redirect URI, only allowing relative paths starting with /
 */
export function resolveRedirectUri(value: string | undefined): string {
  if (!value) return DEFAULT_REDIRECT;

  // Only allow relative paths starting with /
  if (!value.startsWith("/")) return DEFAULT_REDIRECT;

  // Prevent dangerous patterns
  if (value.includes("..") || value.includes("//") || value.includes("\\"))
    return DEFAULT_REDIRECT;

  // Basic validation - should be a safe relative path
  try {
    // Ensure it's a valid relative URL when combined with a base
    const testUrl = new URL(value, "http://example.com");
    if (testUrl.origin !== "http://example.com") return DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }

  return value;
}

/**
 * Build absolute URL from relative path using trusted frontend URL
 */
export function buildAbsoluteUrl(relativePath: string): string {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return frontendUrl + relativePath;
}
