import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function Stats() {
  const { movements, toUSD, expensesByCategory } = useFinance();

  const monthlyData = MONTHS.map((month, i) => {
    const monthMovements = movements.filter(m => {
      const d = new Date(m.date);
      return d.getMonth() === i;
    });
    const income = monthMovements
      .filter(m => m.type === 'income')
      .reduce((sum, m) => sum + toUSD(m.amount, m.currency), 0);
    const expense = monthMovements
      .filter(m => m.type === 'expense')
      .reduce((sum, m) => sum + toUSD(m.amount, m.currency), 0);
    return { month, income, expense };
  }).filter(d => d.income > 0 || d.expense > 0);

  const categoryData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#0057FF', '#3D7FFF', '#7AABFF', '#003DB3', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6'];

  const fmt = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'income' ? 'Ingresos' : 'Gastos'}: ${p.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Estadísticas</h2>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Ingresos vs Gastos Mensual</h3>
        {monthlyData.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">Agrega movimientos para ver estadísticas</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={50} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="income" name="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="expense" name="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-xs text-slate-400">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-xs text-slate-400">Gastos</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Gastos por Categoría</h3>
        {categoryData.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">Sin gastos registrados</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, categoryData.length * 40)}>
            <BarChart data={categoryData} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
                      <p className="text-white">{payload[0].payload.name}: ${payload[0].value.toFixed(2)}</p>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
