
import React, { useMemo } from 'react';
import { MonthData } from '../types';
import { formatCurrency } from '../utils';
import { SPENDING_CATEGORIES } from '../constants';

// --- SUMMARY CARD ---
interface SummaryCardProps {
    title: string;
    value: number;
    details: string;
    color: string;
    progress?: number;
    progressColor?: string;
    isBalance?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, details, color, progress, progressColor, isBalance = false }) => {
    const safeProgress = Math.min(Math.max(progress || 0, 0), 100);
    return (
        <div className="bg-surface p-5 rounded-2xl border border-border flex flex-col gap-1">
            <h3 className="text-sm font-medium text-text-light">{title}</h3>
            <p className={`text-3xl font-bold ${color}`}>
                {isBalance && value < 0 ? `-${formatCurrency(Math.abs(value))}` : formatCurrency(value)}
            </p>
            {progress !== undefined && (
                <div className="w-full bg-surface-light rounded-full h-1.5 mt-2 mb-1">
                    <div className={`${progressColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${safeProgress}%` }}></div>
                </div>
            )}
            <p className={`text-xs ${isBalance ? 'mt-2.5' : ''} text-text-lighter mt-auto`}>{details}</p>
        </div>
    );
};

// --- PIE CHART ---
const PieChart: React.FC<{ categoryTotals: { category: string, amount: number }[] }> = ({ categoryTotals }) => {
    const totalSpent = useMemo(() => categoryTotals.reduce((sum, cat) => sum + cat.amount, 0), [categoryTotals]);

    const chartData = useMemo(() => {
        return categoryTotals
            .map(item => ({
                ...item,
                percentage: totalSpent > 0 ? (item.amount / totalSpent) * 100 : 0,
                color: SPENDING_CATEGORIES[item.category]?.color || 'bg-gray-500'
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [categoryTotals, totalSpent]);

    const conicGradient = useMemo(() => {
        let currentAngle = 0;
        const gradientParts = chartData.map(item => {
            const angle = item.percentage * 3.6;
            // Tailwind doesn't support dynamic class names from variables like item.color
            // So we extract the color from the class name. This is a bit of a hack.
            const colorMap: { [key: string]: string } = {
                'bg-yellow-500': '#eab308', 'bg-blue-500': '#3b82f6', 'bg-red-500': '#ef4444',
                'bg-indigo-500': '#6366f1', 'bg-amber-400': '#facc15', 'bg-teal-500': '#14b8a6',
                'bg-rose-500': '#f43f5e', 'bg-pink-500': '#ec4899', 'bg-sky-400': '#38bdf8',
                'bg-purple-500': '#a855f7', 'bg-green-500': '#22c55e', 'bg-emerald-500': '#10b981',
                'bg-gray-500': '#6b7280'
            };
            const color = colorMap[item.color] || '#6b7280';
            const part = `${color} ${currentAngle}deg ${currentAngle + angle}deg`;
            currentAngle += angle;
            return part;
        });
        return `conic-gradient(${gradientParts.join(', ')})`;
    }, [chartData]);
    
    return (
        <div className="bg-surface p-5 rounded-2xl border border-border">
            <h2 className="text-lg font-bold text-text-main mb-4">Visão Geral das Despesas</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 w-40 h-40 mx-auto rounded-full" style={{ background: conicGradient }}></div>
                <div className="flex-grow space-y-2">
                    {chartData.map(item => (
                        <div key={item.category} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-text-light">{SPENDING_CATEGORIES[item.category]?.name || 'Outros'}</span>
                            </div>
                            <div className="font-semibold text-text-main">
                                {formatCurrency(item.amount)}
                                <span className="text-xs text-text-lighter ml-2">({item.percentage.toFixed(1)}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- HOME VIEW ---
interface HomeViewProps {
    data: MonthData;
}
export const HomeView: React.FC<HomeViewProps> = ({ data }) => {
    const totals = useMemo(() => {
        // --- INCOMES ---
        const totalIncome = data.incomes.reduce((sum, item) => sum + item.amount, 0);
        const salaryIncome = data.incomes.filter(i => i.description.toLowerCase().includes('salario')).reduce((sum, item) => sum + item.amount, 0);
        const mumbucaIncome = data.incomes.filter(i => i.description.toLowerCase().includes('mumbuca')).reduce((sum, item) => sum + item.amount, 0);
        
        // --- EXPENSES (by type) ---
        const monthlyExpensesTotal = data.expenses.reduce((sum, item) => sum + item.amount, 0);
        const avulsosTotal = data.avulsosItems.reduce((sum, item) => sum + item.amount, 0);
        const mumbucaSpent = data.shoppingItems.reduce((sum, item) => sum + item.amount, 0);
        
        // --- PAID EXPENSES (for progress bars) ---
        const paidMonthlyExpenses = data.expenses.filter(e => e.paid).reduce((sum, item) => sum + item.amount, 0);
        
        // --- SPENT LOGIC (for card details) ---
        const salarySpent = monthlyExpensesTotal + avulsosTotal;
        const allSpending = salarySpent + mumbucaSpent;
        
        // --- BALANCE & DEBT LOGIC ---
        // As per screenshot's hint: Salário - Dívidas - Avulsos
        const finalBalance = salaryIncome - salarySpent;

        // "Total a pagar" should only include unpaid debts
        const totalToPayMarcia = data.expenses
            .filter(e => !e.paid && e.description.toLowerCase().includes('marcia brito'))
            .reduce((sum, item) => sum + item.amount, 0);
        
        return { 
            totalIncome, 
            salaryIncome, 
            mumbucaIncome, 
            monthlyExpensesTotal, 
            paidMonthlyExpenses,
            mumbucaSpent, 
            allSpending,
            salarySpent,
            finalBalance, 
            totalToPayMarcia 
        };
    }, [data]);
    
     const categoryTotals = useMemo(() => {
        const spending: { [key: string]: number } = {};
        [...data.expenses, ...data.shoppingItems, ...data.avulsosItems].forEach(item => {
            const category = item.category || 'outros';
            spending[category] = (spending[category] || 0) + item.amount;
        });
        return Object.entries(spending).map(([category, amount]) => ({ category, amount }));
    }, [data]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <SummaryCard 
                    title="Entrada Total"
                    value={totals.totalIncome}
                    progress={(totals.totalIncome > 0 ? (totals.allSpending / totals.totalIncome) * 100 : 0)}
                    details={`${formatCurrency(totals.allSpending)} gastos de ${formatCurrency(totals.totalIncome)}`}
                    color="text-text-main"
                    progressColor="bg-text-lighter"
                />
                 <SummaryCard 
                    title="Entrada Salário"
                    value={totals.salaryIncome}
                    progress={(totals.salaryIncome > 0 ? (totals.salarySpent / totals.salaryIncome) * 100 : 0)}
                    details={`${formatCurrency(totals.salarySpent)} gastos de ${formatCurrency(totals.salaryIncome)}`}
                    color="text-success"
                    progressColor="bg-success"
                />
                 <SummaryCard 
                    title="Entrada Mumbuca"
                    value={totals.mumbucaIncome}
                    progress={(totals.mumbucaIncome > 0 ? (totals.mumbucaSpent / totals.mumbucaIncome) * 100 : 0)}
                    details={`${formatCurrency(totals.mumbucaSpent)} gastos de ${formatCurrency(totals.mumbucaIncome)}`}
                    color="text-mumbuca"
                    progressColor="bg-mumbuca"
                />
                <SummaryCard 
                    title="Dívidas do Mês"
                    value={totals.monthlyExpensesTotal}
                    progress={totals.monthlyExpensesTotal > 0 ? (totals.paidMonthlyExpenses / totals.monthlyExpensesTotal) * 100 : 0}
                    details={`${formatCurrency(totals.paidMonthlyExpenses)} pagos de ${formatCurrency(totals.monthlyExpensesTotal)}`}
                    color="text-danger"
                    progressColor="bg-primary"
                />
                 <SummaryCard 
                    title="Saldo Disponível"
                    value={totals.finalBalance}
                    details="Salário - Dívidas - Avulsos"
                    color={totals.finalBalance >= 0 ? 'text-balance' : 'text-danger'}
                    isBalance={true}
                />
            </div>

            <PieChart categoryTotals={categoryTotals} />
            
            <div className="bg-surface p-5 rounded-2xl border border-border">
                <div className="flex items-center gap-2 text-sm text-text-light">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                     <span>Total a pagar para</span>
                </div>
                <div className="text-text-main font-bold mt-1">Marcia Brito</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(totals.totalToPayMarcia)}</div>
            </div>
        </div>
    );
};
