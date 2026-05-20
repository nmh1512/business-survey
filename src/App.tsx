
// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DocorpLogo as UiDocorpLogo, Hairline as UiHairline, Tag as UiTag } from './components/ui';
import { WelcomeScreen } from './components/screens';
import { ResultsScreen } from './components/results-screen';
import { AdminScreen } from './components/admin-screen';
import { AssessmentScreen } from './components/assessment-screen';
import { ALL_QUESTIONS, CATEGORIES, MILESTONES, SCALE } from './constants/assessment';
import { Api } from './services/api';
import { Storage } from './services/storage';
import { buildRecommendations, classifyCategory, computeScores, getStressLevel, mapApiHistoryToLegacy } from './utils/scoring';

  /* ================================================================== */
  /*                              TOKENS                                */
  /* ================================================================== */
  const C = {
    bg: '#FFFFFF',
    surface: '#F7F7F8',
    surfaceWarm: '#FFF7F7',
    ink: '#1A1A1A',
    inkSoft: '#5A5A5F',
    inkMute: '#9A9AA0',
    rule: '#EAEAEC',
    red: '#E11D2E',
    redDeep: '#B81525',
    redSoft: '#FCE7E9',
    charcoal: '#2A2A2A',
    level1: '#16A34A',
    level2: '#EAB308',
    level3: '#F97316',
    level4: '#DC2626',
    level5: '#7F1D1D',
  };

  /* ================================================================== */
  /*                         INLINE SVG ICONS                           */
  /* ================================================================== */
  const Svg = ({ size = 24, color = 'currentColor', strokeWidth = 2, children, fill = 'none' }) => (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {children}
    </svg>
  );
  const I = {
    arrowRight: (p) => <Svg {...p}><path d="M5 12h14M12 5l7 7-7 7"/></Svg>,
    arrowLeft:  (p) => <Svg {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></Svg>,
    check:      (p) => <Svg {...p}><path d="M20 6 9 17l-5-5"/></Svg>,
    sparkles:   (p) => <Svg {...p}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></Svg>,
    shield:     (p) => <Svg {...p}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></Svg>,
    heart:      (p) => <Svg {...p}><path d="M11 17a1 1 0 0 1-.9-.4l-3.6-5a1 1 0 0 1 0-1.2l3.6-5a1 1 0 0 1 .9-.4h6.6a1 1 0 0 1 .8.4l3.6 5a1 1 0 0 1 0 1.2l-3.6 5a1 1 0 0 1-.9.4z"/><path d="m15 5-3 4 3 4"/></Svg>,
    coffee:     (p) => <Svg {...p}><path d="M10 2v2M14 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1zM6 2v2"/><path d="M17 5h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2"/></Svg>,
    wind:       (p) => <Svg {...p}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></Svg>,
    sun:        (p) => <Svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></Svg>,
    leaf:       (p) => <Svg {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></Svg>,
    printer:    (p) => <Svg {...p}><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V2h12v7"/><rect x="6" y="14" width="12" height="8" rx="1"/></Svg>,
    rotate:     (p) => <Svg {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></Svg>,
    smile:      (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></Svg>,
    clock:      (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Svg>,
    users:      (p) => <Svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Svg>,
    target:     (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Svg>,
    scale:      (p) => <Svg {...p}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></Svg>,
    compass:    (p) => <Svg {...p}><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></Svg>,
    award:      (p) => <Svg {...p}><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></Svg>,
    battery:    (p) => <Svg {...p}><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/></Svg>,
    trendingUp: (p) => <Svg {...p}><path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/></Svg>,
    trendingDown: (p) => <Svg {...p}><path d="M22 17 13.5 8.5l-5 5L2 7"/><path d="M16 17h6v-6"/></Svg>,
    activity:   (p) => <Svg {...p}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.24 2.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4 12H2"/></Svg>,
    handshake:  (p) => <Svg {...p}><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/></Svg>,
    download:   (p) => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></Svg>,
  };

  /* ================================================================== */
  /*                              LOGO                                  */
  /* ================================================================== */
  const DocorpLogo = ({ size = 28, withTagline = false }) => (
    <UiDocorpLogo size={size} withTagline={withTagline} colors={{ red: C.red }} />
  );

  /* ================================================================== */
  /*                            CONTENT                                 */
  /* ================================================================== */

  /* ================================================================== */
  /*                          SHARED UI                                 */
  /* ================================================================== */
  const Tag = ({ children, color = C.red, bg = C.redSoft }) => (
    <UiTag color={color} bg={bg}>{children}</UiTag>
  );
  const Hairline = () => <UiHairline ruleColor={C.rule} />;

  /* ================================================================== */
  /*                         RESULTS SCREEN                             */
  /* ================================================================== */

  /* ================================================================== */
  /*                              APP                                   */
  /* ================================================================== */
  function AssessmentApp() {
    const [stage, setStage] = useState('welcome');
    const [answers, setAnswers] = useState({});
    const [history, setHistory] = useState([]);
    const [hasProgress, setHasProgress] = useState(false);
    const [sessionId] = useState(() => Storage.getSessionId());
    const [businessCode] = useState(() => {
      const fromEnv = import.meta.env.VITE_DOCORP_BUSINESS_CODE;
      const fromQuery = new URLSearchParams(window.location.search).get('businessCode');
      return (fromQuery || fromEnv || '').toString().trim().toLowerCase();
    });

    // On mount: load progress + history
    useEffect(() => {
      const loadHistory = async () => {
        try {
          const apiHistory = await Api.getHistory(sessionId);
          const normalized = [...apiHistory].reverse().map((entry) => mapApiHistoryToLegacy(entry, C));
          setHistory(normalized);
        } catch (error) {
          setHistory(Storage.getHistory());
          console.error(error);
        }
      };

      const progress = Storage.getProgress();
      if (progress && progress.answers && Object.keys(progress.answers).length > 0
          && Object.keys(progress.answers).length < ALL_QUESTIONS.length) {
        setAnswers(progress.answers);
        setHasProgress(true);
      }
      loadHistory();
      // hide boot loader
      const boot = document.getElementById('boot');
      if (boot) {
        boot.classList.add('hidden');
        setTimeout(() => boot.remove(), 500);
      }
    }, [sessionId]);

    const handleStart = () => {
      // If has progress, keep answers; else fresh start
      if (!hasProgress) setAnswers({});
      setStage('assessment');
    };

    const handleComplete = async () => {
      try {
        const submitResult = await Api.submitAssessment(sessionId, answers, businessCode);
        setHistory((prev) => [
          ...prev,
          mapApiHistoryToLegacy({
            date: submitResult.date,
            totalScore: submitResult.totalScore,
            stressLevel: submitResult.stressLevel,
            categoryScores: submitResult.categoryScores,
          }, C),
        ]);
      } catch (error) {
        console.error("Lỗi khi lưu kết quả lên server:", error);
        try {
          const scores = computeScores(answers);
          const level = getStressLevel(scores.totalScore);
          const localEntry = {
            date: new Date().toISOString().split('T')[0],
            totalScore: scores.totalScore,
            stressLevel: level.level,
            categoryScores: Object.keys(scores.categories).map((catId) => ({
              categoryId: catId,
              score: scores.categories[catId],
            })),
          };
          setHistory((prev) => [
            ...prev,
            mapApiHistoryToLegacy(localEntry, C),
          ]);
        } catch (localError) {
          console.error("Lỗi khi tạo lịch sử cục bộ:", localError);
        }
      }

      Storage.clearProgress();
      setHasProgress(false);
      setStage('results');
      window.scrollTo(0, 0);
    };

    const handleRestart = () => {
      Storage.clearProgress();
      setAnswers({});
      setHasProgress(false);
      setStage('welcome');
      window.scrollTo(0, 0);
    };

    return (
      <>
        {stage === 'welcome' && (
          <WelcomeScreen
            onStart={handleStart}
            hasProgress={hasProgress}
            history={history}
            C={C}
            I={I}
            Tag={Tag}
            Hairline={Hairline}
            DocorpLogo={DocorpLogo}
          />
        )}
        {stage === 'assessment' && (
          <AssessmentScreen
            answers={answers}
            setAnswers={setAnswers}
            onComplete={handleComplete}
            onBackToWelcome={() => setStage('welcome')}
            ALL_QUESTIONS={ALL_QUESTIONS}
            CATEGORIES={CATEGORIES}
            I={I}
            C={C}
            Storage={Storage}
            MILESTONES={MILESTONES}
            SCALE={SCALE}
            DocorpLogo={DocorpLogo}
          />
        )}
        {stage === 'results' && (
          <ResultsScreen
            answers={answers}
            onRestart={handleRestart}
            history={history.slice(0, -1) /* exclude current entry already saved */}
            computeScores={computeScores}
            getStressLevel={getStressLevel}
            buildRecommendations={buildRecommendations}
            classifyCategory={classifyCategory}
            C={C}
            I={I}
            Tag={Tag}
            Hairline={Hairline}
            DocorpLogo={DocorpLogo}
          />
        )}
      </>
    );
  }

  function Root() {

    useEffect(() => {
      const boot = document.getElementById('boot');
      if (boot) {
        boot.classList.add('hidden');
        setTimeout(() => boot.remove(), 500);
      }

      return undefined;
    }, []);

    return (
      <Routes>
        <Route path="/" element={<AssessmentApp />} />
        <Route
          path="/admin"
          element={(
            <AdminScreen
              C={C}
              Api={Api}
              Storage={Storage}
              DocorpLogo={DocorpLogo}
              Tag={Tag}
              Hairline={Hairline}
              I={I}
              classifyCategory={classifyCategory}
              buildRecommendations={buildRecommendations}
            />
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  export default Root;
  






