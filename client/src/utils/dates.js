import { format, differenceInDays, parseISO, startOfWeek, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export const GUNMUWON_DATE = '2026-07-04';
export const HANNEUNG_DATE = '2026-05-23';

export const today = () => format(new Date(), 'yyyy-MM-dd');

export const daysUntil = (dateStr) => {
  const target = parseISO(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return differenceInDays(target, now);
};

export const formatDate = (dateStr) =>
  format(parseISO(dateStr), 'M월 d일 (EEE)', { locale: ko });

export const getWeekDates = (weekStart) =>
  Array.from({ length: 7 }, (_, i) => format(addDays(parseISO(weekStart), i), 'yyyy-MM-dd'));

export const getMonday = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return format(d, 'yyyy-MM-dd');
};

export const STUDY_PHASES = [
  {
    id: 1,
    name: '스타트 구간',
    emoji: '🚀',
    start: '2026-04-27',
    end: '2026-04-30',
    color: '#06b6d4',
    colorClass: 'cyan',
    goal: '끊기지 않기 — 매일 했다 유지',
    daily: ['국어 40분 (문법 or 독해)', '컴일 2강', '정보보호 1강'],
    tip: '이해 70%면 그냥 넘어가기. 절대 무리 X',
    hours: '2~3시간',
  },
  {
    id: 2,
    name: '골든타임 🔥',
    emoji: '💥',
    start: '2026-05-01',
    end: '2026-05-10',
    color: '#f59e0b',
    colorClass: 'amber',
    goal: '컴일 + 정보보호 1회독 완료',
    daily: ['컴일 3~4강 + 문제', '정보보호 2~3강', '국어 1시간', '한국사 1시간', '기출 병행'],
    tip: '기출 바로 병행! 여기서 합격/불합격 갈림',
    hours: '5~7시간',
  },
  {
    id: 3,
    name: '상하이 여행 ✈️',
    emoji: '✈️',
    start: '2026-05-11',
    end: '2026-05-14',
    color: '#8b5cf6',
    colorClass: 'purple',
    goal: '유지 모드 — 리듬 깨지 않기',
    daily: ['한국사 요약 30분', '국어 가볍게 20분'],
    tip: '문제풀이 ❌ 무거운 공부 ❌ 유지만!',
    hours: '30~40분',
  },
  {
    id: 4,
    name: '한능검 준비',
    emoji: '⚔️',
    start: '2026-05-15',
    end: '2026-05-22',
    color: '#10b981',
    colorClass: 'green',
    goal: '한국사 4일 압축 + 군무원 유지',
    daily: ['Day1: 선사~고려', 'Day2: 조선', 'Day3: 근현대', 'Day4: 기출 2~3회', '+군무원 과목 유지'],
    tip: '3급 안정 컷 목표. 욕심 버리기!',
    hours: '4~6시간',
  },
  {
    id: 5,
    name: '한능검 시험 🎯',
    emoji: '🎯',
    start: '2026-05-23',
    end: '2026-05-23',
    color: '#ec4899',
    colorClass: 'pink',
    goal: '3급 안정 컷 달성',
    daily: ['맞출 것만 맞추기', '욕심 버리기', '컨디션 최상 유지'],
    tip: '오늘 하루 최선! 어려운 건 남들도 어렵다',
    hours: '시험일',
  },
  {
    id: 6,
    name: '집중 공부 구간',
    emoji: '💪',
    start: '2026-05-24',
    end: '2026-06-14',
    color: '#6366f1',
    colorClass: 'purple',
    goal: '기출 반복 + 약점 보완',
    daily: ['컴일 기출 2시간', '정보보호 기출 1.5시간', '국어 1시간', '오답 정리 1시간'],
    tip: '인강 ❌ 기출 ✅ 주력 전환!',
    hours: '5~6시간',
  },
  {
    id: 7,
    name: '파이널 루틴 💣',
    emoji: '🔥',
    start: '2026-06-15',
    end: '2026-07-03',
    color: '#f97316',
    colorClass: 'orange',
    goal: '아는 걸 틀리지 않게 만들기',
    daily: ['컴일 기출 1회분 (시간 재기)', '정보보호 기출 1회분', '국어 실전 세트', '오답 + 약점 암기'],
    tip: '실전 감각 유지! 새로운 것 시작 ❌',
    hours: '5~6시간',
  },
  {
    id: 8,
    name: '군무원 D-DAY 🏆',
    emoji: '🏆',
    start: '2026-07-04',
    end: '2026-07-04',
    color: '#a78bfa',
    colorClass: 'purple',
    goal: '합격!',
    daily: ['아는 것 먼저', '시간 배분 철저', '국어→컴일→정보보호 순', '포기하지 말기'],
    tip: '지식 싸움이 아니라 운영 싸움이다!',
    hours: '시험일',
  },
];

export const getCurrentPhase = () => {
  const todayStr = today();
  for (const phase of STUDY_PHASES) {
    if (todayStr >= phase.start && todayStr <= phase.end) return phase;
  }
  if (todayStr < STUDY_PHASES[0].start) return STUDY_PHASES[0];
  return STUDY_PHASES[STUDY_PHASES.length - 1];
};

export const SUBJECTS = [
  { id: '컴퓨터일반', label: '💻 컴퓨터일반', color: '#7c3aed', dot: '#8b5cf6' },
  { id: '정보보호론', label: '🔐 정보보호론', color: '#06b6d4', dot: '#22d3ee' },
  { id: '국어',       label: '📖 국어',       color: '#10b981', dot: '#34d399' },
  { id: '한국사',     label: '🏛️ 한국사',     color: '#f59e0b', dot: '#fbbf24' },
  { id: '기출문제',   label: '📝 기출문제',   color: '#ec4899', dot: '#f472b6' },
];

export const SUBJECT_COLORS = Object.fromEntries(
  SUBJECTS.map(s => [s.id, s])
);

export const SESSION_TYPES = ['인강', '기출', '복습', '오답정리', '암기', '문제풀이'];

export const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
