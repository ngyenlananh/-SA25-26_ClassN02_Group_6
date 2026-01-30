// utils/exportPDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(data, fileName = 'transactions.pdf') {
    const doc = new jsPDF();
    const columns = [
        { header: 'Mã GD', dataKey: 'id' },
        { header: 'Thời gian', dataKey: 'date' },
        { header: 'Loại', dataKey: 'type' },
        { header: 'Số tiền', dataKey: 'amount' },
        { header: 'Danh mục', dataKey: 'category' },
        { header: 'Nội dung', dataKey: 'desc' },
        { header: 'Người tạo', dataKey: 'staff' },
    ];
    doc.autoTable({ columns, body: data });
    doc.save(fileName);
}
