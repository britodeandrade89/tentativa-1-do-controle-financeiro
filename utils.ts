
export const formatCurrency = (value: number | undefined): string => {
    if (typeof value !== 'number' || isNaN(value)) value = 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    // Handles both 'YYYY-MM-DD' and ISO strings by ensuring timezone consistency
    const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || !value) return 0;
    const digits = value.replace(/\D/g, '');
    if (!digits) return 0;
    return parseFloat(digits) / 100;
};
