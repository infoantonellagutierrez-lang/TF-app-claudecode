import { useState, useRef, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from 'lucide-react';
import { FinanceContext } from '../context/FinanceContext';

const SONNET_PRICING = {
  input: 3 / 1_000_000,
  output: 15 / 1_000_000,
};

function ChatPanel({ onClose }) {
  const { movements, accounts, toUSD, rates } = useContext(FinanceContext);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      content: '¡Hola! Soy Boti, tu asistente financiero. Estoy aquí para ayudarte con tus finanzas. ¿Qué quieres saber?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionCost, setSessionCost] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFinancialSummary = () => {
    const totalBalance = accounts.reduce((sum, acc) => sum + toUSD(acc.balance, acc.currency), 0);
    const incomes = movements
      .filter(m => m.type === 'income')
      .reduce((sum, m) => sum + toUSD(m.amount, m.currency), 0);
    const expenses = movements
      .filter(m => m.type === 'expense')
      .reduce((sum, m) => sum + toUSD(m.amount, m.currency), 0);

    const categoryExpenses = {};
    movements
      .filter(m => m.type === 'expense')
      .forEach(m => {
        const amountUSD = toUSD(m.amount, m.currency);
        categoryExpenses[m.category] = (categoryExpenses[m.category] || 0) + amountUSD;
      });

    const topCategories = Object.entries(categoryExpenses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
      .join(', ');

    return `Saldo total: $${totalBalance.toFixed(2)} USD. Ingresos totales: $${incomes.toFixed(2)}. Gastos totales: $${expenses.toFixed(2)}. Movimientos registrados: ${movements.length}. Principales gastos: ${topCategories || 'Ninguno'}.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          financialSummary: getFinancialSummary(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en la solicitud');
      }

      const data = await response.json();
      const cost =
        data.usage.input_tokens * SONNET_PRICING.input +
        data.usage.output_tokens * SONNET_PRICING.output;

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        usage: data.usage,
        cost,
      };

      setMessages(prev => [...prev, botMessage]);
      setSessionCost(prev => prev + cost);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: error.message,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">
            <span className="text-brand">Boti</span> - Asesor Financiero
          </h2>
          <p className="text-xs text-slate-400">
            {sessionCost > 0 && `Costo de sesión: $${sessionCost.toFixed(4)}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
          aria-label="Cerrar Boti"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-brand text-white'
                  : msg.type === 'error'
                    ? 'bg-red-900 text-red-100'
                    : 'bg-slate-800 text-slate-100'
              }`}
            >
              {msg.type === 'bot' ? (
                <div className="prose prose-invert max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              {msg.cost && (
                <p className="text-xs opacity-70 mt-1">
                  {msg.usage.input_tokens + msg.usage.output_tokens} tokens · ${msg.cost.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-400 text-sm">
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-4 space-y-3 pb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre tus finanzas..."
            disabled={loading}
            className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand placeholder-slate-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
