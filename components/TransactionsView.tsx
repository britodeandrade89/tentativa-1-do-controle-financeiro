// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { MonthData, FinancialItem, Income, Expense, ShoppingItem, AvulsoItem } from '../types';
import { formatCurrency, formatDate } from '../utils';

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
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    PaidCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success"><polyline points="20 6 9 17 4 12"></polyline></svg>,
};

const ItemRow: React.FC<{ item: FinancialItem, type: ListType, onEdit: () => void, onDelete: () => void, onTogglePaid: () => void }> = ({ item, type, onEdit, onDelete, onTogglePaid }) => {
    const isExpense = 'dueDate' in item;
    const isIncome = type === 'incomes';
    const expense = item as Expense;
    const isOverdue = isExpense && expense.dueDate && !expense.paid && new Date(expense.dueDate) < new Date();

    return (
        <div className="flex items-start gap-3 p-4">
            <button 
                onClick={onTogglePaid} 
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${item.paid ? 'bg-success border-success text-white' : 'border-border hover:border-success'}`}
            >
                {item.paid && <Icons.Check />}
            </button>

            <div className="flex-grow flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="font-bold uppercase text-text-main text-sm pr-4">{item.description}</span>
                    <span className={`font-bold text-sm whitespace-nowrap ${isIncome ? 'text-success' : 'text-danger'}`}>{formatCurrency(item.amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isExpense && expense.type && (
                            <span className={`tag ${expense.type === 'fixed' ? 'tag-fixed' : 'tag-variable'}`}>{expense.type === 'fixed' ? 'Fixo' : 'Variável'}</span>
                        )}
                        {isExpense && expense.current && expense.total && (
                             <span className="tag">{expense.current}/{expense.total}</span>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-xs text-text-light">
                            {item.paid && ('paidDate' in item) && item.paidDate ? (
                                <>
                                    <Icons.PaidCheck />
                                    <span>Pago em {formatDate(item.paidDate)}</span>
                                </>
                            ) : isExpense && expense.dueDate ? (
                                <>
                                    <Icons.Calendar />
                                    <span className={isOverdue ? 'text-warning font-semibold' : ''}>Vence em {formatDate(expense.dueDate)}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <button onClick={onEdit} className="btn-icon"><Icons.Edit /></button>
                        <button onClick={onDelete} className="btn-icon"><Icons.Delete /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TransactionsView: React.FC<TransactionsViewProps> = ({ data, onAddItem, onEditItem, onDeleteItem, onTogglePaid }) => {
    const [activeList, setActiveList] = useState<ListType>('expenses');

    const tabs: { id: ListType; label: string; addType: Parameters<typeof onAddItem>[0] }[] = [
        { id: 'incomes', label: 'Receitas', addType: 'add-income' },
        { id: 'expenses', label: 'Despesas', addType: 'add-expense' },
        { id: 'shopping', label: 'Compras com Mumbuca', addType: 'add-shopping' },
        { id: 'avulsos', label: 'Avulsos', addType: 'add-avulso' },
    ];

    const activeTabData = tabs.find(t => t.id === activeList);

    const sortedAndGroupedExpenses = useMemo(() => {
        const fixed = data.expenses.filter(e => e.type === 'fixed');
        const variable = data.expenses.filter(e => e.type === 'variable');
        
        const sortFn = (a: Expense, b: Expense) => {
            if (a.paid !== b.paid) return a.paid ? 1 : -1;
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            return dateA - dateB;
        }

        return [
            { title: 'Despesas Fixas', items: fixed.sort(sortFn) },
            { title: 'Despesas Variáveis', items: variable.sort(sortFn) }
        ];
    }, [data.expenses]);

    const renderList = () => {
        const listMap = {
            incomes: data.incomes,
            expenses: [], // Handled separately
            shopping: data.shoppingItems,
            avulsos: data.avulsosItems,
        };

        if (activeList === 'expenses') {
             return sortedAndGroupedExpenses.map(group => (
                    group.items.length > 0 && (
                        <div key={group.title}>
                            <h3 className="px-4 py-2 text-sm font-semibold text-text-light bg-surface-light sticky top-0 z-10">{group.title}</h3>
                            <div className="divide-y divide-border">
                                {group.items.map(item => <ItemRow key={item.id} item={item} type="expenses" onEdit={() => onEditItem(item, 'expenses')} onDelete={() => onDeleteItem(item.id, 'expenses')} onTogglePaid={() => onTogglePaid(item, 'expenses')} />)}
                            </div>
                        </div>
                    )
                ));
        }

        const items = listMap[activeList] || [];
        if (items.length === 0) {
            return <p className="text-center text-text-light p-8">Nenhum item nesta categoria.</p>;
        }
        return (
            <div className="divide-y divide-border">
                {items.map(item => <ItemRow key={item.id} item={item} type={activeList} onEdit={() => onEditItem(item, activeList)} onDelete={() => onDeleteItem(item.id, activeList)} onTogglePaid={() => onTogglePaid(item, activeList)} />)}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-2 bg-surface rounded-xl flex items-center gap-1 mb-4 sticky top-0 z-10">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveList(tab.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${activeList === tab.id ? 'bg-surface-light text-text-main' : 'text-text-light hover:bg-background'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-shrink-0 px-2 mb-4">
                {activeTabData && (
                    <button onClick={() => onAddItem(activeTabData.addType)} className="btn-primary w-full">
                        <Icons.Plus /> Nova {activeTabData.label.endsWith('s') ? activeTabData.label.slice(0, -1) : activeTabData.label}
                    </button>
                )}
            </div>

            <div className="flex-grow overflow-y-auto bg-surface rounded-2xl border border-border">
                {renderList()}
            </div>
        </div>
    );
};
