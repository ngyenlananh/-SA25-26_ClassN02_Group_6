// utils/exportExcel.js
import * as XLSX from 'xlsx';

export function exportToExcel(data, fileName = 'transactions.xlsx') {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, fileName);
}
