// Exact wording shown on the forms. Keep in sync with the page text.
// Stored with every submission so we can prove what the person agreed to.
export const CONSENT_VERSION = '2026-10-17';

export const CONSENT_TEXT = {
  terms: 'I accept the privacy policy and terms.',
  quickTerms: 'Email me my calendar. I accept the privacy policy and terms. Unsubscribe any time.',
  cEmail: 'Email me reminders and my calendar.',
  cText: 'Text me reminders. Message and data rates may apply. Reply STOP to opt out.',
  cCall: 'Call me for steps that are close or missed. Say STOP on the call to opt out.',
} as const;
