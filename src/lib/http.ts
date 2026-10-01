/** JSON `Response` helper shared by the Vercel API functions in `api/`. */
export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Reject requests a third-party page could forge from a visitor's browser.
 * A cross-site page can't set a JSON content type without a CORS preflight
 * (which the API functions don't answer), and browsers always send `Origin`
 * on a cross-site POST. Allowed: no `Origin` (non-browser clients, which gain
 * nothing over calling the API directly), or an `Origin` whose host is the
 * request's own host (production, Vercel previews, local preview).
 * Returns an error `Response`, or `null` when the request may proceed.
 */
export function rejectForeignRequest(
  req: Request,
  acceptedTypes: readonly string[] = ["application/json"],
): Response | null {
  const origin = req.headers.get("origin");
  if (origin !== null && !isSameHost(origin, req)) {
    return json(403, { ok: false, error: "forbidden" });
  }
  const type = (req.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!acceptedTypes.includes(type)) {
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
