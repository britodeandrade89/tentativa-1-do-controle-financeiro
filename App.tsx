
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from "firebase/auth";
import { handleAuth, isFirebaseConfigured, subscribeToMonthData, saveMonthData, getMonthData } from './services/firebaseService';
import { MonthData, ModalState, FinancialItem, Expense, Income, ShoppingItem, AvulsoItem, Goal, BankAccount } from './types';
import { initialMonthData, CORRECT_DATA_VERSION } from './constants';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { HomeView } from './components/HomeView';
import { TransactionsView } from './components/TransactionsView';
import { GoalsView } from './components/GoalsView';
import { ProfileView } from './components/ProfileView';
import { FinancialItemModal } from './components/FinancialItemModal';
import { AIChatModal } from './components/AIChatModal';

// --- SVG ICONS ---
const Icons = {
    CloudSyncing: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M22 11.5A10 10 0 0 0 3.5 12.5"/><path d="M2 12.5a10 10 0 0 0 18.5-1"/></svg>,
    CloudError: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// --- UTILITY FUNCTIONS ---
const getMonthName = (month: number) => {
    const d = new Date();
    d.setMonth(month - 1);
    return d.toLocaleString('pt-BR', { month: 'long' });
}

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

  // --- Core Data Handling ---
  const updateAndSaveChanges = useCallback(async (newData: MonthData) => {
    setMonthData(newData); // Optimistic UI update
    if (user && isFirebaseConfigured) {
        setSyncStatus('syncing');
        try {
            await saveMonthData(user.uid, monthKey, newData);
            setSyncStatus('synced');
        } catch (error) {
            console.error("Failed to save changes:", error);
            setSyncStatus('error');
        }
    }
  }, [user, monthKey]);

  // --- Auth & Data Subscription ---
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
                incomes: [],
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
            await updateAndSaveChanges(newMonthData);
        }
        setIsDataLoading(false);
    });

    return () => dataUnsubscribe();
  }, [user, monthKey, currentDate, updateAndSaveChanges]);


  // --- Event Handlers ---
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleModalOpen = (type: ModalState['type'], data?: any) => {
    setModalState({ isOpen: true, type, data });
  };
  const handleModalClose = () => {
    setModalState({ isOpen: false, type: null, data: undefined });
  };

  const getListKeyForItemType = (itemType: 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account'): keyof MonthData | null => {
      switch (itemType) {
          case 'income': return 'incomes';
          case 'expense': return 'expenses';
          case 'shopping': return 'shoppingItems';
          case 'avulso': return 'avulsosItems';
          case 'goal': return 'goals';
          case 'account': return 'bankAccounts';
          default: return null;
      }
  }

  const handleAddItem = (item: Omit<FinancialItem | Goal | BankAccount, 'id'>, itemType: 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account') => {
      if (!monthData) return;
      const listKey = getListKeyForItemType(itemType);
      if (!listKey) return;

      const newItem = { ...item, id: `${itemType}_${Date.now()}` };
      const newList = [...(monthData[listKey] as any[]), newItem];
      
      updateAndSaveChanges({ ...monthData, [listKey]: newList });
      handleModalClose();
  };

  const handleUpdateItem = (item: FinancialItem | Goal | BankAccount, itemType: 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account') => {
      if (!monthData) return;
      const listKey = getListKeyForItemType(itemType);
      if (!listKey) return;

      const list = monthData[listKey] as any[];
      const itemIndex = list.findIndex(i => i.id === item.id);
      if (itemIndex === -1) return;

      const newList = [...list];
      newList[itemIndex] = item;

      updateAndSaveChanges({ ...monthData, [listKey]: newList });
      handleModalClose();
  };

  const handleDeleteItem = (itemId: string, itemType: 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account') => {
      if (!monthData || !window.confirm("Tem certeza que deseja excluir este item?")) return;
      const listKey = getListKeyForItemType(itemType);
      if (!listKey) return;
      
      const newList = (monthData[listKey] as any[]).filter(item => item.id !== itemId);
      updateAndSaveChanges({ ...monthData, [listKey]: newList });
  };

  const handleTogglePaid = (item: FinancialItem, itemType: 'income' | 'expense' | 'shopping' | 'avulso') => {
      const updatedItem = { 
        ...item, 
        paid: !item.paid,
        ...((itemType !== 'income') && { paidDate: !item.paid ? new Date().toISOString().split('T')[0] : null })
      };
      handleUpdateItem(updatedItem, itemType);
  }

  // --- Render Logic ---
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
  
  const renderView = () => {
      switch (activeView) {
          case 'home':
              return <HomeView data={monthData} />;
          case 'transactions':
              return <TransactionsView 
                data={monthData} 
                onAddItem={handleModalOpen}
                onEditItem={(item, type) => handleModalOpen('edit-item', { item, type })}
                onDeleteItem={handleDeleteItem}
                onTogglePaid={handleTogglePaid}
              />;
          case 'goals':
              return <GoalsView 
                data={monthData}
                onAddGoal={() => handleModalOpen('add-goal')}
                onEditGoal={(goal) => handleModalOpen('edit-goal', goal)}
                onDeleteGoal={(id) => handleDeleteItem(id, 'goal')}
              />;
          case 'profile':
              return <ProfileView 
                data={monthData}
                user={user}
                onAddAccount={() => handleModalOpen('add-account')}
                onEditAccount={(acc) => handleModalOpen('edit-account', acc)}
                onDeleteAccount={(id) => handleDeleteItem(id, 'account')}
              />;
          default:
              return <HomeView data={monthData} />;
      }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background font-sans overflow-hidden">
      <Header 
        monthName={getMonthName(currentDate.getMonth() + 1)}
        year={currentDate.getFullYear()}
        onPrevMonth={() => changeMonth('prev')}
        onNextMonth={() => changeMonth('next')}
        syncStatus={syncStatus}
      />
      <main className="flex-grow overflow-y-auto p-4 pb-24 md:p-6 lg:p-8">
        {renderView()}
      </main>
      <TabBar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onTabClick={(view) => view === 'ai' ? handleModalOpen('ai-chat') : setActiveView(view)}
      />

      {modalState.isOpen && modalState.type === 'ai-chat' && (
        <AIChatModal
          isOpen={true}
          onClose={handleModalClose}
          monthData={monthData}
          monthName={getMonthName(currentDate.getMonth() + 1)}
          year={currentDate.getFullYear()}
        />
      )}
      
      {modalState.isOpen && modalState.type !== 'ai-chat' && (
        <FinancialItemModal
          modalState={modalState}
          onClose={handleModalClose}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
        />
      )}
    </div>
  );
}
