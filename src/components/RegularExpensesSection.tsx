import React, { useState, useMemo } from 'react';
import { ExpenseCategory, ExpenseItem, Language } from '../types';
import { 
  EXPENSE_CATEGORIES, 
  formatCurrency, 
  getCategoryColor,
  EURO_CURRENCY,
} from '../utils/helpers';
import { 
  getTranslation, 
  translateExpenseCategory, 
} from '../utils/translations';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
} from 'lucide-react';

interface RegularExpensesSectionProps {
  expenses: ExpenseItem[];
  totalIncome: number;
  language: Language;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onUpdateExpense: (id: string, updated: Partial<ExpenseItem>) => void;
  onDeleteExpense: (id: string) => void;
}

export const RegularExpensesSection: React.FC<RegularExpensesSectionProps> = ({
  expenses,
  totalIncome,
  language,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('Groceries');
  const [editAmount, setEditAmount] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const regularExpenses = useMemo(() => expenses.filter((e) => e.type === 'regular'), [expenses]);
  const totalRegular = regularExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const resetAddForm = () => {
    setName('');
    setCategory('Groceries');
    setAmount('');
    setNotes('');
    setIsAdding(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;

    onAddExpense({
      name: name.trim(),
      amount: parsed,
      type: 'regular',
      category,
      notes: notes.trim() || undefined,
    });

    resetAddForm();
  };

  const startEditing = (item: ExpenseItem) => {
    setIsAdding(false);
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditAmount(String(item.amount));
    setEditNotes(item.notes || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const parsed = parseFloat(editAmount);
    if (!editName.trim() || isNaN(parsed) || parsed <= 0) return;

    onUpdateExpense(editingId, {
      name: editName.trim(),
      amount: parsed,
      category: editCategory,
      type: 'regular',
      notes: editNotes.trim() || undefined,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-xs h-full" id="regular-expenses-card">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-sm">{getTranslation('regularRecurring', language)}</h3>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
            {getTranslation('recurring', language)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(totalRegular, EURO_CURRENCY)}
          </span>

          {!isAdding && !editingId && (
            <button
              id="btn-add-regular-expense"
              onClick={() => {
                setEditingId(null);
                setIsAdding(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation('addRegularItem', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Regular Expense Inline Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="m-5 p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3 animate-in fade-in"
          id="form-add-regular"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>{getTranslation('saveRegularExpense', language)}</span>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('expenseName', language)} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'sk' ? 'napr. Potraviny na týždeň' : 'e.g., Weekly Groceries'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('category', language)} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {translateExpenseCategory(cat, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('amount', language)} (€) *
              </label>
              <input
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {getTranslation('notesDesc', language)}
            </label>
            <input
              type="text"
              placeholder={language === 'sk' ? 'napr. Pravidelný mesačný rozpočet na jedlo' : 'e.g., Monthly grocery estimate'}
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
              {getTranslation('saveRegularExpense', language)}
            </button>
          </div>
        </form>
      )}

      {/* Edit Regular Expense Form */}
      {editingId && (
        <form
          onSubmit={handleEditSubmit}
          className="m-5 p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 animate-in fade-in"
          id="form-edit-regular"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="text-blue-700 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              {getTranslation('editRegularExpense', language)}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('expenseName', language)} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'sk' ? 'napr. Potraviny na týždeň' : 'e.g., Weekly Groceries'}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('category', language)} *
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {translateExpenseCategory(cat, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('amount', language)} (€) *
              </label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {getTranslation('notesDesc', language)}
            </label>
            <input
              type="text"
              placeholder={language === 'sk' ? 'napr. Pravidelný mesačný rozpočet na jedlo' : 'e.g., Monthly grocery estimate'}
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

      {/* Regular Table Content */}
      <div className="flex-1 overflow-auto px-6 py-1">
        <table className="w-full text-xs">
          <thead className="text-slate-400 text-left border-b border-slate-100">
            <tr>
              <th className="py-2.5 font-semibold">{getTranslation('categoryOrName', language)}</th>
              <th className="py-2.5 font-semibold text-right">{getTranslation('amount', language)}</th>
              <th className="py-2.5 font-semibold text-right w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {regularExpenses.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400">
                  <p className="mb-3">{getTranslation('noRegularExpenses', language)}</p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{getTranslation('addRegularItem', language)}</span>
                  </button>
                </td>
              </tr>
            ) : (
              regularExpenses.map((item) => {
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
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: getCategoryColor(item.category) }} 
                        />
                        <div>
                          <span className="font-semibold text-slate-800 block">{item.name}</span>
                          <span className="text-[10px] font-medium text-slate-500">
                            {translateExpenseCategory(item.category, language)}
                          </span>
                          {item.notes && <span className="text-[10px] text-slate-400 italic block">{item.notes}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.amount, EURO_CURRENCY)}
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
                            onDeleteExpense(item.id);
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

      {/* Bottom Bar */}
      <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400 text-[11px]">
          {totalIncome > 0 ? `${((totalRegular / totalIncome) * 100).toFixed(1)}% ${getTranslation('ofTotalIncome', language)}` : `${regularExpenses.length} ${getTranslation('regularShort', language)}`}
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
            {getTranslation('addRegularItem', language)}
          </button>
        )}
      </div>
    </div>
  );
};
