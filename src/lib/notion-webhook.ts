import { createHmac, timingSafeEqual } from "node:crypto";

const SIGNATURE_PREFIX = "sha256=";

export type NotionPayload =
  | { kind: "verification"; token: string }
  | { kind: "event"; type: string }
  | { kind: "unknown" };

export function classifyPayload(rawBody: string): NotionPayload {
  const parsed = JSON.parse(rawBody) as Record<string, unknown>;
  if (typeof parsed.verification_token === "string") {
    return { kind: "verification", token: parsed.verification_token };
  }
  if (typeof parsed.type === "string") {
    return { kind: "event", type: parsed.type };
  }
  return { kind: "unknown" };
}

export function verifySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader?.startsWith(SIGNATURE_PREFIX)) {
    return false;
  }
  const provided = signatureHeader.slice(SIGNATURE_PREFIX.length);
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (provided.length !== expected.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isPageEvent(type: string): boolean {
  return type.startsWith("page.");
}
