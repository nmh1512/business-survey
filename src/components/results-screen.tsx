// @ts-nocheck
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0]?.value;
  return (
    <div className="rounded-[10px] border border-rule bg-bg px-3 py-2 text-[13px]">
      <div className="font-semibold text-ink">{label}</div>
      <div className="text-ink-soft">Điểm: <span className="font-bold text-ink">{value}</span></div>
    </div>
  );
}

export function ResultsScreen({
  answers,
  onRestart,
  history,
  computeScores,
  getStressLevel,
  buildRecommendations,
  classifyCategory,
  I,
  Tag,
  Hairline,
  DocorpLogo,
}) {
    const { totalScore, categoryScores } = useMemo(() => computeScores(answers), [answers]);
    const stressLevel = getStressLevel(totalScore);
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

    const recommendations = useMemo(() => buildRecommendations(categoryScores), [categoryScores]);

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
      <div className="min-h-screen w-full bg-bg">
        <div className="px-5 md:px-10 pt-6 md:pt-8 pb-5">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <DocorpLogo size={24} />
            <div className="no-print flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-bg px-4 py-[9px] text-[13px] font-bold text-ink" onClick={handleExport}>
                <I.download size={14} /> JSON
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-bg px-4 py-[9px] text-[13px] font-bold text-ink" onClick={() => window.print()}>
                <I.printer size={14} /> In
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full border-0 bg-primary px-4 py-[9px] text-[13px] font-bold text-white shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_28%,transparent)]" onClick={onRestart}>
                <I.rotate size={14} /> Làm lại
              </button>
            </div>
          </div>
        </div>

        {/* Warm intro */}
        <div className="px-5 md:px-10">
          <div className="max-w-6xl mx-auto anim-fadeUp">
            <div className="mb-7 rounded-[18px] border-l-4 border-l-primary bg-surface-warm px-6 py-[22px]">
              <div className="flex items-start gap-3.5">
                <span className="text-primary">
                  <I.heart size={26} color="currentColor" />
                </span>
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Cảm ơn bạn đã thành thật
                  </div>
                  <p className="text-[15px] font-medium leading-[1.55] text-ink">
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
              <h1 className={`mt-4 text-[clamp(36px,6vw,72px)] font-extrabold leading-none tracking-[-0.03em] ${stressLevel.level === 1 ? 'text-[#16A34A]' : stressLevel.level === 2 ? 'text-[#EAB308]' : stressLevel.level === 3 ? 'text-[#F97316]' : stressLevel.level === 4 ? 'text-[#DC2626]' : 'text-[#7F1D1D]'}`}>
                {stressLevel.label} <span className="text-[0.6em]">{stressLevel.emoji}</span>
              </h1>
              <p className="mt-5 max-w-[470px] text-base font-medium leading-[1.6] text-ink-soft">{stressLevel.summary}</p>

              {scoreDelta !== null && (
                <div className={`mt-[22px] inline-flex items-center gap-2 rounded-full px-[14px] py-2 text-[13px] font-semibold ${scoreDelta < 0 ? 'bg-[#16A34A15] text-[#16A34A]' : scoreDelta > 0 ? 'bg-[#DC262615] text-[#DC2626]' : 'bg-[#5A5A5F15] text-ink-soft'}`}>
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
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                Tổng điểm · {totalScore} / 120
              </div>

              <div className="mb-3 flex h-14 gap-1">
                {[
                  { range: [24, 43], label: 'Lành mạnh' },
                  { range: [44, 62], label: 'Cấp tính' },
                  { range: [63, 82], label: 'Lặp lại' },
                  { range: [83, 101], label: 'Mãn tính' },
                  { range: [102, 120], label: 'Burnout' },
                ].map((band, i) => {
                  const inBand = totalScore >= band.range[0] && totalScore <= band.range[1];
                  const bandBgClass = i === 0 ? 'bg-[#16A34A]' : i === 1 ? 'bg-[#EAB308]' : i === 2 ? 'bg-[#F97316]' : i === 3 ? 'bg-[#DC2626]' : 'bg-[#7F1D1D]';
                  const bandTextClass = i === 0 ? 'text-[#16A34A]' : i === 1 ? 'text-[#EAB308]' : i === 2 ? 'text-[#F97316]' : i === 3 ? 'text-[#DC2626]' : 'text-[#7F1D1D]';
                  return (
                    <div key={i} className={`relative flex-1 rounded-lg transition-all duration-500 ${inBand ? `${bandBgClass} scale-105` : 'bg-surface scale-100'}`}>
                      {inBand && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                          <I.check size={18} strokeWidth={3} color="#FFFFFF" />
                        </div>
                      )}
                      <div className={`absolute inset-x-0 -bottom-[22px] text-center text-[11px] ${inBand ? `${bandTextClass} font-bold` : 'text-ink-mute font-medium'}`}>{band.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="h-[30px]" />

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[14px] bg-surface p-4">
                  <div className="text-[32px] font-extrabold leading-none text-primary">{totalScore}</div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Tổng điểm
                  </div>
                </div>
                <div className="rounded-[14px] bg-surface p-4">
                  <div className="text-[32px] font-extrabold leading-none text-primary">
                    {drivers.filter(c => classifyCategory(c.sum, c.questions.length).levelEn === 'High').length}
                  </div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                    Yếu tố cao
                  </div>
                </div>
                <div className="rounded-[14px] bg-surface p-4">
                  <div className="text-[32px] font-extrabold leading-none text-primary">
                    {Math.round((burnout.sum / burnout.max) * 100)}%
                  </div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft">
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
                    <h2 className="mt-3.5 text-[clamp(26px,3.5vw,38px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
                      Bạn đang đi <span className="text-primary">theo hướng nào</span>?
                    </h2>
                    <p className="mt-3.5 text-[15px] font-medium leading-[1.6] text-ink-soft">
                      Đường này quan trọng hơn bất kỳ điểm số nào — nó cho thấy xu hướng. Mục tiêu là điểm tổng giảm dần qua các lần đánh giá.
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <div className="h-80 rounded-[18px] bg-surface p-5">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 10, right: 16, left: -8, bottom: 4 }}>
                          <CartesianGrid stroke="#EAEAEC" strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: '#5A5A5F', fontSize: 11, fontWeight: 600 }} stroke="#EAEAEC" />
                          <YAxis domain={[24, 120]} tick={{ fill: '#9A9AA0', fontSize: 11 }} stroke="#EAEAEC" />
                          <Tooltip content={<TrendTooltip />} />
                          <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 5 }} activeDot={{ r: 7 }} />
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
                <h2 className="mt-3.5 text-[clamp(26px,3.5vw,38px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
                  Áp lực đang đến từ <span className="text-primary">đâu</span>?
                </h2>
                <p className="mt-3.5 text-[15px] font-medium leading-[1.6] text-ink-soft">
                  6 nhóm nguyên nhân chính, được chuẩn hóa theo thang 0–100. Bất kỳ yếu tố nào trên 70% sẽ được đánh dấu là "Nguyên nhân chính" và nhận gợi ý hành động bên dưới.
                </p>
              </div>
              <div className="md:col-span-8">
                <div className="h-[360px] rounded-[18px] bg-surface p-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#EAEAEC" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A1A1A', fontSize: 12, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9A9AA0', fontSize: 10 }} stroke="#EAEAEC" />
                      <Radar name="Stress" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.22} strokeWidth={2.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 mt-4">
              {drivers.sort((a, b) => b.perQuestionAvg - a.perQuestionAvg).map((d) => {
                const cls = classifyCategory(d.sum, d.questions.length);
                const pct = Math.round((d.sum / d.max) * 100);
                const DIcon = I[d.iconKey];
                return (
                  <div key={d.id} className="py-3.5">
                    <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${cls.levelEn === 'High' ? 'bg-[#DC26261A]' : cls.levelEn === 'Moderate' ? 'bg-[#F973161A]' : 'bg-[#16A34A1A]'}`}>
                          <DIcon size={15} color={cls.color} />
                        </div>
                        <span className="text-[17px] font-bold text-ink">{d.label}</span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${cls.levelEn === 'High' ? 'text-[#DC2626]' : cls.levelEn === 'Moderate' ? 'text-[#F97316]' : 'text-[#16A34A]'}`}>{cls.level}</span>
                        <span className="text-[17px] font-extrabold text-ink">{d.sum}/{d.max}</span>
                      </div>
                    </div>
                    <progress
                      className={`rs-progress ${cls.levelEn === 'High' ? 'rs-progress-high' : cls.levelEn === 'Moderate' ? 'rs-progress-medium' : 'rs-progress-low'}`}
                      max={100}
                      value={pct}
                    />
                    <p className="mt-1.5 text-[13px] font-medium text-ink-soft">{d.description}</p>
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
                <h2 className="mt-3.5 text-[clamp(26px,3.5vw,38px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
                  3 chiều cạnh theo <span className="text-primary">MBI Maslach</span>
                </h2>
                <p className="mt-3.5 text-[15px] font-medium leading-[1.6] text-ink-soft">
                  Lấy cảm hứng từ Maslach Burnout Inventory: cạn kiệt cảm xúc, xa cách (cynicism), và sụt giảm hiệu suất tự cảm nhận.
                </p>
              </div>
              <div className="md:col-span-8 space-y-6">
                {burnoutBreakdown.map((b, i) => {
                  return (
                    <div key={i}>
                      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <span className="text-xl font-bold text-ink">{b.label}</span>
                          <span className="ml-2 text-xs font-semibold text-ink-mute">{b.labelEn}</span>
                          <div className="mt-0.5 text-[13px] font-medium text-ink-soft">{b.desc}</div>
                        </div>
                        <span className={`text-[26px] font-extrabold ${b.value >= 70 ? 'text-[#DC2626]' : b.value >= 50 ? 'text-[#F97316]' : b.value >= 30 ? 'text-[#EAB308]' : 'text-[#16A34A]'}`}>{Math.round(b.value)}%</span>
                      </div>
                      <progress
                        className={`rs-progress rs-progress-lg ${b.value >= 70 ? 'rs-progress-high' : b.value >= 50 ? 'rs-progress-medium' : b.value >= 30 ? 'rs-progress-warn' : 'rs-progress-low'}`}
                        max={100}
                        value={b.value}
                      />
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
              <h2 className="mt-3.5 max-w-[820px] text-[clamp(28px,4.2vw,48px)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
                Những bước nhỏ, có chủ đích — <span className="text-primary">bắt đầu ngay tuần này</span>.
              </h2>
              <p className="mt-4 max-w-[640px] text-[15px] font-medium leading-[1.6] text-ink-soft">
                Các gợi ý dưới đây được cá nhân hóa theo những yếu tố nguy cơ cao của bạn. Hãy chọn <strong>một việc duy nhất</strong> cho mỗi nhóm — đừng cố làm hết tất cả cùng lúc. Hồi phục là quá trình từng bước.
              </p>
            </div>

            <div className="space-y-8">
              {recommendations.map((rec, idx) => {
                const RIcon = I[rec.iconKey];
                return (
                  <div key={rec.categoryId} className={`print-clean grid gap-5 rounded-[18px] p-6 md:grid-cols-12 md:gap-6 ${idx === 0 ? 'border-l-4 border-l-primary bg-surface-warm' : 'bg-surface'}`}>
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                          <span className="text-primary">
                            <RIcon size={20} color="currentColor" />
                          </span>
                        </div>
                        <div className="text-[38px] font-extrabold leading-none text-primary opacity-40">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="mt-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                        Nguyên nhân chính
                      </div>
                      <div className="mt-1 text-lg font-extrabold text-ink">
                        {rec.label}
                      </div>
                    </div>
                    <div className="md:col-span-9">
                      <h3 className="mb-3.5 text-[22px] font-extrabold leading-[1.25] tracking-[-0.01em] text-ink">
                        {rec.title}
                      </h3>
                      <ul className="m-0 list-none p-0">
                        {rec.items.map((item, i) => (
                          <li key={i} className="flex gap-3.5 border-b border-rule py-3 first:border-t">
                            <div className="flex h-[26px] min-w-[26px] shrink-0 items-center justify-center rounded-full bg-primary-soft">
                              <I.check size={13} strokeWidth={3} color="var(--primary)" />
                            </div>
                            <span className="text-[15px] font-medium leading-[1.55] text-ink">
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
            <span className="inline-flex text-primary">
              <I.sun size={36} color="currentColor" />
            </span>
            <h3 className="mt-4 text-[clamp(22px,3vw,30px)] font-extrabold tracking-[-0.02em] text-ink">
              Cảm ơn vì đã dành thời gian cho chính mình.
            </h3>
            <p className="mt-3 text-[15px] font-medium leading-[1.6] text-ink-soft">
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
                <p className="mt-3 max-w-[620px] text-[13px] font-medium leading-[1.65] text-ink-soft">
                  Bài đánh giá dựa trên framework WHO ICD-11 về burnout, Maslach Burnout Inventory, HSE Stress Management Standards và mô hình Job Demand–Control. Được thiết kế cho mục đích tự nhận thức và các cuộc trò chuyện hỗ trợ — không thay thế chăm sóc sức khỏe tâm thần chuyên nghiệp. Nếu bạn đang trong giai đoạn khó khăn, hãy cân nhắc liên hệ chuyên gia hoặc chương trình hỗ trợ nhân viên (EAP) của tổ chức.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <DocorpLogo size={20} withTagline />
                <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                  v1.0 · Bài đánh giá cá nhân
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
