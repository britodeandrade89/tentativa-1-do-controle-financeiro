
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { ModalState, FinancialItem, Goal, BankAccount, Expense } from '../types';
import { SPENDING_CATEGORIES } from '../constants';

type ItemType = 'income' | 'expense' | 'shopping' | 'avulso' | 'goal' | 'account';

interface FinancialItemModalProps {
    modalState: ModalState;
    onClose: () => void;
    onAddItem: (item: any, type: ItemType) => void;
    onUpdateItem: (item: any, type: ItemType) => void;
}

const parseCurrency = (value: string) => {
    if (typeof value !== 'string' || !value) return 0;
    const digits = value.replace(/\D/g, '');
    if (!digits) return 0;
    return parseFloat(digits) / 100;
}

const formatCurrencyForInput = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const FinancialItemModal: React.FC<FinancialItemModalProps> = ({ modalState, onClose, onAddItem, onUpdateItem }) => {
    const [formData, setFormData] = useState<any>({});
    const [amountStr, setAmountStr] = useState('');

    const { type, data } = modalState;
    const isEdit = type?.startsWith('edit-') ?? false;
    
    const itemType: ItemType | null = useMemo(() => {
        if (!type) return null;
        if (type.includes('income')) return 'income';
        if (type.includes('expense')) return 'expense';
        if (type.includes('shopping')) return 'shopping';
        if (type.includes('avulso')) return 'avulso';
        if (type.includes('goal')) return 'goal';
        if (type.includes('account')) return 'account';
        if (type === 'edit-item') return data?.type as ItemType; // Special case for generic edit
        return null;
    }, [type, data]);

    const title = useMemo(() => {
        const action = isEdit ? 'Editar' : 'Adicionar';
        switch (itemType) {
            case 'income': return `${action} Receita`;
            case 'expense': return `${action} Despesa`;
            case 'shopping': return `${action} Compra (Mumbuca)`;
            case 'avulso': return `${action} Despesa Avulsa`;
            case 'goal': return `${action} Meta`;
            case 'account': return `${action} Conta`;
            default: return 'Item Financeiro';
        }
    }, [isEdit, itemType]);

    useEffect(() => {
        if (isEdit && data) {
            const itemData = (type === 'edit-item') ? data.item : data;
            setFormData(itemData);
            setAmountStr(formatCurrencyForInput(itemData.amount ?? itemData.balance));
        } else {
            setFormData({});
            setAmountStr('');
        }
    }, [modalState, isEdit, data, type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountStr(e.target.value);
    }
    
    const handleAmountBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseCurrency(e.target.value);
        setAmountStr(formatCurrencyForInput(parsedValue));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemType) return;
        
        const finalAmount = parseCurrency(amountStr);
        const finalData = { ...formData };
        if (itemType === 'account') {
            finalData.balance = finalAmount;
        } else {
            finalData.amount = finalAmount;
        }
        delete finalData.amountStr;

        if (itemType === 'shopping') finalData.category = 'shopping';
        if (['shopping', 'avulso'].includes(itemType) && !isEdit) {
            finalData.paid = true;
            finalData.paidDate = new Date().toISOString().split('T')[0];
        }

        if (isEdit) {
            onUpdateItem(finalData, itemType);
        } else {
            onAddItem(finalData, itemType);
        }
    };
    
    const renderFormFields = () => {
        if (!itemType) return null;
        
        const isGeneralExpense = itemType === 'expense';
        const isAvulso = itemType === 'avulso';
        const isGoal = itemType === 'goal';
        const isAccount = itemType === 'account';

        const amountLabel = isAccount ? 'Saldo' : 'Valor';

        return (
            <>
                {itemType !== 'goal' && (
                     <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-text-light mb-1">{isAccount ? 'Nome da Conta' : 'Descrição'}</label>
                        <input type="text" name={isAccount ? 'name' : 'description'} id="description" value={formData.name || formData.description || ''} onChange={handleChange} className="form-input" required />
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-text-light mb-1">{amountLabel}</label>
                    <input type="text" name="amount" id="amount" value={amountStr} onChange={handleAmountChange} onBlur={handleAmountBlur} className="form-input" inputMode="decimal" required />
                </div>
                 {(isGeneralExpense || isAvulso || isGoal) && (
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-text-light mb-1">Categoria</label>
                        <select name="category" id="category" value={formData.category || ''} onChange={handleChange} className="form-input" required>
                            <option value="" disabled>Selecione...</option>
                            {Object.entries(SPENDING_CATEGORIES).map(([key, value]) => (
                                <option key={key} value={key}>{value.name}</option>
                            ))}
                        </select>
                    </div>
                 )}
                 {isGeneralExpense && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="type" className="block text-sm font-medium text-text-light mb-1">Tipo</label>
                            <select name="type" id="type" value={formData.type || 'variable'} onChange={handleChange} className="form-input">
                                <option value="variable">Variável</option>
                                <option value="fixed">Fixo</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dueDate" className="block text-sm font-medium text-text-light mb-1">Data de Vencimento</label>
                            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} className="form-input" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                             <div>
                                <label htmlFor="current" className="block text-sm font-medium text-text-light mb-1">Parcela Atual</label>
                                <input type="number" name="current" id="current" value={formData.current || ''} onChange={handleChange} className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="total" className="block text-sm font-medium text-text-light mb-1">Total Parcelas</label>
                                <input type="number" name="total" id="total" value={formData.total || ''} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="checkbox" name="cyclic" id="cyclic" checked={formData.cyclic || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label htmlFor="cyclic" className="text-sm text-text-light">Repete todo mês?</label>
                        </div>
                    </>
                 )}
            </>
        )
    }

    return (
        <Modal isOpen={modalState.isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                   {renderFormFields()}
                </div>
                <div className="bg-surface-light px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                    <button type="submit" className="btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};