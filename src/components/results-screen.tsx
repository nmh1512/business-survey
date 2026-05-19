// @ts-nocheck
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function ResultsScreen({
  answers,
  onRestart,
  history,
  computeScores,
  getStressLevel,
  buildRecommendations,
  classifyCategory,
  C,
  I,
  Tag,
  Hairline,
  DocorpLogo,
}) {
    const { totalScore, categoryScores } = useMemo(() => computeScores(answers), [answers]);
    const stressLevel = getStressLevel(totalScore, C);
    const drivers = categoryScores.filter((c) => c.id !== 'burnout');
    const burnout = categoryScores.find((c) => c.id === 'burnout');

    const radarData = drivers.map((c) => ({
      subject: c.short, A: Math.round((c.sum / c.max) * 100), fullMark: 100,
    }));

    const burnoutValues = burnout.values;
    const burnoutBreakdown = [
      { label: 'Cạn kiệt',     labelEn: 'Exhaustion',    value: ((burnoutValues[0] + burnoutValues[3]) / 10) * 100, desc: 'Cạn kiệt về cảm xúc và năng lượng' },
      { label: 'Xa cách',      labelEn: 'Detachment',    value: ((burnoutValues[1] + burnoutValues[4]) / 10) * 100, desc: 'Lạnh nhạt, mất ý nghĩa với công việc' },
      { label: 'Sụt giảm hiệu suất', labelEn: 'Effectiveness', value: ((burnoutValues[2] + burnoutValues[5]) / 10) * 100, desc: 'Cảm giác hiệu quả công việc đang giảm' },
    ];

    const recommendations = useMemo(() => buildRecommendations(categoryScores, C), [categoryScores]);

    // Trend data (include current result)
    const trendData = useMemo(() => {
      const past = (history || []).map(h => ({
        date: new Date(h.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        score: h.totalScore,
        level: h.level,
      }));
      const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      return [...past, { date: today + ' (hôm nay)', score: totalScore, level: stressLevel.level }];
    }, [history, totalScore]);

    const showTrend = trendData.length >= 2;
    const previousEntry = history && history.length > 0 ? history[history.length - 1] : null;
    const scoreDelta = previousEntry ? totalScore - previousEntry.totalScore : null;

    const handleExport = () => {
      const data = {
        date: new Date().toISOString(),
        totalScore, level: stressLevel.level, levelLabel: stressLevel.label,
        answers,
        categoryScores: categoryScores.map(c => ({ id: c.id, label: c.label, sum: c.sum, max: c.max })),
        burnoutBreakdown,
        recommendations: recommendations.map(r => ({ category: r.label, title: r.title, items: r.items })),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `docorp-result-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="min-h-screen w-full" style={{ background: C.bg }}>
        <div className="px-5 md:px-10 pt-6 md:pt-8 pb-5">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <DocorpLogo size={24} />
            <div className="flex gap-2 no-print">
              <button onClick={handleExport} style={{
                background: '#FFFFFF', border: `1.5px solid ${C.rule}`, color: C.ink,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', borderRadius: 999,
                padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <I.download size={14} /> JSON
              </button>
              <button onClick={() => window.print()} style={{
                background: '#FFFFFF', border: `1.5px solid ${C.rule}`, color: C.ink,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', borderRadius: 999,
                padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <I.printer size={14} /> In
              </button>
              <button onClick={onRestart} style={{
                background: C.red, border: 'none', color: '#FFFFFF',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', borderRadius: 999,
                padding: '9px 16px', boxShadow: '0 4px 12px rgba(225,29,46,0.25)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <I.rotate size={14} /> Làm lại
              </button>
            </div>
          </div>
        </div>

        {/* Warm intro */}
        <div className="px-5 md:px-10">
          <div className="max-w-6xl mx-auto anim-fadeUp">
            <div style={{
              background: C.surfaceWarm, borderRadius: 18,
              padding: '22px 24px', borderLeft: `4px solid ${C.red}`,
              marginBottom: 28,
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <I.heart size={26} color={C.red} />
                <div>
                  <div style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 4 }}>
                    Cảm ơn bạn đã thành thật
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.55, color: C.ink, fontWeight: 500 }}>
                    Dưới đây là những gì bạn vừa chia sẻ. Đây là một bức ảnh chụp tại thời điểm này, không phải bản án. Mọi thứ đều có thể cải thiện, và bạn đã đi bước đầu rồi. 🌱
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: OVERALL */}
        <section className="px-5 md:px-10 pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 md:gap-10 items-start">
            <div className="md:col-span-5">
              <Tag color={stressLevel.color} bg={stressLevel.color + '1A'}>
                Mức {stressLevel.level}/5 · {stressLevel.sub}
              </Tag>
              <h1 style={{
                fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)',
                lineHeight: 1, letterSpacing: '-0.03em',
                marginTop: 16, color: stressLevel.color,
              }}>
                {stressLevel.label} <span style={{ fontSize: '0.6em' }}>{stressLevel.emoji}</span>
              </h1>
              <p style={{
                fontSize: 16, lineHeight: 1.6, marginTop: 20,
                color: C.inkSoft, maxWidth: 470, fontWeight: 500,
              }}>{stressLevel.summary}</p>

              {scoreDelta !== null && (
                <div style={{
                  marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 13, fontWeight: 600,
                  color: scoreDelta < 0 ? C.level1 : (scoreDelta > 0 ? C.level4 : C.inkSoft),
                  background: (scoreDelta < 0 ? C.level1 : (scoreDelta > 0 ? C.level4 : C.inkSoft)) + '15',
                  padding: '8px 14px', borderRadius: 999,
                }}>
                  {scoreDelta < 0 ? <I.trendingDown size={14}/> : scoreDelta > 0 ? <I.trendingUp size={14}/> : <I.activity size={14}/>}
                  <span>
                    {scoreDelta < 0
                      ? `Giảm ${Math.abs(scoreDelta)} điểm so với lần trước — tiến bộ rồi 🌱`
                      : scoreDelta > 0
                      ? `Tăng ${scoreDelta} điểm so với lần trước — cần chú ý`
                      : 'Không đổi so với lần trước'}
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-7">
              <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.inkSoft, fontWeight: 700, marginBottom: 12 }}>
                Tổng điểm · {totalScore} / 120
              </div>

              <div style={{ display: 'flex', gap: 4, marginBottom: 12, height: 56 }}>
                {[
                  { range: [24, 43], color: C.level1, label: 'Lành mạnh' },
                  { range: [44, 62], color: C.level2, label: 'Cấp tính' },
                  { range: [63, 82], color: C.level3, label: 'Lặp lại' },
                  { range: [83, 101], color: C.level4, label: 'Mãn tính' },
                  { range: [102, 120], color: C.level5, label: 'Burnout' },
                ].map((band, i) => {
                  const inBand = totalScore >= band.range[0] && totalScore <= band.range[1];
                  return (
                    <div key={i} style={{
                      flex: 1, background: inBand ? band.color : C.surface,
                      position: 'relative', borderRadius: 8,
                      transition: 'all 0.5s ease',
                      transform: inBand ? 'scale(1.05)' : 'scale(1)',
                    }}>
                      {inBand && (
                        <div style={{
                          position: 'absolute', top: '50%', left: '50%',
                          transform: 'translate(-50%, -50%)', color: '#FFFFFF',
                        }}>
                          <I.check size={18} strokeWidth={3} color="#FFFFFF" />
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', bottom: -22, left: 0, right: 0,
                        textAlign: 'center', fontSize: 11,
                        color: inBand ? band.color : C.inkMute,
                        fontWeight: inBand ? 700 : 500,
                      }}>{band.label}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ height: 30 }} />

              <div className="grid grid-cols-3 gap-3 mt-8">
                <div style={{ background: C.surface, padding: 16, borderRadius: 14 }}>
                  <div style={{ fontSize: 32, color: C.red, fontWeight: 800, lineHeight: 1 }}>{totalScore}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkSoft, marginTop: 8, fontWeight: 700 }}>
                    Tổng điểm
                  </div>
                </div>
                <div style={{ background: C.surface, padding: 16, borderRadius: 14 }}>
                  <div style={{ fontSize: 32, color: C.red, fontWeight: 800, lineHeight: 1 }}>
                    {drivers.filter(c => classifyCategory(c.sum, c.questions.length, C).levelEn === 'High').length}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkSoft, marginTop: 8, fontWeight: 700 }}>
                    Yếu tố cao
                  </div>
                </div>
                <div style={{ background: C.surface, padding: 16, borderRadius: 14 }}>
                  <div style={{ fontSize: 32, color: C.red, fontWeight: 800, lineHeight: 1 }}>
                    {Math.round((burnout.sum / burnout.max) * 100)}%
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkSoft, marginTop: 8, fontWeight: 700 }}>
                    Tín hiệu burnout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-5 md:px-10"><div className="max-w-6xl mx-auto"><Hairline /></div></div>

        {/* TREND CHART (if has history) */}
        {showTrend && (
          <>
            <section className="px-5 md:px-10 py-12 md:py-16">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start mb-8">
                  <div className="md:col-span-4">
                    <Tag>Lịch sử của bạn</Tag>
                    <h2 style={{ fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 14, color: C.ink }}>
                      Bạn đang đi <span style={{ color: C.red }}>theo hướng nào</span>?
                    </h2>
                    <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 14, color: C.inkSoft, fontWeight: 500 }}>
                      Đường này quan trọng hơn bất kỳ điểm số nào — nó cho thấy xu hướng. Mục tiêu là điểm tổng giảm dần qua các lần đánh giá.
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <div style={{ background: C.surface, borderRadius: 18, padding: 20, height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 10, right: 16, left: -8, bottom: 4 }}>
                          <CartesianGrid stroke={C.rule} strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: C.inkSoft, fontSize: 11, fontWeight: 600 }} stroke={C.rule} />
                          <YAxis domain={[24, 120]} tick={{ fill: C.inkMute, fontSize: 11 }} stroke={C.rule} />
                          <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.rule}`, fontSize: 13, fontFamily: 'SVN Gilroy' }} />
                          <Line type="monotone" dataKey="score" stroke={C.red} strokeWidth={3} dot={{ fill: C.red, r: 5 }} activeDot={{ r: 7 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="px-5 md:px-10"><div className="max-w-6xl mx-auto"><Hairline /></div></div>
          </>
        )}

        {/* SECTION 2: DRIVERS */}
        <section className="px-5 md:px-10 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start mb-8">
              <div className="md:col-span-4">
                <Tag>02 · Phân tích nguyên nhân</Tag>
                <h2 style={{ fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 14, color: C.ink }}>
                  Áp lực đang đến từ <span style={{ color: C.red }}>đâu</span>?
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 14, color: C.inkSoft, fontWeight: 500 }}>
                  6 nhóm nguyên nhân chính, được chuẩn hóa theo thang 0–100. Bất kỳ yếu tố nào trên 70% sẽ được đánh dấu là "Nguyên nhân chính" và nhận gợi ý hành động bên dưới.
                </p>
              </div>
              <div className="md:col-span-8">
                <div style={{ background: C.surface, borderRadius: 18, padding: 20, height: 360 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={C.rule} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: C.ink, fontSize: 12, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: C.inkMute, fontSize: 10 }} stroke={C.rule} />
                      <Radar name="Stress" dataKey="A" stroke={C.red} fill={C.red} fillOpacity={0.22} strokeWidth={2.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 mt-4">
              {drivers.sort((a, b) => b.perQuestionAvg - a.perQuestionAvg).map((d) => {
                const cls = classifyCategory(d.sum, d.questions.length, C);
                const pct = Math.round((d.sum / d.max) * 100);
                const DIcon = I[d.iconKey];
                return (
                  <div key={d.id} className="py-3.5">
                    <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: cls.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DIcon size={15} color={cls.color} />
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 700, color: C.ink }}>{d.label}</span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: cls.color, fontWeight: 700 }}>{cls.level}</span>
                        <span style={{ fontSize: 17, color: C.ink, fontWeight: 800 }}>{d.sum}/{d.max}</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: C.surface, borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: cls.color, transition: 'width 0.7s ease', borderRadius: 999 }} />
                    </div>
                    <p style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, fontWeight: 500 }}>{d.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="px-5 md:px-10"><div className="max-w-6xl mx-auto"><Hairline /></div></div>

        {/* SECTION 3: BURNOUT */}
        <section className="px-5 md:px-10 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
              <div className="md:col-span-4">
                <Tag>03 · Dấu hiệu burnout</Tag>
                <h2 style={{ fontWeight: 800, fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 14, color: C.ink }}>
                  3 chiều cạnh theo <span style={{ color: C.red }}>MBI Maslach</span>
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 14, color: C.inkSoft, fontWeight: 500 }}>
                  Lấy cảm hứng từ Maslach Burnout Inventory: cạn kiệt cảm xúc, xa cách (cynicism), và sụt giảm hiệu suất tự cảm nhận.
                </p>
              </div>
              <div className="md:col-span-8 space-y-6">
                {burnoutBreakdown.map((b, i) => {
                  const color = b.value >= 70 ? C.level4 : b.value >= 50 ? C.level3 : b.value >= 30 ? C.level2 : C.level1;
                  return (
                    <div key={i}>
                      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <span style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{b.label}</span>
                          <span style={{ fontSize: 12, color: C.inkMute, marginLeft: 8, fontWeight: 600 }}>{b.labelEn}</span>
                          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2, fontWeight: 500 }}>{b.desc}</div>
                        </div>
                        <span style={{ fontSize: 26, color, fontWeight: 800 }}>{Math.round(b.value)}%</span>
                      </div>
                      <div style={{ height: 8, background: C.surface, borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${b.value}%`, background: color, transition: 'width 0.8s ease', borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="px-5 md:px-10"><div className="max-w-6xl mx-auto"><Hairline /></div></div>

        {/* SECTION 4: RECOMMENDATIONS */}
        <section className="px-5 md:px-10 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <Tag>04 · Gợi ý dành riêng cho bạn</Tag>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 4.2vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.025em', marginTop: 14, color: C.ink, maxWidth: 820 }}>
                Những bước nhỏ, có chủ đích — <span style={{ color: C.red }}>bắt đầu ngay tuần này</span>.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 16, color: C.inkSoft, maxWidth: 640, fontWeight: 500 }}>
                Các gợi ý dưới đây được cá nhân hóa theo những yếu tố nguy cơ cao của bạn. Hãy chọn <strong>một việc duy nhất</strong> cho mỗi nhóm — đừng cố làm hết tất cả cùng lúc. Hồi phục là quá trình từng bước.
              </p>
            </div>

            <div className="space-y-8">
              {recommendations.map((rec, idx) => {
                const RIcon = I[rec.iconKey];
                return (
                  <div key={rec.categoryId} className="grid md:grid-cols-12 gap-5 md:gap-6 print-clean" style={{
                    background: idx === 0 ? C.surfaceWarm : C.surface,
                    padding: '24px', borderRadius: 18,
                    borderLeft: idx === 0 ? `4px solid ${C.red}` : 'none',
                  }}>
                    <div className="md:col-span-3">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: '#FFFFFF', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                          <RIcon size={20} color={C.red} />
                        </div>
                        <div style={{ fontSize: 38, color: C.red, fontWeight: 800, lineHeight: 1, opacity: 0.4 }}>
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.inkSoft, fontWeight: 700, marginTop: 14 }}>
                        Nguyên nhân chính
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginTop: 4 }}>
                        {rec.label}
                      </div>
                    </div>
                    <div className="md:col-span-9">
                      <h3 style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.01em', color: C.ink, marginBottom: 14 }}>
                        {rec.title}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {rec.items.map((item, i) => (
                          <li key={i} style={{
                            display: 'flex', gap: 14, padding: '12px 0',
                            borderTop: i === 0 ? `1px solid ${C.rule}` : 'none',
                            borderBottom: `1px solid ${C.rule}`,
                          }}>
                            <div style={{
                              minWidth: 26, height: 26, borderRadius: '50%',
                              background: C.redSoft, display: 'flex',
                              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <I.check size={13} strokeWidth={3} color={C.red} />
                            </div>
                            <span style={{ fontSize: 15, lineHeight: 1.55, color: C.ink, fontWeight: 500 }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="px-5 md:px-10 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <I.sun size={36} color={C.red} />
            <h3 style={{ fontWeight: 800, fontSize: 'clamp(22px, 3vw, 30px)', marginTop: 16, color: C.ink, letterSpacing: '-0.02em' }}>
              Cảm ơn vì đã dành thời gian cho chính mình.
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.inkSoft, marginTop: 12, fontWeight: 500 }}>
              Hãy quay lại làm bài test này sau 4 tuần để theo dõi sự thay đổi. Sự cải thiện thường đến từ những điều chỉnh nhỏ, đều đặn — không phải những thay đổi lớn một lần.
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="px-5 md:px-10 pb-12">
          <div className="max-w-6xl mx-auto">
            <Hairline />
            <div className="grid md:grid-cols-12 gap-6 pt-8">
              <div className="md:col-span-7">
                <Tag>Một công cụ phản tư, không phải chẩn đoán</Tag>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.inkSoft, marginTop: 12, maxWidth: 620, fontWeight: 500 }}>
                  Bài đánh giá dựa trên framework WHO ICD-11 về burnout, Maslach Burnout Inventory, HSE Stress Management Standards và mô hình Job Demand–Control. Được thiết kế cho mục đích tự nhận thức và các cuộc trò chuyện hỗ trợ — không thay thế chăm sóc sức khỏe tâm thần chuyên nghiệp. Nếu bạn đang trong giai đoạn khó khăn, hãy cân nhắc liên hệ chuyên gia hoặc chương trình hỗ trợ nhân viên (EAP) của tổ chức.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <DocorpLogo size={20} withTagline />
                <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.inkMute, marginTop: 12, fontWeight: 700 }}>
                  v1.0 · Bài đánh giá cá nhân
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
