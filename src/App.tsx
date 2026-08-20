import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ExpenseItem, IncomeItem, Language, MonthData } from './types';
import { 
  calculateFinancialSummary, 
  loadAllMonths, 
  saveAllMonths, 
  loadSavedLanguage, 
  saveSelectedLanguage 
} from './utils/helpers';
import { getTranslation } from './utils/translations';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { VariableExpensesSection } from './components/VariableExpensesSection';
import { RegularExpensesSection } from './components/RegularExpensesSection';
import { IncomeSection } from './components/IncomeSection';
import { 
  subscribeToUserMonths, 
  saveMonthToFirestore, 
  syncLocalMonthsToFirestore 
} from './lib/firestoreService';
import { Cloud, Sparkles, X } from 'lucide-react';

function FinanceApp() {
  const { user, signIn, setIsSyncing } = useAuth();

  // Language state: 'en' | 'sk'
  const [language, setLanguage] = useState<Language>(() => loadSavedLanguage());

  // Load saved data or sample defaults
  const [months, setMonths] = useState<Record<string, MonthData>>(() => loadAllMonths());
  
  // Banner visibility state (can be dismissed by user)
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Current active month key (e.g., '2026-08')
  const [activeMonthId, setActiveMonthId] = useState<string>(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const keys = Object.keys(months);
    return months[currentKey] ? currentKey : (keys[0] || currentKey);
  });

  // Sync to local storage on changes as a persistent offline backup
  useEffect(() => {
    saveAllMonths(months);
  }, [months]);

  useEffect(() => {
    saveSelectedLanguage(language);
  }, [language]);

  // Firestore Real-time synchronization when user logs in with Google
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    setIsSyncing(true);

    // Initial sync of existing local data to cloud if user has no cloud documents yet
    syncLocalMonthsToFirestore(user.uid, months).catch((err) => {
      console.warn('Initial cloud sync notice:', err);
    });

    // Real-time listener for cloud changes
    const unsubscribe = subscribeToUserMonths(
      user.uid,
      (cloudMonths) => {
        if (!isMounted) return;
        setIsSyncing(false);
        if (Object.keys(cloudMonths).length > 0) {
          setMonths(cloudMonths);
        }
      },
      (err) => {
        console.error('Firestore listener error:', err);
        if (isMounted) setIsSyncing(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user, setIsSyncing]);

  // Ensure current active month data exists
  const currentMonthData: MonthData = useMemo(() => {
    if (months[activeMonthId]) {
      return months[activeMonthId];
    }
    // If navigating to a month that doesn't exist yet, auto-create it
    const [yStr, mStr] = activeMonthId.split('-');
    const year = parseInt(yStr, 10) || new Date().getFullYear();
    const month = parseInt(mStr, 10) || (new Date().getMonth() + 1);
    const dateObj = new Date(year, month - 1, 1);
    const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Copy recurring regular expenses from existing month if available
    const existingMonths: MonthData[] = Object.values(months);
    const sampleRegulars: ExpenseItem[] = existingMonths.length > 0 
      ? existingMonths[0].expenses.filter((e) => e.type === 'regular').map((e) => ({
          ...e,
          id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        }))
      : [];

    const newMonth: MonthData = {
      id: activeMonthId,
      monthName,
      incomes: existingMonths.length > 0 && existingMonths[0].incomes.length > 0
        ? existingMonths[0].incomes.map((i) => ({
            ...i,
            id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          }))
        : [],
      expenses: sampleRegulars,
    };

    return newMonth;
  }, [months, activeMonthId]);

  // Financial summary computation
  const summary = useMemo(() => {
    return calculateFinancialSummary(currentMonthData.incomes, currentMonthData.expenses);
  }, [currentMonthData.incomes, currentMonthData.expenses]);

  // Master handler for saving month updates (State + LocalStorage + Cloud Firestore)
  const handleUpdateMonth = useCallback(async (updated: MonthData) => {
    setMonths((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));

    if (user) {
      try {
        setIsSyncing(true);
        await saveMonthToFirestore(user.uid, updated);
      } catch (error) {
        console.error('Failed to sync month to Firestore:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [user, setIsSyncing]);

  const handleMonthChange = (newMonthId: string) => {
    setActiveMonthId(newMonthId);
  };

  // Income actions
  const handleAddIncome = (income: Omit<IncomeItem, 'id'>) => {
    const newItem: IncomeItem = {
      ...income,
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    handleUpdateMonth({
      ...currentMonthData,
      incomes: [...currentMonthData.incomes, newItem],
    });
  };

  const handleUpdateIncome = (id: string, updated: Partial<IncomeItem>) => {
    handleUpdateMonth({
      ...currentMonthData,
      incomes: currentMonthData.incomes.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    });
  };

  const handleDeleteIncome = (id: string) => {
    handleUpdateMonth({
      ...currentMonthData,
      incomes: currentMonthData.incomes.filter((item) => item.id !== id),
    });
  };

  // Expense actions
  const handleAddExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    handleUpdateMonth({
      ...currentMonthData,
      expenses: [...currentMonthData.expenses, newItem],
    });
  };

  const handleUpdateExpense = (id: string, updated: Partial<ExpenseItem>) => {
    handleUpdateMonth({
      ...currentMonthData,
      expenses: currentMonthData.expenses.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    });
  };

  const handleDeleteExpense = (id: string) => {
    handleUpdateMonth({
      ...currentMonthData,
      expenses: currentMonthData.expenses.filter((item) => item.id !== id),
    });
  };

  const regularCount = currentMonthData.expenses.filter((e) => e.type === 'regular').length;
  const irregularCount = currentMonthData.expenses.filter((e) => e.type === 'irregular').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white" id="finance-app-root">
      
      {/* Top Application Navigation with Language Switcher & Google Sign-In */}
      <Header
        currentMonth={currentMonthData}
        language={language}
        onMonthChange={handleMonthChange}
        onLanguageChange={setLanguage}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Google Sign-in Prompt Banner (When Not Logged In) */}
        {!user && !bannerDismissed && (
          <div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in"
            id="google-save-banner"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-5 h-5 text-blue-100" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{getTranslation('loginPromptTitle', language)}</span>
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {getTranslation('savedToCloud', language)}
                  </span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  {getTranslation('loginToSaveProgress', language)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => signIn()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                id="banner-btn-google-sign-in"
              >
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
              
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer"
                title={getTranslation('cancel', language)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Summary KPIs & Monthly Outcome Status */}
        <SummaryCards
          summary={summary}
          incomesCount={currentMonthData.incomes.length}
          regularExpensesCount={regularCount}
          irregularExpensesCount={irregularCount}
          monthId={currentMonthData.id}
          language={language}
        />

        {/* Full-width Row: Variable & Irregular Expenses */}
        <VariableExpensesSection
          expenses={currentMonthData.expenses}
          totalIncome={summary.totalIncome}
          language={language}
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
        />

        {/* Bottom Row: Regular Expenses and Monthly Incomes shared side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="bottom-shared-row">
          <RegularExpensesSection
            expenses={currentMonthData.expenses}
            totalIncome={summary.totalIncome}
            language={language}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />

          <IncomeSection
            incomes={currentMonthData.incomes}
            language={language}
            onAddIncome={handleAddIncome}
            onUpdateIncome={handleUpdateIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-xs flex items-center justify-center">
              <div className="w-1.5 h-1.5 border border-white rounded-xxs"></div>
            </div>
            <span className="font-bold text-slate-800">FINANCIAL <span className="text-blue-600">LOOK</span></span>
            <span className="text-slate-400">— {getTranslation('appSubtitle', language)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Cloud className="w-3.5 h-3.5 text-blue-500" />
            <p>{getTranslation('footerNote', language)}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceApp />
    </AuthProvider>
  );
}
