// @ts-nocheck
export function WelcomeScreen({
  onStart,
  hasProgress,
  history,
  I,
  Tag,
  Hairline,
  DocorpLogo,
}) {
  const isReturning = history && history.length > 0;
  const lastEntry = isReturning ? history[history.length - 1] : null;
  const levelColorClass = {
    1: 'text-[#16A34A]',
    2: 'text-[#EAB308]',
    3: 'text-[#F97316]',
    4: 'text-[#DC2626]',
    5: 'text-[#7F1D1D]',
  };
  const levelBgSoftClass = {
    1: 'bg-[#16A34A22]',
    2: 'bg-[#EAB30822]',
    3: 'bg-[#F9731622]',
    4: 'bg-[#DC262622]',
    5: 'bg-[#7F1D1D22]',
  };
  const textFooter = import.meta.env.VITE_APP_TEXT_FOOTER || 'DOCORP · Doing The Right Thing · Bài đánh giá nội bộ phục vụ mục đích tự nhận thức và hỗ trợ. Không thay thế tư vấn y tế chuyên môn.';

  return (
    <div className="min-h-screen w-full bg-bg">
      <div className="px-5 md:px-12 pt-6 md:pt-8 flex justify-between items-center max-w-7xl mx-auto gap-4 flex-wrap">
        <DocorpLogo size={26} />
        <Tag>{isReturning ? 'Chào mừng quay lại 👋' : 'Bài đánh giá nội bộ'}</Tag>
      </div>

      <div className="px-5 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-7 anim-fadeUp">
            <Tag>
              <I.heart size={12} /> <span className="ml-1.5">Một bài đánh giá, không phải chẩn đoán</span>
            </Tag>
            <h1 className="mt-[18px] text-[clamp(34px,6vw,72px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink">
              Cuộc sống công việc của bạn <span className="text-primary">thật sự</span> đang ổn không?
            </h1>
            <p className="mt-[22px] max-w-[600px] text-[17px] font-normal leading-[1.6] text-ink-soft">
              5 phút để dừng lại, lắng nghe chính mình, và nhận về những gợi ý hồi phục cá nhân hóa. Bài test dựa trên các framework khoa học của WHO, Maslach Burnout Inventory, và HSE Stress Standards.
            </p>
            <div className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4 items-center">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2.5 rounded-full border-0 bg-primary px-[26px] py-[14px] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(225,29,46,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-deep"
              >
                {hasProgress ? 'Tiếp tục bài đang làm' : (isReturning ? 'Làm bài mới' : 'Bắt đầu nào')}
                <I.arrowRight size={18} />
              </button>
              <span className="text-[13px] font-medium text-ink-soft">Ẩn danh · Lưu cục bộ · ~5 phút</span>
            </div>
            {isReturning && lastEntry && (
              <div className="mt-9 flex max-w-[580px] items-center gap-3.5 rounded-[14px] bg-surface px-[22px] py-[18px]">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${levelBgSoftClass[lastEntry.level] || 'bg-[#F9731622]'}`}>
                  <I.activity size={20} color={lastEntry.levelColor} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-ink-soft">Lần đánh giá gần nhất · {new Date(lastEntry.date).toLocaleDateString('vi-VN')}</div>
                  <div className={`mt-0.5 text-[15px] font-bold ${levelColorClass[lastEntry.level] || 'text-ink'}`}>
                    Mức {lastEntry.level}/5 · {lastEntry.levelLabel}
                    <span className="ml-2 text-[13px] font-medium text-ink-soft">({lastEntry.totalScore} điểm)</span>
                  </div>
                </div>
              </div>
            )}
            {!isReturning && (
              <div className="mt-12 max-w-[580px] rounded-r-xl border-l-[3px] border-l-primary bg-surface-warm px-[22px] py-5">
                <div className="flex items-start gap-3.5">
                  <span className="text-primary">
                    <I.smile size={22} color="currentColor" />
                  </span>
                  <div>
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Bạn có biết?</div>
                    <p className="text-[15px] font-medium leading-[1.55] text-ink">Theo WHO, khoảng <strong>1/3 nhân sự ở châu Á</strong> trải qua dấu hiệu burnout ít nhất một lần mỗi năm. Nếu bạn cảm thấy mệt mỏi, bạn không một mình — và việc bạn dành thời gian cho bài test này đã là một bước đi đúng. 🌱</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-5">
            <div className="anim-fadeUp rounded-2xl bg-surface p-[26px] [animation-delay:150ms]">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">Bài test diễn ra thế nào</div>
              {[
                { Icon: I.clock, title: 'Khoảng 5 phút', desc: '24 câu hỏi, mỗi câu một màn hình. Có nút Quay lại nếu bạn đổi ý.' },
                { Icon: I.shield, title: 'Hoàn toàn ẩn danh', desc: 'Kết quả lưu trên thiết bị của bạn. Không ai khác xem được.' },
                { Icon: I.leaf, title: 'Không phán xét', desc: 'Không có câu trả lời đúng/sai. Hãy nghĩ về 2–4 tuần gần nhất và trả lời thật.' },
                { Icon: I.sparkles, title: 'Kết quả cá nhân hóa', desc: 'Bạn nhận được phân tích nguyên nhân stress + gợi ý cụ thể có thể làm ngay tuần này.' },
              ].map((step, i) => {
                const StepIcon = step.Icon;
                return (
                  <div key={i} className={`flex gap-3.5 pb-3.5 ${i === 0 ? 'pt-0' : 'pt-3.5'} ${i === 3 ? '' : 'border-b border-rule'}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft">
                      <span className="text-primary">
                        <StepIcon size={18} color="currentColor" />
                      </span>
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-ink">{step.title}</div>
                      <div className="mt-0.5 text-[13px] leading-[1.5] text-ink-soft">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-[18px] text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">Dựa trên các framework khoa học</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['WHO ICD-11', 'MBI Maslach', 'HSE Standards', 'Job Demand–Control'].map((f) => (
                <span key={f} className="rounded-full border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-charcoal">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-12 max-w-7xl mx-auto pb-8">
        <Hairline />
        <div className="mt-5 text-sm font-medium text-ink-mute">
          { textFooter }
        </div>
      </div>
    </div>
  );
}

export function MilestoneScreen({ milestone, progress, onContinue, I }) {
  const M = milestone;
  const Icon = I[M.iconKey] || I.sparkles;
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-warm px-6">
      <div className="anim-fadeScale w-full max-w-xl text-center">
        <div className="anim-iconBounce mb-6 inline-flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white shadow-[0_10px_40px_rgba(225,29,46,0.15)]">
          <span className="text-primary">
            <Icon size={40} color="currentColor" />
          </span>
        </div>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Đã hoàn thành {progress}%</div>
        <h2 className="text-[clamp(26px,4vw,38px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">{M.title}</h2>
        <p className="mt-4 text-base font-medium leading-[1.6] text-ink-soft">{M.message}</p>
        <button
          onClick={onContinue}
          className="mt-8 inline-flex items-center gap-2.5 rounded-full border-0 bg-primary px-[26px] py-[13px] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(225,29,46,0.25)] transition-colors hover:bg-primary-deep"
        >
          {M.cta} <I.arrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
