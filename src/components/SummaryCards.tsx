import React from 'react';
import { FinancialHealthSummary, Language } from '../types';
import { formatCurrency, EURO_CURRENCY } from '../utils/helpers';
import { getTranslation, formatMonthName } from '../utils/translations';
import { 
  Wallet,
  Receipt,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SummaryCardsProps {
  summary: FinancialHealthSummary;
  incomesCount: number;
  regularExpensesCount: number;
  irregularExpensesCount: number;
  monthId: string;
  language: Language;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  incomesCount,
  regularExpensesCount,
  irregularExpensesCount,
  monthId,
  language,
}) => {
  const {
    totalIncome,
    totalRegularExpenses,
    totalIrregularExpenses,
    totalExpenses,
    netBalance,
    isPositive,
    isBreakEven,
    savingsRate,
  } = summary;

  const monthName = formatMonthName(monthId, language);

  const getStatusText = () => {
    if (isBreakEven) {
      return getTranslation('statusBrokeEven', language);
    }
    if (isPositive) {
      return getTranslation('statusSaved', language)
        .replace('{amount}', formatCurrency(netBalance, EURO_CURRENCY))
        .replace('{rate}', savingsRate.toFixed(1));
    }
    return getTranslation('statusLost', language)
      .replace('{amount}', formatCurrency(Math.abs(netBalance), EURO_CURRENCY));
  };

  return (
    <div className="space-y-6" id="summary-section">
      
      {/* Top Section Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {getTranslation('summaryTitle', language).replace('{month}', monthName)}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {getTranslation('summaryDesc', language)}
        </p>
      </div>

      {/* 3 Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="primary-kpis">
        
        {/* Total Income */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between" id="card-total-income">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {getTranslation('totalIncome', language)}
              </p>
              <Wallet className="w-4 h-4 text-emerald-600 opacity-80" />
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalIncome, EURO_CURRENCY)}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
              {incomesCount} {incomesCount === 1 ? getTranslation('incomeStreamSingular', language) : getTranslation('incomeStreamPlural', language)}
            </div>
            <span className="text-[11px] text-slate-400">{getTranslation('totalInflow', language)}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between" id="card-total-expenses">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {getTranslation('totalExpenses', language)}
              </p>
              <Receipt className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalExpenses, EURO_CURRENCY)}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
              {irregularExpensesCount} {getTranslation('variableShort', language)} + {regularExpensesCount} {getTranslation('regularShort', language)}
            </div>
            <span className="text-[11px] text-slate-400">{getTranslation('totalOutflow', language)}</span>
          </div>
        </div>

        {/* Net Savings / Lost Outcome */}
        <div 
          id="card-net-savings"
          className={`p-6 rounded-xl shadow-md flex flex-col justify-between text-white transition-all ${
            isBreakEven
              ? 'bg-slate-800 border border-slate-700'
              : isPositive
              ? 'bg-blue-900 border border-blue-800'
              : 'bg-rose-950 border border-rose-900'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                isPositive ? 'text-blue-300' : 'text-rose-300'
              }`}>
                {isBreakEven 
                  ? getTranslation('balancedResult', language) 
                  : isPositive 
                  ? getTranslation('netSaved', language) 
                  : getTranslation('netLost', language)}
              </p>
              {isPositive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <p className="text-3xl font-bold tracking-tight">
              {isBreakEven ? (
                <span>0,00 €</span>
              ) : isPositive ? (
                <span>+{formatCurrency(netBalance, EURO_CURRENCY)}</span>
              ) : (
                <span>-{formatCurrency(Math.abs(netBalance), EURO_CURRENCY)}</span>
              )}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${
              isPositive ? 'text-blue-200 bg-blue-800/80' : 'text-rose-200 bg-rose-900/80'
            }`}>
              {getTranslation('savingsRate', language)}: {savingsRate.toFixed(1)}%
            </div>
            <span className={`text-[11px] font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-300'}`}>
              {isBreakEven ? getTranslation('even', language) : isPositive ? getTranslation('savedMoney', language) : getTranslation('lostMoney', language)}
            </span>
          </div>
        </div>

      </div>

      {/* Monthly Result Status Banner */}
      <div 
        id="monthly-health-banner"
        className={`rounded-xl flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-5 relative overflow-hidden text-white shadow-xs gap-4 ${
          isBreakEven
            ? 'bg-slate-700'
            : isPositive
            ? 'bg-emerald-600'
            : 'bg-rose-600'
        }`}
      >
        <div className={`absolute right-0 top-0 h-full w-1/3 skew-x-12 translate-x-12 opacity-40 pointer-events-none ${
          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />

        <div className="relative z-10">
          <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider">
            {getTranslation('outcomeStatus', language)}
          </h4>
          <p className="text-white text-lg sm:text-xl font-bold mt-0.5">
            {getStatusText()}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-white/90">
            <span>{getTranslation('notRegularLabel', language)}: <strong>{formatCurrency(totalIrregularExpenses, EURO_CURRENCY)}</strong></span>
            <span>•</span>
            <span>{getTranslation('regularLabel', language)}: <strong>{formatCurrency(totalRegularExpenses, EURO_CURRENCY)}</strong></span>
            <span>•</span>
            <span>{getTranslation('totalSpending', language)}: <strong>{formatCurrency(totalExpenses, EURO_CURRENCY)}</strong></span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-white/80 block">{getTranslation('savingsRate', language)}</span>
            <span className="text-2xl font-black text-white">
              {isPositive ? `+${savingsRate.toFixed(1)}%` : `-${Math.abs(savingsRate).toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
