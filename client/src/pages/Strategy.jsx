import React, { useState } from 'react';

const STRATEGIES = [
  {
    id: '컴퓨터일반', emoji:'💻',
    grad: 'from-violet-600 to-indigo-500', shadow:'rgba(124,58,237,0.3)',
    bg:'bg-violet-50', border:'border-violet-200', text:'text-violet-700',
    importance:'최우선 ⭐⭐⭐',
    desc:'합격 핵심 과목. 점수 차이가 여기서 남.',
    strategy:['1.5~2배속으로 빠르게 1회독','하루 3~4강 → 듣고 바로 기출 5~10문제','완벽 이해 기다리지 말고 넘어가. 기출에서 다시 이해','강의 순서대로 X → 우선순위 순서로 점프하며 듣기'],
    lectureOrder: [
      { rank:'🥇 1순위', name:'운영체제', reason:'매년 반복 출제. 이해하면 문제 바로 풀림', tag:'고빈도·고득점', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥇 1순위', name:'자료구조', reason:'매년 반복 출제. 이해하면 문제 바로 풀림', tag:'고빈도·고득점', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥇 1순위', name:'데이터베이스', reason:'매년 반복 출제. 이해하면 문제 바로 풀림', tag:'고빈도·고득점', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥈 2순위', name:'네트워크', reason:'개념 이해 + 암기 섞임. 문제 유형 반복됨', tag:'중빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥈 2순위', name:'컴퓨터구조', reason:'개념 이해 + 암기 섞임. 문제 유형 반복됨', tag:'중빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥉 3순위', name:'소프트웨어공학', reason:'암기 위주. 시간 대비 효율 낮음', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
      { rank:'🥉 3순위', name:'기타 이론', reason:'암기 위주. 뒤로 미뤄도 됨', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
    ],
    priorities: [
      { n:'운영체제', l:'최상' },{ n:'자료구조', l:'최상' },{ n:'데이터베이스', l:'최상' },
      { n:'네트워크', l:'상' },{ n:'컴퓨터구조', l:'상' },
      { n:'소프트웨어공학', l:'중' },{ n:'기타 이론', l:'하' },
    ],
    caution:'강의 순서대로 다 듣다가 시간 부족으로 핵심 못 보고 끝남. 운OS→자료구조→DB 먼저!',
    exam:['아는 문제 → 즉시 체크','헷갈리는 문제 → 표시 후 넘김','3분 이상 고민 절대 금지','목표: 실수 2~3개 이하'],
  },
  {
    id: '정보보호론', emoji:'🔐',
    grad: 'from-cyan-500 to-sky-500', shadow:'rgba(8,145,178,0.28)',
    bg:'bg-cyan-50', border:'border-cyan-200', text:'text-cyan-700',
    importance:'중요 ⭐⭐',
    desc:'암기성 강함. 하루 안 보면 바로 까먹는 과목.',
    strategy:['인강 → 바로 요약 → 다음날 10분 복습','짧게라도 매일 보기 (끊기면 다 날아감)','비슷한 개념 비교 정리 필수','암호화 먼저 → 인증 → 네트워크보안 순서로'],
    lectureOrder: [
      { rank:'🥇 1순위', name:'암호화 (대칭/비대칭)', reason:'거의 필수 출제. 점수 뽑기 쉬움', tag:'고빈도·고득점', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥇 1순위', name:'인증 / 접근제어', reason:'거의 필수 출제. 점수 뽑기 쉬움', tag:'고빈도·고득점', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥈 2순위', name:'네트워크 보안', reason:'헷갈리는 선지 많음. 반복 중요', tag:'중빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥈 2순위', name:'보안 공격 유형', reason:'헷갈리는 선지 많음. 반복 중요', tag:'중빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥉 3순위', name:'관리적 보안', reason:'암기 많음. 막판에 몰아서 가능', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
      { rank:'🥉 3순위', name:'법 / 정책', reason:'암기 많음. 막판에 몰아서 가능', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
    ],
    priorities: [
      { n:'암호화 (대칭/비대칭)', l:'최상' },{ n:'인증 / 접근제어', l:'최상' },
      { n:'네트워크 보안', l:'상' },{ n:'보안 공격 유형', l:'상' },
      { n:'관리적 보안', l:'중' },{ n:'법 / 정책', l:'하' },
    ],
    caution:'비슷한 개념으로 낚시 많이 함. 선지 하나하나 분석하고 헷갈리는 개념 별도 정리 노트 필수!',
    exam:['선지 하나하나 확인','"비슷한 개념" 낚시 주의','확실히 모르면 과감히 넘김','목표: 낚시 선지 안 걸리기'],
  },
  {
    id: '국어', emoji:'📖',
    grad: 'from-emerald-500 to-green-400', shadow:'rgba(5,150,105,0.25)',
    bg:'bg-emerald-50', border:'border-emerald-200', text:'text-emerald-700',
    importance:'기본 ⭐⭐',
    desc:'감 유지 과목. 매일 조금씩 하면 됨.',
    strategy:['문법 틀리면 점수 바로 날아감 → 문법 먼저','독해: 매일 3~5지문 시간 재고 풀기','많이 듣기보다 직접 풀기가 훨씬 중요','인강 30~40% / 문제풀이 60~70%'],
    lectureOrder: [
      { rank:'🥇 1순위', name:'문법 (형태론/통사론)', reason:'틀리면 점수 바로 날아감', tag:'고빈도·필수', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥈 2순위', name:'독해 (비문학)', reason:'문제 풀이로 감 유지', tag:'고빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥈 2순위', name:'어휘 / 맞춤법', reason:'꾸준히 암기', tag:'중빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥉 3순위', name:'문학 (현대/고전)', reason:'시간 있을 때', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
      { rank:'🥉 3순위', name:'화법 / 작문', reason:'시간 있을 때', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
    ],
    priorities: [
      { n:'문법 (형태론/통사론)', l:'최상' },{ n:'독해 (비문학)', l:'상' },
      { n:'어휘 / 맞춤법', l:'상' },{ n:'문학', l:'중' },{ n:'화법/작문', l:'하' },
    ],
    caution:'국어는 인강 과몰입하면 망함. 독해에서 막히면 바로 넘기기. 한 지문 3분 이상 쓰면 위험.',
    exam:['스타트 과목으로 추천','문법 → 바로 풀기, 독해 → 쉬운 지문 먼저','한 지문 3분 이상 쓰면 위험','목표: 시간 부족 방지'],
  },
  {
    id: '한국사', emoji:'🏛️',
    grad: 'from-amber-500 to-yellow-400', shadow:'rgba(217,119,6,0.25)',
    bg:'bg-amber-50', border:'border-amber-200', text:'text-amber-700',
    importance:'서브 (한능검) ⭐',
    desc:'군무원엔 없음. 한능검 3급 컷만 노린다.',
    strategy:['3~4일 압축이 가장 효율적','시대 흐름 + 사료 해석 + 헷갈리는 선지 구분이 핵심','하루 벼락치기로 3급 안정권 어려움 → 최소 3일 투자','5/17~5/22 집중 (4일 압축 루틴)'],
    lectureOrder: [
      { rank:'🥇 1순위', name:'조선 (붕당/개혁/정치)', reason:'출제 비중 최상. 여기서 다 나옴', tag:'최고빈도', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥇 1순위', name:'근현대 (독립운동/정부)', reason:'출제 비중 최상', tag:'최고빈도', tagColor:'bg-red-100 text-red-700' },
      { rank:'🥈 2순위', name:'고려 (왕/사건 줄기)', reason:'출제 비중 높음', tag:'고빈도', tagColor:'bg-amber-100 text-amber-700' },
      { rank:'🥉 3순위', name:'선사~삼국 흐름', reason:'시대 흐름만 파악', tag:'후순위', tagColor:'bg-slate-100 text-slate-500' },
    ],
    priorities: [
      { n:'조선 (붕당/개혁/정치)', l:'최상' },{ n:'근현대 (독립운동/정부)', l:'최상' },
      { n:'고려 (왕/사건 줄기)', l:'상' },{ n:'선사~삼국 흐름', l:'중' },
    ],
    caution:'5/1~5/10엔 욕심 금지. 하루 1시간 흐름만. 5/17 이후 4일 압축으로 완성!',
    exam:['군무원 시험 아님 → 3급 컷만 목표','Day1 선사~고려, Day2 조선, Day3 근현대, Day4 기출 2~3회'],
  },
];

const LEVEL_STYLE = {
  최상:{ bg:'bg-red-100',   text:'text-red-700'   },
  상:  { bg:'bg-amber-100', text:'text-amber-700'  },
  중:  { bg:'bg-blue-100',  text:'text-blue-700'   },
  하:  { bg:'bg-slate-100', text:'text-slate-500'  },
};

export default function Strategy() {
  const [active, setActive] = useState('컴퓨터일반');
  const [showOrder, setShowOrder] = useState(true);
  const sub = STRATEGIES.find(s => s.id === active);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">🧠 과목별 전략</h1>
        <p className="page-subtitle">과목마다 다른 전략으로 접근하자</p>
      </div>

      {/* 핵심 원칙 배너 */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 rounded-2xl p-4 mb-6 flex items-center gap-3"
           style={{ boxShadow:'0 4px 20px rgba(124,58,237,0.25)' }}>
        <span className="text-2xl flex-shrink-0">🎯</span>
        <div>
          <div className="text-white font-extrabold text-[15px]">"모든 걸 다 보는 시험이 아니라, 많이 나오는 걸 맞추는 시험"</div>
          <div className="text-violet-200 text-xs mt-0.5">우선순위 기준으로 점프하면서 듣기 → 강의 순서대로 다 듣기 ❌</div>
        </div>
      </div>

      <div className="tabs">
        {STRATEGIES.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} className={`tab-btn ${active===s.id?'active':''}`}>
            {s.emoji} {s.id}
          </button>
        ))}
      </div>

      {/* 과목 헤더 */}
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

      {/* 탭 전환: 순서 / 전략 */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setShowOrder(true)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${showOrder ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'}`}>
          📋 인강 듣는 순서
        </button>
        <button onClick={() => setShowOrder(false)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${!showOrder ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'}`}>
          🎯 학습 전략 & 시험 요령
        </button>
      </div>

      {showOrder ? (
        /* ── 인강 듣는 순서 뷰 ── */
        <div>
          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-1">📋 {sub.id} 인강 듣는 순서</h3>
            <p className="text-xs text-slate-400 mb-5">점수 많이 나오는 순서 기준 — 시간 부족해도 핵심은 다 본다</p>

            <div className="flex flex-col gap-3">
              {sub.lectureOrder.map((item, i) => (
                <div key={i} className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[14px] text-slate-800">{item.name}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.reason}</div>
                  </div>
                  <span className="text-lg flex-shrink-0">{item.rank.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 우선순위별 묶음 */}
          <div className="grid grid-cols-3 gap-4 mb-5 max-sm:grid-cols-1">
            {[
              { label:'🥇 1순위 — 먼저 + 시간 많이', color:'bg-red-50 border-red-200', tc:'text-red-700', items: sub.lectureOrder.filter(x=>x.rank.includes('1순위')) },
              { label:'🥈 2순위 — 그 다음', color:'bg-amber-50 border-amber-200', tc:'text-amber-700', items: sub.lectureOrder.filter(x=>x.rank.includes('2순위')) },
              { label:'🥉 3순위 — 뒤로 미뤄도 됨', color:'bg-slate-50 border-slate-200', tc:'text-slate-600', items: sub.lectureOrder.filter(x=>x.rank.includes('3순위')) },
            ].map(g => g.items.length > 0 && (
              <div key={g.label} className={`${g.color} border rounded-2xl p-4`}>
                <div className={`text-[12px] font-bold ${g.tc} mb-3`}>{g.label}</div>
                <div className="flex flex-col gap-2">
                  {g.items.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl px-3 py-2.5 border border-white/80 shadow-sm">
                      <div className="font-semibold text-[13px] text-slate-700">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 경고 박스 */}
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">❌</span>
              <div>
                <div className="font-bold text-red-700 text-sm mb-1">강의 순서대로 다 듣기</div>
                <div className="text-xs text-red-500">시간 부족으로 핵심 못 보고 끝남</div>
              </div>
            </div>
            <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">✅</span>
              <div>
                <div className="font-bold text-emerald-700 text-sm mb-1">우선순위 기준으로 점프하며 듣기</div>
                <div className="text-xs text-emerald-600">시험 점수 바로 올라감</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── 학습 전략 뷰 ── */
        <div>
          <div className="grid grid-cols-2 gap-5 mb-5 max-md:grid-cols-1">
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
            <div className="card">
              <h3 className="font-bold text-slate-800 mb-4">🎯 시험장 전략</h3>
              <div className="flex flex-col gap-2">
                {sub.exam.map((e, i) => (
                  <div key={i} className={`flex gap-2.5 items-start px-3.5 py-2.5 ${sub.bg} border ${sub.border} rounded-xl text-[13.5px] text-slate-700`}>
                    <span className={`${sub.text} font-bold flex-shrink-0`}>→</span>{e}
                  </div>
                ))}
              </div>
            </div>
          </div>

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

          <div className="flex gap-3 bg-red-50 border border-red-200 rounded-2xl p-5">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <div className="font-bold text-red-700 mb-1">주의사항</div>
              <div className="text-[13.5px] text-red-600 leading-relaxed">{sub.caution}</div>
            </div>
          </div>
        </div>
      )}

      {/* 5/10까지 목표 */}
      <div className="card mt-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <h3 className="font-bold text-slate-800 mb-4">🔥 5/10까지 현실 목표</h3>
        <div className="grid grid-cols-3 gap-3 mb-4 max-sm:grid-cols-1">
          {[
            { label:'💻 컴일', goal:'핵심 70% 커버', sub:'운OS + 자료구조 + DB 완료', color:'bg-violet-100 border-violet-200 text-violet-700' },
            { label:'🔐 정보보호', goal:'핵심 파트 완료', sub:'암호화 + 인증 + 네트워크보안 완료', color:'bg-cyan-100 border-cyan-200 text-cyan-700' },
            { label:'나머지', goal:'5월 중순 이후 채우기', sub:'운영체제 나머지 + 소프트웨어공학 등', color:'bg-slate-100 border-slate-200 text-slate-600' },
          ].map(item => (
            <div key={item.label} className={`${item.color} border rounded-xl p-4`}>
              <div className="font-bold text-[15px] mb-1">{item.label}</div>
              <div className="font-semibold text-sm mb-1">{item.goal}</div>
              <div className="text-xs opacity-80">{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 max-sm:flex-col">
          {[
            { label:'컴퓨터일반', pct:50, grad:'from-violet-600 to-indigo-500', shadow:'rgba(124,58,237,0.25)' },
            { label:'정보보호론', pct:30, grad:'from-cyan-500 to-sky-500',       shadow:'rgba(6,182,212,0.22)' },
            { label:'국어',       pct:20, grad:'from-emerald-500 to-green-400',  shadow:'rgba(5,150,105,0.2)'  },
          ].map(item => (
            <div key={item.label} className={`flex-1 bg-gradient-to-br ${item.grad} rounded-2xl p-4 text-white text-center`}
                 style={{ boxShadow:`0 4px 16px ${item.shadow}` }}>
              <div className="text-3xl font-black mb-0.5">{item.pct}%</div>
              <div className="text-xs opacity-90 font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
