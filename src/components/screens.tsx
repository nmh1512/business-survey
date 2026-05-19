// @ts-nocheck
export function WelcomeScreen({
  onStart,
  hasProgress,
  history,
  C,
  I,
  Tag,
  Hairline,
  DocorpLogo,
}) {
  const isReturning = history && history.length > 0;
  const lastEntry = isReturning ? history[history.length - 1] : null;

  return (
    <div className="min-h-screen w-full" style={{ background: C.bg }}>
      <div className="px-5 md:px-12 pt-6 md:pt-8 flex justify-between items-center max-w-7xl mx-auto gap-4 flex-wrap">
        <DocorpLogo size={26} />
        <Tag>{isReturning ? 'Chào mừng quay lại 👋' : 'Bài đánh giá nội bộ'}</Tag>
      </div>

      <div className="px-5 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-7 anim-fadeUp">
            <Tag>
              <I.heart size={12} /> <span style={{ marginLeft: 6 }}>Một bài đánh giá, không phải chẩn đoán</span>
            </Tag>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(34px, 6vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', marginTop: 18, color: C.ink }}>
              Cuộc sống công việc của bạn <span style={{ color: C.red }}>thật sự</span> đang ổn không?
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 22, color: C.inkSoft, maxWidth: 600, fontWeight: 400 }}>
              5 phút để dừng lại, lắng nghe chính mình, và nhận về những gợi ý hồi phục cá nhân hóa. Bài test dựa trên các framework khoa học của WHO, Maslach Burnout Inventory, và HSE Stress Standards.
            </p>
            <div className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4 items-center">
              <button
                onClick={onStart}
                style={{ background: C.red, color: '#FFFFFF', fontSize: 15, fontWeight: 700, padding: '14px 26px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(225, 29, 46, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.redDeep; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.red; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {hasProgress ? 'Tiếp tục bài đang làm' : (isReturning ? 'Làm bài mới' : 'Bắt đầu nào')}
                <I.arrowRight size={18} />
              </button>
              <span style={{ fontSize: 13, color: C.inkSoft, fontWeight: 500 }}>Ẩn danh · Lưu cục bộ · ~5 phút</span>
            </div>
            {isReturning && lastEntry && (
              <div style={{ marginTop: 36, background: C.surface, padding: '18px 22px', borderRadius: 14, display: 'flex', gap: 14, alignItems: 'center', maxWidth: 580 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: lastEntry.levelColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I.activity size={20} color={lastEntry.levelColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600 }}>Lần đánh giá gần nhất · {new Date(lastEntry.date).toLocaleDateString('vi-VN')}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 2 }}>
                    Mức {lastEntry.level}/5 · {lastEntry.levelLabel}
                    <span style={{ fontSize: 13, color: C.inkSoft, fontWeight: 500, marginLeft: 8 }}>({lastEntry.totalScore} điểm)</span>
                  </div>
                </div>
              </div>
            )}
            {!isReturning && (
              <div style={{ marginTop: 48, background: C.surfaceWarm, borderLeft: `3px solid ${C.red}`, padding: '20px 22px', borderRadius: '0 12px 12px 0', maxWidth: 580 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <I.smile size={22} color={C.red} />
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 4 }}>Bạn có biết?</div>
                    <p style={{ fontSize: 15, lineHeight: 1.55, color: C.ink, fontWeight: 500 }}>Theo WHO, khoảng <strong>1/3 nhân sự ở châu Á</strong> trải qua dấu hiệu burnout ít nhất một lần mỗi năm. Nếu bạn cảm thấy mệt mỏi, bạn không một mình — và việc bạn dành thời gian cho bài test này đã là một bước đi đúng. 🌱</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-5">
            <div className="anim-fadeUp" style={{ background: C.surface, padding: 26, borderRadius: 16, animationDelay: '0.15s' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.inkSoft, fontWeight: 700, marginBottom: 16 }}>Bài test diễn ra thế nào</div>
              {[
                { Icon: I.clock, title: 'Khoảng 5 phút', desc: '24 câu hỏi, mỗi câu một màn hình. Có nút Quay lại nếu bạn đổi ý.' },
                { Icon: I.shield, title: 'Hoàn toàn ẩn danh', desc: 'Kết quả lưu trên thiết bị của bạn. Không ai khác xem được.' },
                { Icon: I.leaf, title: 'Không phán xét', desc: 'Không có câu trả lời đúng/sai. Hãy nghĩ về 2–4 tuần gần nhất và trả lời thật.' },
                { Icon: I.sparkles, title: 'Kết quả cá nhân hóa', desc: 'Bạn nhận được phân tích nguyên nhân stress + gợi ý cụ thể có thể làm ngay tuần này.' },
              ].map((step, i) => {
                const StepIcon = step.Icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, paddingTop: i === 0 ? 0 : 14, paddingBottom: 14, borderBottom: i === 3 ? 'none' : `1px solid ${C.rule}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: C.redSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <StepIcon size={18} color={C.red} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{step.title}</div>
                      <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, marginTop: 2 }}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.inkMute, fontWeight: 700 }}>Dựa trên các framework khoa học</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['WHO ICD-11', 'MBI Maslach', 'HSE Standards', 'Job Demand–Control'].map((f) => (
                <span key={f} style={{ fontSize: 12, fontWeight: 600, color: C.charcoal, padding: '6px 12px', background: '#FFFFFF', border: `1px solid ${C.rule}`, borderRadius: 999 }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-12 max-w-7xl mx-auto pb-8">
        <Hairline />
        <div className="mt-5" style={{ fontSize: 11, color: C.inkMute, fontWeight: 500 }}>
          DOCORP · Doing The Right Thing · Bài đánh giá nội bộ phục vụ mục đích tự nhận thức và hỗ trợ. Không thay thế tư vấn y tế chuyên môn.
        </div>
      </div>
    </div>
  );
}

export function MilestoneScreen({ milestone, progress, onContinue, C, I }) {
  const M = milestone;
  const Icon = I[M.iconKey] || I.sparkles;
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6" style={{ background: C.surfaceWarm }}>
      <div className="text-center max-w-xl w-full anim-fadeScale">
        <div className="anim-iconBounce" style={{ width: 88, height: 88, borderRadius: '50%', background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(225, 29, 46, 0.15)', marginBottom: 24 }}>
          <Icon size={40} color={C.red} />
        </div>
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 12 }}>Đã hoàn thành {progress}%</div>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: C.ink, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{M.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: C.inkSoft, marginTop: 16, fontWeight: 500 }}>{M.message}</p>
        <button
          onClick={onContinue}
          style={{ background: C.red, color: '#FFFFFF', fontSize: 15, fontWeight: 700, padding: '13px 26px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(225, 29, 46, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 32 }}
          onMouseEnter={(e) => e.currentTarget.style.background = C.redDeep}
          onMouseLeave={(e) => e.currentTarget.style.background = C.red}
        >
          {M.cta} <I.arrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
