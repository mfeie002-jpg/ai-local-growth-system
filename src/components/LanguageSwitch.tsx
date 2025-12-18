import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage, getAlternateLanguagePath } from '@/i18n/LanguageContext';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (newLang: 'de' | 'en') => {
    if (newLang === language) return;
    
    setLanguage(newLang);
    const newPath = getAlternateLanguagePath(location.pathname, language);
    navigate(newPath);
  };

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => handleLanguageChange('de')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'de'
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Deutsch"
      >
        DE
      </button>
      <span className="text-muted-foreground/50">|</span>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
