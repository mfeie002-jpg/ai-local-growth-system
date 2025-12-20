// Gemeinsame Admin-Konstanten für Status-Labels, Farben und Mappings

export const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  scored: 'bg-purple-100 text-purple-800',
  contacted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

export const statusLabels: Record<string, string> = {
  new: 'Neu',
  reviewing: 'In Bearbeitung',
  scored: 'Bewertet',
  contacted: 'Kontaktiert',
  closed: 'Abgeschlossen',
};

export const bucketColors: Record<string, string> = {
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
};

export const bucketLabels: Record<string, string> = {
  red: 'Rot – Fundament kritisch',
  yellow: 'Gelb – Solide Basis, Hebel offen',
  green: 'Grün – Starkes Fundament',
};

export const callStatusColors: Record<string, string> = {
  started: 'bg-blue-100 text-blue-800',
  ended: 'bg-gray-100 text-gray-800',
  error: 'bg-red-100 text-red-800',
};

export const scoreColors = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const scoreTextColors = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-destructive';
};

// Utility-Funktionen
export const formatDuration = (ms: number | null): string => {
  if (!ms) return '-';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatCurrency = (amount: number): string => {
  return `CHF ${amount.toLocaleString('de-CH')}`;
};
