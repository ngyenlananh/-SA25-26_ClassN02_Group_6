// coffee/src/services/materialService.js
export async function getLowStockMaterials() {
  const response = await fetch('/api/materials/low-stock');
  if (!response.ok) throw new Error('Lỗi lấy dữ liệu tồn kho');
  return response.json();
}
