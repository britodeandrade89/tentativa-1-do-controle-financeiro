// @ts-nocheck
import { MonthData } from './types';

export const CORRECT_DATA_VERSION = "v2.2-transactions-replication";

// This data is meticulously crafted to match the numbers in the screenshots.
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
        // Paid Fixed Expenses
        { id: "exp_1", description: "SEGURO DO CARRO (NOVEMBRO)", amount: 142.90, type: "fixed", category: "transporte", paid: true, cyclic: true, dueDate: '2025-11-03', paidDate: '2025-11-03', current: 11, total: 12 },
        { id: "exp_2", description: "INVESTIMENTO PARA VIAGEM DE FÉRIAS (PaGol)", amount: 1000.00, type: "fixed", category: "investimento", paid: true, cyclic: false, dueDate: '2025-10-31', paidDate: '2025-10-31', current: 2, total: 5 },
        { id: "exp_3", description: "ALUGUEL", amount: 1300.00, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-11-03', paidDate: '2025-11-03', current: 10, total: 12 },
        { id: "exp_4", description: "PSICÓLOGA DA MARCELLY", amount: 210.00, type: "fixed", category: "saude", paid: true, cyclic: true, dueDate: '2025-11-05', paidDate: '2025-11-05', current: 10, total: 12 },
        { id: "exp_5", description: "INTERNET DE CASA (ESTAVA ATRASADA)", amount: 125.85, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-10-30', paidDate: '2025-10-30', current: 10, total: 12 },
        { id: "exp_6", description: "CONTA DA VIVO --- ANDRÉ (ATRASADAS DE AGOSTO, SETEMBRO E OUTUBRO)", amount: 86.86, type: "fixed", category: "pessoal", paid: true, cyclic: true, dueDate: '2025-10-30', paidDate: '2025-10-30', current: 10, total: 12 },
        { id: "exp_7", description: "CONTA DA CLARO", amount: 74.99, type: "fixed", category: "pessoal", paid: true, cyclic: true, dueDate: '2025-10-30', paidDate: '2025-10-30', current: 11, total: 12 },
        { id: "exp_8", description: "CONTA DA VIVO --- MARCELLY", amount: 66.56, type: "fixed", category: "pessoal", paid: true, cyclic: true, dueDate: '2025-11-05', paidDate: '2025-11-05', current: 10, total: 12 },

        // Unpaid Fixed Expenses
        { id: "exp_9", description: "REMÉDIOS DO ANDRÉ", amount: 0.00, type: "fixed", category: "saude", paid: false, cyclic: true, dueDate: '2025-11-05', paidDate: null, current: 10, total: 12 },
        { id: "exp_10", description: "INTERMÉDICA DO ANDRÉ (MARCIA BRITO)", amount: 123.00, type: "fixed", category: "saude", paid: false, cyclic: true, dueDate: '2025-11-15', paidDate: null, current: 10, total: 12 },
        { id: "exp_11", description: "APPAI DA MARCELLY", amount: 110.00, type: "fixed", category: "educacao", paid: false, cyclic: true, dueDate: '2025-11-15', paidDate: null, current: 10, total: 12 },
        { id: "exp_12", description: "APPAI DO ANDRÉ (MARCIA BRITO)", amount: 129.00, type: "fixed", category: "educacao", paid: false, cyclic: true, dueDate: '2025-11-20', paidDate: null, current: 10, total: 12 },
        { id: "exp_13", description: "CIDADANIA PORTUGUESA", amount: 140.00, type: "fixed", category: "outros", paid: false, cyclic: false, dueDate: '2025-11-20', paidDate: null, current: 13, total: 36 },
        { id: "exp_14", description: "EMPRÉSTIMO PARA ACABAR DE PASSAR ABRIL (MARCIA BRITO)", amount: 220.00, type: "fixed", category: "dividas", paid: false, cyclic: false, dueDate: '2025-11-25', paidDate: null, current: 6, total: 6 },
        { id: "exp_15", description: "RENEGOCIAÇÃO DO CARREFOUR (MARCIA BRITO)", amount: 250.00, type: "fixed", category: "dividas", paid: false, cyclic: false, dueDate: '2025-11-28', paidDate: null, current: 2, total: 12 },
        
        // Paid Variable Expenses
        { id: "exp_16", description: "DALUZ (LILI)", amount: 88.50, type: "variable", category: "pessoal", paid: true, cyclic: false, dueDate: '2025-11-03', paidDate: '2025-11-03', current: 1, total: 2 },
        { id: "exp_17", description: "VESTIDO CÍTRICA (LILI)", amount: 53.57, type: "variable", category: "pessoal", paid: true, cyclic: false, dueDate: '2025-11-03', paidDate: '2025-11-03', current: 1, total: 2 },
        { id: "exp_18", description: "PARCELAMENTO DO ITAÚ --- ANDRÉ", amount: 159.59, type: "variable", category: "dividas", paid: true, cyclic: false, dueDate: '2025-10-30', paidDate: '2025-10-30', current: 3, total: 3 },
        { id: "exp_19", description: "Pagamento de fatura atrasada do Inter", amount: 5.50, type: "variable", category: "dividas", paid: true, cyclic: false, dueDate: '2025-10-30', paidDate: '2025-10-30', current: null, total: null },
        { id: "exp_20", description: "ACORDO ITAÚ ANDRÉ (CARTÃO DE CRÉDITO E CHEQUE ESPECIAL)", amount: 233.14, type: "variable", category: "dividas", paid: true, cyclic: false, dueDate: '2025-10-30', paidDate: '2025-10-30', current: null, total: null },
        { id: "exp_21", description: "FATURA DO CARTÃO DO ANDRÉ", amount: 103.89, type: "variable", category: "dividas", paid: true, cyclic: false, dueDate: '2025-10-30', paidDate: '2025-10-30', current: 11, total: 12 },
        
        // Unpaid Variable Expenses
        { id: "exp_22", description: "TEATRO (JADY)", amount: 126.09, type: "variable", category: "lazer", paid: false, cyclic: false, dueDate: '2025-11-05', paidDate: null, current: 2, total: 2 },
        { id: "exp_23", description: "PRESENTE JULIANA (JADY)", amount: 34.65, type: "variable", category: "pessoal", paid: false, cyclic: false, dueDate: '2025-11-05', paidDate: null, current: null, total: null },
        { id: "exp_24", description: "PRESENTE NENEM GLEYCI (JADY)", amount: 38.94, type: "variable", category: "pessoal", paid: false, cyclic: false, dueDate: '2025-11-05', paidDate: null, current: 1, total: 2 },
        { id: "exp_25", description: "VESTIDO LONGO AMARELO (MÃE DA MARCELLY)", amount: 33.00, type: "variable", category: "pessoal", paid: false, cyclic: false, dueDate: '2025-11-10', paidDate: null, current: 2, total: 3 },
        { id: "exp_26", description: "BLUSA BRANCA DALUZ (MÃE DA MARCELLY)", amount: 34.50, type: "variable", category: "pessoal", paid: false, cyclic: false, dueDate: '2025-11-10', paidDate: null, current: 2, total: 2 },
        { id: "exp_27", description: "FATURA CARTÃO MARCELLY", amount: 100.00, type: "variable", category: "dividas", paid: false, cyclic: false, dueDate: '2025-11-15', paidDate: null, current: 10, total: 12 },
        { id: "exp_28", description: "CONSERTO DO CARRO COM PEÇAS DE OUTUBRO (MARCIA BRITO)", amount: 361.75, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-11-28', paidDate: null, current: 1, total: 4 },
        { id: "exp_29", description: "PEÇAS DO CARRO - CONSERTO DE DEZEMBRO (MARCIA BRITO)", amount: 67.70, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-11-28', paidDate: null, current: 10, total: 10 },
        { id: "exp_30", description: "MÃO DE OBRA DO DAVI (MARCIA BRITO)", amount: 108.33, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-11-28', paidDate: null, current: 3, total: 3 },
        { id: "exp_31", description: "PEÇA DO CARRO (MARCIA BRITO)", amount: 45.00, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-11-28', paidDate: null, current: 3, total: 3 },
        { id: "exp_32", description: "MULTAS (MARCIA BRITO)", amount: 260.00, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-11-30', paidDate: null, current: 2, total: 4 },
        { id: "exp_33", description: "EMPRÉSTIMO DA TIA CÉLIA", amount: 400.00, type: "variable", category: "dividas", paid: false, cyclic: false, dueDate: '2025-11-30', paidDate: null, current: 8, total: 10 }
    ],
    // These lists remain from the previous version as they were not part of the update request
    avulsosItems: [
        { id: "avulso_1", description: 'Supermercado rápido', amount: 332.49, paid: true, paidDate: '2025-11-05', category: 'alimentacao'},
        { id: "avulso_2", description: 'Outras despesas avulsas', amount: 215.77, paid: true, paidDate: '2025-11-06', category: 'outros'},
        { id: "avulso_3", description: 'Almoço fora', amount: 101.81, paid: true, paidDate: '2025-11-07', category: 'avulsos' },
    ],
    shoppingItems: [
        { id: "shop_1", description: "Mercado do Mês (Mumbuca)", amount: 263.16, paid: true, category: 'shopping', paidDate: '2025-11-04' }
    ],
    goals: [
        { id: "goal_1", category: "moradia", amount: 1700.00 },
        { id: "goal_2", category: "transporte", amount: 1100.00 },
    ],
    bankAccounts: [
        { id: "acc_1", name: "Conta Principal", balance: 466.53 },
        { id: "acc_2", name: "Poupança", balance: 1000.00 },
    ]
};


export const SPENDING_CATEGORIES: { [key: string]: { name: string, color: string } } = {
    moradia: { name: 'Moradia', color: 'bg-yellow-500' },
    dividas: { name: 'Dívidas', color: 'bg-blue-500' },
    transporte: { name: 'Transporte', color: 'bg-red-500' },
    investimento: { name: 'Investimento para Viagem', color: 'bg-indigo-500' },
    avulsos: { name: 'Avulsos', color: 'bg-amber-400' },
    saude: { name: 'Saúde', color: 'bg-teal-500' },
    alimentacao: { name: 'Alimentação', color: 'bg-rose-500' },
    shopping: { name: 'Compras com Mumbuca', color: 'bg-pink-500' },
    outros: { name: 'Outros', color: 'bg-sky-400' },
    lazer: { name: 'Lazer', color: 'bg-purple-500' },
    pessoal: { name: 'Pessoal', color: 'bg-green-500' },
    educacao: { name: 'Educação', color: 'bg-emerald-500' },
};
