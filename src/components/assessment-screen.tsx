// @ts-nocheck
import { useEffect, useState } from 'react';
import { MilestoneScreen } from './screens';

export function AssessmentScreen({
  answers,
  setAnswers,
  onComplete,
  onBackToWelcome,
  ALL_QUESTIONS,
  CATEGORIES,
  I,
  Storage,
  MILESTONES,
  SCALE,
  DocorpLogo,
}) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = ALL_QUESTIONS.findIndex((q) => !(q.id in answers));
    return idx === -1 ? 0 : idx;
  });
  const [shownMilestones, setShownMilestones] = useState(new Set());
  const [activeMilestone, setActiveMilestone] = useState(null);

  const total = ALL_QUESTIONS.length;
  const q = ALL_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;
  const cat = CATEGORIES.find((c) => c.id === q.categoryId);
  const CatIcon = I[cat.iconKey];

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    Storage.setProgress({ answers: newAnswers, updatedAt: new Date().toISOString() });

    const completedCount = currentIndex + 1;
    setTimeout(() => {
      if (MILESTONES[completedCount] && !shownMilestones.has(completedCount) && completedCount < total) {
        setActiveMilestone(completedCount);
        setShownMilestones((prev) => new Set([...prev, completedCount]));
        return;
      }
      if (currentIndex < total - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete();
      }
    }, 280);
  };

  useEffect(() => {
    const handler = (e) => {
      if (activeMilestone) return;
      const k = e.key;
      if (['1', '2', '3', '4', '5'].includes(k)) handleSelect(parseInt(k, 10));
      else if (k === 'ArrowLeft' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, activeMilestone, answers]);

  if (activeMilestone) {
    return (
      <MilestoneScreen
        milestone={MILESTONES[activeMilestone]}
        progress={Math.round((activeMilestone / total) * 100)}
        I={I}
        onContinue={() => {
          setActiveMilestone(null);
          if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1);
          else onComplete();
        }}
      />
    );
  }

  const selected = answers[q.id];

  return (
    <div className="min-h-screen w-full flex flex-col bg-bg">
      <div className="px-5 pb-3 pt-5 md:px-10 md:pt-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            onClick={onBackToWelcome}
            className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] font-semibold text-ink-soft"
          >
            <I.arrowLeft size={14} /> Thoát
          </button>
          <DocorpLogo size={20} />
        </div>

        <div className="mx-auto mt-5 max-w-4xl">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-ink-soft">
              <span className="text-primary">
                <CatIcon size={14} color="currentColor" />
              </span>
              {cat.icon} · {cat.label}
            </span>
            <span className="text-sm font-bold text-ink">
              {currentIndex + 1} <span className="font-medium text-ink-mute">/ {total}</span>
            </span>
          </div>

          <progress className="w-full h-1.5 border-0 rounded-full overflow-hidden bg-surface [&::-webkit-progress-bar]:bg-surface [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-primary [&::-webkit-progress-value]:to-primary-deep [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-700 [&::-webkit-progress-value]:ease-in-out [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-gradient-to-r [&::-moz-progress-bar]:from-primary [&::-moz-progress-bar]:to-primary-deep [&::-moz-progress-bar]:transition-[width] [&::-moz-progress-bar]:duration-700 [&::-moz-progress-bar]:ease-in-out" max={100} value={progress} />
        </div>
      </div>

      <div className="flex flex-1 items-center px-5 py-8 md:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-3.5 text-[13px] font-bold text-primary">Câu hỏi {currentIndex + 1}</div>

          <h2
            key={q.id}
            className="anim-fadeUp max-w-[820px] text-[clamp(22px,4vw,40px)] font-bold leading-[1.22] tracking-[-0.02em] text-ink"
          >
            {q.text}
          </h2>

          <div className="mt-3.5 inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft">
            <span className="text-primary">
              <I.leaf size={14} color="currentColor" />
            </span>
            <span>Hãy nghĩ về 2–4 tuần gần nhất</span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-2.5 md:grid-cols-5 md:gap-3">
            {SCALE.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`rounded-[14px] border-2 p-[16px_14px] text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary text-white -translate-y-0.5 shadow-[0_8px_20px_rgba(225,29,46,0.25)]'
                      : 'border-rule bg-bg text-ink hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className={`text-[22px] font-extrabold ${isSelected ? 'text-white' : 'text-primary'}`}>{opt.value}</div>
                    <span className="text-[22px]">{opt.emoji}</span>
                  </div>
                  <div className={`text-[13px] font-semibold leading-[1.3] ${isSelected ? 'text-white' : 'text-ink'}`}>{opt.label}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className={`w-full justify-center sm:w-auto sm:justify-start inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold ${
                currentIndex === 0 ? 'cursor-not-allowed text-ink-mute' : 'text-ink-soft'
              }`}
            >
              <I.arrowLeft size={14} /> Câu trước
            </button>

            {selected && currentIndex < total - 1 && (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="w-full justify-center sm:w-auto sm:justify-end inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-bold text-primary"
              >
                Câu tiếp <I.arrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
