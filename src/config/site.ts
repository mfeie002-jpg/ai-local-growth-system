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
  email: 'info@itsfeierabend.ch',
  
  // URLs
  siteUrl: 'https://itsfeierabend.ch',
  bookingUrlDE: '',
  bookingUrlEN: '',
  slackWebhookUrl: '',
} as const;
