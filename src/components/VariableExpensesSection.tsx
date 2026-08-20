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

interface VariableExpensesSectionProps {
  expenses: ExpenseItem[];
  totalIncome: number;
  language: Language;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onUpdateExpense: (id: string, updated: Partial<ExpenseItem>) => void;
  onDeleteExpense: (id: string) => void;
}

export const VariableExpensesSection: React.FC<VariableExpensesSectionProps> = ({
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
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('Groceries');
  const [editDate, setEditDate] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const irregularExpenses = useMemo(() => expenses.filter((e) => e.type === 'irregular'), [expenses]);
  const totalIrregular = irregularExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const resetAddForm = () => {
    setName('');
    setCategory('Groceries');
    setDate(new Date().toISOString().split('T')[0]);
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
      type: 'irregular',
      category,
      date: date || undefined,
      notes: notes.trim() || undefined,
    });

    resetAddForm();
  };

  const startEditing = (item: ExpenseItem) => {
    setIsAdding(false);
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditDate(item.date || new Date().toISOString().split('T')[0]);
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
      type: 'irregular',
      date: editDate || undefined,
      notes: editNotes.trim() || undefined,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-xs w-full" id="variable-expenses-section">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-sm">{getTranslation('variableAndIrregular', language)}</h3>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
            {getTranslation('oneTime', language)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(totalIrregular, EURO_CURRENCY)}
          </span>

          {!isAdding && !editingId && (
            <button
              id="btn-add-irregular-expense"
              onClick={() => {
                setEditingId(null);
                setIsAdding(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation('addVariableItem', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Not Regular Expense Inline Form (Sequence: Item -> Category -> Date -> Amount) */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="m-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in"
          id="form-add-irregular"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>{getTranslation('saveIrregularExpense', language)}</span>
            <button
              type="button"
              onClick={resetAddForm}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Item Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('expenseName', language)} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'sk' ? 'napr. Zimná bunda / Oprava auta' : 'e.g., Winter Coat / Car Repair'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* 2. Category */}
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

            {/* 3. Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('date', language)}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* 4. Amount */}
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
              placeholder={language === 'sk' ? 'napr. Bloček z obchodu, oprava bŕzd' : 'e.g., Receipt note, brake repair'}
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
              {getTranslation('saveIrregularExpense', language)}
            </button>
          </div>
        </form>
      )}

      {/* Edit Not Regular Expense Form (Matching Design) */}
      {editingId && (
        <form
          onSubmit={handleEditSubmit}
          className="m-5 p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 animate-in fade-in"
          id="form-edit-irregular"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="text-blue-700 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              {getTranslation('editIrregularExpense', language)}
            </span>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Item Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('expenseName', language)} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'sk' ? 'napr. Zimná bunda / Oprava auta' : 'e.g., Winter Coat / Car Repair'}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* 2. Category */}
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

            {/* 3. Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {getTranslation('date', language)}
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* 4. Amount */}
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
              placeholder={language === 'sk' ? 'napr. Bloček z obchodu, oprava bŕzd' : 'e.g., Receipt note, brake repair'}
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

      {/* Table Content */}
      <div className="flex-1 overflow-auto px-6 py-1">
        <table className="w-full text-xs">
          <thead className="text-slate-400 text-left border-b border-slate-100">
            <tr>
              <th className="py-2.5 font-semibold">{getTranslation('item', language)}</th>
              <th className="py-2.5 font-semibold">{getTranslation('category', language)}</th>
              <th className="py-2.5 font-semibold">{getTranslation('date', language)}</th>
              <th className="py-2.5 font-semibold text-right">{getTranslation('amount', language)}</th>
              <th className="py-2.5 font-semibold text-right w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {irregularExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  <p className="mb-3">{getTranslation('noIrregularExpenses', language)}</p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{getTranslation('addVariableItem', language)}</span>
                  </button>
                </td>
              </tr>
            ) : (
              irregularExpenses.map((item) => {
                const isCurrentEditing = editingId === item.id;

                return (
                  <tr 
                    key={item.id} 
                    className={`group transition-colors ${
                      isCurrentEditing ? 'bg-blue-50/70 font-medium' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* 1. Item Name + Notes */}
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: getCategoryColor(item.category) }} 
                        />
                        <div>
                          <span className="font-semibold text-slate-800 block">{item.name}</span>
                          {item.notes && (
                            <span className="text-[10px] text-slate-500 italic block">{item.notes}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Category Badge */}
                    <td className="py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium inline-block">
                        {translateExpenseCategory(item.category, language)}
                      </span>
                    </td>

                    {/* 3. Date */}
                    <td className="py-3 text-slate-600 font-medium">
                      {item.date || '-'}
                    </td>

                    {/* 4. Amount */}
                    <td className="py-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.amount, EURO_CURRENCY)}
                    </td>

                    {/* 5. Actions */}
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
          {totalIncome > 0 ? `${((totalIrregular / totalIncome) * 100).toFixed(1)}% ${getTranslation('ofTotalIncome', language)}` : `${irregularExpenses.length} ${getTranslation('variableShort', language)}`}
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
            {getTranslation('addVariableItem', language)}
          </button>
        )}
      </div>
    </div>
  );
};
