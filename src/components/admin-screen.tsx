// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';

export function AdminScreen({ C, Api, Storage, DocorpLogo, Tag, Hairline, I, classifyCategory, buildRecommendations }) {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [querySessionId, setQuerySessionId] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [queryBusinessCode, setQueryBusinessCode] = useState('');
  const [businessCodeFilter, setBusinessCodeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authReady, setAuthReady] = useState(!!Storage.getAdminToken());

  const loadStats = async () => {
    const data = await Api.getAdminStats();
    setStats(data);
  };

  const buildLevelDistribution = (rows) => {
    const map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach((row) => {
      const level = row?.stressLevel?.level;
      if (level >= 1 && level <= 5) map[level] += 1;
    });
    return [1, 2, 3, 4, 5].map((level) => ({ level, count: map[level] }));
  };

  const loadList = async (
    nextPage = page,
    nextFilter = sessionFilter,
    nextBusinessCode = businessCodeFilter,
    nextStartDate = startDate,
    nextEndDate = endDate,
  ) => {
    setLoading(true);
    try {
      const data = await Api.getAdminAssessments({
        page: nextPage,
        limit: 20,
        sessionId: nextFilter,
        businessCode: nextBusinessCode,
        startDate: nextStartDate,
        endDate: nextEndDate,
      });
      setItems(data.data || []);
      setDistribution(buildLevelDistribution(data.data || []));
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = useMemo(() => {
    if (!items.length) return 0;
    return Math.round(items.reduce((sum, item) => sum + (item.totalScore || 0), 0) / items.length);
  }, [items]);

  const highRiskCount = useMemo(() => items.filter((item) => (item?.stressLevel?.level || 0) >= 4).length, [items]);
  const highRiskRatio = useMemo(() => {
    if (!items.length) return 0;
    return Math.round((highRiskCount / items.length) * 100);
  }, [items, highRiskCount]);

  const recordsLast7Days = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    return items.filter((item) => {
      const ts = new Date(item.date).getTime();
      return ts >= sevenDaysAgo && ts <= now;
    }).length;
  }, [items]);

  useEffect(() => {
    if (!authReady) return;
    const run = async () => {
      try {
        await Promise.all([loadStats(), loadList(1, '', '')]);
      } catch (error) {
        console.error(error);
        alert('Không tải được dữ liệu admin. Vui lòng đăng nhập lại.');
        Storage.clearAdminToken();
        setAuthReady(false);
      }
    };
    run();
  }, [authReady]);

  const handleDelete = async (id) => {
    if (!window.confirm('Ban chac chan muon xoa ban ghi nay?')) return;
    try {
      await Api.deleteAdminAssessment(id);
      await Promise.all([loadStats(), loadList(page, sessionFilter, businessCodeFilter, startDate, endDate)]);
    } catch (error) {
      console.error(error);
      alert('Xóa thất bại');
    }
  };

  const handleOpenDetail = async (id) => {
    setDetailLoading(true);
    try {
      const detail = await Api.getAdminAssessmentDetail(id);
      setDetailRecord(detail);
    } catch (error) {
      console.error(error);
      alert('Không tải được chi tiết');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await Api.adminLogin(email, password);
      if (!result?.access_token) throw new Error('No access token');
      Storage.setAdminToken(result.access_token);
      setAuthReady(true);
    } catch (error) {
      console.error(error);
      alert('Đăng nhập admin thất bại');
    }
  };

  const handleLogout = () => {
    Storage.clearAdminToken();
    setAuthReady(false);
    setStats(null);
    setItems([]);
    setEmail('');
    setPassword('');
  };

  const handleSearch = async () => {
    try {
      setSessionFilter(querySessionId);
      setBusinessCodeFilter(queryBusinessCode);
      await loadList(1, querySessionId, queryBusinessCode, startDate, endDate);
    } catch (error) {
      console.error(error);
      alert('Tìm kiếm thất bại');
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-bg px-4 flex items-center justify-center">
        <div className="w-full max-w-[420px] rounded-2xl border border-rule p-6 bg-bg">
          <div className="mb-5"><DocorpLogo size={22} /></div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email admin" required className="w-full rounded-[10px] border border-rule px-3 py-[11px] text-sm outline-none" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required className="w-full rounded-[10px] border border-rule px-3 py-[11px] text-sm outline-none" />
            <button type="submit" className="w-full rounded-full border-0 bg-primary px-3.5 py-[11px] text-sm font-bold text-white">Đăng nhập</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <DocorpLogo size={24} />
          <div className="flex items-center gap-2">
            <Tag>Admin Dashboard</Tag>
            <button onClick={handleLogout} className="rounded-full border border-rule bg-bg px-3 py-[7px] text-xs font-bold text-ink">Đăng xuất</button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[['Tổng bản ghi', total], ['Điểm trung bình', avgScore], ['Tỉ lệ mức 4-5', `${highRiskRatio}%`], ['Bản ghi 7 ngày', recordsLast7Days]].map(([label, value]) => (
            <div key={label} className="rounded-[14px] bg-surface p-[18px]">
              <div className="text-xs font-semibold text-ink-soft">{label}</div>
              <div className="text-[32px] font-extrabold text-primary">{value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-[14px] bg-surface p-4">
          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
            <input type="text" value={querySessionId} onChange={(e) => setQuerySessionId(e.target.value)} placeholder="Session ID" className="w-full rounded-[10px] border border-rule px-3 py-2.5 text-sm outline-none md:col-span-4" />
            <input type="text" value={queryBusinessCode} onChange={(e) => setQueryBusinessCode(e.target.value)} placeholder="Business code" className="w-full rounded-[10px] border border-rule px-3 py-2.5 text-sm outline-none md:col-span-3" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-[10px] border border-rule px-3 py-2.5 text-sm outline-none md:col-span-2" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-[10px] border border-rule px-3 py-2.5 text-sm outline-none md:col-span-2" />
            <button onClick={handleSearch} className="w-full rounded-full border-0 bg-primary px-[18px] py-2.5 text-sm font-bold text-white md:col-span-1">Lọc</button>
            <button onClick={async () => { setQuerySessionId(''); setSessionFilter(''); setQueryBusinessCode(''); setBusinessCodeFilter(''); setStartDate(''); setEndDate(''); await loadList(1, '', '', '', ''); }} className="w-full rounded-full border border-rule bg-bg px-3 py-2.5 text-sm font-bold text-ink md:col-span-12">Reset</button>
          </div>
        </div>

        <div className="mb-4 rounded-[14px] border border-rule bg-bg p-4">
          <div className="mb-3 text-[13px] font-bold text-ink-soft">Phân bố mức stress trong trang hiện tại</div>
          <div className="grid gap-3 md:grid-cols-5">
            {distribution.map((item) => {
              const pct = items.length ? Math.round((item.count / items.length) * 100) : 0;
              const levelClass = item.level >= 4 ? 'text-[#DC2626]' : item.level === 3 ? 'text-[#F97316]' : 'text-[#16A34A]';
              const progressClass = item.level >= 4 ? 'rs-progress-high' : item.level === 3 ? 'rs-progress-medium' : 'rs-progress-low';
              return (
                <div key={item.level} className="rounded-xl bg-surface p-3">
                  <div className="text-xs text-ink-soft">Mức {item.level}</div>
                  <div className={`text-2xl font-extrabold ${levelClass}`}>{item.count}</div>
                  <progress className={`mt-2 rs-progress ${progressClass}`} max={100} value={pct} />
                  <div className="mt-1.5 text-[11px] text-ink-mute">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-rule bg-bg">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse">
              <thead>
                <tr className="bg-surface">
                  {['Ngày', 'Session', 'Business', 'Điểm', 'Mức', 'Rủi ro', 'Nguồn', 'Thao tác'].map((h) => <th key={h} className="px-3 py-3 text-left text-xs">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-rule">
                    <td className="px-3 py-3 text-[13px]">{new Date(item.date).toLocaleString('vi-VN')}</td>
                    <td className="px-3 py-3 text-[13px]">{item.sessionId}</td>
                    <td className="px-3 py-3 text-[13px]">{item.businessCode || '-'}</td>
                    <td className="px-3 py-3 text-[13px] font-bold">{item.totalScore}</td>
                    <td className="px-3 py-3 text-[13px]"><span className={`font-bold ${(item?.stressLevel?.level || 0) >= 4 ? 'text-[#DC2626]' : (item?.stressLevel?.level || 0) === 3 ? 'text-[#F97316]' : 'text-[#16A34A]'}`}>{item.stressLevel?.label || '-'}</span></td>
                    <td className="px-3 py-3 text-[13px]"><span className={`inline-block rounded-full px-2 py-1 text-[11px] font-bold ${(item?.stressLevel?.level || 0) >= 4 ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{(item?.stressLevel?.level || 0) >= 4 ? 'High' : 'Normal'}</span></td>
                    <td className="px-3 py-3 text-[13px]">{item.source || '-'}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenDetail(item.id)} className="rounded-lg border-0 bg-indigo-50 px-2.5 py-2 text-xs font-bold text-indigo-800">Chi tiết</button>
                        <button onClick={() => handleDelete(item.id)} className="rounded-lg border-0 bg-red-100 px-2.5 py-2 text-xs font-bold text-red-700">Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-4 text-center text-ink-soft">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-rule px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px] text-ink-soft">Trang {page}/{totalPages} · {total} bản ghi</div>
            <div className="flex gap-2">
              <button disabled={page <= 1 || loading} onClick={() => loadList(page - 1, sessionFilter, businessCodeFilter, startDate, endDate)} className="rounded-lg border border-rule bg-bg px-3 py-2 text-[13px] disabled:opacity-50">Trước</button>
              <button disabled={page >= totalPages || loading} onClick={() => loadList(page + 1, sessionFilter, businessCodeFilter, startDate, endDate)} className="rounded-lg border border-rule bg-bg px-3 py-2 text-[13px] disabled:opacity-50">Sau</button>
            </div>
          </div>
        </div>

        {(detailLoading || detailRecord) && (
          <div onClick={() => !detailLoading && setDetailRecord(null)} className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/55 p-4">
            <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-[980px] overflow-y-auto rounded-2xl bg-bg p-5">
              {detailLoading && <div className="p-9 text-center text-ink-soft">Đang tải chi tiết...</div>}
              {!detailLoading && detailRecord && (
                <>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-ink-soft">Bản ghi #{detailRecord.id}</div>
                      <div className="mt-1 text-2xl font-extrabold text-ink">Kết quả đánh giá stress</div>
                      <div className="mt-1.5 text-[13px] text-ink-soft">{new Date(detailRecord.date).toLocaleString('vi-VN')} · Session: {detailRecord.sessionId}</div>
                    </div>
                    <button onClick={() => setDetailRecord(null)} className="rounded-[10px] border border-rule bg-bg px-2.5 py-2">Đóng</button>
                  </div>

                  <div className="mb-5 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-surface p-3.5"><div className="text-xs text-ink-soft">Tổng điểm</div><div className="text-[28px] font-extrabold text-primary">{detailRecord.totalScore}</div></div>
                    <div className="rounded-xl bg-surface p-3.5"><div className="text-xs text-ink-soft">Mức stress</div><div className={`text-lg font-extrabold ${(detailRecord?.stressLevel?.level || 0) >= 4 ? 'text-[#DC2626]' : (detailRecord?.stressLevel?.level || 0) === 3 ? 'text-[#F97316]' : 'text-[#16A34A]'}`}>{detailRecord.stressLevel?.label || '-'}</div></div>
                    <div className="rounded-xl bg-surface p-3.5"><div className="text-xs text-ink-soft">Nguồn</div><div className="text-base font-bold text-ink">{detailRecord.source || '-'}</div></div>
                  </div>

                  <div className="mb-3.5 overflow-hidden rounded-xl border border-rule bg-bg">
                    <div className="bg-surface px-3 py-3 text-[13px] font-bold text-ink-soft">Chi tiết theo nhóm</div>
                    <div className="p-3">
                      {(detailRecord.categoryScores || []).map((cat) => {
                        const percent = cat.max ? Math.round((cat.sum / cat.max) * 100) : 0;
                        const levelClass = cat.classification?.level === 'Cao' ? 'text-[#DC2626]' : cat.classification?.level === 'Trung bình' ? 'text-[#F97316]' : 'text-[#16A34A]';
                        const progressClass = cat.classification?.level === 'Cao' ? 'rs-progress-high' : cat.classification?.level === 'Trung bình' ? 'rs-progress-medium' : 'rs-progress-low';
                        return (
                          <div key={cat.id} className="mb-3 last:mb-0">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-bold text-ink">{cat.label}</div>
                              <div className={`text-[13px] font-bold ${levelClass}`}>{cat.sum}/{cat.max} · {cat.classification?.level || '-'}</div>
                            </div>
                            <progress className={`mt-1.5 rs-progress ${progressClass}`} max={100} value={percent} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-rule bg-bg">
                    <div className="bg-surface px-3 py-3 text-[13px] font-bold text-ink-soft">Gợi ý hành động</div>
                    <div className="p-3">
                      {(detailRecord.recommendations || []).length === 0 && <div className="text-[13px] text-ink-soft">Không có dữ liệu.</div>}
                      {(detailRecord.recommendations || []).map((rec, idx) => (
                        <div key={idx} className="mb-3 border-b border-rule pb-3 last:mb-0 last:border-b-0 last:pb-0">
                          <div className="text-[15px] font-extrabold text-ink">{rec.label}</div>
                          <div className="mt-0.5 text-[13px] text-ink-soft">{rec.title}</div>
                          <ul className="mt-2 list-disc pl-4.5">
                            {(rec.items || []).map((it, i) => <li key={i} className="mb-1 text-[13px] leading-[1.5] text-ink">{it}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
