
import React, { useMemo } from 'react';
import { MonthData, Goal } from '../types';
import { SPENDING_CATEGORIES } from '../constants';
import { formatCurrency } from '../utils';

interface GoalsViewProps {
    data: MonthData;
    onAddGoal: () => void;
    onEditGoal: (goal: Goal) => void;
    onDeleteGoal: (id: string) => void;
}

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    Goal: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12"cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
};

export const GoalsView: React.FC<GoalsViewProps> = ({ data, onAddGoal, onEditGoal, onDeleteGoal }) => {

    const categorySpending = useMemo(() => {
        const spending: { [key: string]: number } = {};
        [...data.expenses, ...data.shoppingItems, ...data.avulsosItems].forEach(item => {
            spending[item.category] = (spending[item.category] || 0) + item.amount;
        });
        return spending;
    }, [data]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-main">Metas de Gastos</h2>
                <button onClick={onAddGoal} className="btn-primary"><Icons.Plus /> Nova Meta</button>
            </div>
            
            {data.goals.length === 0 ? (
                 <div className="text-center py-16 px-6 bg-surface rounded-2xl border border-border">
                    <Icons.Goal />
                    <h3 className="mt-4 text-lg font-semibold text-text-main">Sem metas definidas</h3>
                    <p className="mt-1 text-sm text-text-light">Crie metas para acompanhar seus gastos por categoria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.goals.map(goal => {
                        const spent = categorySpending[goal.category] || 0;
                        const progress = goal.amount > 0 ? (spent / goal.amount) * 100 : 0;
                        const remaining = goal.amount - spent;
                        
                        let progressClass = 'bg-success';
                        if (progress > 100) progressClass = 'bg-danger';
                        else if (progress > 75) progressClass = 'bg-warning';

                        return (
                             <div key={goal.id} className="bg-surface p-5 rounded-2xl border border-border flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-medium text-text-light">{SPENDING_CATEGORIES[goal.category]?.name || goal.category}</div>
                                        <div className="text-xs text-text-lighter">Meta: {formatCurrency(goal.amount)}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => onEditGoal(goal)} className="btn-icon"><Icons.Edit /></button>
                                        <button onClick={() => onDeleteGoal(goal.id)} className="btn-icon"><Icons.Delete /></button>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-text-main">{formatCurrency(spent)}</div>
                                    <div className={`text-xs font-medium ${remaining >= 0 ? 'text-text-light' : 'text-danger'}`}>
                                        {remaining >= 0 ? `${formatCurrency(remaining)} restantes` : `${formatCurrency(Math.abs(remaining))} acima`}
                                    </div>
                                </div>
                                <div className="w-full bg-surface-light rounded-full h-2 mt-auto">
                                    <div className={`${progressClass} h-2 rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
