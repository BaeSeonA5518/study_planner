import React, { useState } from 'react';
import { STUDY_PHASES, today, daysUntil } from '../utils/dates';
import { parseISO, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PC = {
  cyan:  {dot:'bg-cyan-500',  ring:'ring-cyan-200',  bg:'bg-cyan-50',  border:'border-cyan-200',  text:'text-cyan-700',  tip:'bg-cyan-100'},
  amber: {dot:'bg-amber-500', ring:'ring-amber-200', bg:'bg-amber-50', border:'border-amber-200', text:'text-amber-700', tip:'bg-amber-100'},
  green: {dot:'bg-emerald-500',ring:'ring-emerald-200',bg:'bg-emerald-50',border:'border-emerald-200',text:'text-emerald-700',tip:'bg-emerald-100'},
  purple:{dot:'bg-violet-500',ring:'ring-violet-200',bg:'bg-violet-50',border:'border-violet-200',text:'text-violet-700',tip:'bg-violet-100'},
  pink:  {dot:'bg-pink-500',  ring:'ring-pink-200',  bg:'bg-pink-50',  border:'border-pink-200',  text:'text-pink-700',  tip:'bg-pink-100'},
  orange:{dot:'bg-orange-500',ring:'ring-orange-200',bg:'bg-orange-50',border:'border-orange-200',text:'text-orange-700',tip:'bg-orange-100'},
};

const getStatus = p => {
  const t = today();
  if (t > p.end) return 'done';
  if (t >= p.start) return 'active';
  return 'future';
};

/* ─── 점수 시뮬레이션 데이터 ─────────────────────────── */
const SCORE_SIM = [
  {
    stage:'1단계',period:'지금 ~ 5/10',label:'개념 익숙해지는 단계',
    score:'40~55점',prob:'30~40%',
    desc:'문제 보면 "아 본 적 있음"인데 확신 없음',
    tip:'여기서 좌절 많이 함 → 정상이다!',
    bg:'bg-slate-50',border:'border-slate-200',tc:'text-slate-600',
    danger:true,dangerMsg:'점수 안 나온다고 여기서 포기하면 안 됨',
  },
  {
    stage:'2단계',period:'5/15 ~ 6/10',label:'문제 적응 시작',
    score:'55~70점',prob:'50~65%',
    desc:'반복 문제는 맞추기 시작. 틀리는 유형 줄어듦',
    tip:'합격권 보이기 시작하는 구간',
    bg:'bg-amber-50',border:'border-amber-200',tc:'text-amber-700',
    danger:false,
  },
  {
    stage:'3단계',period:'6/10 ~ 시험 전',label:'🔥 점수 폭발 구간',
    score:'70~85점',prob:'70~85%',
    desc:'기출 2회독+ / 아는 문제는 거의 안 틀림 / 시간 관리 가능',
    tip:'6월 중순에 50점 → 70점대 점프 체감 옴!',
    bg:'bg-emerald-50',border:'border-emerald-200',tc:'text-emerald-700',
    danger:false,
    explosion:true,
  },
];

const SUBJECT_SCORE = [
  {sub:'💻 컴퓨터일반',early:'30~50점',late:'70~85점',note:'상승폭 제일 큼',color:'text-violet-700',bg:'bg-violet-50',border:'border-violet-200'},
  {sub:'🔐 정보보호론',early:'40~60점',late:'65~80점',note:'암기 잘하면 빠르게 오름',color:'text-cyan-700',bg:'bg-cyan-50',border:'border-cyan-200'},
  {sub:'📖 국어',      early:'50~65점',late:'60~75점',note:'큰 상승 없음. 대신 안정화',color:'text-emerald-700',bg:'bg-emerald-50',border:'border-emerald-200'},
];

const DANGER_ZONES = [
  {period:'5월 초 (~5/10)',emoji:'🚨',title:'가장 많이 탈락하는 구간',desc:'점수 안 나옴 + 이해 안 됨 + 자신감 ↓ → 여기서 포기하는 사람 많음',solution:'버티면 됨. 이 구간은 원래 그래'},
  {period:'5월 중순 (~5/20)',emoji:'⚠️',title:'여행 + 한능검 + 일정 겹침',desc:'흐름 끊기기 쉬운 구간',solution:'최소 루틴 유지 (1~2강이라도)'},
  {period:'6월 초',emoji:'😤',title:'슬럼프 구간',desc:'"했는데 왜 점수 안 오르지?" → 정상임. 반복해야 올라감',solution:'포기 말고 반복. 6월 중순에 터짐'},
];

/* ─── D-7 최종 전략 ─────────────────────────────── */
const FINAL_WEEK = [
  {
    period:'D-7 ~ D-4',label:'실전 훈련',tag:'4일간',tagColor:'bg-red-100 text-red-700',
    tasks:['컴일 기출 1회분 (시간 재고)','정보보호 기출 1회분','국어 1세트 or 독해'],
    must:'틀린 문제 → 개념 다시 보기 + ⭐ 오답 표시 → 이게 점수 상승 핵심',
  },
  {
    period:'D-3 ~ D-2',label:'정리 모드',tag:'2일간',tagColor:'bg-amber-100 text-amber-700',
    tasks:['오답 노트 반복','헷갈리는 개념만 보기'],
    must:'새로운 문제 ❌ 새로운 강의 ❌ — 기억 꼬이면 점수 하락',
  },
  {
    period:'D-1',label:'컨디션 관리',tag:'전날',tagColor:'bg-emerald-100 text-emerald-700',
    tasks:['공부 2~3시간만','오답 가볍게 보기','일찍 자기'],
    must:'여기서 무리하면 다음날 망함. 컨디션이 점수임',
  },
];

/* ─── 합격자 패턴 ────────────────────────────────── */
const PASSER_PATTERNS = [
  {emoji:'✅',title:'완벽하게 안 함',desc:'1회독: 대충 → 2회독: 이해 → 3회독: 완성\n대충 봐도 반복이 답'},
  {emoji:'📚',title:'기출 중심',desc:'인강 많이 안 봄. 문제 계속 반복\n"문제가 교재"'},
  {emoji:'🔥',title:'매일 함',desc:'많이 하는 날 없음. 대신 끊기지 않음\n"안 하는 날이 없는 것"이 핵심'},
  {emoji:'💪',title:'포기 안 함',desc:'5월: 점수 안 나옴 → 6월: 올라감\n이 구간을 버틴 사람이 붙음'},
];

const FAIL_PATTERNS = [
  '인강만 계속 들음 (문제 안 품)',
  '완벽하게 하려다가 진도 멈춤',
  '일정 때문에 흐름 끊김',
  '점수 안 나온다고 5~6월에 포기',
];

export default function Timeline() {
  const [tab, setTab]         = useState('timeline');
  const [expanded, setExpanded] = useState(null);

  const TABS = [
    {id:'timeline', label:'🗺️ 학습 타임라인'},
    {id:'score',    label:'📈 점수 시뮬레이션'},
    {id:'final',    label:'🎯 D-7 최종 전략'},
    {id:'passer',   label:'🏆 합격자 패턴'},
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">🗺️ 타임라인 & 합격 분석</h1>
        <p className="page-subtitle">4/27 ~ 7/4 로드맵 + 점수 전망 + 합격 전략</p>
      </div>

      {/* 탭 */}
      <div className="grid grid-cols-4 gap-2 mb-6 max-sm:grid-cols-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-2.5 rounded-xl text-xs font-bold border transition-all
              ${tab===t.id ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 학습 타임라인 ── */}
      {tab === 'timeline' && (
        <div>
          {/* 전체 현황 */}
          <div className="card bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200 mb-6">
            <div className="grid grid-cols-4 gap-4 mb-5 max-sm:grid-cols-2">
              {[
                {label:'전체 기간', value:'69일',  icon:'📅', color:'text-violet-700'},
                {label:'군무원까지', value:`D-${Math.max(0,daysUntil('2026-07-04'))}`, icon:'🏆', color:'text-violet-700'},
                {label:'한능검까지', value:`D-${Math.max(0,daysUntil('2026-05-23'))}`, icon:'📋', color:'text-sky-600'},
                {label:'학습 구간', value:`${STUDY_PHASES.length}개`, icon:'🗺️', color:'text-emerald-600'},
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl mb-1.5">{item.icon}</div>
                  <div className={`text-2xl font-extrabold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="flex rounded-lg overflow-hidden h-3 gap-0.5">
              {STUDY_PHASES.map(phase => {
                const s = parseISO(phase.start), e = parseISO(phase.end);
                const total = STUDY_PHASES.reduce((acc,p) => acc + Math.max(1,Math.round((parseISO(p.end)-parseISO(p.start))/86400000)+1), 0);
                const days  = Math.max(1, Math.round((e-s)/86400000)+1);
                const st    = getStatus(phase);
                const c     = PC[phase.colorClass] || PC.purple;
                return (
                  <div key={phase.id} title={phase.name}
                       className={`${st==='future'?'bg-slate-200':c.dot} rounded-sm`}
                       style={{flex:(days/total)*100, opacity:st==='done'?0.5:1}} />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5">
              <span>4/27 시작</span><span>5/23 한능검</span><span>7/4 군무원 🏆</span>
            </div>
          </div>

          <div className="timeline">
            {STUDY_PHASES.map(phase => {
              const status = getStatus(phase);
              const c      = PC[phase.colorClass] || PC.purple;
              const active = status === 'active';
              const done   = status === 'done';
              const open   = expanded === phase.id;
              return (
                <div key={phase.id} className="timeline-item">
                  <div className={`timeline-dot w-3.5 h-3.5 border-2 ${c.dot.replace('bg-','border-')}
                    ${active ? `${c.dot} ring-4 ${c.ring} !w-4 !h-4` : done ? c.dot : 'bg-white'}`} />
                  <div onClick={() => setExpanded(open?null:phase.id)}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 select-none
                      ${active ? `${c.bg} ${c.border} shadow-md` : done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-card hover:shadow-card-hover'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-slate-400 font-medium mb-1">
                          {format(parseISO(phase.start),'M/d',{locale:ko})}
                          {phase.start!==phase.end&&` ~ ${format(parseISO(phase.end),'M/d',{locale:ko})}`}
                          {' · '}{phase.hours}
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg">{phase.emoji}</span>
                          <span className={`font-extrabold text-[15px] ${active?c.text:done?'text-slate-400':'text-slate-800'}`}>{phase.name}</span>
                          {active && <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${c.dot} text-white`}>진행 중</span>}
                          {done   && <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">완료 ✓</span>}
                        </div>
                        <div className="text-sm text-slate-500 font-medium">🎯 {phase.goal}</div>
                      </div>
                      <span className="text-slate-300 text-sm mt-1 flex-shrink-0">{open?'▲':'▼'}</span>
                    </div>
                    {open && (
                      <div className={`mt-4 pt-4 border-t ${c.border} grid grid-cols-2 gap-4 max-sm:grid-cols-1`}>
                        <div>
                          <p className="section-label">하루 할 것</p>
                          <ul className="flex flex-col gap-1.5">
                            {phase.daily.map((d,i) => (
                              <li key={i} className="flex gap-2 text-sm text-slate-600">
                                <span className={`${c.text} font-bold flex-shrink-0`}>→</span>{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="section-label">핵심 팁</p>
                          <div className={`${c.tip} border ${c.border} rounded-xl p-3 text-sm ${c.text} leading-relaxed font-medium`}>
                            💡 {phase.tip}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 시험 당일 전략 */}
          <div className="card mt-4 bg-gradient-to-br from-slate-50 to-violet-50 border-violet-200">
            <h3 className="font-extrabold text-xl text-slate-800 mb-4">🎯 D-DAY 시험 전략 (7월 4일)</h3>
            <div className="grid grid-cols-4 gap-3 mb-4 max-lg:grid-cols-2">
              {[
                {time:'시간 배분',items:['국어 20~25분','컴일 25~30분','정보보호 25~30분'],bg:'bg-violet-50',border:'border-violet-200',tc:'text-violet-700'},
                {time:'1회독 전략',items:['아는 문제 즉시 체크','헷갈리면 표시 후 넘기기','집착 금지!'],bg:'bg-cyan-50',border:'border-cyan-200',tc:'text-cyan-700'},
                {time:'2회독 전략',items:['표시한 문제만 재검토','30초~1분 후 찍기','미련 없이 제출'],bg:'bg-emerald-50',border:'border-emerald-200',tc:'text-emerald-700'},
                {time:'멘탈 관리',items:['어려운 건 남들도 어려워','아는 것만 다 맞추자','침착하게!'],bg:'bg-amber-50',border:'border-amber-200',tc:'text-amber-700'},
              ].map(s => (
                <div key={s.time} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                  <div className={`font-bold text-sm ${s.tc} mb-2.5`}>{s.time}</div>
                  {s.items.map((item,i) => (
                    <div key={i} className="flex gap-2 text-[13px] text-slate-600 mb-1">
                      <span className={`${s.tc} font-bold flex-shrink-0`}>→</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="alert alert-info !mb-0">
              🔥 시험은 "지식 싸움"이 아니라 <strong>"운영 싸움"</strong>이다! 마킹은 5~10문제 단위로.
            </div>
          </div>
        </div>
      )}

      {/* ── 점수 시뮬레이션 ── */}
      {tab === 'score' && (
        <div>
          {/* 단계별 점수 */}
          <div className="flex flex-col gap-4 mb-6">
            {SCORE_SIM.map((s, i) => (
              <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600`}>{s.stage}</span>
                      <span className="text-xs text-slate-400 font-medium">{s.period}</span>
                      {s.explosion && <span className="text-xs font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">💥 점수 폭발 구간</span>}
                    </div>
                    <div className={`font-extrabold text-[16px] ${s.tc} mb-1`}>{s.label}</div>
                    <div className="text-sm text-slate-600">{s.desc}</div>
                    {s.danger && (
                      <div className="mt-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                        ⚠️ {s.dangerMsg}
                      </div>
                    )}
                    <div className={`mt-2 text-xs font-semibold ${s.tc}`}>💡 {s.tip}</div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className={`text-3xl font-extrabold ${s.tc}`}>{s.score}</div>
                    <div className="text-xs text-slate-400 mt-1">합격 가능성</div>
                    <div className={`text-xl font-extrabold ${s.tc}`}>{s.prob}</div>
                  </div>
                </div>
                {/* 점수 바 시각화 */}
                <div className="mt-3 progress-wrap">
                  <div className="progress-fill bg-gradient-to-r from-violet-400 to-indigo-500"
                       style={{width: i===0?'45%': i===1?'65%':'80%'}} />
                </div>
              </div>
            ))}
          </div>

          {/* 과목별 점수 구조 */}
          <div className="card mb-6">
            <h3 className="font-bold text-slate-800 mb-4">📊 과목별 점수 현실 구조</h3>
            <div className="flex flex-col gap-3">
              {SUBJECT_SCORE.map((s, i) => (
                <div key={i} className={`${s.bg} border ${s.border} rounded-xl p-4 flex items-center gap-4 flex-wrap`}>
                  <div className={`font-bold ${s.color} min-w-[120px]`}>{s.sub}</div>
                  <div className="flex-1 flex items-center gap-3 flex-wrap">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-0.5">초반</div>
                      <div className="font-bold text-slate-600">{s.early}</div>
                    </div>
                    <div className="text-slate-300 font-bold text-xl">→</div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-0.5">후반</div>
                      <div className={`font-extrabold ${s.color}`}>{s.late}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold ${s.color} bg-white border ${s.border} px-3 py-1.5 rounded-full`}>{s.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 합격 기준 */}
          <div className="card mb-6">
            <h3 className="font-bold text-slate-800 mb-4">🎯 합격권 기준 (현실)</h3>
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              {[
                {label:'70점 이상',tag:'안정권',bg:'bg-emerald-50',border:'border-emerald-200',tc:'text-emerald-700'},
                {label:'65점 내외',tag:'경쟁권',bg:'bg-amber-50',border:'border-amber-200',tc:'text-amber-700'},
                {label:'60점 이하',tag:'위험',bg:'bg-red-50',border:'border-red-200',tc:'text-red-600'},
              ].map(g => (
                <div key={g.label} className={`${g.bg} border ${g.border} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-extrabold ${g.tc} mb-1`}>{g.label}</div>
                  <div className={`text-sm font-bold ${g.tc}`}>{g.tag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 위험 구간 */}
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-4">🚨 위험 구간 — 미리 알고 대비</h3>
            <div className="flex flex-col gap-3">
              {DANGER_ZONES.map((d, i) => (
                <div key={i} className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl items-start">
                  <span className="text-2xl flex-shrink-0">{d.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-red-700 text-[14px]">{d.title}</span>
                      <span className="text-xs text-red-400 bg-red-100 px-2 py-0.5 rounded-full">{d.period}</span>
                    </div>
                    <div className="text-sm text-red-600 mb-2">{d.desc}</div>
                    <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                      ✅ 해결: {d.solution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-violet-100 rounded-xl px-4 py-3 text-center">
              <div className="font-extrabold text-violet-800">"지금 못하는 게 정상이고, 끝까지 가는 사람이 붙는다" 🎯</div>
            </div>
          </div>
        </div>
      )}

      {/* ── D-7 최종 전략 ── */}
      {tab === 'final' && (
        <div>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-5 mb-6 text-white"
               style={{boxShadow:'0 4px 20px rgba(239,68,68,0.3)'}}>
            <div className="font-extrabold text-lg mb-1">🎯 시험 직전 일주일 목표</div>
            <div className="text-red-100 text-sm">"새로 배우는 게 아니라, 틀리는 걸 없애는 것"</div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {FINAL_WEEK.map((w, i) => (
              <div key={i} className="card !p-0 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                  <div>
                    <div className="font-extrabold text-slate-800">{w.period}</div>
                    <div className="text-xs text-slate-500">{w.label}</div>
                  </div>
                  <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${w.tagColor}`}>{w.tag}</span>
                </div>
                <div className="px-5 py-4">
                  <div className="flex flex-col gap-2 mb-3">
                    {w.tasks.map((t, j) => (
                      <div key={j} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-violet-500 font-bold flex-shrink-0">→</span>{t}
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-amber-700">
                    ⚡ {w.must}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 금지 행동 */}
          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-4">🚫 시험 직전 금지 행동</h3>
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              {['새로운 강의 듣기','새로운 개념 공부','어려운 문제 풀기'].map((b, i) => (
                <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">❌</div>
                  <div className="font-bold text-red-700 text-sm">{b}</div>
                  <div className="text-xs text-red-400 mt-1">기억 꼬임 = 점수 하락</div>
                </div>
              ))}
            </div>
          </div>

          {/* 점수 끌어올리는 3가지 */}
          <div className="card bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
            <h3 className="font-bold text-slate-800 mb-4">🔥 점수 끌어올리는 핵심 3가지</h3>
            <div className="flex flex-col gap-3">
              {[
                {n:'1',t:'틀린 문제 반복',d:'오답 표시 → 다음날 다시 풀기 → 이게 진짜 점수 상승',c:'bg-violet-50 border-violet-200 text-violet-700'},
                {n:'2',t:'헷갈리는 개념 비교',d:'비슷한 개념 나란히 보기 → 낚시 선지 안 걸림',c:'bg-cyan-50 border-cyan-200 text-cyan-700'},
                {n:'3',t:'시간 재고 문제 풀기',d:'실전 감각 유지 → 시험장에서 시간 부족 안 생김',c:'bg-emerald-50 border-emerald-200 text-emerald-700'},
              ].map(r => (
                <div key={r.n} className={`${r.c} border rounded-xl flex gap-3 px-4 py-3.5 items-center`}>
                  <div className="w-7 h-7 rounded-full bg-white border border-current flex items-center justify-center font-extrabold text-sm flex-shrink-0">{r.n}</div>
                  <div>
                    <div className="font-bold text-[14px]">{r.t}</div>
                    <div className="text-xs opacity-80 mt-0.5">{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 합격자 패턴 ── */}
      {tab === 'passer' && (
        <div>
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-5 mb-6 text-white"
               style={{boxShadow:'0 4px 20px rgba(16,185,129,0.3)'}}>
            <div className="font-extrabold text-lg mb-1">🏆 실제 합격자 공통 특징</div>
            <div className="text-emerald-100 text-sm">"잘하는 사람이 붙는 게 아니라, 끝까지 한 사람이 붙는다"</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 max-sm:grid-cols-1">
            {PASSER_PATTERNS.map((p, i) => (
              <div key={i} className="card flex gap-4">
                <div className="text-3xl flex-shrink-0">{p.emoji}</div>
                <div>
                  <div className="font-bold text-slate-800 mb-1">{p.title}</div>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 탈락 패턴 */}
          <div className="card mb-6">
            <h3 className="font-bold text-slate-800 mb-4">❌ 탈락하는 사람 패턴</h3>
            <div className="flex flex-col gap-2">
              {FAIL_PATTERNS.map((f, i) => (
                <div key={i} className="flex gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <span className="text-sm font-medium text-red-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 너 기준 냉정한 평가 */}
          <div className="card bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200 mb-5">
            <h3 className="font-bold text-slate-800 mb-4">📌 너 기준 냉정한 평가</h3>
            <div className="grid grid-cols-2 gap-3 mb-4 max-sm:grid-cols-1">
              {[
                {label:'계획',      status:'있음 ✅', c:'bg-emerald-50 border-emerald-200 text-emerald-700'},
                {label:'전략',      status:'있음 ✅', c:'bg-emerald-50 border-emerald-200 text-emerald-700'},
                {label:'시간',      status:'있음 ✅', c:'bg-emerald-50 border-emerald-200 text-emerald-700'},
                {label:'꾸준함',    status:'실행 중 🔥', c:'bg-amber-50 border-amber-200 text-amber-700'},
              ].map(g => (
                <div key={g.label} className={`${g.c} border rounded-xl p-3.5 flex items-center justify-between`}>
                  <span className="font-bold">{g.label}</span>
                  <span className="font-extrabold">{g.status}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-violet-200 rounded-xl px-4 py-3 text-sm text-violet-700 font-medium">
              👉 지금 합격 가능한 초입 구간이다. 부족한 건 딱 하나 — <strong>"끝까지 유지"</strong>
            </div>
          </div>

          {/* 현실 시나리오 */}
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-4">📈 제대로 하면 이렇게 된다</h3>
            <div className="flex flex-col gap-2">
              {[
                {period:'5월 초',state:'"아는 것 같은데 틀림" 구간',color:'text-slate-500',icon:'😤'},
                {period:'5월 말',state:'"반은 맞추기 시작"',color:'text-amber-600',icon:'📈'},
                {period:'6월 중순',state:'"점수 올라감 체감!" 💥',color:'text-emerald-600',icon:'🚀'},
                {period:'시험',state:'합격권 진입',color:'text-violet-700',icon:'🏆'},
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm font-bold text-slate-500 min-w-[60px]">{r.period}</span>
                  <span className={`flex-1 font-semibold text-sm ${r.color}`}>{r.state}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center bg-violet-600 text-white rounded-xl py-3 font-extrabold">
              "5월에 힘든 건 정상 — 끝까지 한 사람이 붙는다" 💪
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
