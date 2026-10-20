// Browser helper: POST a form to our own API route. Never talks to GHL directly.
export async function postForm(path: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.ok) return { ok: true };
    return { ok: false, error: j.error || 'Something went wrong. Please try again.' };
  } catch {
    return { ok: false, error: 'No connection. Please check your internet and try again.' };
  }
}

// no logs
