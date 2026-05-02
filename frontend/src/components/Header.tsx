import type { Language } from "../types";
import { t, ALL_LANGUAGES, setLanguage } from "../lib/i18n";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const tr = t(language);

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <header className="sticky top-0 z-30 safe-top border-b border-black/5 bg-white/95 backdrop-blur-xl">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-warm-50 flex items-center justify-center text-warm-500 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4H5a1 1 0 00-1 1v2m13-3h2a1 1 0 011 1v2M7 20H5a1 1 0 01-1-1v-2m13 3h2a1 1 0 001-1v-2M9 8h2v2H9V8zm4 0h2v2h-2V8zM9 14h2v2H9v-2zm4 0h2v2h-2v-2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-warm-500 font-extrabold text-lg leading-tight">
              {tr.brand}
            </h1>
          </div>
        </div>

        <label className="relative flex shrink-0 items-center gap-1 rounded-full bg-cream-100 px-3 py-2">
          <span className="sr-only">{tr.languageName}</span>
          <svg className="w-4 h-4 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h7M9 3v2m6 0h5m-4-2v2M7 9c.8 1.8 2.2 3.3 4 4.4m0-4.4c-.7 1.7-2.2 3.3-4.3 4.8M14 19l3-8 3 8m-4.1-2h2.2" />
          </svg>
          <select
            value={language}
            onChange={(event) => handleLangChange(event.target.value as Language)}
            className="appearance-none bg-transparent pr-4 text-xs font-extrabold text-ink outline-none cursor-pointer"
          >
            {ALL_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2 h-3 w-3 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </label>
      </div>
    </header>
  );
}
