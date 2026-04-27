import React, { useState } from 'react';

const SITUATIONS = [
  { id:'one_day', icon:'😓', title:'하루 날렸을 때', sub:'어제 하나도 못 했어', tag:'경미',
    bg:'bg-amber-50', border:'border-amber-200', text:'text-amber-700', tagBg:'bg-amber-100',
    steps:[{l:'컴일 +1강 추가',d:'오늘 원래 분량 + 1강만 더'},{l:'정보보호 +1강 추가',d:'그냥 하루만에 복구됨'},{l:'국어는 그대로 유지',d:'국어는 미루지 말고 오늘도 진행'}],
    conclusion:'하루는 다음날 바로 복구 가능. 겁먹지 마.' },
  { id:'few_days', icon:'😰', title:'2~3일 밀렸을 때', sub:'며칠째 공부를 거의 못 했어', tag:'주의',
    bg:'bg-red-50', border:'border-red-200', text:'text-red-700', tagBg:'bg-red-100',
    steps:[{l:'국어 시간 임시 축소',d:'국어는 감 유지용만 (20분으로)'},{l:'컴일 집중 복구',d:'하루 4~5강 밀어붙이기'},{l:'정보보호 집중 복구',d:'컴일 다음 우선순위'},{l:'한국사 잠시 스킵 가능',d:'핵심 과목 먼저 살리기'}],
    conclusion:'"핵심 과목 먼저 살림" — 2~3일은 일주일 안에 복구 가능.' },
  { id:'slump', icon:'😵', title:'슬럼프 — 흐름 끊겼을 때', sub:'의욕이 아예 없어. 하기 싫어',  tag:'긴급',
    bg:'bg-violet-50', border:'border-violet-200', text:'text-violet-700', tagBg:'bg-violet-100',
    steps:[{l:'최소 루틴으로 리셋',d:'컴일 1강 + 정보보호 1강 + 국어 20분'},{l:'1~2시간 컷으로 시작',d:'완벽한 루틴 X → 일단 하는 게 목표'},{l:'점화 성공하면 유지',d:'작은 성공이 다음 날 연결됨'},{l:'공부 환경 바꿔보기',d:'카페, 도서관 등 새 장소 시도'}],
    conclusion:'잘하는 날 필요 없어. 안 하는 날만 없으면 됨.' },
  { id:'travel', icon:'✈️', title:'여행 중 (5/11~14)', sub:'상하이 여행 중인데 어떻게 해?', tag:'계획됨',
    bg:'bg-cyan-50', border:'border-cyan-200', text:'text-cyan-700', tagBg:'bg-cyan-100',
    steps:[{l:'하루 30~40분만',d:'억지로 더 하려 하지 마'},{l:'한국사 요약 정리',d:'이동 중 가볍게 보기 좋음'},{l:'국어 가볍게 (선택)',d:'독해 지문 2~3개 정도'},{l:'무거운 공부 절대 ❌',d:'문제풀이, 기출은 여행 후에'}],
    conclusion:'여행은 이미 계획에 반영됐어. 유지만 해도 충분.' },
];

const MIN_ROUTINE = [
  { s:'💻 컴퓨터일반', t:'인강 1강', time:'30~40분', bg:'bg-violet-50', border:'border-violet-200', tc:'text-violet-600' },
  { s:'🔐 정보보호론', t:'인강 1강 or 암기', time:'20~30분', bg:'bg-cyan-50', border:'border-cyan-200', tc:'text-cyan-600' },
  { s:'📖 국어',       t:'독해 2지문', time:'20분', bg:'bg-emerald-50', border:'border-emerald-200', tc:'text-emerald-600' },
];

export default function RecoveryPlan() {
  const [selected, setSelected] = useState(null);
  const sit = SITUATIONS.find(s => s.id === selected);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">🚨 복구 플랜</h1>
        <p className="page-subtitle">진도 밀렸을 때, 슬럼프 왔을 때 여기로 와</p>
      </div>

      <p className="section-label">상황 선택</p>
      <div className="grid grid-cols-4 gap-3 mb-6 max-lg:grid-cols-2">
        {SITUATIONS.map(s => (
          <button key={s.id} onClick={() => setSelected(selected===s.id?null:s.id)}
            className={`text-left p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 font-[inherit]
              ${selected===s.id ? `${s.bg} ${s.border} shadow-md` : 'bg-white border-slate-200 hover:border-slate-300 shadow-card'}`}>
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className="font-bold text-[14px] text-slate-800 mb-1">{s.title}</div>
            <div className="text-xs text-slate-500 mb-3">{s.sub}</div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.tagBg} ${s.text}`}>{s.tag}</span>
          </button>
        ))}
      </div>

      {sit && (
        <div className={`${sit.bg} border-2 ${sit.border} rounded-2xl p-7 mb-6`}>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-4xl">{sit.icon}</span>
            <div>
              <div className={`text-xl font-extrabold ${sit.text}`}>{sit.title}</div>
              <div className="text-sm text-slate-500 mt-0.5">{sit.sub}</div>
            </div>
          </div>
          <p className="section-label">실행 단계</p>
          <div className="flex flex-col gap-2.5 mb-5">
            {sit.steps.map((step, i) => (
              <div key={i} className="flex gap-3.5 items-start bg-white border border-white/80 rounded-xl px-4 py-3.5 shadow-sm">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${sit.text.replace('text-','from-')} to-white/50 flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0`}
                     style={{ background: sit.border.replace('border-','').includes('amber') ? '#d97706' : sit.border.replace('border-','').includes('red') ? '#dc2626' : sit.border.replace('border-','').includes('violet') ? '#7c3aed' : '#0891b2' }}>
                  {i+1}
                </div>
                <div>
                  <div className="font-bold text-[14px] text-slate-800">{step.l}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={`${sit.tagBg} border ${sit.border} rounded-xl px-4 py-3 font-semibold text-sm ${sit.text}`}>
            💬 {sit.conclusion}
          </div>
        </div>
      )}

      {/* 최소 루틴 */}
      <p className="section-label">슬럼프 전용 최소 루틴</p>
      <div className="card mb-6">
        <div className="font-bold text-slate-800 mb-1">⚡ 이것만 해도 된다 <span className="text-slate-400 font-normal text-sm">(총 1~1.5시간)</span></div>
        <div className="text-sm text-slate-500 mb-4">리듬 안 깨지게 최소한만 유지. 이것만 해도 내일 다시 이어진다.</div>
        <div className="flex flex-col gap-2.5">
          {MIN_ROUTINE.map((r, i) => (
            <div key={i} className={`flex items-center gap-3.5 px-4 py-3.5 ${r.bg} border ${r.border} rounded-xl`}>
              <div className="flex-1">
                <div className="font-bold text-[14px] text-slate-800">{r.s}</div>
                <div className="text-xs text-slate-500 mt-0.5">{r.t}</div>
              </div>
              <span className={`text-sm font-bold ${r.tc}`}>{r.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 절대 규칙 */}
      <p className="section-label">절대 규칙</p>
      <div className="flex flex-col gap-3 mb-6">
        {[
          { bad:'❌ "내일부터 다시"', good:'⭕ 오늘 최소라도 한다', why:'한 번 나오면 연쇄 붕괴. 안 하는 날이 없는 게 합격한 사람들 공통점.' },
          { bad:'❌ 완벽한 날 기다리기', good:'⭕ 최소 루틴이라도 실행', why:'30분이라도 하면 다음날 이어진다. 완벽한 날은 없어.' },
          { bad:'❌ 밀린 양 한번에 몰아서', good:'⭕ 원래 페이스로 빠르게 복귀', why:'몰아하면 번아웃 온다. 정상 페이스 복귀가 목표.' },
        ].map((r, i) => (
          <div key={i} className="card !p-4">
            <div className="grid grid-cols-2 gap-3 mb-2.5">
              <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-red-600">{r.bad}</div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-emerald-600">{r.good}</div>
            </div>
            <div className="text-xs text-slate-500">💡 {r.why}</div>
          </div>
        ))}
      </div>

      {/* 성장 체크 */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-4">📈 일주일마다 이것만 체크하면 돼</h3>
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          {[
            { q:'컴일', check:'문제 풀 때 "아는 문제" 늘었나?', bg:'bg-violet-50', border:'border-violet-200', tc:'text-violet-700' },
            { q:'정보보호', check:'헷갈리는 개념 줄었나?', bg:'bg-cyan-50', border:'border-cyan-200', tc:'text-cyan-700' },
            { q:'국어', check:'독해 속도 빨라졌나?', bg:'bg-emerald-50', border:'border-emerald-200', tc:'text-emerald-700' },
          ].map(item => (
            <div key={item.q} className={`${item.bg} border ${item.border} rounded-xl p-4`}>
              <div className={`font-bold text-[15px] ${item.tc} mb-2`}>{item.q}</div>
              <div className="text-[13px] text-slate-600 leading-relaxed">{item.check}</div>
            </div>
          ))}
        </div>
        <div className="alert alert-success mt-4 !mb-0">
          이 3개 중 <strong>1개라도 개선</strong>되면 정상 진행 중이야. 자신감 가져!
        </div>
      </div>

      {/* 멘탈 유지법 */}
      <div className="card mt-5 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
        <h3 className="font-bold text-slate-800 mb-1">🧠 멘탈 흔들릴 때 (실전 대응)</h3>
        <p className="text-xs text-slate-400 mb-4">이런 생각 드는 거 정상이야. 대응법만 기억하면 됨.</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">이런 생각 들 때</div>
          <div className="flex flex-wrap gap-2">
            {['"이거 해서 붙을 수 있나?"','"너무 늦은 거 아닌가?"','"남들은 더 많이 했을텐데"'].map(t => (
              <span key={t} className="text-xs font-medium bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
          <div className="text-xs text-amber-600 font-bold mt-2">→ 전부 정상이다. 이 생각 없는 사람이 이상한 거야.</div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              n:'1', title:'생각 끊고 행동',
              desc:'컴일 1강 + 정보보호 1강. 이거만 하고 끝내도 오늘 성공',
              bg:'bg-violet-50', border:'border-violet-200', tc:'text-violet-700',
            },
            {
              n:'2', title:'비교 금지',
              desc:'너는 "지금 시작한 기준"으로 싸움 중. 남과 비교하면 무조건 무너짐',
              bg:'bg-cyan-50', border:'border-cyan-200', tc:'text-cyan-700',
            },
            {
              n:'3', title:'점수 말고 반복 체크',
              desc:'❌ "오늘 몇 점 나왔지?" → ✅ "오늘 공부 했냐 안 했냐" 이것만 봐',
              bg:'bg-emerald-50', border:'border-emerald-200', tc:'text-emerald-700',
            },
          ].map(r => (
            <div key={r.n} className={`${r.bg} border ${r.border} rounded-xl flex gap-3 px-4 py-3.5`}>
              <div className={`w-7 h-7 rounded-full bg-white border ${r.border} flex items-center justify-center font-extrabold text-sm ${r.tc} flex-shrink-0 mt-0.5`}>{r.n}</div>
              <div>
                <div className={`font-bold text-[14px] ${r.tc}`}>{r.title}</div>
                <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하루 체크 시스템 */}
      <div className="card mt-4">
        <h3 className="font-bold text-slate-800 mb-4">✅ 현실 유지 시스템 (간단하게)</h3>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="font-bold text-slate-700 mb-3 text-sm">하루 체크 (이 2개만)</div>
            <div className="flex flex-col gap-2">
              {['💻 컴일 했냐? ⭕ / ❌','🔐 정보보호 했냐? ⭕ / ❌'].map(c => (
                <div key={c} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-600">{c}</div>
              ))}
            </div>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <div className="font-bold text-violet-700 mb-3 text-sm">일주일 기준</div>
            <div className="text-2xl font-extrabold text-violet-700 mb-1">7일 중 5일 이상</div>
            <div className="text-xs text-violet-500">이 기준만 넘기면 정상 루트</div>
            <div className="progress-wrap mt-2">
              <div className="progress-fill bg-violet-500" style={{width:'72%'}} />
            </div>
          </div>
        </div>
        <div className="mt-4 bg-violet-600 text-white rounded-xl px-4 py-3 text-center font-extrabold">
          "잘하는 날 필요 없다, 안 하는 날만 없으면 된다" 🔥
        </div>
      </div>
    </div>
  );
}
