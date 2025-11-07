
import React from 'react';
import type { User } from 'firebase/auth';
import { MonthData, BankAccount } from '../types';
import { isFirebaseConfigured } from '../services/firebaseService';
import { formatCurrency } from '../utils';

interface ProfileViewProps {
    data: MonthData;
    user: User | null;
    onAddAccount: () => void;
    onEditAccount: (account: BankAccount) => void;
    onDeleteAccount: (id: string) => void;
}

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
};


export const ProfileView: React.FC<ProfileViewProps> = ({ data, user, onAddAccount, onEditAccount, onDeleteAccount }) => {
    
    const totalBalance = data.bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <section>
                <h2 className="text-2xl font-bold text-text-main mb-4">Sincronização na Nuvem</h2>
                <div className="bg-surface p-6 rounded-2xl border border-border text-sm text-text-light space-y-3">
                    {isFirebaseConfigured && user ? (
                        <>
                            <p>Seus dados são salvos automaticamente na nuvem, permitindo o acesso de qualquer dispositivo.</p>
                            <p className="flex items-center gap-2">
                                <span className="font-semibold text-text-main">Status:</span> 
                                <span className="text-success font-medium">Conectado e Sincronizado</span>
                            </p>
                             <p className="flex items-start gap-2">
                                <span className="font-semibold text-text-main">ID da Sessão:</span>
                                <span className="text-text-lighter break-all">{user.uid}</span>
                            </p>
                        </>
                    ) : (
                        <p>A sincronização na nuvem está desativada. Configure o Firebase para habilitar o backup em tempo real.</p>
                    )}
                </div>
            </section>

             <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-text-main">Contas Bancárias</h2>
                    <button onClick={onAddAccount} className="btn-primary"><Icons.Plus /> Nova Conta</button>
                </div>
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                        {data.bankAccounts.map(account => (
                            <div key={account.id} className="p-4 flex justify-between items-center hover:bg-surface-light">
                                <span className="font-medium text-text-main">{account.name}</span>
                                <div className="flex items-center gap-4">
                                    <span className={`font-semibold ${account.balance < 0 ? 'text-danger' : 'text-text-main'}`}>{formatCurrency(account.balance)}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => onEditAccount(account)} className="btn-icon"><Icons.Edit /></button>
                                        <button onClick={() => onDeleteAccount(account.id)} className="btn-icon"><Icons.Delete /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="p-4 bg-surface-light flex justify-between items-center font-bold">
                        <span className="text-text-main">Saldo Total</span>
                        <span className={totalBalance < 0 ? 'text-danger' : 'text-text-main'}>{formatCurrency(totalBalance)}</span>
                     </div>
                </div>
            </section>
        </div>
    );
};
