
import { MonthData } from './types';

export const CORRECT_DATA_VERSION = "v2.0-final-react";

export const initialMonthData: MonthData = {
    dataVersion: CORRECT_DATA_VERSION,
    incomes: [
        { id: "inc_nov_1", description: 'SALARIO MARCELLY', amount: 3349.92, paid: true },
        { id: "inc_nov_2", description: 'SALARIO ANDRE', amount: 3349.92, paid: true },
        { id: "inc_nov_3", description: 'MUMBUCA MARCELLY', amount: 650.00, paid: true },
        { id: "inc_nov_4", description: 'MUMBUCA ANDRE', amount: 650.00, paid: true },
        { id: "inc_nov_5", description: 'Dinheiro que o seu Claudio deu', amount: 100.00, paid: true },
    ],
    expenses: [
        { id: "exp_nov_1", description: "SEGURO DO CARRO (NOVEMBRO)", amount: 142.90, type: "fixed", category: "transporte", paid: true, cyclic: true, dueDate: '2025-11-03', paidDate: '2025-11-03', current: 11, total: 12 },
        { id: "exp_nov_2", description: "INVESTIMENTO PARA VIAGEM DE FÉRIAS (PaGol)", amount: 1000.00, type: "fixed", category: "investimento", paid: true, cyclic: false, dueDate: '2025-10-31', paidDate: '2025-10-31', current: 2, total: 5 },
        { id: "exp_nov_3", description: "ALUGUEL", amount: 1300.00, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-11-03', paidDate: '2025-11-03', current: 10, total: 12 },
    ],
    shoppingItems: [
        { id: "shop_1", description: "Supermercado Guanabara", amount: 450.75, paid: true, category: 'shopping', paidDate: '2025-11-04' }
    ],
    avulsosItems: [
        { id: "avulso_28", description: 'Correios', amount: 69.02, paid: true, paidDate: '2025-11-05', category: 'outros'},
        { id: "avulso_27", description: 'Mercado', amount: 78.80, paid: true, paidDate: '2025-11-05', category: 'alimentacao'},
    ],
    goals: [
        { id: "goal_1", category: "shopping", amount: 900.00 },
        { id: "goal_2", category: "moradia", amount: 2200.00 },
    ],
    bankAccounts: [
        { id: "acc_1", name: "Conta Principal", balance: -2232.86 },
        { id: "acc_2", name: "Poupança", balance: 0.00 },
    ]
};


export const SPENDING_CATEGORIES: { [key: string]: { name: string, color: string } } = {
    moradia: { name: 'Moradia', color: 'bg-rose-500' },
    alimentacao: { name: 'Alimentação', color: 'bg-orange-500' },
    transporte: { name: 'Transporte', color: 'bg-amber-500' },
    abastecimento_mumbuca: { name: 'Abastecimento (Mumbuca)', color: 'bg-yellow-500' },
    saude: { name: 'Saúde', color: 'bg-lime-500' },
    lazer: { name: 'Lazer', color: 'bg-green-500' },
    educacao: { name: 'Educação', color: 'bg-emerald-500' },
    dividas: { name: 'Dívidas', color: 'bg-red-500' },
    pessoal: { name: 'Pessoal', color: 'bg-cyan-500' },
    investimento: { name: 'Investimento Viagem', color: 'bg-sky-500' },
    shopping: { name: 'Compras (Mumbuca)', color: 'bg-blue-500' },
    avulsos: { name: 'Avulsos', color: 'bg-indigo-500' },
    outros: { name: 'Outros', color: 'bg-violet-500' },
};
