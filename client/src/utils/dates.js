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
    name: '학원 병행 스타트',
    emoji: '🏫',
    start: '2026-04-27',
    end: '2026-04-29',
    color: '#06b6d4',
    colorClass: 'cyan',
    goal: '끊기지 않기 — 저녁 최소 루틴만',
    daily: ['컴일 1~2강', '정보보호 1강', '국어 20분'],
    tip: '학원 마치고 저녁 1~2시간만. 이해 70%면 그냥 넘어가!',
    hours: '1~2시간',
  },
  {
    id: 2,
    name: '첫 풀데이 🚀',
    emoji: '🚀',
    start: '2026-04-30',
    end: '2026-04-30',
    color: '#8b5cf6',
    colorClass: 'purple',
    goal: '본격 시작 전환점',
    daily: ['컴일 3강 + 문제', '정보보호 2강', '국어 1시간', '한국사 1시간'],
    tip: '오늘부터 페이스 올리는 날. 컴일·정보보호 집중!',
    hours: '5~6시간',
  },
  {
    id: 3,
    name: '골든타임 🔥',
    emoji: '💥',
    start: '2026-05-01',
    end: '2026-05-10',
    color: '#f59e0b',
    colorClass: 'amber',
    goal: '컴일+정보보호 1회독 완료 + 기출 맛보기',
    daily: ['컴일 2.5~3시간 (인강+문제)', '정보보호 1.5~2시간', '국어 1~1.5시간', '한국사 1시간'],
    tip: '여기서 승부 갈림. 완벽주의 버리고 기출 바로 병행!',
    hours: '6시간',
  },
  {
    id: 4,
    name: '상하이 여행 ✈️',
    emoji: '✈️',
    start: '2026-05-11',
    end: '2026-05-14',
    color: '#06b6d4',
    colorClass: 'cyan',
    goal: '유지 모드 — 리듬 절대 끊지 않기',
    daily: ['한국사 핵심 흐름 30분', '또는 국어 독해 20분'],
    tip: '이거 안 하면 여행 후 리듬 붕괴! 가볍게라도 매일.',
    hours: '30분',
  },
  {
    id: 5,
    name: '여행 복귀 재정비',
    emoji: '🔄',
    start: '2026-05-15',
    end: '2026-05-15',
    color: '#10b981',
    colorClass: 'green',
    goal: '페이스 복귀 + 한국사 시작',
    daily: ['컴일·정보보호 가볍게 복귀', '한국사 Day1: 선사~고려'],
    tip: '여행 후 첫날, 무리 금지. 리듬 되찾는 게 목표.',
    hours: '3~4시간',
  },
  {
    id: 6,
    name: '결혼식 💍',
    emoji: '💍',
    start: '2026-05-16',
    end: '2026-05-16',
    color: '#ec4899',
    colorClass: 'pink',
    goal: '최소 루틴 사수 — 완전 OFF 금지',
    daily: ['컴일 1강 (이동 중이라도)', '정보보호 1강'],
    tip: '바쁜 날이어도 완전 OFF는 금지. 1시간만 터치!',
    hours: '1시간',
  },
  {
    id: 7,
    name: '한능검 직전 ⚔️',
    emoji: '⚔️',
    start: '2026-05-17',
    end: '2026-05-22',
    color: '#10b981',
    colorClass: 'green',
    goal: '한국사 3~4일 압축 + 군무원 유지',
    daily: ['한국사: 조선→근현대→기출 2~3회', '컴일·정보보호 유지 (끊지 않기)'],
    tip: '한능검은 짧고 굵게 끝내기. 군무원이 메인!',
    hours: '4~5시간',
  },
  {
    id: 8,
    name: '한능검 시험 🎯',
    emoji: '🎯',
    start: '2026-05-23',
    end: '2026-05-23',
    color: '#ec4899',
    colorClass: 'pink',
    goal: '3급 컷 확보',
    daily: ['맞출 것만 맞추기', '욕심 버리기', '컨디션 최상'],
    tip: '어려운 건 남들도 어렵다. 아는 것만 다 맞추자!',
    hours: '시험일',
  },
  {
    id: 9,
    name: '진짜 승부 구간 💪',
    emoji: '🔥',
    start: '2026-05-24',
    end: '2026-06-14',
    color: '#6366f1',
    colorClass: 'purple',
    goal: '기출 반복 + 약점 집중 보완',
    daily: ['컴일 기출 (최우선)', '정보보호 기출 + 암기', '국어 유지 + 실전'],
    tip: '인강 ❌ 기출 ✅. 여기서 합격 결정됨!',
    hours: '5~6시간',
  },
  {
    id: 10,
    name: '파이널 루틴 💣',
    emoji: '💣',
    start: '2026-06-15',
    end: '2026-07-03',
    color: '#f97316',
    colorClass: 'orange',
    goal: '아는 걸 틀리지 않게 만들기',
    daily: ['컴일 기출 1회분 (시간 재기)', '정보보호 기출 1회분', '국어 실전 세트', '오답 + 약점 암기'],
    tip: '실전 감각 유지! 새로운 것 절대 시작 ❌',
    hours: '5~6시간',
  },
  {
    id: 11,
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
