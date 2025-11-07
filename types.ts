
export interface Income {
  id: string;
  description: string;
  amount: number;
  paid: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  type: 'fixed' | 'variable';
  category: string;
  paid: boolean;
  cyclic: boolean;
  dueDate: string | null;
  paidDate: string | null;
  current?: number | null;
  total?: number | null;
}

export interface ShoppingItem {
  id: string;
  description: string;
  amount: number;
  paid: boolean;
  category: 'shopping';
  paidDate: string | null;
}

export interface AvulsoItem {
  id: string;
  description: string;
  amount: number;
  paid: boolean;
  category: string;
  paidDate: string | null;
}

export interface Goal {
  id: string;
  category: string;
  amount: number;
  isAuto?: boolean;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
}

export interface MonthData {
  dataVersion: string;
  incomes: Income[];
  expenses: Expense[];
  shoppingItems: ShoppingItem[];
  avulsosItems: AvulsoItem[];
  goals: Goal[];
  bankAccounts: BankAccount[];
}

export type FinancialItem = Income | Expense | ShoppingItem | AvulsoItem;

export type ModalType = 
  | 'add-income' 
  | 'add-expense' 
  | 'add-shopping' 
  | 'add-avulso'
  | 'edit-item'
  | 'add-goal'
  | 'edit-goal'
  | 'add-account'
  | 'edit-account'
  | 'ai-chat';

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data?: any;
}
