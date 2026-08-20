import React, { useState } from 'react';
import { IncomeCategory, IncomeItem, Language } from '../types';
import { INCOME_CATEGORIES, formatCurrency, getCategoryColor, EURO_CURRENCY } from '../utils/helpers';
import { getTranslation, translateIncomeCategory } from '../utils/translations';
import { Plus, Trash2, Edit3, X } from 'lucide-react';

interface IncomeSectionProps {
  incomes: IncomeItem[];
  language: Language;
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  onUpdateIncome: (id: string, updated: Partial<IncomeItem>) => void;
  onDeleteIncome: (id: string) => void;
}

export const IncomeSection: React.FC<IncomeSectionProps> = ({
  incomes,
  language,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('Salary / Wage');
  const [notes, setNotes] = useState('');

  // Editing state
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<IncomeCategory>('Salary / Wage');
  const [editNotes, setEditNotes] = useState('');

  const totalIncome = incomes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const resetAddForm = () => {
    setName('');
    setAmount('');
    setCategory('Salary / Wage');
    setNotes('');
    setIsAdding(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddIncome({
      name: name.trim(),
      amount: parsedAmount,
      category,
      notes: notes.trim() || undefined,
    });
    resetAddForm();
  };

  const startEditing = (item: IncomeItem) => {
    setIsAdding(false);
    setEditingId(item.id);
    setEditName(item.name);
    setEditAmount(String(item.amount));
    setEditCategory(item.category);
    setEditNotes(item.notes || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const parsedAmount = parseFloat(editAmount);
    if (!editName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onUpdateIncome(editingId, {
      name: editName.trim(),
      amount: parsedAmount,
      category: editCategory,
      notes: editNotes.trim() || undefined,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-xs h-full" id="income-section">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-sm">{getTranslation('monthlyIncomes', language)}</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
            {getTranslation('inflow', language)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(totalIncome, EURO_CURRENCY)}
          </span>

          {!isAdding && !editingId && (
            <button
              id="btn-add-income"
              onClick={() => {
                setEditingId(null);
                setIsAdding(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation('addIncome', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Income Form Card */}
      {isAdding && (
        <form 
          onSubmit={handleAddSubmit}
          className="m-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in"
          id="form-add-income"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{getTranslation('newIncomeStream', language)}</span>
            <button 
              type="button" 
              onClick={resetAddForm}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('incomeSource', language)} *</label>
              <input
                id="input-income-name"
                type="text"
                required
                placeholder={language === 'sk' ? 'napr. Hlavná výplata' : 'e.g., Primary Salary'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('category', language)}</label>
              <select
                id="select-income-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {translateIncomeCategory(cat, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('monthlyAmount', language)} (€) *</label>
              <input
                id="input-income-amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('notesDesc', language)}</label>
            <input
              id="input-income-notes"
              type="text"
              placeholder={language === 'sk' ? 'napr. Prevod na bankový účet' : 'e.g., Post-tax bank deposit'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={resetAddForm}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {getTranslation('cancel', language)}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              {getTranslation('saveIncome', language)}
            </button>
          </div>
        </form>
      )}

      {/* Edit Income Form Card */}
      {editingId && (
        <form 
          onSubmit={handleEditSubmit}
          className="m-5 p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 animate-in fade-in"
          id="form-edit-income"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="text-blue-700 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              {getTranslation('editIncome', language)}
            </span>
            <button 
              type="button" 
              onClick={() => setEditingId(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('incomeSource', language)} *</label>
              <input
                type="text"
                required
                placeholder={language === 'sk' ? 'napr. Hlavná výplata' : 'e.g., Primary Salary'}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('category', language)}</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as IncomeCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {translateIncomeCategory(cat, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('monthlyAmount', language)} (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{getTranslation('notesDesc', language)}</label>
            <input
              type="text"
              placeholder={language === 'sk' ? 'napr. Prevod na bankový účet' : 'e.g., Post-tax bank deposit'}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {getTranslation('cancel', language)}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              {getTranslation('saveChanges', language)}
            </button>
          </div>
        </form>
      )}

      {/* Table Listing */}
      <div className="flex-1 overflow-auto px-6 py-1">
        <table className="w-full text-xs">
          <thead className="text-slate-400 text-left border-b border-slate-100">
            <tr>
              <th className="py-2.5 font-semibold">{getTranslation('incomeStream', language)}</th>
              <th className="py-2.5 font-semibold">{getTranslation('category', language)}</th>
              <th className="py-2.5 font-semibold text-right">{getTranslation('amount', language)}</th>
              <th className="py-2.5 font-semibold text-right w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {incomes.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  <p className="mb-3">{getTranslation('noIncomes', language)}</p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{getTranslation('addIncome', language)}</span>
                  </button>
                </td>
              </tr>
            ) : (
              incomes.map((item) => {
                const isCurrentEditing = editingId === item.id;

                return (
                  <tr 
                    key={item.id} 
                    className={`group transition-colors ${
                      isCurrentEditing ? 'bg-blue-50/70 font-medium' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full shrink-0" 
                          style={{ backgroundColor: getCategoryColor(item.category) }} 
                        />
                        <div>
                          <span className="font-semibold text-slate-800 block">{item.name}</span>
                          {item.notes && <span className="text-[10px] text-slate-500 italic block">{item.notes}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {translateIncomeCategory(item.category, language)}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">
                      +{formatCurrency(item.amount, EURO_CURRENCY)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(item)}
                          title={getTranslation('edit', language)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (editingId === item.id) setEditingId(null);
                            onDeleteIncome(item.id);
                          }}
                          title={getTranslation('delete', language)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Footer */}
      <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400 text-[11px]">
          {incomes.length} {incomes.length === 1 ? getTranslation('activeIncomeStreamSingular', language) : getTranslation('activeIncomeStreamPlural', language)}
        </span>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
            }}
            className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {getTranslation('addIncome', language)}
          </button>
        )}
      </div>

    </div>
  );
};
