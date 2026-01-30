// coffee/src/services/systemService.js

export async function getSystemConfig() {
  const res = await fetch('/api/system');
  if (!res.ok) throw new Error('Lỗi lấy cấu hình hệ thống');
  return res.json();
}

export async function updateSystemConfig(data) {
  const res = await fetch('/api/system', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật cấu hình');
  return res.json();
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const res = await fetch('/api/system/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) throw new Error('Lỗi đổi mật khẩu');
  return res.json();
}

export async function backupSystem() {
  const res = await fetch('/api/system/backup', { method: 'POST' });
  if (!res.ok) throw new Error('Lỗi backup hệ thống');
  return res.json();
}

export async function resetSystem() {
  const res = await fetch('/api/system/reset', { method: 'POST' });
  if (!res.ok) throw new Error('Lỗi reset hệ thống');
  return res.json();
}
