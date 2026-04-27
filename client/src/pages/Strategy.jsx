import React, { useState } from 'react';

/* ─── 컴일 14일 진도표 ─────────────────────────────── */
const COMP_DAILY_PLAN = [
  {
    period:'4/27~4/29', tag:'바쁜 구간', tagColor:'bg-cyan-100 text-cyan-700',
    desc:'학원 끝나고 저녁 루틴', perDay:'2~3강',
    days:[
      {date:'4/27 (월)',lectures:'24, 25',topic:'운영체제 개요 / 프로세스'},
      {date:'4/28 (화)',lectures:'26, 28',topic:'스레드 / 교착상태'},
      {date:'4/29 (수)',lectures:'29, 30',topic:'스케줄링 / RR + 메모리관리'},
    ],
    result:'운영체제 절반',
  },
  {
    period:'4/30', tag:'첫 풀데이', tagColor:'bg-violet-100 text-violet-700',
    desc:'운영체제 완료 + 자료구조 시작', perDay:'5강',
    days:[
      {date:'4/30 (목)',lectures:'31, 32, 33, 34 + 48',topic:'가상메모리 / 페이지교체 / 디스크 / 유닉스+기출 ✅ + 시간복잡도'},
    ],
    result:'🎉 운영체제 완료! 자료구조 시작',
  },
  {
    period:'5/1~5/3', tag:'가속 구간', tagColor:'bg-amber-100 text-amber-700',
    desc:'자료구조 완주', perDay:'4~5강',
    days:[
      {date:'5/1 (금)',lectures:'49, 50, 51, 52, 53',topic:'배열 / 연결리스트 / 스택 / 큐'},
      {date:'5/2 (토)',lectures:'54, 55, 56, 57',    topic:'트리 / 그래프 / 정렬 / 탐색'},
      {date:'5/3 (일)',lectures:'58 + 기출',          topic:'해싱 + 자료구조 기출 복습'},
    ],
    result:'🎉 자료구조 완료!',
  },
  {
    period:'5/4~5/7', tag:'DB 집중', tagColor:'bg-emerald-100 text-emerald-700',
    desc:'데이터베이스 완주', perDay:'2강',
    days:[
      {date:'5/4 (월)',lectures:'59, 60',topic:'데이터 독립성 / 관계 데이터 제약'},
      {date:'5/5 (화)',lectures:'61, 62',topic:'관계대수 / SQL'},
      {date:'5/6 (수)',lectures:'63, 64',topic:'정규형 / 데이터모델링'},
      {date:'5/7 (목)',lectures:'65, 66',topic:'트랜잭션 / 동시성제어'},
    ],
    result:'🎉 DB 완료!',
  },
  {
    period:'5/8~5/10', tag:'기출 전환', tagColor:'bg-red-100 text-red-700',
    desc:'인강 줄이고 문제풀이로 전환', perDay:'기출 20~30문제',
    days:[
      {date:'5/8 (금)', lectures:'기출 집중', topic:'OS + 자료구조 기출 20문제 + 약한 파트 다시 듣기'},
      {date:'5/9 (토)', lectures:'기출 집중', topic:'DB 기출 20문제 + 오답 정리'},
      {date:'5/10 (일)',lectures:'기출 집중', topic:'전체 범위 기출 30문제 → 시험형 상태 진입'},
    ],
    result:'🔥 시험형 상태 진입!',
  },
];

/* ─── 컴일 강의 순서 ─────────────────────────────── */
const COMP_ORDER = [
  {rank:'🥇 1순위',label:'운영체제',    lectures:'24~34번',priority:'최우선',bg:'bg-red-50',border:'border-red-200',tag:'bg-red-100 text-red-700',
   topics:['24 운영체제 개요','25 프로세스','26 스레드','28 교착상태','29 스케줄링','30 RR + 메모리관리','31 가상메모리','32 페이지 교체','33 디스크 스케줄링','34 유닉스 + 기출'],
   why:'매년 반복 출제. 이해하면 문제 바로 풀림'},
  {rank:'🥇 2순위',label:'자료구조',    lectures:'48~58번',priority:'운영체제 다음 바로',bg:'bg-orange-50',border:'border-orange-200',tag:'bg-orange-100 text-orange-700',
   topics:['48 시간복잡도','49~50 배열','51~52 연결리스트 / 스택','53 큐','54 트리','55 그래프','56 정렬','57 탐색','58 해싱'],
   why:'OS + 자료구조만 해도 시험 절반 먹고 들어감'},
  {rank:'🥇 3순위',label:'데이터베이스',lectures:'59~66번',priority:'이어서 — 합격권 핵심',bg:'bg-amber-50',border:'border-amber-200',tag:'bg-amber-100 text-amber-700',
   topics:['59 데이터 독립성','60 관계 데이터 제약','61 관계대수','62 SQL','63 정규형','64 데이터모델링','65 트랜잭션','66 동시성제어'],
   why:'여기까지 = 합격권 핵심 완성'},
  {rank:'🥈 4순위',label:'네트워크',    lectures:'35~47번',priority:'그 다음',bg:'bg-blue-50',border:'border-blue-200',tag:'bg-blue-100 text-blue-700',
   topics:['35~39 데이터통신','40 TCP/IP','41 TCP/UDP','42 IP','43 IPv6','44 토폴로지','45 LAN','46 신기술','47 기출'],
   why:'개념 이해 + 암기 섞임'},
  {rank:'🥈 5순위',label:'컴퓨터구조',  lectures:'01~23번',priority:'뒤로 미룸',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-600',
   topics:['01~23 컴퓨터구조 전체'],
   why:'초반에 듣기엔 효율 낮음. 나중에 보완용'},
  {rank:'🥉 6순위',label:'소프트웨어공학',lectures:'67~74번',priority:'거의 마지막',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-500',
   topics:['67~74 소프트웨어공학 전체'],
   why:'암기 위주. 시간 대비 효율 낮음'},
  {rank:'🥉 7순위',label:'기타 (언어 등)',lectures:'75~78번',priority:'시간 남으면',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-400',
   topics:['75~78 기타'],
   why:'시간 남으면. 억지로 안 봐도 됨'},
];

/* ─── 정보보호론 강의 순서 ─────────────────────────── */
const INFOSEC_ORDER = [
  {rank:'🥇 1순위',label:'암호화',lectures:'05~16번',priority:'핵심 중 핵심 — 무조건 먼저',bg:'bg-red-50',border:'border-red-200',tag:'bg-red-100 text-red-700',
   topics:['05 암호시스템','06 대칭키 암호','07 기출OX + 3DES','08 AES','09 블록암호 운용모드','10 대표 알고리즘 + KDC','11 Diffie-Hellman','12 RSA','13 암호해독 + 중간자 공격','14 해시함수','15 해시 공격','16 SHA + 문제'],
   why:'여기 먼저 끝내면 절반 먹고 들어감'},
  {rank:'🥇 2순위',label:'인증 / 접근제어',lectures:'17~24번',priority:'암호화 다음 바로',bg:'bg-orange-50',border:'border-orange-200',tag:'bg-orange-100 text-orange-700',
   topics:['17 인증 + MAC','18 전자서명','19 인증서','21 사용자 인증','22 생체인증 + 커버로스','23 커버로스','24 접근제어 + 보안모델'],
   why:'시험에서 "그대로 나오는 파트"'},
  {rank:'🥈 3순위',label:'공격 유형',lectures:'31~36, 46~48번',priority:'점수 갈리는 파트',bg:'bg-amber-50',border:'border-amber-200',tag:'bg-amber-100 text-amber-700',
   topics:['31 네트워크 공격','32 스니핑','33 HTTP/APT 공격','34 스캐닝','35 악성SW','36 사회공학','46 SQL 공격','47 코드 공격','48 취약점'],
   why:'"설명 보고 맞추는 문제" 여기서 나옴'},
  {rank:'🥈 4순위',label:'네트워크 보안',lectures:'37~45번',priority:'그 다음',bg:'bg-blue-50',border:'border-blue-200',tag:'bg-blue-100 text-blue-700',
   topics:['37 방화벽','38~39 IDS/IPS','40 VPN','41 IP보안','42 메일구조','43 PGP','44 SSL/TLS','45 SSH'],
   why:'개념 이해 중심'},
  {rank:'🥉 5순위',label:'네트워크 기초',lectures:'27~30번',priority:'필요할 때만',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-500',
   topics:['27 IP','28 TCP','29 ARP','30 네트워크 명령'],
   why:'보조 개념. 앞 파트 이해에 필요할 때 참고'},
  {rank:'🥉 6순위',label:'관리적 보안 / 기타',lectures:'49~55번',priority:'마지막 몰아서',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-400',
   topics:['49 전자상거래 / 무선','50 모바일 / 윈도우','51 리눅스','52 DB보안','53 재난복구','54 관리 / 표준','55 평가제도'],
   why:'암기 많음. 막판에 몰아서 가능'},
  {rank:'❌ 스킵 가능',label:'이론 / 개요',lectures:'01~04번',priority:'시간 부족 시 스킵',bg:'bg-gray-50',border:'border-gray-200',tag:'bg-gray-100 text-gray-500',
   topics:['01~04 이론/개요'],
   why:'시험 출제 비중 낮음'},
];

/* ─── 기출 연결 방식 ────────────────────────────── */
const KICHUL_LINK = [
  {
    subject:'💻 컴퓨터일반', color:'text-violet-700', bg:'bg-violet-50', border:'border-violet-200',
    parts:[
      {part:'운영체제 들은 날',   problems:['스케줄링 문제','교착상태','메모리 관리']},
      {part:'자료구조 들은 날',   problems:['스택 / 큐','트리 순회','정렬']},
      {part:'데이터베이스 들은 날',problems:['정규화','SQL','트랜잭션']},
    ],
  },
  {
    subject:'🔐 정보보호론', color:'text-cyan-700', bg:'bg-cyan-50', border:'border-cyan-200',
    parts:[
      {part:'암호화 들은 날',  problems:['대칭키 vs 공개키','RSA / AES','해시']},
      {part:'인증 들은 날',    problems:['인증 방식','전자서명','접근제어']},
      {part:'공격 유형 들은 날',problems:['SQL Injection','XSS','DoS']},
    ],
  },
];

/* ─── 하루 시간표 (5/1~5/10 기준) ───────────────── */
const DAILY_SCHEDULE = [
  {time:'09:00~11:30',subject:'💻 컴퓨터일반',task:'인강 2~3강 (OS/자료구조) + 바로 기출 5~10문제',bg:'bg-violet-50',border:'border-violet-200',tc:'text-violet-700',tip:'뇌 상태 최고일 때 핵심 과목'},
  {time:'13:00~15:00',subject:'🔐 정보보호론',task:'인강 2강 (암호화 파트) + 핵심 키워드 메모',bg:'bg-cyan-50',border:'border-cyan-200',tc:'text-cyan-700',tip:''},
  {time:'15:30~17:00',subject:'💻 컴일 2차',  task:'인강 1~2강 추가 + 기출 5문제',bg:'bg-violet-50',border:'border-violet-200',tc:'text-violet-700',tip:''},
  {time:'17:30~18:30',subject:'📖 국어',       task:'독해 3지문 or 문법',bg:'bg-emerald-50',border:'border-emerald-200',tc:'text-emerald-700',tip:'집중력 떨어질 때 가벼운 과목'},
  {time:'19:30~21:00',subject:'🔐 정보보호 기출',task:'기출 5~10문제 + 틀린 개념 체크',bg:'bg-cyan-50',border:'border-cyan-200',tc:'text-cyan-700',tip:''},
  {time:'자기 전 10~15분',subject:'🧠 암기 고정',task:'정보보호 (암호화/인증) + 한국사 간단 흐름',bg:'bg-pink-50',border:'border-pink-200',tc:'text-pink-700',tip:'기억 고정'},
];

/* ─── 과목별 전략 ────────────────────────────────── */
const STRATEGIES = [
  {
    id:'컴퓨터일반',emoji:'💻',
    grad:'from-violet-600 to-indigo-500',shadow:'rgba(124,58,237,0.3)',
    bg:'bg-violet-50',border:'border-violet-200',text:'text-violet-700',
    importance:'최우선 ⭐⭐⭐',desc:'합격 핵심 과목. 점수 차이가 여기서 남.',
    strategy:['지금 당장 24번부터 시작 (1번부터 X)','하루 3~4강 → 듣고 바로 기출 5~10문제','완벽 이해 기다리지 말고 넘어가. 2회독에서 완성','강의 번호 순서대로 ❌ → 우선순위 순서로 점프 ✅'],
    exam:['아는 문제 → 즉시 체크','헷갈리는 문제 → 표시 후 넘김','3분 이상 고민 절대 금지','목표: 실수 2~3개 이하'],
  },
  {
    id:'정보보호론',emoji:'🔐',
    grad:'from-cyan-500 to-sky-500',shadow:'rgba(8,145,178,0.28)',
    bg:'bg-cyan-50',border:'border-cyan-200',text:'text-cyan-700',
    importance:'중요 ⭐⭐',desc:'암기성 강함. 하루 안 보면 바로 까먹는 과목.',
    strategy:['지금 당장 05번부터 시작 (1번부터 X)','인강 → 바로 요약 → 다음날 10분 복습','짧게라도 매일 보기 (끊기면 다 날아감)','암호화 + 인증만 잡아도 점수 나온다'],
    exam:['선지 하나하나 확인','"비슷한 개념" 낚시 주의','확실히 모르면 과감히 넘김','목표: 낚시 선지 안 걸리기'],
  },
  {
    id:'국어',emoji:'📖',
    grad:'from-emerald-500 to-green-400',shadow:'rgba(5,150,105,0.25)',
    bg:'bg-emerald-50',border:'border-emerald-200',text:'text-emerald-700',
    importance:'기본 ⭐⭐',desc:'감 유지 과목. 매일 조금씩 하면 됨.',
    strategy:['문법 틀리면 점수 바로 날아감 → 문법 먼저','독해: 매일 3~5지문 시간 재고 풀기','많이 듣기보다 직접 풀기가 훨씬 중요','인강 30~40% / 문제풀이 60~70%'],
    exam:['스타트 과목으로 추천','문법 → 바로 풀기, 독해 → 쉬운 지문 먼저','한 지문 3분 이상 쓰면 위험','목표: 시간 부족 방지'],
    lectureOrder:[
      {rank:'🥇 1순위',name:'문법 (형태론/통사론)',reason:'틀리면 점수 바로 날아감',tag:'고빈도·필수',tagColor:'bg-red-100 text-red-700'},
      {rank:'🥈 2순위',name:'독해 (비문학)',reason:'문제 풀이로 감 유지',tag:'고빈도',tagColor:'bg-amber-100 text-amber-700'},
      {rank:'🥈 2순위',name:'어휘 / 맞춤법',reason:'꾸준히 암기',tag:'중빈도',tagColor:'bg-amber-100 text-amber-700'},
      {rank:'🥉 3순위',name:'문학 (현대/고전)',reason:'시간 있을 때',tag:'후순위',tagColor:'bg-slate-100 text-slate-500'},
      {rank:'🥉 3순위',name:'화법 / 작문',reason:'시간 있을 때',tag:'후순위',tagColor:'bg-slate-100 text-slate-500'},
    ],
  },
  {
    id:'한국사',emoji:'🏛️',
    grad:'from-amber-500 to-yellow-400',shadow:'rgba(217,119,6,0.25)',
    bg:'bg-amber-50',border:'border-amber-200',text:'text-amber-700',
    importance:'서브 (한능검) ⭐',desc:'군무원엔 없음. 한능검 3급 컷만 노린다.',
    strategy:['3~4일 압축이 가장 효율적','시대 흐름 + 사료 해석이 핵심','최소 3일 투자','5/17~5/22 집중 (4일 압축 루틴)'],
    exam:['군무원 시험 아님 → 3급 컷만 목표','Day1 선사~고려, Day2 조선, Day3 근현대, Day4 기출 2~3회'],
    lectureOrder:[
      {rank:'🥇 1순위',name:'조선 (붕당/개혁/정치)',reason:'출제 비중 최상',tag:'최고빈도',tagColor:'bg-red-100 text-red-700'},
      {rank:'🥇 1순위',name:'근현대 (독립운동/정부)',reason:'출제 비중 최상',tag:'최고빈도',tagColor:'bg-red-100 text-red-700'},
      {rank:'🥈 2순위',name:'고려 (왕/사건 줄기)',reason:'출제 비중 높음',tag:'고빈도',tagColor:'bg-amber-100 text-amber-700'},
      {rank:'🥉 3순위',name:'선사~삼국 흐름',reason:'시대 흐름만 파악',tag:'후순위',tagColor:'bg-slate-100 text-slate-500'},
    ],
  },
];

/* ─── 공통 컴포넌트 ──────────────────────────────── */
function OrderList({ items, expandedGroup, setExpandedGroup }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((g, i) => (
        <div key={i}>
          <button
            onClick={() => setExpandedGroup(expandedGroup === i ? null : i)}
            className={`w-full flex items-center gap-3.5 p-4 ${g.bg} border ${g.border} rounded-xl text-left transition-all hover:shadow-sm`}
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-extrabold text-slate-600 flex-shrink-0 shadow-sm">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[14px] text-slate-800">{g.label}</span>
                <span className="text-xs font-bold text-slate-400">({g.lectures})</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${g.tag}`}>{g.rank}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{g.why}</div>
            </div>
            <span className="text-slate-300 text-sm flex-shrink-0">{expandedGroup === i ? '▲' : '▼'}</span>
          </button>
          {expandedGroup === i && (
            <div className={`${g.bg} border ${g.border} border-t-0 rounded-b-xl px-4 pb-4 -mt-1`}>
              <div className="grid grid-cols-2 gap-1.5 max-sm:grid-cols-1 pt-3">
                {g.topics.map((t, j) => (
                  <div key={j} className="bg-white rounded-lg px-3 py-2 text-xs font-medium text-slate-600 border border-white shadow-sm">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── 메인 컴포넌트 ──────────────────────────────── */
export default function Strategy() {
  const [active, setActive]           = useState('컴퓨터일반');
  const [tab, setTab]                 = useState('order');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const sub    = STRATEGIES.find(s => s.id === active);
  const isComp = active === '컴퓨터일반';
  const isInfo = active === '정보보호론';

  const TABS = [
    ...(isComp || isInfo ? [{id:'order',label:'📋 인강 듣는 순서'}] : [{id:'order',label:'📋 인강 순서'}]),
    ...(isComp ? [{id:'plan',label:'📅 14일 진도표'}] : []),
    {id:'schedule',label:'⏱️ 하루 시간표'},
    {id:'kichul',  label:'📚 기출 연결'},
    {id:'strategy',label:'🎯 학습 전략'},
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">🧠 과목별 전략</h1>
        <p className="page-subtitle">과목마다 다른 전략으로 접근하자</p>
      </div>

      {/* 핵심 원칙 */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-500 rounded-2xl p-4 mb-6 flex items-center gap-3"
           style={{boxShadow:'0 4px 20px rgba(124,58,237,0.25)'}}>
        <span className="text-2xl flex-shrink-0">🎯</span>
        <div>
          <div className="text-white font-extrabold text-[15px]">"인강 → 바로 기출 → 틀린 개념 체크" 이 사이클이 전부다</div>
          <div className="text-violet-200 text-xs mt-0.5">강의는 속도로, 점수는 기출로 만든다</div>
        </div>
      </div>

      {/* 과목 탭 */}
      <div className="tabs">
        {STRATEGIES.map(s => (
          <button key={s.id} onClick={() => { setActive(s.id); setTab('order'); setExpandedGroup(null); }}
            className={`tab-btn ${active===s.id?'active':''}`}>
            {s.emoji} {s.id}
          </button>
        ))}
      </div>

      {/* 과목 헤더 */}
      <div className={`rounded-3xl p-7 bg-gradient-to-br ${sub.grad} text-white mb-5 flex items-center gap-5 flex-wrap`}
           style={{boxShadow:`0 8px 32px ${sub.shadow}`}}>
        <div className="text-5xl">{sub.emoji}</div>
        <div>
          <div className="text-2xl font-extrabold mb-1">{sub.id}</div>
          <div className="text-sm opacity-80">{sub.desc}</div>
        </div>
        <div className="ml-auto bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold flex-shrink-0">
          {sub.importance}
        </div>
      </div>

      {/* 기능 탭 */}
      <div className={`grid gap-2 mb-5`} style={{gridTemplateColumns:`repeat(${TABS.length},1fr)`}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setExpandedGroup(null); }}
            className={`py-2.5 rounded-xl text-xs font-bold border transition-all max-sm:text-[11px] max-sm:py-2
              ${tab===t.id ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 인강 듣는 순서 ── */}
      {tab === 'order' && (
        <div>
          <div className="card mb-4">
            <h3 className="font-bold text-slate-800 mb-1">
              🔢 {sub.id} 인강 듣는 순서 {isComp ? '— 24번부터!' : isInfo ? '— 05번부터!' : ''}
            </h3>
            <p className="text-xs text-slate-400 mb-4">강의 번호 순서 ❌ → 점수 순서 ✅ · 클릭하면 세부 강의 펼쳐짐</p>
            <OrderList
              items={isComp ? COMP_ORDER : isInfo ? INFOSEC_ORDER : (sub.lectureOrder || []).map((lo, i) => ({
                rank: lo.rank, label: lo.name, lectures:'', priority:'', bg:'bg-slate-50', border:'border-slate-200',
                tag: lo.tagColor, topics:[], why: lo.reason
              }))}
              expandedGroup={expandedGroup}
              setExpandedGroup={setExpandedGroup}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">❌</span>
              <div>
                <div className="font-bold text-red-700 text-sm">강의 번호 순서대로 (1번부터)</div>
                <div className="text-xs text-red-500 mt-0.5">시간 부족으로 핵심 못 끝냄</div>
              </div>
            </div>
            <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">✅</span>
              <div>
                <div className="font-bold text-emerald-700 text-sm">지금 당장 {isComp ? '24' : isInfo ? '05' : '1'}번부터 시작!</div>
                <div className="text-xs text-emerald-600 mt-0.5">우선순위 순서로 점프하며 듣기</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 14일 진도표 (컴일 전용) ── */}
      {tab === 'plan' && isComp && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5 max-sm:grid-cols-1">
            {[{date:'5/3까지',goal:'자료구조 완료',c:'bg-amber-50 border-amber-200 text-amber-700'},
              {date:'5/7까지',goal:'DB 완료',       c:'bg-emerald-50 border-emerald-200 text-emerald-700'},
              {date:'5/10까지',goal:'🔥 기출 시작', c:'bg-red-50 border-red-200 text-red-700'}
            ].map(g => (
              <div key={g.date} className={`${g.c} border rounded-xl p-3.5 text-center`}>
                <div className="text-xs font-bold opacity-70 mb-1">{g.date}</div>
                <div className="font-extrabold text-[15px]">{g.goal}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {COMP_DAILY_PLAN.map((block, bi) => (
              <div key={bi} className="card !p-0 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                  <div>
                    <div className="font-extrabold text-slate-800 text-[15px]">{block.period}</div>
                    <div className="text-xs text-slate-500">{block.desc} · 하루 {block.perDay}</div>
                  </div>
                  <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${block.tagColor}`}>{block.tag}</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {block.days.map((d, di) => (
                    <div key={di} className="flex gap-4 px-5 py-3.5 items-start">
                      <div className="text-xs font-bold text-slate-400 min-w-[80px] flex-shrink-0 mt-0.5">{d.date}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-slate-700">{d.topic}</div>
                        <div className="text-xs text-violet-600 font-bold mt-0.5">강의 {d.lectures}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-t border-violet-100">
                  <span className="text-sm font-bold text-violet-700">{block.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 하루 시간표 ── */}
      {tab === 'schedule' && (
        <div>
          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-1">⏱️ 하루 시간표 (5/1~5/10 기준, 풀타임)</h3>
            <p className="text-xs text-slate-400 mb-5">컴일 + 정보보호 동시에 굴리는 구조 · 하루 총 5~7시간</p>
            <div className="flex flex-col gap-3">
              {DAILY_SCHEDULE.map((r, i) => (
                <div key={i} className={`flex gap-4 items-center ${r.bg} border ${r.border} rounded-xl px-5 py-4`}>
                  <div className="flex-shrink-0 min-w-[110px]">
                    <div className={`text-xs font-extrabold ${r.tc}`}>{r.time}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[13.5px] text-slate-800">{r.subject}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.task}</div>
                  </div>
                  {r.tip && (
                    <div className="text-[10px] text-slate-400 text-right flex-shrink-0 max-w-[80px] leading-tight">{r.tip}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="card bg-amber-50 border-amber-200">
            <h3 className="font-bold text-slate-800 mb-3">🔥 하루 요약</h3>
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              {[
                {label:'💻 컴일',   val:'3~5강 + 기출',   c:'bg-violet-100 text-violet-700 border-violet-200'},
                {label:'🔐 정보보호',val:'2~3강 + 기출',   c:'bg-cyan-100 text-cyan-700 border-cyan-200'},
                {label:'📖 국어',   val:'3지문 or 문법',  c:'bg-emerald-100 text-emerald-700 border-emerald-200'},
              ].map(s => (
                <div key={s.label} className={`${s.c} border rounded-xl p-3.5 text-center`}>
                  <div className="font-bold text-sm">{s.label}</div>
                  <div className="text-[13px] mt-1 font-extrabold">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 기출 연결 ── */}
      {tab === 'kichul' && (
        <div>
          <div className="card mb-5">
            <div className="flex gap-3 items-start mb-5">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 mb-1">📚 기출 연결 방식</h3>
                <p className="text-xs text-slate-400">그날 들은 범위 → 바로 이 문제 풀기</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-[10px] text-red-500 font-bold">❌ 인강 다 듣고</div>
                  <div className="text-[10px] text-red-500">기출 → 실패 루트</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-[10px] text-emerald-600 font-bold">✅ 그날 바로</div>
                  <div className="text-[10px] text-emerald-600">기출 → 성공 루트</div>
                </div>
              </div>
            </div>
            {KICHUL_LINK.map((subj, si) => (
              <div key={si} className={`${subj.bg} border ${subj.border} rounded-2xl p-4 mb-4 last:mb-0`}>
                <div className={`font-extrabold text-[15px] ${subj.color} mb-3`}>{subj.subject}</div>
                <div className="flex flex-col gap-2.5">
                  {subj.parts.map((p, pi) => (
                    <div key={pi} className="bg-white rounded-xl px-4 py-3 border border-white/80 shadow-sm flex gap-4 items-start flex-wrap">
                      <div className="text-xs font-bold text-slate-500 min-w-[130px] flex-shrink-0 mt-0.5">
                        📌 {p.part}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {p.problems.map((prob, pri) => (
                          <span key={pri} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${subj.bg} ${subj.color} border ${subj.border}`}>
                            {prob}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-gradient-to-br from-slate-50 to-violet-50 border-violet-200">
            <h3 className="font-bold text-slate-800 mb-3">📊 문제 푸는 방식 (단계별)</h3>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-violet-700 mb-2">지금~5월 중순</div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  하루 <strong>5~10문제</strong> (과목별)<br/>
                  틀린 것 <strong>체크만</strong> → 개념 다시 확인<br/>
                  맞으면 그냥 넘어감
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-red-600 mb-2">5월 중순 이후</div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  하루 <strong>20~30문제</strong><br/>
                  틀린 것 <strong>분석까지</strong><br/>
                  "문제 보면 자동으로 답 떠오름" 목표
                </div>
              </div>
            </div>
            <div className="mt-3 bg-violet-100 rounded-xl px-4 py-3 text-center">
              <div className="text-violet-800 font-bold text-sm">
                반복되면 → "문제 보면 자동으로 답 떠오름" 상태 진입 🎯
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 학습 전략 ── */}
      {tab === 'strategy' && (
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
          <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <h3 className="font-bold text-slate-800 mb-4">🔥 5/10까지 현실 목표</h3>
            <div className="grid grid-cols-3 gap-3 mb-4 max-sm:grid-cols-1">
              {[
                {label:'💻 컴일',    goal:'OS+자료구조+DB',c:'bg-violet-100 border-violet-200 text-violet-700'},
                {label:'🔐 정보보호', goal:'암호화+인증+공격',c:'bg-cyan-100 border-cyan-200 text-cyan-700'},
                {label:'이후',       goal:'5월 중순에 채우기',c:'bg-slate-100 border-slate-200 text-slate-600'},
              ].map(item => (
                <div key={item.label} className={`${item.c} border rounded-xl p-3.5 text-center`}>
                  <div className="font-bold text-[14px] mb-1">{item.label}</div>
                  <div className="font-extrabold text-sm">{item.goal}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 max-sm:flex-col">
              {[
                {label:'컴퓨터일반',pct:50,grad:'from-violet-600 to-indigo-500',shadow:'rgba(124,58,237,0.25)'},
                {label:'정보보호론',pct:30,grad:'from-cyan-500 to-sky-500',     shadow:'rgba(6,182,212,0.22)'},
                {label:'국어',      pct:20,grad:'from-emerald-500 to-green-400',shadow:'rgba(5,150,105,0.2)'},
              ].map(item => (
                <div key={item.label} className={`flex-1 bg-gradient-to-br ${item.grad} rounded-2xl p-4 text-white text-center`}
                     style={{boxShadow:`0 4px 16px ${item.shadow}`}}>
                  <div className="text-3xl font-black mb-0.5">{item.pct}%</div>
                  <div className="text-xs opacity-90 font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
