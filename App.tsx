
import React, { useState, useEffect, useMemo } from 'react';
import type { User } from "firebase/auth";
import { handleAuth } from './services/firebaseService';
import { MonthData, ModalState, FinancialItem, Goal, BankAccount } from './types';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { HomeView } from './components/HomeView';
import { TransactionsView } from './components/TransactionsView';
import { GoalsView } from './components/GoalsView';
import { ProfileView } from './components/ProfileView';
import { FinancialItemModal } from './components/FinancialItemModal';
import { AIChatModal } from './components/AIChatModal';
import { useFinancialData } from './hooks/useFinancialData';

// --- SVG ICONS ---
const Icons = {
    CloudSyncing: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M22 11.5A10 10 0 0 0 3.5 12.5"/><path d="M2 12.5a10 10 0 0 0 18.5-1"/></svg>,
    CloudError: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// --- UTILITY FUNCTIONS ---
const getMonthName = (month: number) => {
    // Create a date on the 1st day of the given month to avoid day-of-month overflow issues.
    const d = new Date(2000, month, 1);
    return d.toLocaleString('pt-BR', { month: 'long' });
}

// --- App Component ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [activeView, setActiveView] = useState('home');
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });

  const {
      monthData,
      isDataLoading,
      syncStatus,
      addItem,
      updateItem,
      deleteItem,
      togglePaid
  } = useFinancialData(user, currentDate);

  // --- Auth Subscription ---
  useEffect(() => {
    const authUnsubscribe = handleAuth(setUser);
    return () => {
      authUnsubscribe();
    };
  }, []);


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
  
  const handleAddItem = (item: Omit<FinancialItem | Goal | BankAccount, 'id'>, itemType: 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account') => {
      addItem(item, itemType);
      handleModalClose();
  };

  const handleUpdateItem = (item: FinancialItem | Goal | BankAccount, itemType: 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account') => {
      updateItem(item, itemType);
      handleModalClose();
  };

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
                onDeleteItem={deleteItem}
                onTogglePaid={togglePaid}
              />;
          case 'goals':
              return <GoalsView 
                data={monthData}
                onAddGoal={() => handleModalOpen('add-goal')}
                onEditGoal={(goal) => handleModalOpen('edit-goal', goal)}
                onDeleteGoal={(id) => deleteItem(id, 'goal')}
              />;
          case 'profile':
              return <ProfileView 
                data={monthData}
                user={user}
                onAddAccount={() => handleModalOpen('add-account')}
                onEditAccount={(acc) => handleModalOpen('edit-account', acc)}
                onDeleteAccount={(id) => deleteItem(id, 'account')}
              />;
          default:
              return <HomeView data={monthData} />;
      }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background font-sans overflow-hidden">
      <Header 
        monthName={getMonthName(currentDate.getMonth())}
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
          monthName={getMonthName(currentDate.getMonth())}
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