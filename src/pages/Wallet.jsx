import { useState } from 'react';
import { Banknote, Landmark, Bitcoin, Wallet as WalletIcon, PlusCircle, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const ACCOUNT_ICONS = {
  banknote: Banknote,
  landmark: Landmark,
  bitcoin: Bitcoin,
  wallet: WalletIcon,
};

const CURRENCIES = ['USD', 'EUR', 'Bs', 'USDT'];

export default function Wallet() {
  const {
    accounts, movements, addMovement, addAccount, deleteMovement,
    CATEGORIES, toUSD,
  } = useFinance();

  const [tab, setTab] = useState('accounts');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', icon: 'wallet', currency: 'USD' });
  const [form, setForm] = useState({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: CATEGORIES[0],
    amount: '',
    currency: 'USD',
    accountId: accounts[0]?.id || '',
  });

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.accountId) return;
    addMovement({ ...form, amount: parseFloat(form.amount) });
    setForm(prev => ({ ...prev, description: '', amount: '' }));
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!newAccount.name.trim()) return;
    addAccount(newAccount);
    setNewAccount({ name: '', icon: 'wallet', currency: 'USD' });
    setShowAddAccount(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Billetera</h2>

      <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
        {['accounts', 'movements'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'accounts' ? 'Cuentas' : 'Movimientos'}
          </button>
        ))}
      </div>

      {tab === 'accounts' ? (
        <div className="space-y-3">
          {accounts.map(acc => {
            const Icon = ACCOUNT_ICONS[acc.icon] || WalletIcon;
            return (
              <div key={acc.id} className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-light" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{acc.name}</p>
                    <p className="text-[10px] text-slate-500">{acc.currency}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${acc.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {fmt(acc.balance)} {acc.currency}
                </p>
              </div>
            );
          })}

          {showAddAccount ? (
            <form onSubmit={handleAddAccount} className="bg-slate-900 rounded-xl border border-brand/30 p-4 space-y-3">
              <input
                type="text"
                placeholder="Nombre de cuenta"
                value={newAccount.name}
                onChange={e => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newAccount.icon}
                  onChange={e => setNewAccount(prev => ({ ...prev, icon: e.target.value }))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                >
                  <option value="wallet">Billetera</option>
                  <option value="banknote">Efectivo</option>
                  <option value="landmark">Banco</option>
                  <option value="bitcoin">Crypto</option>
                </select>
                <select
                  value={newAccount.currency}
                  onChange={e => setNewAccount(prev => ({ ...prev, currency: e.target.value }))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-brand text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-light transition-colors">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowAddAccount(false)} className="flex-1 bg-slate-800 text-slate-400 py-2 rounded-lg text-sm hover:text-white transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddAccount(true)}
              className="w-full bg-slate-900 border border-dashed border-slate-700 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-400 hover:text-brand hover:border-brand/50 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-sm">Agregar Cuenta</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex bg-slate-800 rounded-lg p-1">
              {['income', 'expense'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type: t }))}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    form.type === t
                      ? t === 'income' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {t === 'income' ? 'Ingreso' : 'Gasto'}
                </button>
              ))}
            </div>

            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={form.accountId}
                onChange={e => setForm(prev => ({ ...prev, accountId: e.target.value }))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              >
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Monto"
                value={form.amount}
                onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand"
                step="0.01"
                min="0"
              />
              <select
                value={form.currency}
                onChange={e => setForm(prev => ({ ...prev, currency: e.target.value }))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-brand text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-light transition-colors"
            >
              Registrar {form.type === 'income' ? 'Ingreso' : 'Gasto'}
            </button>
          </form>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Todos los Movimientos</h3>
            {movements.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Sin movimientos</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {movements.map(m => (
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
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        m.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {m.type === 'income' ? '+' : '-'}{fmt(m.amount)} {m.currency}
                      </span>
                      <button
                        onClick={() => deleteMovement(m.id)}
                        className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
