// Site configuration flags
export const siteConfig = {
  // Trust/Proof section toggles
  trustAwardsEnabled: false,
  trustBrandsEnabled: false,
  proofNumbersEnabled: false,      // numbers like "+40% leads" must stay off
  voiceSpeedClaimsEnabled: false,  // "<1 sec" / "800 ms" claims MUST be off by default
  
  // Feature toggles
  audioDemoEnabled: true,
  showPhoneWhatsapp: false,
  
  // Contact
  email: 'hello@itsfeierabend.ch',
  
  // URLs
  siteUrl: 'https://itsfeierabend.ch',
  bookingUrlDE: '',
  bookingUrlEN: '',
  slackWebhookUrl: '',
  
  // Voice Agent (all disabled by default until setup complete)
  voiceEnabled: false,               // Master switch - keep off until setup is complete
  voiceCallbackEnabled: false,       // Outbound callback feature
  voiceStoreTranscripts: false,      // Store transcripts (requires consent)
  voiceStoreRecordings: false,       // Store recordings (requires consent)
  voiceDataStorageSetting: 'everything_except_pii' as const,
} as const;

// Type for the config
export type SiteConfig = typeof siteConfig;
