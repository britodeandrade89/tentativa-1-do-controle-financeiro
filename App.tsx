
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from "firebase/auth";
import { handleAuth, isFirebaseConfigured, subscribeToMonthData, saveMonthData, getMonthData } from './services/firebaseService';
import { generateFinancialAnalysis } from './services/geminiService';
import { MonthData, ModalState, FinancialItem, Expense } from './types';
import { initialMonthData, CORRECT_DATA_VERSION, SPENDING_CATEGORIES } from './constants';

// --- UTILITY FUNCTIONS ---
const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) value = 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const getMonthName = (month: number) => {
    const d = new Date();
    d.setMonth(month - 1);
    return d.toLocaleString('pt-BR', { month: 'long' });
}

// --- SVG ICONS ---
const Icons = {
    Logo: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>,
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Transactions: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Goals: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12"cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    AI: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 8.3 9c.5 1.1 1.4 2 2.7 2s2.2-.9 2.7-2c.1-.4.2-.8.3-1.3.6-1.1 0-2.3-1-3.1-.3-.2-.6-.3-1-.3z"></path><path d="M12 21c-1.2 0-2.4-.6-3-1.7A3.6 3.6 0 0 1 8.3 15c.5-1.1 1.4-2 2.7-2s2.2.9 2.7 2c.1.4.2.8.3 1.3.6 1.1 0 2.3-1 3.1-.3-.2-.6-.3-1 .3z"></path><path d="M3 12c0-1.2.6-2.4 1.7-3A3.6 3.6 0 0 1 9 8.3c1.1.5 2 1.4 2 2.7s-.9 2.2-2 2.7c-.4.1-.8.2-1.3.3-1.1.6-2.3 0-3.1-1 .2-.3-.3-.6-.3-1z"></path><path d="M21 12c0-1.2-.6-2.4-1.7-3A3.6 3.6 0 0 0 15 8.3c-1.1.5-2 1.4-2 2.7s.9 2.2 2 2.7c.4.1.8.2 1.3.3 1.1.6 2.3 0-3.1-1 .2-.3.3-.6-.3-1z"></path></svg>,
    Profile: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Send: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    CloudSynced: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M17.5 22a5.3 5.3 0 0 0 4.2-2.1"/><path d="M17.5 22a5.3 5.3 0 0 1-4.2-2.1"/><path d="m15 16.5-3-3-1.5 1.5"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>,
    CloudSyncing: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M22 11.5A10 10 0 0 0 3.5 12.5"/><path d="M2 12.5a10 10 0 0 0 18.5-1"/></svg>,
    CloudError: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};


// --- App Component ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [activeView, setActiveView] = useState('home');
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'disconnected'>('disconnected');
  const [isDataLoading, setIsDataLoading] = useState(true);

  const monthKey = useMemo(() => `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`, [currentDate]);

  const handleSetMonthData = useCallback(async (data: MonthData) => {
    setMonthData(data);
    if(user) {
        setSyncStatus('syncing');
        await saveMonthData(user.uid, monthKey, data);
        setSyncStatus('synced');
    }
  }, [user, monthKey]);

  useEffect(() => {
    const authUnsubscribe = handleAuth(newUser => {
      setUser(newUser);
      if(!isFirebaseConfigured) {
          setSyncStatus('disconnected');
          setMonthData(initialMonthData);
          setIsDataLoading(false);
      }
    });
    return () => authUnsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    setIsDataLoading(true);
    const dataUnsubscribe = subscribeToMonthData(user.uid, monthKey, async (dataFromFirebase) => {
        if (dataFromFirebase) {
             setMonthData(dataFromFirebase);
             setSyncStatus('synced');
        } else {
            console.log(`No data for ${monthKey}, creating new month.`);
            const prevMonthDate = new Date(currentDate);
            prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
            const prevMonthKey = `${prevMonthDate.getFullYear()}-${(prevMonthDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const prevMonthData = await getMonthData(user.uid, prevMonthKey) || initialMonthData;

            const newMonthData: MonthData = {
                dataVersion: CORRECT_DATA_VERSION,
                incomes: [
                    { id: `inc_salario_marcelly_${Date.now()}`, description: 'SALARIO MARCELLY', amount: 3349.92, paid: false },
                    { id: `inc_salario_andre_${Date.now()}`, description: 'SALARIO ANDRE', amount: 3349.92, paid: false },
                    { id: `inc_mumbuca_marcelly_${Date.now()}`, description: 'MUMBUCA MARCELLY', amount: 650.00, paid: false },
                    { id: `inc_mumbuca_andre_${Date.now()}`, description: 'MUMBUCA ANDRE', amount: 650.00, paid: false }
                ],
                expenses: prevMonthData.expenses
                    .filter(exp => exp.cyclic)
                    .map(exp => {
                        const newDueDate = new Date(exp.dueDate || Date.now());
                        newDueDate.setMonth(newDueDate.getMonth() + 1);
                        return {
                            ...exp,
                            id: `exp_${Date.now()}_${Math.random()}`,
                            paid: false,
                            paidDate: null,
                            dueDate: newDueDate.toISOString().split('T')[0],
                            current: (exp.current || 0) < (exp.total || Infinity) ? (exp.current || 0) + 1 : exp.current
                        };
                    }),
                shoppingItems: [],
                avulsosItems: [],
                bankAccounts: prevMonthData.bankAccounts.map(acc => ({...acc})),
                goals: prevMonthData.goals.map(goal => ({...goal})),
            };
            await handleSetMonthData(newMonthData);
        }
        setIsDataLoading(false);
    });

    return () => dataUnsubscribe();
  }, [user, monthKey, currentDate, handleSetMonthData]);

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  if (isDataLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <Icons.CloudSyncing />
                <p className="text-text-light">Carregando dados financeiros...</p>
            </div>
        </div>
    );
  }

  if (!monthData) {
      return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <Icons.CloudError />
                <p className="text-text-light">Não foi possível carregar os dados.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background font-sans">
      <Header 
        monthName={getMonthName(currentDate.getMonth() + 1)}
        year={currentDate.getFullYear()}
        onPrevMonth={() => changeMonth('prev')}
        onNextMonth={() => changeMonth('next')}
        syncStatus={syncStatus}
      />
      <main className="flex-grow overflow-y-auto p-4 pb-24 md:p-8">
        {activeView === 'home' && <HomeView data={monthData} />}
        {activeView === 'transactions' && <p>Transactions View</p>}
        {activeView === 'goals' && <p>Goals View</p>}
        {activeView === 'profile' && <p>Profile View</p>}
      </main>
      <TabBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

// --- HEADER COMPONENT ---
interface HeaderProps {
    monthName: string;
    year: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    syncStatus: 'synced' | 'syncing' | 'error' | 'disconnected';
}
const Header: React.FC<HeaderProps> = ({ monthName, year, onPrevMonth, onNextMonth, syncStatus }) => {
    const SyncIcon = {
        synced: <Icons.CloudSynced />,
        syncing: <Icons.CloudSyncing />,
        error: <Icons.CloudError />,
        disconnected: <Icons.CloudError />,
    }[syncStatus];
    
    return (
        <header className="flex-shrink-0 bg-surface border-b border-border flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-light to-primary rounded-xl p-2 text-white">
                    <Icons.Logo />
                </div>
                <h1 className="hidden md:block text-lg font-bold text-text-main">Finanças AI</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1 bg-background border border-border rounded-xl p-1">
                    <button onClick={onPrevMonth} className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-light hover:text-text-main"><Icons.ChevronLeft /></button>
                    <div className="font-semibold text-text-main text-center w-32 md:w-40">{monthName} {year}</div>
                    <button onClick={onNextMonth} className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-light hover:text-text-main"><Icons.ChevronRight /></button>
                </div>
                <div className="p-2">{SyncIcon}</div>
            </div>
        </header>
    );
};

// --- TABBAR COMPONENT ---
interface TabBarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}
const TabBar: React.FC<TabBarProps> = ({ activeView, setActiveView }) => {
    const tabs = [
        { id: 'home', icon: <Icons.Home />, label: 'Início' },
        { id: 'transactions', icon: <Icons.Transactions />, label: 'Lançamentos' },
        { id: 'goals', icon: <Icons.Goals />, label: 'Metas' },
        { id: 'ai', icon: <Icons.AI />, label: 'Análise AI' },
        { id: 'profile', icon: <Icons.Profile />, label: 'Perfil' },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-20 flex justify-around items-center px-2 pb-[env(safe-area-inset-bottom)]">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${activeView === tab.id ? 'text-primary' : 'text-text-light hover:text-text-main'}`}
                >
                    <div className={`transition-transform ${activeView === tab.id ? 'scale-110' : ''}`}>{tab.icon}</div>
                    <span className="text-xs font-medium">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};


// --- HOME VIEW ---
interface HomeViewProps {
    data: MonthData;
}
const HomeView: React.FC<HomeViewProps> = ({ data }) => {
    const totals = useMemo(() => {
        const totalIncome = data.incomes.reduce((sum, item) => sum + item.amount, 0);
        const salaryIncome = data.incomes.filter(i => i.description.toLowerCase().includes('salario')).reduce((sum, item) => sum + item.amount, 0);
        const mumbucaIncome = data.incomes.filter(i => i.description.toLowerCase().includes('mumbuca')).reduce((sum, item) => sum + item.amount, 0);
        
        const allExpensesList = [...data.expenses, ...data.shoppingItems, ...data.avulsosItems];
        const totalExpenses = allExpensesList.reduce((sum, item) => sum + item.amount, 0);
        const paidExpenses = allExpensesList.filter(e => e.paid).reduce((sum, item) => sum + item.amount, 0);

        const salarySpent = data.expenses.filter(e => e.paid).reduce((sum, item) => sum + item.amount, 0) + data.avulsosItems.filter(e => e.paid).reduce((sum, item) => sum + item.amount, 0);
        const mumbucaSpent = data.shoppingItems.filter(e => e.paid).reduce((sum, item) => sum + item.amount, 0);

        const finalBalance = salaryIncome - salarySpent;

        return { totalIncome, salaryIncome, mumbucaIncome, totalExpenses, paidExpenses, salarySpent, mumbucaSpent, finalBalance };
    }, [data]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SummaryCard 
                title="Entrada Salário"
                value={totals.salaryIncome}
                progress={totals.salaryIncome > 0 ? (totals.salarySpent / totals.salaryIncome) * 100 : 0}
                details={`${formatCurrency(totals.salarySpent)} gastos de ${formatCurrency(totals.salaryIncome)}`}
                color="text-success"
                progressColor="bg-success"
            />
             <SummaryCard 
                title="Entrada Mumbuca"
                value={totals.mumbucaIncome}
                progress={totals.mumbucaIncome > 0 ? (totals.mumbucaSpent / totals.mumbucaIncome) * 100 : 0}
                details={`${formatCurrency(totals.mumbucaSpent)} gastos de ${formatCurrency(totals.mumbucaIncome)}`}
                color="text-mumbuca"
                progressColor="bg-mumbuca"
            />
            <SummaryCard 
                title="Dívidas do Mês"
                value={totals.totalExpenses}
                progress={totals.totalExpenses > 0 ? (totals.paidExpenses / totals.totalExpenses) * 100 : 0}
                details={`${formatCurrency(totals.paidExpenses)} pagos de ${formatCurrency(totals.totalExpenses)}`}
                color="text-danger"
                progressColor="bg-danger"
            />
            <SummaryCard 
                title="Saldo Disponível"
                value={totals.finalBalance}
                details="Salário - Dívidas - Avulsos"
                color={totals.finalBalance >= 0 ? 'text-balance' : 'text-danger'}
            />
        </div>
    );
};

// --- SUMMARY CARD ---
interface SummaryCardProps {
    title: string;
    value: number;
    details: string;
    color: string;
    progress?: number;
    progressColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, details, color, progress, progressColor }) => {
    const safeProgress = Math.min(Math.max(progress || 0, 0), 100);
    return (
        <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col gap-2">
            <h3 className="text-sm font-medium text-text-light">{title}</h3>
            <p className={`text-3xl font-bold ${color}`}>{formatCurrency(value)}</p>
            {progress !== undefined && (
                <div className="w-full bg-surface-light rounded-full h-2 mt-2">
                    <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${safeProgress}%` }}></div>
                </div>
            )}
            <p className="text-xs text-text-lighter mt-auto pt-2">{details}</p>
        </div>
    );
};