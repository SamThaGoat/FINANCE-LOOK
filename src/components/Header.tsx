import React from 'react';
import { Language, MonthData } from '../types';
import { formatMonthName, getTranslation } from '../utils/translations';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Languages,
  LogOut,
  Cloud,
  CloudCheck,
  Loader2,
} from 'lucide-react';

interface HeaderProps {
  currentMonth: MonthData;
  language: Language;
  onMonthChange: (monthId: string) => void;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  language,
  onMonthChange,
  onLanguageChange,
}) => {
  const { user, loading, isSyncing, signIn, signOut } = useAuth();

  // Extract year and month from ID
  const [yearStr, monthStr] = currentMonth.id.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const handlePrevMonth = () => {
    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const newId = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    onMonthChange(newId);
  };

  const handleNextMonth = () => {
    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const newId = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    onMonthChange(newId);
  };

  const localizedMonthName = formatMonthName(currentMonth.id, language);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-xs"></div>
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-slate-800">
                  FINANCIAL <span className="text-blue-600">LOOK</span>
                </span>
              </div>
            </div>

            {/* Cloud Sync Status Badge */}
            {user ? (
              <div 
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700"
                title={user.email ? `${getTranslation('signedInAs', language)}: ${user.email}` : undefined}
                id="cloud-sync-status"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                    <span>{getTranslation('syncing', language)}</span>
                  </>
                ) : (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{getTranslation('savedToCloud', language)}</span>
                  </>
                )}
              </div>
            ) : (
              <div 
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-500"
                id="local-sync-status"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>{getTranslation('localMode', language)}</span>
              </div>
            )}
          </div>

          {/* Right Controls: Month Navigation, Language, and Google Auth */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
            
            {/* Month Navigator Controls */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200/80">
              <button
                id="btn-prev-month"
                onClick={handlePrevMonth}
                title={language === 'sk' ? 'Predchádzajúci mesiac' : 'Previous Month'}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-slate-800 bg-white rounded-md shadow-xs border border-slate-200/50 min-w-32 justify-center">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{localizedMonthName}</span>
              </div>

              <button
                id="btn-next-month"
                onClick={handleNextMonth}
                title={language === 'sk' ? 'Nasledujúci mesiac' : 'Next Month'}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Language Switcher Button (English / Slovak) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs font-bold" id="language-switcher">
              <div className="flex items-center gap-1 pl-1.5 pr-2 text-slate-400">
                <Languages className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                id="btn-lang-sk"
                type="button"
                onClick={() => onLanguageChange('sk')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'sk'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SK
              </button>
            </div>

            {/* Google Authentication Section */}
            <div className="flex items-center" id="google-auth-container">
              {loading ? (
                <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 pr-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Google User'} 
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'G').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="max-w-[130px] sm:max-w-[170px] truncate text-left">
                    <span className="text-xs font-semibold text-slate-800 block truncate leading-tight">
                      {user.displayName || user.email}
                    </span>
                    {user.displayName && user.email && (
                      <span className="text-[10px] text-slate-500 block truncate leading-none">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <button
                    id="btn-sign-out"
                    onClick={() => signOut()}
                    title={getTranslation('signOut', language)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="btn-google-sign-in"
                  onClick={() => signIn()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  {/* Google 'G' standard SVG logo */}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{getTranslation('signInWithGoogle', language)}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
