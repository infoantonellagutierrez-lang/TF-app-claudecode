import { useState } from 'react';
import { User, Globe, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Profile() {
  const { profile, setProfile, rates, setRates, clearAllData } = useFinance();
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const handleSaveName = () => {
    setProfile(prev => ({ ...prev, name: nameInput.trim() || 'Usuario' }));
    setEditingName(false);
  };

  const handleRateChange = (currency, value) => {
    const numVal = parseFloat(value);
    if (!isNaN(numVal) && numVal > 0) {
      setRates(prev => ({ ...prev, [currency]: numVal }));
    }
  };

  const handleClear = () => {
    clearAllData();
    setShowConfirm(false);
    setNameInput('Usuario');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Perfil</h2>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="text-left flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  className="flex-1 bg-slate-800 border border-brand rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveName} className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                  OK
                </button>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)} className="text-left">
                <p className="text-base font-semibold text-white">{profile.name}</p>
                <p className="text-[10px] text-slate-500">Toca para editar</p>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-brand-pale" />
          <h3 className="text-sm font-semibold text-white">Preferencias</h3>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Idioma</label>
          <select
            value={profile.language}
            onChange={e => setProfile(prev => ({ ...prev, language: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Moneda Principal</label>
          <select
            value={profile.currency}
            onChange={e => setProfile(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
          >
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="Bs">Bs - Bolívar</option>
            <option value="USDT">USDT - Tether</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <RefreshCw className="w-4 h-4 text-brand-pale" />
          <h3 className="text-sm font-semibold text-white">Tasas de Cambio (a USD)</h3>
        </div>
        <p className="text-[10px] text-slate-500">Valor de 1 unidad de cada moneda en USD</p>

        {[
          { key: 'EUR', label: '1 EUR =' },
          { key: 'USDT', label: '1 USDT =' },
          { key: 'Bs', label: '1 Bs =' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm text-slate-400 w-20">{label}</span>
            <input
              type="number"
              value={rates[key]}
              onChange={e => handleRateChange(key, e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              step="0.0001"
              min="0.0001"
            />
            <span className="text-sm text-slate-500">USD</span>
          </div>
        ))}
      </div>

      <div className="bg-red-950/30 rounded-xl border border-red-900/50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Zona de Riesgo</h3>
        </div>
        <p className="text-xs text-slate-500">Esta acción eliminará todos los datos: cuentas, movimientos, tasas y perfil.</p>
        {showConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Sí, eliminar todo
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-slate-800 text-slate-400 py-2 rounded-lg text-sm hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-red-900/50 text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors border border-red-900"
          >
            Limpiar Todos los Datos
          </button>
        )}
      </div>
    </div>
  );
}
