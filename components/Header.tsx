
// Fix: Added 'useMemo' to React import to resolve 'Cannot find name' error.
import React, { useMemo } from 'react';

const Icons = {
    Logo: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>,
    ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
    ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
    CloudSynced: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M17.5 22a5.3 5.3 0 0 0 4.2-2.1"/><path d="M17.5 22a5.3 5.3 0 0 1-4.2-2.1"/><path d="m15 16.5-3-3-1.5 1.5"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>,
    CloudSyncing: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M22 11.5A10 10 0 0 0 3.5 12.5"/><path d="M2 12.5a10 10 0 0 0 18.5-1"/></svg>,
    CloudError: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};


interface HeaderProps {
    monthName: string;
    year: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    syncStatus: 'synced' | 'syncing' | 'error' | 'disconnected';
}

export const Header: React.FC<HeaderProps> = ({ monthName, year, onPrevMonth, onNextMonth, syncStatus }) => {
    
    const SyncState = useMemo(() => {
        switch (syncStatus) {
            case 'synced':
                return { icon: <Icons.CloudSynced />, title: 'Dados salvos na nuvem' };
            case 'syncing':
                return { icon: <Icons.CloudSyncing />, title: 'Sincronizando...' };
            case 'error':
                return { icon: <Icons.CloudError />, title: 'Erro na sincronização' };
            case 'disconnected':
            default:
                return { icon: <Icons.CloudError />, title: 'Sincronização desativada' };
        }
    }, [syncStatus]);
    
    return (
        <header className="flex-shrink-0 bg-surface border-b border-border flex justify-between items-center p-4 sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-light to-primary rounded-xl p-2 text-white">
                    <Icons.Logo />
                </div>
                <h1 className="hidden md:block text-lg font-bold text-text-main">Finanças AI</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1 bg-background border border-border rounded-xl p-1">
                    <button onClick={onPrevMonth} className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-light hover:text-text-main"><Icons.ChevronLeft /></button>
                    <div className="font-semibold text-text-main text-center w-32 md:w-40 capitalize">{monthName} {year}</div>
                    <button onClick={onNextMonth} className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-light hover:text-text-main"><Icons.ChevronRight /></button>
                </div>
                <div className="p-2" title={SyncState.title}>{SyncState.icon}</div>
            </div>
        </header>
    );
};