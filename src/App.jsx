import { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

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
