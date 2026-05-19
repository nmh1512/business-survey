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
  C,
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
        C={C}
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
    <div className="min-h-screen w-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 md:px-10 pt-5 md:pt-6 pb-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBackToWelcome} style={{ fontSize: 13, color: C.inkSoft, fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <I.arrowLeft size={14} /> Thoát
          </button>
          <DocorpLogo size={20} />
        </div>
        <div className="max-w-4xl mx-auto mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.inkSoft, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <CatIcon size={14} color={C.red} />
              {cat.icon} · {cat.label}
            </span>
            <span style={{ fontSize: 14, color: C.ink, fontWeight: 700 }}>
              {currentIndex + 1} <span style={{ color: C.inkMute, fontWeight: 500 }}>/ {total}</span>
            </span>
          </div>
          <div style={{ height: 6, background: C.surface, width: '100%', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${C.red}, ${C.redDeep})`, transition: 'width 0.5s cubic-bezier(.4,0,.2,1)', borderRadius: 999 }} />
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center px-5 md:px-10 py-8">
        <div className="max-w-4xl w-full mx-auto">
          <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 14 }}>Câu hỏi {currentIndex + 1}</div>
          <h2 key={q.id} className="anim-fadeUp" style={{ fontWeight: 700, fontSize: 'clamp(22px, 4vw, 40px)', lineHeight: 1.22, letterSpacing: '-0.02em', color: C.ink, maxWidth: 820 }}>
            {q.text}
          </h2>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <I.leaf size={14} color={C.red} />
            <span>Hãy nghĩ về 2–4 tuần gần nhất</span>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-2.5 md:gap-3">
            {SCALE.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{ background: isSelected ? C.red : '#FFFFFF', color: isSelected ? '#FFFFFF' : C.ink, border: `2px solid ${isSelected ? C.red : C.rule}`, borderRadius: 14, cursor: 'pointer', padding: '16px 14px', textAlign: 'left', transform: isSelected ? 'translateY(-2px)' : 'translateY(0)', boxShadow: isSelected ? '0 8px 20px rgba(225, 29, 46, 0.25)' : '0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = C.red;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = C.rule;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: isSelected ? '#FFFFFF' : C.red }}>{opt.value}</div>
                    <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#FFFFFF' : C.ink, lineHeight: 1.3 }}>{opt.label}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              style={{ background: 'transparent', border: 'none', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', color: currentIndex === 0 ? C.inkMute : C.inkSoft, fontSize: 14, fontWeight: 600, padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <I.arrowLeft size={14} /> Câu trước
            </button>
            {selected && currentIndex < total - 1 && (
              <button onClick={() => setCurrentIndex(currentIndex + 1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.red, fontSize: 14, fontWeight: 700, padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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
