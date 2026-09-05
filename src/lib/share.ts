import { Assessment, BorrowerProfile, SharedCardPayload } from './types';

/**
 * Compresses the minimal card output state into a URL-safe base64 string.
 * Uses zero server storage, zero database, zero risk of personal data retention.
 */
export function encodeCardPayload(assessment: Assessment, profile: BorrowerProfile): string {
  const payload: SharedCardPayload = {
    v: assessment.verdict,
    r: profile.requestedAmount,
    p: profile.loanPurpose,
    ls: assessment.estimatedLenderRange,
    bs: assessment.borrowerSafeRange,
    fr: assessment.fairRateRange,
    apr: assessment.effectiveAPRRange,
    emi: assessment.recommendedMaxEMI,
    conf: assessment.confidence,
    wh: assessment.verdictReason,
    alt: assessment.betterAlternative.action,
    rt: assessment.inferredProductRoute,
    ts: Date.now()
  };

  try {
    const jsonStr = JSON.stringify(payload);
    if (typeof window !== 'undefined' && window.btoa) {
      return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    }
    return Buffer.from(jsonStr).toString('base64url');
  } catch (err) {
    console.error('Failed to encode card payload', err);
    return '';
  }
}

/**
 * Decodes the URL hash parameter back into the shared card payload.
 */
export function decodeCardPayload(encoded: string): SharedCardPayload | null {
  if (!encoded) return null;
  try {
    let jsonStr = '';
    if (typeof window !== 'undefined' && window.atob) {
      jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    } else {
      jsonStr = Buffer.from(encoded, 'base64url').toString('utf-8');
    }
    return JSON.parse(jsonStr) as SharedCardPayload;
  } catch (err) {
    console.error('Failed to decode card payload', err);
    return null;
  }
}
