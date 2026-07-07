import { json } from '../src/lib/http.js';
import {
  classifyPayload,
  isPageEvent,
  type NotionPayload,
  verifySignature,
} from '../src/lib/notion-webhook.js';

export async function POST(req: Request): Promise<Response> {
  const rawBody = await req.text();

  let payload: NotionPayload;
  try {
    payload = classifyPayload(rawBody);
  } catch {
    return json(400, { ok: false, error: 'invalid json' });
  }

  if (payload.kind === 'verification') {
    // Deliberately log the secret: Notion's verification handshake delivers the
    // token via this endpoint, and we have no UI to surface it. Operator copies
    // it from Vercel function logs, pastes into Notion's UI, and stores it as
    // NOTION_WEBHOOK_SECRET on Vercel.
    console.log(`NOTION_VERIFICATION_TOKEN: ${payload.token}`);
    return json(200, { ok: true, verification: true });
  }

  if (payload.kind === 'unknown') {
    return json(400, { ok: false, error: 'unknown payload' });
  }

  const secret = process.env.NOTION_WEBHOOK_SECRET;
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!secret || !deployHookUrl) {
    console.error(
      'Missing NOTION_WEBHOOK_SECRET or VERCEL_DEPLOY_HOOK_URL env var',
    );
    return json(500, { ok: false, error: 'server misconfigured' });
  }

  if (
    !verifySignature(rawBody, req.headers.get('x-notion-signature'), secret)
  ) {
    return json(401, { ok: false, error: 'invalid signature' });
  }

  if (!isPageEvent(payload.type)) {
    console.log(`Ignoring non-page event: ${payload.type}`);
    return json(200, { ok: true, ignored: true, type: payload.type });
  }

  const res = await fetch(deployHookUrl, {
    method: 'POST',
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) {
    console.error(`Deploy hook returned ${res.status}`);
    return json(502, { ok: false, error: 'deploy hook failed' });
  }

  console.log(`Triggered Vercel rebuild for event: ${payload.type}`);
  return json(200, { ok: true, triggered: true, type: payload.type });
}
