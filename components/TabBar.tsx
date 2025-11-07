
import React from 'react';

const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Transactions: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Goals: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12"cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    AI: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 8.3 9c.5 1.1 1.4 2 2.7 2s2.2-.9 2.7-2c.1-.4.2-.8.3-1.3.6-1.1 0-2.3-1-3.1-.3-.2-.6-.3-1-.3z"></path><path d="M12 21c-1.2 0-2.4-.6-3-1.7A3.6 3.6 0 0 1 8.3 15c.5-1.1 1.4-2 2.7-2s2.2.9 2.7 2c.1.4.2.8.3 1.3.6 1.1 0 2.3-1 3.1-.3-.2-.6-.3-1 .3z"></path><path d="M3 12c0-1.2.6-2.4 1.7-3A3.6 3.6 0 0 1 9 8.3c1.1.5 2 1.4 2 2.7s-.9 2.2-2 2.7c-.4.1-.8.2-1.3.3-1.1.6-2.3 0-3.1-1 .2-.3-.3-.6-.3-1z"></path><path d="M21 12c0-1.2-.6-2.4-1.7-3A3.6 3.6 0 0 0 15 8.3c-1.1.5-2 1.4-2 2.7s.9 2.2 2 2.7c.4.1.8.2 1.3.3 1.1.6 2.3 0-3.1-1 .2-.3.3-.6-.3-1z"></path></svg>,
    Profile: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
};


interface TabBarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    onTabClick: (view: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeView, onTabClick }) => {
    const tabs = [
        { id: 'home', icon: <Icons.Home />, label: 'Início' },
        { id: 'transactions', icon: <Icons.Transactions />, label: 'Lançamentos' },
        { id: 'goals', icon: <Icons.Goals />, label: 'Metas' },
        { id: 'ai', icon: <Icons.AI />, label: 'Análise AI' },
        { id: 'profile', icon: <Icons.Profile />, label: 'Perfil' },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-20 flex justify-around items-start z-20 pt-2 px-2 pb-[env(safe-area-inset-bottom)]">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors rounded-lg ${activeView === tab.id ? 'text-primary' : 'text-text-light hover:text-text-main'}`}
                >
                    <div className={`transition-transform ${activeView === tab.id ? 'scale-110' : ''}`}>{tab.icon}</div>
                    <span className="text-xs font-medium">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};
