
import React, { useState } from 'react';
import { MonthData, FinancialItem, Income, Expense, ShoppingItem, AvulsoItem } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { SPENDING_CATEGORIES } from '../constants';

type ListType = 'incomes' | 'expenses' | 'shopping' | 'avulsos';

interface TransactionsViewProps {
    data: MonthData;
    onAddItem: (type: 'add-income' | 'add-expense' | 'add-shopping' | 'add-avulso') => void;
    onEditItem: (item: FinancialItem, type: 'income' | 'expense' | 'shopping' | 'avulso') => void;
    onDeleteItem: (id: string, type: 'income' | 'expense' | 'shopping' | 'avulso') => void;
    onTogglePaid: (item: FinancialItem, type: 'income' | 'expense' | 'shopping' | 'avulso') => void;
}

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
};


const ItemRow: React.FC<{ item: FinancialItem, type: 'income' | 'expense' | 'shopping' | 'avulso', onEdit: () => void, onDelete: () => void, onTogglePaid: () => void }> = ({ item, type, onEdit, onDelete, onTogglePaid }) => {
    const isExpense = type !== 'income';
    const expense = item as Expense;
    const isOverdue = isExpense && expense.dueDate && !item.paid && new Date(expense.dueDate) < new Date();
    
    return (
        <div className="flex items-start gap-3 p-4 border-b border-border last:border-b-0 hover:bg-surface-light">
            <button onClick={onTogglePaid} className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${item.paid ? 'bg-success border-success text-white' : 'border-text-lighter hover:border-success'}`}>
                {item.paid && <Icons.Check />}
            </button>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <span className={`font-medium text-text-main ${item.paid ? 'line-through text-text-lighter' : ''}`}>{item.description}</span>
                    <span className={`font-bold text-lg ${type === 'income' ? 'text-success' : 'text-danger'}`}>{formatCurrency(item.amount)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                     <div className="flex items-center gap-2 text-xs text-text-light">
                        {expense.category && <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white/80 ${SPENDING_CATEGORIES[expense.category]?.color || 'bg-gray-500'}`}>{SPENDING_CATEGORIES[expense.category]?.name}</span>}
                        {expense.type && <span className="capitalize">{expense.type}</span>}
                        {expense.current && expense.total && <span>{expense.current}/{expense.total}</span>}
                        {expense.paidDate && item.paid && <span>Pago em: {formatDate(expense.paidDate)}</span>}
                        {expense.dueDate && !item.paid && <span className={`flex items-center gap-1 ${isOverdue ? 'text-warning font-semibold' : ''}`}><Icons.Calendar /> Vence: {formatDate(expense.dueDate)}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onEdit} className="btn-icon"><Icons.Edit /></button>
                        <button onClick={onDelete} className="btn-icon"><Icons.Delete /></button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export const TransactionsView: React.FC<TransactionsViewProps> = ({ data, onAddItem, onEditItem, onDeleteItem, onTogglePaid }) => {
    const [activeList, setActiveList] = useState<ListType>('expenses');

    const lists = {
        incomes: { title: 'Receitas', items: data.incomes.slice().sort((a,b) => b.amount - a.amount) as Income[] },
        expenses: { title: 'Despesas', items: data.expenses.slice().sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()) as Expense[] },
        shopping: { title: 'Compras (Mumbuca)', items: data.shoppingItems.slice().sort((a,b) => new Date(b.paidDate || 0).getTime() - new Date(a.paidDate || 0).getTime()) as ShoppingItem[] },
        avulsos: { title: 'Avulsos', items: data.avulsosItems.slice().sort((a,b) => new Date(b.paidDate || 0).getTime() - new Date(a.paidDate || 0).getTime()) as AvulsoItem[] },
    };
    
    const activeItems = lists[activeList].items;

    const handleAddItem = () => {
        const modalType = `add-${activeList.slice(0, -1)}` as any;
        onAddItem(modalType);
    }
    
    return (
        <div className="space-y-4">
            <div className="p-1 bg-background rounded-xl border border-border flex items-center gap-1 sticky top-0 z-10">
                {Object.keys(lists).map(key => (
                    <button 
                        key={key}
                        onClick={() => setActiveList(key as ListType)}
                        className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${activeList === key ? 'bg-surface-light text-text-main' : 'text-text-light hover:bg-surface-light/50'}`}
                    >
                        {lists[key as ListType].title}
                    </button>
                ))}
            </div>
            
            <div className="bg-surface rounded-2xl border border-border">
                <div className="p-4 border-b border-border">
                    <button onClick={handleAddItem} className="btn-primary w-full md:w-auto"><Icons.Plus /> Adicionar {lists[activeList].title.slice(0, -1)}</button>
                </div>
                 <div className="divide-y divide-border">
                    {activeItems.length > 0 ? activeItems.map(item => (
                        <ItemRow 
                            key={item.id} 
                            item={item} 
                            type={activeList.slice(0,-1) as any}
                            onEdit={() => onEditItem(item, activeList.slice(0, -1) as any)}
                            onDelete={() => onDeleteItem(item.id, activeList.slice(0, -1) as any)}
                            onTogglePaid={() => onTogglePaid(item, activeList.slice(0, -1) as any)}
                        />
                    )) : (
                        <p className="p-8 text-center text-text-light">Nenhum item encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
