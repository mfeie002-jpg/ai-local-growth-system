export type Language = 'de' | 'en';

export const translations = {
  de: {
    footer: {
      location: 'Schweiz',
      links: {
        imprint: 'Impressum',
        privacy: 'Datenschutz',
      },
    },
  },
  en: {
    footer: {
      location: 'Switzerland',
      links: {
        imprint: 'Imprint',
        privacy: 'Privacy',
      },
    },
  },
} as const;

export type Translations = typeof translations.de;
