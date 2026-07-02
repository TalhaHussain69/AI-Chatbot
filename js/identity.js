export const IDENTITY_ANSWER = "Mujhe Talha Jutt ne banaya hai. Woh Islamia University Bahawalpur mein Computer Science ke student hain aur is AI Chatbot project ke developer hain.";

const identityPatterns = [
  /who\s+(created|made|built|developed|designed|coded|programmed)\s+you/i,
  /who\s+is\s+your\s+(creator|developer|maker|owner|programmer|author)/i,
  /who\s+(owns|built|runs)\s+(this|you)/i,
  /(made|created|built|developed)\s+by\s+who/i,
  /your\s+(creator|developer|maker|owner)\s+is/i,
  /who\s+is\s+behind\s+(this|you)/i,
  /developer\s+of\s+(this|you)/i,
  /(kis\s*ne|kisne|kis\s*ny|kisny)\s*(tumhe|tumhein|aapko|ap\s*ko|is\s*ko|ise)?\s*(banaya|bnaya)/i,
  /(tumhe|tumhein|aapko|ap\s*ko)\s*(kis\s*ne|kisne|kis\s*ny|kisny)\s*(banaya|bnaya)/i,
  /(tumhara|tmhara|aapka|apka)\s*(banane\s*wala|creator|developer|maker)/i,
  /tum(hein)?\s*kaun(sy)?\s*(banaya|bnaya)/i,
  /किसने.*बनाया/,
  /आपको.*किसने.*बनाया/,
  /तुम्हें.*किसने.*बनाया/,
  /तुम्हारा.*निर्माता/,
  /من\s*صنعك/,
  /من\s*طورك/,
  /من\s*قام\s*بإنشائك/,
  /من\s*برمجك/,
  /من\s*هو\s*مطورك/
];

export function isIdentityQuestion(text) {
  if (!text) return false;
  return identityPatterns.some(pattern => pattern.test(text));
}