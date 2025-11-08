

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from "firebase/auth";
import { subscribeToMonthData, saveMonthData, getMonthData, isFirebaseConfigured } from '../services/firebaseService';
import { MonthData, FinancialItem, Goal, BankAccount, Expense } from '../types';
import { initialMonthData, CORRECT_DATA_VERSION } from '../constants';

type ItemType = 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account';

const getListKeyForItemType = (itemType: ItemType): keyof MonthData | null => {
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

export const useFinancialData = (user: User | null, currentDate: Date) => {
    const [monthData, setMonthData] = useState<MonthData | null>(null);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'disconnected'>('disconnected');
    const [isDataLoading, setIsDataLoading] = useState(true);

    const monthKey = useMemo(() => `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`, [currentDate]);

    const updateAndSaveChanges = useCallback(async (newData: MonthData) => {
        setMonthData(newData); // Optimistic UI update
        if (user && isFirebaseConfigured) {
            setSyncStatus('syncing');
            try {
                await saveMonthData(user.uid, monthKey, newData);
                setSyncStatus('synced');
            } catch (error)
 {
                console.error("Failed to save changes:", error);
                setSyncStatus('error');
            }
        }
    }, [user, monthKey]);

    useEffect(() => {
        if (!user) {
            // This handles both the case where Firebase is not configured and
            // where authentication fails (e.g., on a non-whitelisted domain), 
            // preventing the app from getting stuck on the loading screen.
            setMonthData(initialMonthData);
            setSyncStatus(isFirebaseConfigured ? 'error' : 'disconnected');
            setIsDataLoading(false);
            return;
        }

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
                        .map((exp: Expense) => {
                            if (!exp.dueDate) {
                                return { ...exp, id: `exp_${Date.now()}_${Math.random()}`, paid: false, paidDate: null };
                            }
                             const [year, month, day] = exp.dueDate.split('-').map(Number);
                            const nextDate = new Date(Date.UTC(year, month - 1, day));
                            
                            nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);

                            if (nextDate.getUTCDate() !== day) {
                                nextDate.setUTCDate(0);
                            }

                            return {
                                ...exp,
                                id: `exp_${Date.now()}_${Math.random()}`,
                                paid: false,
                                paidDate: null,
                                dueDate: nextDate.toISOString().slice(0, 10),
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
    
    const addItem = (item: Omit<FinancialItem | Goal | BankAccount, 'id'>, itemType: ItemType) => {
      if (!monthData) return;
      const listKey = getListKeyForItemType(itemType);
      if (!listKey) return;

      const newItem = { ...item, id: `${itemType}_${Date.now()}` };
      const newList = [...(monthData[listKey] as any[]), newItem];
      
      updateAndSaveChanges({ ...monthData, [listKey]: newList });
    };

    const updateItem = (item: FinancialItem | Goal | BankAccount, itemType: ItemType) => {
        if (!monthData) return;
        const listKey = getListKeyForItemType(itemType);
        if (!listKey) return;

        const list = monthData[listKey] as any[];
        const itemIndex = list.findIndex(i => i.id === item.id);
        if (itemIndex === -1) return;

        const newList = [...list];
        newList[itemIndex] = item;

        updateAndSaveChanges({ ...monthData, [listKey]: newList });
    };

    const deleteItem = (itemId: string, itemType: ItemType) => {
        if (!monthData || !window.confirm("Tem certeza que deseja excluir este item?")) return;
        const listKey = getListKeyForItemType(itemType);
        if (!listKey) return;
        
        const newList = (monthData[listKey] as any[]).filter(item => item.id !== itemId);
        updateAndSaveChanges({ ...monthData, [listKey]: newList });
    };

    const togglePaid = (item: FinancialItem, itemType: 'income' | 'expense' | 'shopping' | 'avulso') => {
        const updatedItem = { 
            ...item, 
            paid: !item.paid,
            ...((itemType !== 'income') && { paidDate: !item.paid ? new Date().toISOString().split('T')[0] : null })
        };
        updateItem(updatedItem, itemType);
    }

    return { monthData, isDataLoading, syncStatus, addItem, updateItem, deleteItem, togglePaid };
};