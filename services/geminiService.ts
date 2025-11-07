
import { GoogleGenAI } from "@google/genai";
import { MonthData } from '../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.warn("API_KEY environment variable not set. Gemini AI features will be disabled.");
}

const generateFinancialContext = (monthData: MonthData, monthName: string, year: number): string => {
    const totalIncome = monthData.incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = [
        ...monthData.expenses,
        ...monthData.shoppingItems,
        ...monthData.avulsosItems
    ].reduce((sum, item) => sum + item.amount, 0);
    const finalBalance = totalIncome - totalExpenses;

    const topExpenses = [...monthData.expenses, ...monthData.avulsosItems]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(e => `- ${e.description}: ${formatCurrency(e.amount)}`)
        .join('\n');

    return `
        **Resumo Financeiro de ${monthName}/${year}:**
        - **Receita Total:** ${formatCurrency(totalIncome)}
        - **Despesa Total:** ${formatCurrency(totalExpenses)}
        - **Saldo Final:** ${formatCurrency(finalBalance)}
        - **Principais Despesas:**
        ${topExpenses}
    `;
};


export const generateFinancialAnalysis = async (
    monthData: MonthData, 
    monthName: string, 
    year: number,
    prompt: string
): Promise<string> => {
    if (!ai) {
        return "O serviço de IA não está configurado. Verifique a chave de API.";
    }

    const financialContext = generateFinancialContext(monthData, monthName, year);
    const fullPrompt = `${financialContext}\n\n**Pergunta do usuário:** ${prompt}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: 'user', 
                parts: [{ text: fullPrompt }]
            }],
            config: {
                systemInstruction: "Você é um assistente financeiro amigável e prestativo para um aplicativo de finanças pessoais. Seu nome é 'Finanças AI'. Analise os dados fornecidos e responda às perguntas do usuário de forma clara, concisa e com dicas úteis. Use formatação markdown simples, como **negrito**, para destacar pontos importantes. Não use cabeçalhos (#). Seja sempre positivo e encorajador.",
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Desculpe, ocorreu um erro ao tentar analisar suas finanças. Tente novamente mais tarde.";
    }
};
