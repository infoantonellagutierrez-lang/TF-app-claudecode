import { TrendingUp, TrendingDown, DollarSign, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Home({ onNavigate, onQuickAdd }) {
  const {
    totalBalanceUSD, totalIncome, totalExpenses,
    movements, expensesByCategory, toUSD,
  } = useFinance();

  const last5 = movements.slice(0, 5);
  const categoryEntries = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const maxCategoryAmount = categoryEntries.length > 0 ? categoryEntries[0][1] : 1;

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-brand via-brand-light to-brand-pale rounded-2xl p-5 text-white shadow-lg shadow-brand/20">
        <p className="text-sm opacity-80 mb-1">Saldo Total</p>
        <p className="text-3xl font-bold">${fmt(totalBalanceUSD)}</p>
        <p className="text-xs opacity-60 mt-1">USD</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-400">Ingresos</span>
          </div>
          <p className="text-lg font-semibold text-emerald-400">${fmt(totalIncome)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-xs text-slate-400">Gastos</span>
          </div>
          <p className="text-lg font-semibold text-red-400">${fmt(totalExpenses)}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Ingreso', icon: ArrowUpRight, color: 'text-emerald-400', action: () => onQuickAdd('income') },
          { label: 'Gasto', icon: ArrowDownRight, color: 'text-red-400', action: () => onQuickAdd('expense') },
          { label: 'Tasas', icon: RefreshCw, color: 'text-brand-pale', action: () => onNavigate('profile') },
          { label: 'Limpiar', icon: Trash2, color: 'text-amber-400', action: () => onNavigate('profile') },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:border-brand/50 transition-colors"
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-[10px] text-slate-400">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Últimos Movimientos</h3>
        {last5.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">Sin movimientos aún</p>
        ) : (
          <div className="space-y-2">
            {last5.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    m.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    {m.type === 'income'
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      : <ArrowDownRight className="w-4 h-4 text-red-400" />
                    }
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white">{m.description || m.category}</p>
                    <p className="text-[10px] text-slate-500">{m.date} · {m.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  m.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {m.type === 'income' ? '+' : '-'}{fmt(m.amount)} {m.currency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {categoryEntries.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Gastos por Categoría</h3>
          <div className="space-y-3">
            {categoryEntries.map(([cat, amount]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{cat}</span>
                  <span className="text-slate-300">${fmt(amount)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all"
                    style={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
