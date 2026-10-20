// Server-only GoHighLevel client (API v2). Never import this from client code.
// Mock mode: when GHL_API_KEY or GHL_LOCATION_ID is missing, calls are logged, not sent.
const BASE = 'https://services.leadconnectorhq.com';

export const ghlMock = () => !process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID;

async function call(path: string, body: unknown) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_KEY}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`GHL ${path} ${r.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

// Optional JSON map of our field name to GHL custom field id, e.g. {"pet_name":"abc123"}.
// Without an id we send the field key and GHL matches on it.
function fieldIds(): Record<string, string> {
  try { return JSON.parse(process.env.GHL_CUSTOM_FIELD_IDS || '{}'); } catch { return {}; }
}

export type Lead = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags: string[];
  fields: Record<string, string | number | boolean | string[] | undefined>;
  consentNote: string;
  source: string;
  opportunity: { name: string; value?: number };
};

export async function submitLead(lead: Lead): Promise<{ mock: boolean }> {
  if (ghlMock()) {
    console.log('[ghl mock] would send:', JSON.stringify(lead, null, 2));
    return { mock: true };
  }
  const ids = fieldIds();
  const customFields = Object.entries(lead.fields)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => (ids[k] ? { id: ids[k], field_value: v } : { key: k, field_value: v }));

  const c = await call('/contacts/upsert', {
    locationId: process.env.GHL_LOCATION_ID,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone || undefined,
    source: lead.source,
    tags: lead.tags,
    customFields,
  });
  const contactId = c.contact?.id;
  if (!contactId) throw new Error('GHL returned no contact id');

  await call(`/contacts/${contactId}/notes`, { body: lead.consentNote });

  if (process.env.GHL_PIPELINE_ID && process.env.GHL_STAGE_INQUIRY_ID) {
    await call('/opportunities/upsert', {
      locationId: process.env.GHL_LOCATION_ID,
      pipelineId: process.env.GHL_PIPELINE_ID,
      pipelineStageId: process.env.GHL_STAGE_INQUIRY_ID,
      contactId,
      name: lead.opportunity.name,
      status: 'open',
      monetaryValue: lead.opportunity.value || 0,
    });
  }
  return { mock: false };
}

// endpoint
