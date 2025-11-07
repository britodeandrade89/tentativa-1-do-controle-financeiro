import { MonthData } from './types';

export const CORRECT_DATA_VERSION = "v2.1-design-replication";

// This data is meticulously crafted to match the numbers in the screenshot.
export const initialMonthData: MonthData = {
    dataVersion: CORRECT_DATA_VERSION,
    incomes: [
        { id: "inc_nov_1", description: 'SALARIO MARCELLY', amount: 3349.92, paid: true },
        { id: "inc_nov_2", description: 'SALARIO ANDRE', amount: 3349.92, paid: true },
        { id: "inc_nov_3", description: 'MUMBUCA MARCELLY', amount: 650.00, paid: true },
        { id: "inc_nov_4", description: 'MUMBUCA ANDRE', amount: 650.00, paid: true },
        { id: "inc_nov_5", description: 'Dinheiro que o seu Claudio deu', amount: 100.00, paid: true },
    ],
    // Expenses are grouped by category to sum up to the exact legend values.
    expenses: [
        // Moradia: 1654.26
        { id: "exp_moradia_1", description: "ALUGUEL", amount: 1300.00, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-11-03', paidDate: '2025-11-03' },
        { id: "exp_moradia_2", description: "Condomínio", amount: 354.26, type: "fixed", category: "moradia", paid: true, cyclic: true, dueDate: '2025-11-10', paidDate: '2025-11-10' },

        // Dívidas: 1408.23
        { id: "exp_dividas_1", description: "Renegociação Cartão", amount: 1408.23, type: "fixed", category: "dividas", paid: false, cyclic: false, dueDate: '2025-11-28', paidDate: null },
        
        // Transporte: 1018.08
        { id: "exp_transporte_1", description: "SEGURO DO CARRO", amount: 142.90, type: "fixed", category: "transporte", paid: true, cyclic: true, dueDate: '2025-11-03', paidDate: '2025-11-03'},
        { id: "exp_transporte_2", description: "Conserto do Carro (Marcia Brito)", amount: 875.18, type: "variable", category: "transporte", paid: false, cyclic: false, dueDate: '2025-11-20', paidDate: null },

        // Investimento: 1000.00
        { id: "exp_investimento_1", description: "INVESTIMENTO PARA VIAGEM DE FÉRIAS", amount: 1000.00, type: "fixed", category: "investimento", paid: true, cyclic: false, dueDate: '2025-10-31', paidDate: '2025-10-31' },

        // Saúde: 572.00
        { id: "exp_saude_1", description: "Plano de Saúde", amount: 450.00, type: "fixed", category: "saude", paid: false, cyclic: true, dueDate: '2025-11-15', paidDate: null },
        { id: "exp_saude_2", description: "Farmácia", amount: 122.00, type: "variable", category: "saude", paid: true, cyclic: false, dueDate: '2025-11-05', paidDate: '2025-11-05' },

        // Lazer: 126.09
        { id: "exp_lazer_1", description: "Cinema", amount: 126.09, type: "variable", category: "lazer", paid: false, cyclic: false, dueDate: '2025-11-12', paidDate: null },

        // Pessoal: 94.84
        { id: "exp_pessoal_1", description: "Capinha de Celular", amount: 94.84, type: "variable", category: "pessoal", paid: true, cyclic: false, dueDate: '2025-11-01', paidDate: '2025-11-01' },
    ],
    // Total Avulsos: 650.07
    avulsosItems: [
        { id: "avulso_1", description: 'Supermercado rápido', amount: 332.49, paid: true, paidDate: '2025-11-05', category: 'alimentacao'},
        { id: "avulso_2", description: 'Outras despesas avulsas', amount: 215.77, paid: true, paidDate: '2025-11-06', category: 'outros'},
        { id: "avulso_3", description: 'Almoço fora', amount: 101.81, paid: true, paidDate: '2025-11-07', category: 'avulsos' },
    ],
    // Total Compras Mumbuca: 263.16
    shoppingItems: [
        { id: "shop_1", description: "Mercado do Mês (Mumbuca)", amount: 263.16, paid: true, category: 'shopping', paidDate: '2025-11-04' }
    ],
    // Total a pagar Marcia Brito: 689.60 + 875.18 = 1564.78
    goals: [
        { id: "goal_1", category: "moradia", amount: 1700.00 },
        { id: "goal_2", category: "transporte", amount: 1100.00 },
    ],
    bankAccounts: [
        { id: "acc_1", name: "Conta Principal", balance: 466.53 }, // Adjusted for realism based on salary - paid expenses
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