// @ts-nocheck
import { Storage } from './storage';

const API_BASE = import.meta.env.VITE_DOCORP_API_BASE || 'https://api.beemon.shop';

console.log('API Base URL:', import.meta.env.VITE_DOCORP_API_BASE);
const getAdminAuthHeaders = () => {
  const token = Storage.getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const Api = {
  async getHistory(sessionId) {
    const res = await fetch(`${API_BASE}/survey/assessment/history?sessionId=${encodeURIComponent(sessionId)}&limit=50`);
    if (!res.ok) throw new Error('Khong the tai lich su');
    return res.json();
  },
  async submitAssessment(sessionId, answers, businessCode) {
    const res = await fetch(`${API_BASE}/survey/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answers, source: 'survey-web', businessCode }),
    });
    if (!res.ok) throw new Error('Khong the gui ket qua');
    return res.json();
  },
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/survey/admin/stats`, { headers: { ...getAdminAuthHeaders() } });
    if (!res.ok) throw new Error('Khong the tai thong ke');
    return res.json();
  },
  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Dang nhap that bai');
    return res.json();
  },
  async getAdminAssessments({ page = 1, limit = 20, sessionId = '', businessCode = '', startDate = '', endDate = '' }) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (sessionId.trim()) query.set('sessionId', sessionId.trim());
    if (businessCode.trim()) query.set('businessCode', businessCode.trim());
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    const res = await fetch(`${API_BASE}/survey/admin/assessments?${query.toString()}`, { headers: { ...getAdminAuthHeaders() } });
    if (!res.ok) throw new Error('Khong the tai danh sach');
    return res.json();
  },
  async getAdminAssessmentDetail(id) {
    const res = await fetch(`${API_BASE}/survey/admin/assessments/${id}`, { headers: { ...getAdminAuthHeaders() } });
    if (!res.ok) throw new Error('Khong the tai chi tiet');
    return res.json();
  },
  async deleteAdminAssessment(id) {
    const res = await fetch(`${API_BASE}/survey/admin/assessments/${id}`, { method: 'DELETE', headers: { ...getAdminAuthHeaders() } });
    if (!res.ok) throw new Error('Khong the xoa ban ghi');
    return res.json();
  },
};

