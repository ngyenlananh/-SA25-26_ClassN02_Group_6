// utils/categorySummary.js
export function getCategorySummary(transactions) {
    const summary = {};
    transactions.forEach(t => {
        if (t.type === 'expense') {
            summary[t.category] = (summary[t.category] || 0) + t.amount;
        }
    });
    return summary;
}
