// Firebase web configuration. Firebase web API keys are public identifiers
// (they ship to every browser), so they are safe to commit. What protects your
// data is firestore.rules plus Firebase Authentication, not secrecy of this key.
//
// NEVER put private keys here (service-account JSON, ElevenLabs, OpenAI,
// GitHub tokens, Gmail OAuth secrets). Those belong in the command center's
// on-device Settings or in a server-side function. See docs/technical/SECURITY.md.

export const FIREBASE = {
  projectId: '',
  apiKey: '',
  authDomain: '',
};
