import { createHash } from "node:crypto";
import { BlobNotFoundError, head, put } from "@vercel/blob";

const BLOB_PREFIX = "notion/";
const AVATAR_PREFIX = "notion/avatars/";

function parseNotionFileKey(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith(".amazonaws.com")) return null;
    const [parentId, objId, fileName] = pathname.split("/").filter(Boolean);
    if (!parentId || !objId || !fileName) return null;
    const ext = fileName.split(".").pop() ?? "bin";
    return `${BLOB_PREFIX}${parentId}/${objId}.${ext}`;
  } catch {
    return null;
  }
}

function parseAvatarKey(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".public.blob.vercel-storage.com")) {
      return null;
    }
    const stable = `${parsed.origin}${parsed.pathname}`;
    const hash = createHash("sha256").update(stable).digest("hex").slice(0, 24);
    return `${AVATAR_PREFIX}${hash}`;
  } catch {
    return null;
  }
}

async function uploadIfMissing(url: string, key: string): Promise<string> {
  const token = import.meta.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return url;

  try {
    const existing = await head(key, { token });
    return existing.url;
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) throw error;
  }

  const res = await fetch(url);
  if (!res.ok) return url;
  const body = await res.arrayBuffer();
  const { url: publicUrl } = await put(key, body, {
    access: "public",
    token,
    addRandomSuffix: false,
    contentType: res.headers.get("content-type") ?? undefined,
  });
  return publicUrl;
}

export async function uploadNotionFileIfMissing(url: string): Promise<string> {
  const key = parseNotionFileKey(url);
  if (!key) return url;
  return uploadIfMissing(url, key);
}

export async function uploadAvatarIfMissing(url: string): Promise<string> {
  const key = parseAvatarKey(url);
  if (!key) return url;
  return uploadIfMissing(url, key);
}
