import { ExpenseCategory, IncomeCategory, Language } from '../types';

export const TRANSLATIONS = {
  en: {
    appTitle: 'FINANCIAL LOOK',
    appSubtitle: 'Monthly Cash Flow & Expense Tracker',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    language: 'Language',
    
    // Summary
    summaryTitle: '{month} Financial Summary',
    summaryDesc: 'Detailed overview of your monthly earnings, recurring regular expenses, variable expenses, and net result.',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netSaved: 'Net Saved (Profit)',
    netLost: 'Net Lost (Deficit)',
    balancedResult: 'Balanced Result',
    totalInflow: 'Total Inflow',
    totalOutflow: 'Total Outflow',
    savedMoney: 'Saved Money',
    lostMoney: 'Lost Money',
    even: 'Even',
    incomeStreamSingular: 'income stream',
    incomeStreamPlural: 'income streams',
    regularShort: 'regular',
    variableShort: 'variable',
    
    // Status banner
    outcomeStatus: 'Monthly Outcome Status',
    statusBrokeEven: 'You broke even this month with zero net surplus or deficit.',
    statusSaved: 'You saved {amount} ({rate}% of your income) this month.',
    statusLost: 'You lost {amount} during this month.',
    regularLabel: 'Regular',
    notRegularLabel: 'Not Regular',
    totalSpending: 'Total Spending',
    savingsRate: 'Savings Rate',
    
    // Expense Section
    sideBySide: 'Side-by-Side',
    notRegularTab: 'Not Regular',
    searchPlaceholder: 'Search expenses & categories...',
    addExpense: 'Add Expense',
    addNewExpense: 'Add New Expense',
    regularRecurring: 'Regular (Recurring)',
    notRegularOneOff: 'Not Regular (One-Off)',
    expenseName: 'Expense Name',
    amount: 'Amount',
    category: 'Category',
    recurrenceFreq: 'Recurrence Frequency',
    date: 'Date',
    notesDesc: 'Notes / Description (Optional)',
    cancel: 'Cancel',
    saveRegularExpense: 'Save Regular Expense',
    saveIrregularExpense: 'Save Not Regular Expense',
    editRegularExpense: 'Edit Regular Expense',
    editIrregularExpense: 'Edit Not Regular Expense',
    saveChanges: 'Save Changes',
    item: 'Item',
    categoryOrName: 'Category / Name',
    categoryOrItem: 'Category / Item',
    dateOrNotes: 'Date / Notes',
    noRegularExpenses: 'No regular recurring expenses recorded.',
    addRegularPrompt: '+ Add Regular Groceries, Car Lease, or Healthcare',
    noIrregularExpenses: 'No irregular or one-off expenses recorded.',
    addIrregularPrompt: '+ Add Clothing, Car Maintenance, or Extraordinary Item',
    ofTotalIncome: 'of total income',
    addRegularItem: 'Add Regular Item',
    addVariableItem: 'Add Variable Item',
    variableAndIrregular: 'Variable & Irregular',
    oneTime: 'One-Time',
    recurring: 'Recurring',
    shiftToNotRegular: 'Shift to Not Regular',
    shiftToRegular: 'Shift to Regular',
    edit: 'Edit',
    delete: 'Delete',
    
    // Expense Categories
    catGroceries: 'Groceries',
    catDrugstore: 'Drugstore',
    catHealthcare: 'Healthcare',
    catClothingFootwear: 'Clothing / Footwear',
    catStationery: 'Stationery',
    catCar: 'Car',
    catExtraordinary: 'Extraordinary',

    // Frequencies
    freqMonthly: 'Monthly',
    freqWeekly: 'Weekly',
    freqBiWeekly: 'Bi-Weekly',
    freqAnnual12: 'Annual / 12',

    // Income Section
    monthlyIncomes: 'Monthly Incomes',
    inflow: 'Inflow',
    addIncome: 'Add Income',
    newIncomeStream: 'New Income Stream',
    editIncome: 'Edit Income Stream',
    incomeSource: 'Income Source / Name',
    monthlyAmount: 'Monthly Amount',
    dateReceived: 'Date Received',
    saveIncome: 'Save Income',
    incomeStream: 'Income Stream',
    noIncomes: 'No income sources added yet.',
    addIncomePrompt: '+ Add your salary or income stream',
    activeIncomeStreamSingular: 'active income stream',
    activeIncomeStreamPlural: 'active income streams',
    addStream: 'Add Stream',

    // Income Categories
    incSalaryWage: 'Salary / Wage',
    incFreelanceContract: 'Freelance & Contract',
    incSideBusiness: 'Side Business',
    incInvestmentsDividends: 'Investments & Dividends',
    incRentalIncome: 'Rental Income',
    incGiftsReimbursements: 'Gifts & Reimbursements',
    incOther: 'Other',
    
    // Footer & Auth
    footerNote: 'All data securely synced to your account and local backup.',
    signInWithGoogle: 'Sign in with Google',
    signOut: 'Sign out',
    savedToCloud: 'Cloud Synced',
    syncing: 'Syncing...',
    localMode: 'Local Session',
    signedInAs: 'Signed in as',
    loginToSaveProgress: 'Sign in with Google to automatically save your progress and sync across devices.',
    loginPromptTitle: 'Save your monthly progress',
  },
  sk: {
    appTitle: 'FINANCIAL LOOK',
    appSubtitle: 'Mesačný prehľad cashflow a výdavkov',
    prevMonth: 'Predchádzajúci mesiac',
    nextMonth: 'Nasledujúci mesiac',
    language: 'Jazyk',
    
    // Summary
    summaryTitle: 'Finančný prehľad za {month}',
    summaryDesc: 'Podrobný prehľad vašich mesačných príjmov, pravidelných fixných výdavkov, variabilných výdavkov a výsledného zostatku.',
    totalIncome: 'Celkový príjem',
    totalExpenses: 'Celkové výdavky',
    netSaved: 'Ušetrené (Prebytok)',
    netLost: 'V strate (Deficit)',
    balancedResult: 'Vyrovnaný rozpočet',
    totalInflow: 'Celkový prílev',
    totalOutflow: 'Celkový odtok',
    savedMoney: 'Ušetrené peniaze',
    lostMoney: 'Peniaze v strate',
    even: 'Vyrovnané',
    incomeStreamSingular: 'zdroj príjmu',
    incomeStreamPlural: 'zdroje príjmov',
    regularShort: 'pravidelné',
    variableShort: 'nepravidelné',
    
    // Status banner
    outcomeStatus: 'Stav mesačného výsledku',
    statusBrokeEven: 'Tento mesiac máte vyrovnaný rozpočet bez prebytku či straty.',
    statusSaved: 'Tento mesiac ste ušetrili {amount} ({rate}% z vášho príjmu).',
    statusLost: 'Tento mesiac ste v strate {amount}.',
    regularLabel: 'Pravidelné',
    notRegularLabel: 'Nepravidelné',
    totalSpending: 'Celkové výdavky',
    savingsRate: 'Miera úspor',
    
    // Expense Section
    sideBySide: 'Vedľa seba',
    notRegularTab: 'Nepravidelné',
    searchPlaceholder: 'Hľadať výdavky a kategórie...',
    addExpense: 'Pridať výdavok',
    addNewExpense: 'Pridať nový výdavok',
    regularRecurring: 'Pravidelný (Opakovaný)',
    notRegularOneOff: 'Nepravidelný (Jednorazový)',
    expenseName: 'Názov výdavku',
    amount: 'Suma',
    category: 'Kategória',
    recurrenceFreq: 'Periodicita opakovania',
    date: 'Dátum',
    notesDesc: 'Poznámky / Popis (Voliteľné)',
    cancel: 'Zrušiť',
    saveRegularExpense: 'Uložiť pravidelný výdavok',
    saveIrregularExpense: 'Uložiť nepravidelný výdavok',
    editRegularExpense: 'Upraviť pravidelný výdavok',
    editIrregularExpense: 'Upraviť nepravidelný výdavok',
    saveChanges: 'Uložiť zmeny',
    item: 'Položka',
    categoryOrName: 'Kategória / Názov',
    categoryOrItem: 'Kategória / Položka',
    dateOrNotes: 'Dátum / Poznámka',
    noRegularExpenses: 'Žiadne pravidelné výdavky.',
    addRegularPrompt: '+ Pridať pravidelné potraviny, lízing auta či zdravotnú starostlivosť',
    noIrregularExpenses: 'Žiadne nepravidelné či jednorazové výdavky.',
    addIrregularPrompt: '+ Pridať oblečenie, servis auta či mimoriadny výdavok',
    ofTotalIncome: 'z celkového príjmu',
    addRegularItem: 'Pridať pravidelnú položku',
    addVariableItem: 'Pridať nepravidelnú položku',
    variableAndIrregular: 'Variabilné a mimoriadne',
    oneTime: 'Jednorazové',
    recurring: 'Opakované',
    shiftToNotRegular: 'Presunúť do nepravidelných',
    shiftToRegular: 'Presunúť do pravidelných',
    edit: 'Upraviť',
    delete: 'Zmazať',
    
    // Expense Categories
    catGroceries: 'Potraviny',
    catDrugstore: 'Drogéria',
    catHealthcare: 'Zdravotníctvo',
    catClothingFootwear: 'Oblečenie a obuv',
    catStationery: 'Papiernictvo',
    catCar: 'Auto',
    catExtraordinary: 'Mimoriadne',

    // Frequencies
    freqMonthly: 'Mesačne',
    freqWeekly: 'Týždenne',
    freqBiWeekly: 'Každé 2 týždne',
    freqAnnual12: 'Ročne / 12',

    // Income Section
    monthlyIncomes: 'Mesačné príjmy',
    inflow: 'Prílev',
    addIncome: 'Pridať príjem',
    newIncomeStream: 'Nový zdroj príjmu',
    editIncome: 'Upraviť zdroj príjmu',
    incomeSource: 'Zdroj príjmu / Názov',
    monthlyAmount: 'Mesačná suma',
    dateReceived: 'Dátum prijatia',
    saveIncome: 'Uložiť príjem',
    incomeStream: 'Zdroj príjmu',
    noIncomes: 'Zatiaľ neboli pridané žiadne príjmy.',
    addIncomePrompt: '+ Pridať výplatu alebo príjem',
    activeIncomeStreamSingular: 'aktívny zdroj príjmu',
    activeIncomeStreamPlural: 'aktívne zdroje príjmov',
    addStream: 'Pridať zdroj',

    // Income Categories
    incSalaryWage: 'Výplata / Mzda',
    incFreelanceContract: 'Živnosť a zákazky',
    incSideBusiness: 'Vedľajšie podnikanie',
    incInvestmentsDividends: 'Investície a dividendy',
    incRentalIncome: 'Príjem z prenájmu',
    incGiftsReimbursements: 'Dary a preplatky',
    incOther: 'Iné',
    
    // Footer & Auth
    footerNote: 'Všetky údaje sú bezpečne synchronizované s vaším účtom a lokálnou zálohou.',
    signInWithGoogle: 'Prihlásiť sa cez Google',
    signOut: 'Odhlásiť sa',
    savedToCloud: 'Synchronizované v cloude',
    syncing: 'Synchronizujem...',
    localMode: 'Lokálna relácia',
    signedInAs: 'Prihlásený ako',
    loginToSaveProgress: 'Prihláste sa cez Google a automaticky ukladajte svoje financie a postup.',
    loginPromptTitle: 'Uložte si svoj mesačný postup',
  },
};

export function getTranslation(key: keyof typeof TRANSLATIONS.en, lang: Language): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || (key as string);
}

export function translateExpenseCategory(category: ExpenseCategory, lang: Language): string {
  const map: Record<ExpenseCategory, keyof typeof TRANSLATIONS.en> = {
    'Groceries': 'catGroceries',
    'Drugstore': 'catDrugstore',
    'Healthcare': 'catHealthcare',
    'Clothing / Footwear': 'catClothingFootwear',
    'Stationery': 'catStationery',
    'Car': 'catCar',
    'Extraordinary': 'catExtraordinary',
  };
  const key = map[category];
  return key ? getTranslation(key, lang) : category;
}

export function translateIncomeCategory(category: IncomeCategory, lang: Language): string {
  const map: Record<IncomeCategory, keyof typeof TRANSLATIONS.en> = {
    'Salary / Wage': 'incSalaryWage',
    'Freelance & Contract': 'incFreelanceContract',
    'Side Business': 'incSideBusiness',
    'Investments & Dividends': 'incInvestmentsDividends',
    'Rental Income': 'incRentalIncome',
    'Gifts & Reimbursements': 'incGiftsReimbursements',
    'Other': 'incOther',
  };
  const key = map[category];
  return key ? getTranslation(key, lang) : category;
}

export function translateFrequency(freq: string | undefined, lang: Language): string {
  if (!freq) return lang === 'sk' ? 'Mesačne' : 'Monthly';
  if (freq === 'Monthly') return getTranslation('freqMonthly', lang);
  if (freq === 'Weekly') return getTranslation('freqWeekly', lang);
  if (freq === 'Bi-Weekly') return getTranslation('freqBiWeekly', lang);
  if (freq === 'Annual / 12') return getTranslation('freqAnnual12', lang);
  return freq;
}

export function formatMonthName(monthId: string, lang: Language): string {
  const [yStr, mStr] = monthId.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  
  if (isNaN(year) || isNaN(month)) return monthId;

  const date = new Date(year, month - 1, 1);
  const locale = lang === 'sk' ? 'sk-SK' : 'en-US';
  const name = date.toLocaleString(locale, { month: 'long', year: 'numeric' });
  return name.charAt(0).toUpperCase() + name.slice(1);
}
