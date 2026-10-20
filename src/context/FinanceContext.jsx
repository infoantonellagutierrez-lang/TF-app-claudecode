import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const FinanceContext = createContext();

const DEFAULT_ACCOUNTS = [
  { id: 'cash', name: 'Efectivo', icon: 'banknote', balance: 0, currency: 'USD' },
  { id: 'bank', name: 'Banco', icon: 'landmark', balance: 0, currency: 'USD' },
  { id: 'binance', name: 'Binance', icon: 'bitcoin', balance: 0, currency: 'USDT' },
  { id: 'paypal', name: 'PayPal', icon: 'wallet', balance: 0, currency: 'USD' },
];

const DEFAULT_RATES = { USD: 1, EUR: 1.08, USDT: 1, Bs: 0.027 };

const DEFAULT_PROFILE = {
  name: 'Usuario',
  language: 'es',
  currency: 'USD',
};

const CATEGORIES = [
  'Alimentación', 'Transporte', 'Entretenimiento', 'Salud',
  'Educación', 'Servicios', 'Ropa', 'Hogar', 'Tecnología', 'Otros',
];

function loadState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function FinanceProvider({ children }) {
  const [accounts, setAccounts] = useState(() => loadState('tf_accounts', DEFAULT_ACCOUNTS));
  const [movements, setMovements] = useState(() => loadState('tf_movements', []));
  const [rates, setRates] = useState(() => loadState('tf_rates', DEFAULT_RATES));
  const [profile, setProfile] = useState(() => loadState('tf_profile', DEFAULT_PROFILE));

  useEffect(() => { localStorage.setItem('tf_accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('tf_movements', JSON.stringify(movements)); }, [movements]);
  useEffect(() => { localStorage.setItem('tf_rates', JSON.stringify(rates)); }, [rates]);
  useEffect(() => { localStorage.setItem('tf_profile', JSON.stringify(profile)); }, [profile]);

  const toUSD = useCallback((amount, currency) => {
    const rate = rates[currency] || 1;
    return amount * rate;
  }, [rates]);

  const addMovement = useCallback((movement) => {
    const newMovement = {
      ...movement,
      id: Date.now().toString(),
      date: movement.date || new Date().toISOString().split('T')[0],
    };
    setMovements(prev => [newMovement, ...prev]);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === movement.accountId) {
        const amountInAccCurrency = movement.currency === acc.currency
          ? movement.amount
          : toUSD(movement.amount, movement.currency) / (rates[acc.currency] || 1);
        const delta = movement.type === 'income' ? amountInAccCurrency : -amountInAccCurrency;
        return { ...acc, balance: acc.balance + delta };
      }
      return acc;
    }));
  }, [rates, toUSD]);

  const addAccount = useCallback((account) => {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
      balance: 0,
    };
    setAccounts(prev => [...prev, newAccount]);
  }, []);

  const deleteMovement = useCallback((id) => {
    setMovements(prev => {
      const movement = prev.find(m => m.id === id);
      if (movement) {
        setAccounts(accs => accs.map(acc => {
          if (acc.id === movement.accountId) {
            const amountInAccCurrency = movement.currency === acc.currency
              ? movement.amount
              : toUSD(movement.amount, movement.currency) / (rates[acc.currency] || 1);
            const delta = movement.type === 'income' ? -amountInAccCurrency : amountInAccCurrency;
            return { ...acc, balance: acc.balance + delta };
          }
          return acc;
        }));
      }
      return prev.filter(m => m.id !== id);
    });
  }, [rates, toUSD]);

  const clearAllData = useCallback(() => {
    setAccounts(DEFAULT_ACCOUNTS);
    setMovements([]);
    setRates(DEFAULT_RATES);
    setProfile(DEFAULT_PROFILE);
  }, []);

  const totalBalanceUSD = accounts.reduce((sum, acc) => sum + toUSD(acc.balance, acc.currency), 0);

  const totalIncome = movements
    .filter(m => m.type === 'income')
    .reduce((sum, m) => sum + toUSD(m.amount, m.currency), 0);

  const totalExpenses = movements
    .filter(m => m.type === 'expense')
    .reduce((sum, m) => sum + toUSD(m.amount, m.currency), 0);

  const expensesByCategory = movements
    .filter(m => m.type === 'expense')
    .reduce((acc, m) => {
      const cat = m.category || 'Otros';
      acc[cat] = (acc[cat] || 0) + toUSD(m.amount, m.currency);
      return acc;
    }, {});

  return (
    <FinanceContext.Provider value={{
      accounts, movements, rates, profile,
      setAccounts, setMovements, setRates, setProfile,
      addMovement, addAccount, deleteMovement, clearAllData,
      toUSD, totalBalanceUSD, totalIncome, totalExpenses,
      expensesByCategory, CATEGORIES,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
