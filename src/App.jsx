import { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import BottomNav from './components/BottomNav';
import ChatPanel from './components/ChatPanel';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import { MessageCircle, Bell } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);

  const handleQuickAdd = (type) => {
    setActiveTab('wallet');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-md mx-auto px-4 pt-6 pb-24 md:max-w-2xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">
            <span className="text-brand">TF</span> Finance
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChat(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition text-brand hover:text-brand-light"
              aria-label="Abrir Boti"
              title="Boti - Asesor Financiero"
            >
              <MessageCircle size={20} />
            </button>
            <button
              className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-slate-300"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
            </button>
          </div>
        </header>

        {activeTab === 'home' && <Home onNavigate={setActiveTab} onQuickAdd={handleQuickAdd} />}
        {activeTab === 'stats' && <Stats />}
        {activeTab === 'wallet' && <Wallet />}
        {activeTab === 'profile' && <Profile />}
      </div>

      <BottomNav
        active={activeTab}
        onNavigate={setActiveTab}
        onQuickAdd={() => handleQuickAdd('expense')}
      />

      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
