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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authReady, setAuthReady] = useState(!!Storage.getAdminToken());

    const loadStats = async () => {
      const data = await Api.getAdminStats();
      setStats(data);
    };

    const loadList = async (nextPage = page, nextFilter = sessionFilter, nextStartDate = startDate, nextEndDate = endDate) => {
      setLoading(true);
      try {
        const data = await Api.getAdminAssessments({
          page: nextPage,
          limit: 20,
          sessionId: nextFilter,
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

    const buildLevelDistribution = (rows) => {
      const map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      rows.forEach((row) => {
        const level = row?.stressLevel?.level;
        if (level >= 1 && level <= 5) {
          map[level] += 1;
        }
      });
      return [1, 2, 3, 4, 5].map((level) => ({
        level,
        count: map[level],
      }));
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
          await Promise.all([loadStats(), loadList(1, '')]);
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
        await Promise.all([loadStats(), loadList(page, sessionFilter, startDate, endDate)]);
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
        if (!result?.access_token) {
          throw new Error('No access token');
        }
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
        await loadList(1, querySessionId, startDate, endDate);
      } catch (error) {
        console.error(error);
        alert('Tìm kiếm thất bại');
      }
    };

    if (!authReady) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
          <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 16, padding: 24 }}>
            <div className="mb-5">
              <DocorpLogo size={22} />
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email admin"
                required
                style={{ width: '100%', border: `1px solid ${C.rule}`, borderRadius: 10, padding: '11px 12px', fontSize: 14 }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
                style={{ width: '100%', border: `1px solid ${C.rule}`, borderRadius: 10, padding: '11px 12px', fontSize: 14 }}
              />
              <button
                type="submit"
                style={{ width: '100%', border: 'none', borderRadius: 999, background: C.red, color: '#fff', padding: '11px 14px', fontWeight: 700, cursor: 'pointer' }}
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <div className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
            <DocorpLogo size={24} />
            <div className="flex items-center gap-2">
              <Tag>Admin Dashboard</Tag>
              <button
                onClick={handleLogout}
                style={{ border: `1px solid ${C.rule}`, borderRadius: 999, background: '#fff', color: C.ink, padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div style={{ background: C.surface, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>Tổng bản ghi</div>
              <div style={{ fontSize: 32, color: C.red, fontWeight: 800 }}>{total}</div>
            </div>
            <div style={{ background: C.surface, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>Điểm trung bình</div>
              <div style={{ fontSize: 32, color: C.red, fontWeight: 800 }}>{avgScore}</div>
            </div>
            <div style={{ background: C.surface, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>Tỉ lệ mức 4-5</div>
              <div style={{ fontSize: 32, color: C.red, fontWeight: 800 }}>{highRiskRatio}%</div>
            </div>
            <div style={{ background: C.surface, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>Bản ghi 7 ngày</div>
              <div style={{ fontSize: 32, color: C.red, fontWeight: 800 }}>{recordsLast7Days}</div>
            </div>
          </div>

          <div style={{ background: C.surface, borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div className="grid md:grid-cols-12 gap-3 items-end">
              
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  gridColumn: 'span 2 / span 2',
                  border: `1px solid ${C.rule}`,
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  gridColumn: 'span 2 / span 2',
                  border: `1px solid ${C.rule}`,
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  gridColumn: 'span 2 / span 2',
                  border: 'none',
                  borderRadius: 999,
                  background: C.red,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  padding: '10px 18px',
                  cursor: 'pointer',
                }}
              >
                Lọc
              </button>
              <button
                onClick={async () => {
                  setQuerySessionId('');
                  setSessionFilter('');
                  setStartDate('');
                  setEndDate('');
                  await loadList(1, '', '', '');
                }}
                style={{
                  gridColumn: 'span 1 / span 1',
                  border: `1px solid ${C.rule}`,
                  borderRadius: 999,
                  background: '#fff',
                  color: C.ink,
                  fontWeight: 700,
                  fontSize: 14,
                  padding: '10px 12px',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.inkSoft, fontWeight: 700, marginBottom: 12 }}>Phân bố mức stress trong trang hiện tại</div>
            <div className="grid md:grid-cols-5 gap-3">
              {distribution.map((item) => {
                const pct = items.length ? Math.round((item.count / items.length) * 100) : 0;
                const color = item.level >= 4 ? C.level4 : item.level === 3 ? C.level3 : C.level1;
                return (
                  <div key={item.level} style={{ background: C.surface, borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 12, color: C.inkSoft }}>Mức {item.level}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color }}>{item.count}</div>
                    <div style={{ height: 6, background: '#fff', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.inkMute, marginTop: 6 }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
                <thead>
                  <tr style={{ background: C.surface }}>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Ngày</th>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Session</th>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Điểm</th>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Mức</th>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Rủi ro</th>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Nguồn</th>
                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} style={{ borderTop: `1px solid ${C.rule}` }}>
                      <td style={{ padding: 12, fontSize: 13 }}>{new Date(item.date).toLocaleString('vi-VN')}</td>
                      <td style={{ padding: 12, fontSize: 13 }}>{item.sessionId}</td>
                      <td style={{ padding: 12, fontSize: 13, fontWeight: 700 }}>{item.totalScore}</td>
                      <td style={{ padding: 12, fontSize: 13 }}>
                        <span style={{ color: item.stressLevel?.color || C.ink, fontWeight: 700 }}>
                          {item.stressLevel?.label || '-'}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontSize: 13 }}>
                        <span style={{
                          display: 'inline-block',
                          borderRadius: 999,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          background: (item?.stressLevel?.level || 0) >= 4 ? '#fee2e2' : '#ecfdf5',
                          color: (item?.stressLevel?.level || 0) >= 4 ? '#b91c1c' : '#166534',
                        }}>
                          {(item?.stressLevel?.level || 0) >= 4 ? 'High' : 'Normal'}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontSize: 13 }}>{item.source || '-'}</td>
                      <td style={{ padding: 12 }}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenDetail(item.id)}
                            style={{
                              border: 'none',
                              borderRadius: 8,
                              background: '#eef2ff',
                              color: '#3730a3',
                              fontWeight: 700,
                              fontSize: 12,
                              padding: '8px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              border: 'none',
                              borderRadius: 8,
                              background: '#fee2e2',
                              color: '#b91c1c',
                              fontWeight: 700,
                              fontSize: 12,
                              padding: '8px 10px',
                              cursor: 'pointer',
                            }}
                          >
                            Xoá
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && items.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 16, textAlign: 'center', color: C.inkSoft }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center" style={{ padding: 12, borderTop: `1px solid ${C.rule}` }}>
              <div style={{ fontSize: 13, color: C.inkSoft }}>
                Trang {page}/{totalPages} · {total} bản ghi
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => loadList(page - 1, sessionFilter, startDate, endDate)}
                  style={{ border: `1px solid ${C.rule}`, background: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 13, cursor: 'pointer' }}
                >
                  Trước
                </button>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() => loadList(page + 1, sessionFilter, startDate, endDate)}
                  style={{ border: `1px solid ${C.rule}`, background: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 13, cursor: 'pointer' }}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>

          {(detailLoading || detailRecord) && (
            <div
              onClick={() => !detailLoading && setDetailRecord(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(17, 24, 39, 0.55)',
                zIndex: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: 'min(980px, 100%)',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  background: '#fff',
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                {detailLoading && (
                  <div style={{ padding: 36, textAlign: 'center', color: C.inkSoft }}>Đang tải chi tiết...</div>
                )}
                {!detailLoading && detailRecord && (
                  <>
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div>
                        <div style={{ fontSize: 12, color: C.inkSoft, fontWeight: 700 }}>Bản ghi #{detailRecord.id}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 4 }}>Kết quả đánh giá stress</div>
                        <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 6 }}>
                          {new Date(detailRecord.date).toLocaleString('vi-VN')} · Session: {detailRecord.sessionId}
                        </div>
                      </div>
                      <button
                        onClick={() => setDetailRecord(null)}
                        style={{ border: `1px solid ${C.rule}`, borderRadius: 10, padding: '8px 10px', background: '#fff', cursor: 'pointer' }}
                      >
                        Đóng
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mb-5">
                      <div style={{ background: C.surface, borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 12, color: C.inkSoft }}>Tổng điểm</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: C.red }}>{detailRecord.totalScore}</div>
                      </div>
                      <div style={{ background: C.surface, borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 12, color: C.inkSoft }}>Mức stress</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: detailRecord.stressLevel?.color || C.ink }}>
                          {detailRecord.stressLevel?.label || '-'}
                        </div>
                      </div>
                      <div style={{ background: C.surface, borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 12, color: C.inkSoft }}>Nguồn</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{detailRecord.source || '-'}</div>
                      </div>
                    </div>

                    <div style={{ background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                      <div style={{ padding: 12, fontSize: 13, fontWeight: 700, color: C.inkSoft, background: C.surface }}>Chi tiết theo nhóm</div>
                      <div style={{ padding: 12 }}>
                        {(detailRecord.categoryScores || []).map((cat) => {
                          const percent = cat.max ? Math.round((cat.sum / cat.max) * 100) : 0;
                          return (
                            <div key={cat.id} style={{ marginBottom: 12 }}>
                              <div className="flex justify-between items-center">
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{cat.label}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: cat.classification?.color || C.ink }}>
                                  {cat.sum}/{cat.max} · {cat.classification?.level || '-'}
                                </div>
                              </div>
                              <div style={{ height: 7, borderRadius: 999, background: C.surface, marginTop: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${percent}%`, height: '100%', background: cat.classification?.color || C.red }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ background: '#fff', border: `1px solid ${C.rule}`, borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ padding: 12, fontSize: 13, fontWeight: 700, color: C.inkSoft, background: C.surface }}>Gợi ý hành động</div>
                      <div style={{ padding: 12 }}>
                        {(detailRecord.recommendations || []).length === 0 && (
                          <div style={{ fontSize: 13, color: C.inkSoft }}>Không có dữ liệu.</div>
                        )}
                        {(detailRecord.recommendations || []).map((rec, idx) => (
                          <div key={idx} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.rule}` }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{rec.label}</div>
                            <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 3 }}>{rec.title}</div>
                            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                              {(rec.items || []).map((it, i) => (
                                <li key={i} style={{ fontSize: 13, color: C.ink, lineHeight: 1.5, marginBottom: 4 }}>{it}</li>
                              ))}
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
