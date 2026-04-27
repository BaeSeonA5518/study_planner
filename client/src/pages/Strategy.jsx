import React, { useState } from 'react';

const STRATEGIES = [
  {
    id: '컴퓨터일반', emoji:'💻',
    grad: 'from-violet-600 to-indigo-500', shadow:'rgba(124,58,237,0.3)',
    bg:'bg-violet-50', border:'border-violet-200', text:'text-violet-700',
    importance:'최우선 ⭐⭐⭐',
    desc:'합격 핵심 과목. 점수 차이가 여기서 남.',
    strategy:['1.5~2배속으로 빠르게 1회독','하루 2~3강 → 듣고 바로 문제 풀기','완벽 이해 기다리지 말고 넘어가. 기출에서 다시 이해','기출은 지금 바로 병행 (오늘 들은 범위만)'],
    priorities:[{n:'자료구조 / 알고리즘',l:'최상'},{n:'운영체제',l:'최상'},{n:'데이터베이스',l:'상'},{n:'네트워크',l:'상'},{n:'프로그래밍 언어',l:'중'},{n:'컴퓨터 구조',l:'중'}],
    caution:'인강만 듣고 문제 안 풀면 시험장에서 아무것도 안 떠오름. 무조건 기출 병행!',
    exam:['아는 문제 → 즉시 체크','헷갈리는 문제 → 표시 후 넘김','3분 이상 고민 절대 금지','목표: 실수 2~3개 이하'],
  },
  {
    id: '정보보호론', emoji:'🔐',
    grad: 'from-cyan-500 to-sky-500', shadow:'rgba(8,145,178,0.28)',
    bg:'bg-cyan-50', border:'border-cyan-200', text:'text-cyan-700',
    importance:'중요 ⭐⭐',
    desc:'암기성 강함. 하루 안 보면 바로 까먹는 과목.',
    strategy:['인강 → 바로 요약 → 다음날 10분 복습','짧게라도 매일 보기 (끊기면 다 날아감)','비슷한 개념 비교 정리 필수','개념 + 문제 같이 가야 함'],
    priorities:[{n:'암호화 (대칭/비대칭)',l:'최상'},{n:'인증 / 접근제어',l:'최상'},{n:'네트워크 보안',l:'상'},{n:'보안 공격 유형',l:'상'},{n:'보안 정책',l:'중'},{n:'법령 / 인증 제도',l:'하'}],
    caution:'비슷한 개념으로 낚시 많이 함. 선지 하나하나 분석하고 헷갈리는 개념 별도 정리 노트 필수!',
    exam:['선지 하나하나 확인','"비슷한 개념" 낚시 주의','확실히 모르면 과감히 넘김','목표: 낚시 선지 안 걸리기'],
  },
  {
    id: '국어', emoji:'📖',
    grad: 'from-emerald-500 to-green-400', shadow:'rgba(5,150,105,0.25)',
    bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700',
    importance:'기본 ⭐⭐',
    desc:'감 유지 과목. 매일 조금씩 하면 됨.',
    strategy:['문법: 틀린 것만 정리 (인강은 부족한 부분만)','독해: 매일 3~5지문 시간 재고 풀기','많이 듣기보다 직접 풀기가 훨씬 중요','인강 30~40% / 문제풀이 60~70%'],
    priorities:[{n:'독해 (비문학)',l:'최상'},{n:'문법 (형태론/통사론)',l:'상'},{n:'어휘 / 맞춤법',l:'상'},{n:'문학 (현대/고전)',l:'중'},{n:'화법 / 작문',l:'중'}],
    caution:'국어는 인강 과몰입하면 망함. 독해에서 막히면 바로 넘기기. 한 지문 3분 이상 쓰면 위험.',
    exam:['스타트 과목으로 추천','문법 → 바로 풀기, 독해 → 쉬운 지문 먼저','한 지문 3분 이상 쓰면 위험','목표: 시간 부족 방지'],
  },
  {
    id: '한국사', emoji:'🏛️',
    grad: 'from-amber-500 to-yellow-400', shadow:'rgba(217,119,6,0.25)',
    bg:'bg-amber-50', border:'border-amber-200', text:'text-amber-700',
    importance:'서브 (한능검) ⭐',
    desc:'군무원엔 없음. 한능검 3급 컷만 노린다.',
    strategy:['3~4일 압축이 가장 효율적','시대 흐름 + 사료 해석 + 헷갈리는 선지 구분이 핵심','하루 벼락치기로 3급 안정권 어려움 → 최소 3일 투자','5/15~5/22 집중 (4일 압축 루틴)'],
    priorities:[{n:'조선 (붕당/개혁/정치)',l:'최상'},{n:'근현대 (독립운동/정부)',l:'최상'},{n:'고려 (왕/사건 줄기)',l:'상'},{n:'선사~삼국 흐름',l:'중'}],
    caution:'5/1~5/10엔 욕심 금지. 하루 1시간 흐름만. 5/15 이후 4일 압축으로 완성!',
    exam:['군무원 시험 아님 → 3급 컷만 목표','Day1 선사~고려, Day2 조선, Day3 근현대, Day4 기출 2~3회'],
  },
];

const LEVEL_STYLE = {
  최상:{ bg:'bg-red-100',    text:'text-red-700'    },
  상:  { bg:'bg-amber-100',  text:'text-amber-700'  },
  중:  { bg:'bg-blue-100',   text:'text-blue-700'   },
  하:  { bg:'bg-slate-100',  text:'text-slate-500'  },
};

export default function Strategy() {
  const [active, setActive] = useState('컴퓨터일반');
  const sub = STRATEGIES.find(s => s.id === active);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">🧠 과목별 전략</h1>
        <p className="page-subtitle">과목마다 다른 전략으로 접근하자</p>
      </div>

      <div className="tabs">
        {STRATEGIES.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} className={`tab-btn ${active===s.id?'active':''}`}>
            {s.emoji} {s.id}
          </button>
        ))}
      </div>

      {/* 헤더 배너 */}
      <div className={`rounded-3xl p-7 bg-gradient-to-br ${sub.grad} text-white mb-5 flex items-center gap-5 flex-wrap`}
           style={{ boxShadow:`0 8px 32px ${sub.shadow}` }}>
        <div className="text-5xl">{sub.emoji}</div>
        <div>
          <div className="text-2xl font-extrabold mb-1">{sub.id}</div>
          <div className="text-sm opacity-80">{sub.desc}</div>
        </div>
        <div className="ml-auto bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold flex-shrink-0">
          {sub.importance}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5 max-md:grid-cols-1">
        {/* 학습 전략 */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4">📌 학습 전략</h3>
          <div className="flex flex-col gap-3">
            {sub.strategy.map((s, i) => (
              <div key={i} className="flex gap-3 text-[13.5px]">
                <div className={`w-6 h-6 rounded-lg ${sub.bg} ${sub.border} border flex items-center justify-center font-extrabold text-xs ${sub.text} flex-shrink-0`}>{i+1}</div>
                <span className="text-slate-600 leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 시험장 전략 */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4">🎯 시험장 전략</h3>
          <div className="flex flex-col gap-2">
            {sub.exam.map((e, i) => (
              <div key={i} className={`flex gap-2.5 items-start px-3.5 py-2.5 ${sub.bg} border ${sub.border} rounded-xl text-[13.5px] text-slate-700`}>
                <span className={`${sub.text} font-bold flex-shrink-0`}>→</span>
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 파트 우선순위 */}
      <div className="card mb-5">
        <h3 className="font-bold text-slate-800 mb-4">📊 파트별 우선순위</h3>
        <div className="flex flex-col gap-2">
          {sub.priorities.map((p, i) => {
            const lc = LEVEL_STYLE[p.l] || LEVEL_STYLE.하;
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-xs font-bold w-5">#{i+1}</span>
                <span className="flex-1 text-[13.5px] font-medium text-slate-700">{p.n}</span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${lc.bg} ${lc.text}`}>{p.l}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 주의사항 */}
      <div className="flex gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 mb-5">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div>
          <div className="font-bold text-red-700 mb-1">주의사항</div>
          <div className="text-[13.5px] text-red-600 leading-relaxed">{sub.caution}</div>
        </div>
      </div>

      {/* 문제풀이 비율 */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-4">🔥 하루 문제풀이 비율 (5/15 이후 기준)</h3>
        <div className="flex gap-3 flex-wrap">
          {[
            { label:'컴퓨터일반', pct:50, grad:'from-violet-600 to-indigo-500', shadow:'rgba(124,58,237,0.25)' },
            { label:'정보보호론', pct:30, grad:'from-cyan-500 to-sky-500',       shadow:'rgba(6,182,212,0.22)' },
            { label:'국어',       pct:20, grad:'from-emerald-500 to-green-400',  shadow:'rgba(5,150,105,0.2)'  },
          ].map(item => (
            <div key={item.label} className={`flex-1 min-w-[100px] bg-gradient-to-br ${item.grad} rounded-2xl p-5 text-white text-center`}
                 style={{ boxShadow:`0 6px 20px ${item.shadow}` }}>
              <div className="text-4xl font-black mb-1">{item.pct}%</div>
              <div className="text-sm opacity-90 font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="alert alert-info mt-4 !mb-0">
          💡 인강은 "빨리 소비", 기출은 "느리게 반복" — 이게 합격 공식이야.
        </div>
      </div>
    </div>
  );
}
