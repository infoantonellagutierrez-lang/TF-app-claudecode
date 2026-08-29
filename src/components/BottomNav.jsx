import { Home, BarChart3, Wallet, User, Plus } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
  { id: 'wallet', label: 'Billetera', icon: Wallet },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function BottomNav({ active, onNavigate, onQuickAdd }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1 relative">
        {tabs.map((tab, i) => (
          <div key={tab.id} className="contents">
            {i === 2 && (
              <button
                onClick={onQuickAdd}
                className="w-12 h-12 -mt-6 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/30 hover:bg-brand-light transition-colors"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            )}
            <button
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-colors ${
                active === tab.id ? 'text-brand' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
}
