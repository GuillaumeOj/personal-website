/** JSON `Response` helper shared by the Vercel API functions in `api/`. */
export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** The request's media type, lower-cased and without parameters. */
export const mediaType = (req: Request): string =>
  (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();

/** `303 See Other` to a same-site path: where a no-JS form post lands. */
export const redirect = (path: string): Response =>
  new Response(null, { status: 303, headers: { location: path } });

/**
 * Reject requests a third-party page could forge from a visitor's browser.
 * A cross-site page can't set a JSON content type without a CORS preflight
 * (which the API functions don't answer), and browsers always send `Origin`
 * on a cross-site POST. Allowed: an `Origin` whose host is the request's own
 * host (production, Vercel previews, local preview), or no `Origin` at all
 * (non-browser clients, which gain nothing over calling the API directly) —
 * unless `requireOrigin` is set, as it must be for HTML form posts, which any
 * site can send cross-site without a preflight.
 * Returns an error `Response`, or `null` when the request may proceed.
 */
export function rejectForeignRequest(
  req: Request,
  {
    types = ["application/json"],
    requireOrigin = false,
  }: { types?: readonly string[]; requireOrigin?: boolean } = {},
): Response | null {
  const origin = req.headers.get("origin");
  if (origin === null ? requireOrigin : !isSameHost(origin, req)) {
    return json(403, { ok: false, error: "forbidden" });
  }
  if (!types.includes(mediaType(req))) {
    return json(415, { ok: false, error: "unsupported media type" });
  }
  return null;
}

function isSameHost(origin: string, req: Request): boolean {
  const originHost = URL.parse(origin)?.host;
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    new URL(req.url).host;
  return originHost === host;
}
