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

/* ─── 국어 강의 순서 (문법 김병태) ──────────────────── */
const KOREAN_GRAMMAR_ORDER = [
  {rank:'🥇 1순위',label:'음운 / 표준 발음법',lectures:'13~23번',priority:'제일 먼저 — 시험 함정 1위',bg:'bg-red-50',border:'border-red-200',tag:'bg-red-100 text-red-700',
   topics:['13 자음 체계','14 훈민정음','15 음운변동','16~23 표준 발음법 전체 (비음화/유음화/경음화/구개음화)'],
   why:'문제 대부분 여기서 출제. "맞는 것 고르기" 함정 많음'},
  {rank:'🥇 2순위',label:'형태소 / 단어 형성',lectures:'08~12번',priority:'안정 점수 구간',bg:'bg-orange-50',border:'border-orange-200',tag:'bg-orange-100 text-orange-700',
   topics:['08 형태소','09 파생접사','10~11 접미사','12 합성어'],
   why:'안정 점수 구간. 반복 출제'},
  {rank:'🥈 3순위',label:'품사 / 문장성분',lectures:'01~03번',priority:'기본 개념',bg:'bg-amber-50',border:'border-amber-200',tag:'bg-amber-100 text-amber-700',
   topics:['01~02 성분과 품사','03 체언'],
   why:'기본 개념. 가볍게 보고 넘어가기'},
  {rank:'🥉 4순위',label:'어미',lectures:'04~07번',priority:'시간 부족 시 뒤로',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-500',
   topics:['04 종결어미','05 연결어미','06~07 전성어미'],
   why:'시간 부족하면 뒤로 미뤄도 됨'},
];

/* ─── 국어 독해 (이유진) 수강 범위 ──────────────────── */
const KOREAN_READING_ORDER = [
  {rank:'🥇 무조건 듣기',label:'주제/결론 + 구조독해',lectures:'07~09, 12~15번',priority:'독해 실력 바로 올라가는 구간',bg:'bg-red-50',border:'border-red-200',tag:'bg-red-100 text-red-700',
   topics:['07~09 주제/결론 파악','12~15 구조 독해'],
   why:'독해 점수 바로 올라가는 핵심 파트'},
  {rank:'🥇 무조건 듣기',label:'확인 + 응용 추론',lectures:'16~22, 28~34번',priority:'추론 문제 대응',bg:'bg-orange-50',border:'border-orange-200',tag:'bg-orange-100 text-orange-700',
   topics:['16~22 확인 추론','28~34 응용 추론'],
   why:'추론 비중 높아지는 추세. 여기서 점수 갈림'},
  {rank:'🥈 여유 있으면',label:'논리 / 비판',lectures:'40~46번',priority:'추가 득점',bg:'bg-amber-50',border:'border-amber-200',tag:'bg-amber-100 text-amber-700',
   topics:['40~46 논리/비판'],
   why:'시간 있으면 들으면 좋음'},
  {rank:'❌ 스킵 가능',label:'지문형 문법 / 화법·작문',lectures:'01~06, 38~39번',priority:'시간 부족 시 생략',bg:'bg-slate-50',border:'border-slate-200',tag:'bg-slate-100 text-slate-400',
   topics:['01~06 지문형 문법','38~39 화법/작문'],
   why:'시간 대비 효율 낮음. 시간 부족 시 스킵'},
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

/* ─── 정보보호론 일정 (4/28~5/10) ───────────────────── */
const INFOSEC_SCHEDULE = [
  {
    period:'4/28~4/30', tag:'암호 기초 스타트', tagColor:'bg-cyan-100 text-cyan-700',
    desc:'암호 개념 구조 익히기', perDay:'1~2시간',
    days:[
      {
        date:'4/28 Day1', lectures:'05강, 06강', topic:'암호시스템 / 대칭키 암호',
        task:'대칭 vs 공개키 기출 3~5문제',
        points:['암호의 목적 (기밀성/무결성/가용성)','대칭키 vs 공개키 차이 감 잡기'],
      },
      {
        date:'4/29 Day2', lectures:'07강, 08강, 09강', topic:'3DES / AES / 블록암호 운용모드',
        task:'AES/DES 비교 기출 5문제',
        points:['AES vs DES 차이','ECB / CBC 정도만 감 잡기'],
      },
      {
        date:'4/30 Day3', lectures:'10강, 11강', topic:'KDC / Diffie-Hellman',
        task:'키교환/KDC 기출 5문제',
        points:['키 분배 방식 구조 이해','공개키 교환 개념'],
      },
    ],
    result:'✅ 암호화 흐름 50% 완성!',
  },
  {
    period:'5/1~5/4', tag:'암호화 완성 🔥', tagColor:'bg-orange-100 text-orange-700',
    desc:'RSA + 해시까지 암호화 100% 완성', perDay:'1~1.5시간',
    days:[
      {
        date:'5/1 Day4', lectures:'12강', topic:'RSA 암호해독',
        task:'RSA 특징 + "누가 암복호화?" 기출 5문제',
        points:['공개키/개인키 역할','암호화 vs 복호화 방향 (시험 단골)'],
      },
      {
        date:'5/2 Day5', lectures:'13강', topic:'암호해독 + 중간자 공격',
        task:'중간자 공격 + RSA 혼합 기출 5~8문제',
        points:['MITM 공격 흐름','키 탈취 과정'],
      },
      {
        date:'5/3 Day6', lectures:'14강, 15강', topic:'해시함수 / 해시 공격',
        task:'해시 특징 + SHA vs MD5 기출 5문제',
        points:['해시 목적: 무결성','단방향 특징 / 충돌·무차별 공격'],
      },
      {
        date:'5/4 Day7', lectures:'16강', topic:'SHA-512 + 단원 문제',
        task:'암호화 총정리 기출 10문제',
        points:['SHA 특징 (강화된 해시)','전체 암호 흐름 연결'],
      },
    ],
    result:'🔥 암호화 완성! 대칭키 ✔ 공개키 ✔ RSA ✔ 해시 ✔',
  },
  {
    period:'5/5~5/6', tag:'인증 완성', tagColor:'bg-blue-100 text-blue-700',
    desc:'인증 + 접근제어 자동반사화', perDay:'3~4시간',
    days:[
      {
        date:'5/5 Day8', lectures:'17강, 18강, 19강', topic:'인증 / 전자서명 / 인증서',
        task:'"다음 중 인증 방식 아닌 것" 유형 기출 20문제',
        points:['지식/소유/생체 인증','전자서명 vs 암호화 차이'],
      },
      {
        date:'5/6 Day9', lectures:'21~24강', topic:'사용자인증/생체/커버로스/접근제어',
        task:'RBAC/커버로스/접근제어 기출 20문제',
        points:['MAC=강제 / DAC=사용자 / RBAC=역할','커버로스 구조'],
      },
    ],
    result:'✅ 인증 완성! 문제 보면 3초 안에 자동 분류',
  },
  {
    period:'5/7~5/8', tag:'공격 유형 완성', tagColor:'bg-red-100 text-red-700',
    desc:'공격 유형 패턴 암기 + 자동반사화', perDay:'3~4시간',
    days:[
      {
        date:'5/7 Day10', lectures:'31~36강', topic:'네트워크 공격/스니핑/XSS/스캐닝/악성SW/사회공학',
        task:'공격 유형 기출 30문제',
        points:['SQL Injection=DB 조작','XSS=브라우저 공격','DoS=서비스 마비','APT=장기 침투'],
      },
      {
        date:'5/8 Day11', lectures:'46~48강', topic:'SQL공격 / 코드공격 / 취약점',
        task:'공격 유형 기출 30문제',
        points:['사회공학=사람 속임','설명 → 이름 매칭 훈련'],
      },
    ],
    result:'✅ 공격 유형 완성! 설명 보면 자동으로 답 나옴',
  },
  {
    period:'5/9~5/10', tag:'혼합 테스트 + 고정화', tagColor:'bg-pink-100 text-pink-700',
    desc:'실전형 혼합 기출로 완전 고정화', perDay:'3~4시간',
    days:[
      {
        date:'5/9 Day12', lectures:'기출', topic:'인증 + 공격 혼합 테스트',
        task:'인증+공격 혼합 기출 40문제 / 틀린 이유만 체크',
        points:['섞여도 구분 가능 상태 목표','틀린 이유만 체크 — 강의 다시 X'],
      },
      {
        date:'5/10 Day13', lectures:'기출', topic:'최종 고정화 (실전)',
        task:'기출 50문제 시간 재고 / 오답: 인증+공격 헷갈리는 유형만',
        points:['60~70점 진입 준비 완료 상태'],
      },
    ],
    result:'🎯 60~70점 진입 준비 완료!',
  },
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

/* ─── 하루 시간표 (5/15~5/31 기출 2회독 기준) ───────── */
const DAILY_SCHEDULE_ROUND2 = [
  {time:'오전 (1시간 40분)',  subject:'💻 컴퓨터일반 기출', task:'기출 20문제 (40분) → 채점/해설 (40분) → 틀린개념 정리 (20분)', bg:'bg-violet-50', border:'border-violet-200', tc:'text-violet-700', tip:'뇌 최고일 때 최우선'},
  {time:'오후 (1시간 10분)',  subject:'🔐 정보보호 기출',   task:'기출 15문제 (30분) → 해설 (30분) → 개념 체크 (10분)',         bg:'bg-cyan-50',   border:'border-cyan-200',   tc:'text-cyan-700',   tip:''},
  {time:'저녁 (40분)',        subject:'📖 국어',             task:'기출 1회분 or 틀린 문제 복습',                                 bg:'bg-emerald-50',border:'border-emerald-200',tc:'text-emerald-700',tip:''},
  {time:'저녁 (1시간)',       subject:'🏛️ 한국사',           task:'기출 or 흐름 복습',                                           bg:'bg-amber-50',  border:'border-amber-200',  tc:'text-amber-700',  tip:''},
  {time:'자기 전 (10분)',     subject:'🧠 오답 고정',         task:'틀린 이유 한 줄 정리 → 다음날 시작 전 확인',                  bg:'bg-pink-50',   border:'border-pink-200',   tc:'text-pink-700',   tip:'기억 고정'},
];

/* ─── 국어 출제코드 일정 (4/28~5/10) ─────────────────── */
const KOREAN_SCHEDULE = [
  {
    period:'4/28~4/30', tag:'문법 압축 스타트', tagColor:'bg-red-100 text-red-700',
    desc:'출제코드 1~6강 (문법)', perDay:'1시간',
    days:[
      {date:'4/28 Day1', lectures:'1강, 2강', topic:'문법 출제코드 1~2강', task:'문제 5문제 (문법)'},
      {date:'4/29 Day2', lectures:'3강, 4강', topic:'문법 출제코드 3~4강', task:'문제 5문제'},
      {date:'4/30 Day3', lectures:'5강, 6강', topic:'문법 출제코드 5~6강', task:'문제 5문제'},
    ],
    result:'✅ 문법 출제코드 1바퀴 완료!',
  },
  {
    period:'5/1~5/4', tag:'독해+구조', tagColor:'bg-emerald-100 text-emerald-700',
    desc:'출제코드 7~10강 (독해·구조)', perDay:'1~1.5시간',
    days:[
      {date:'5/1 Day4', lectures:'7강',  topic:'독해 출제코드 7강',  task:'지문 3개 풀기'},
      {date:'5/2 Day5', lectures:'8강',  topic:'독해 출제코드 8강',  task:'지문 3개'},
      {date:'5/3 Day6', lectures:'9강',  topic:'독해 출제코드 9강',  task:'문학 2지문'},
      {date:'5/4 Day7', lectures:'10강', topic:'독해 출제코드 10강', task:'혼합 문제 5문제'},
    ],
    result:'✅ 출제코드 1~10강 완료!',
  },
  {
    period:'5/5', tag:'핵심 하루 ⚡', tagColor:'bg-violet-100 text-violet-700',
    desc:'경향 분석 — 방향 확정', perDay:'1시간',
    days:[
      {date:'5/5 Day8', lectures:'11강', topic:'경향 분석 (뭐 버리고 뭐 집중할지)', task:'집중파트 / 버릴파트 정리'},
    ],
    result:'✅ 방향 확정! 기출 진입 준비 완료',
  },
  {
    period:'5/6~5/10', tag:'기출 진입 🔥', tagColor:'bg-pink-100 text-pink-700',
    desc:'먼저 문제 풀고 → 강의 순서로!', perDay:'1~2시간',
    days:[
      {date:'5/6  Day9',  lectures:'12강', topic:'2023 9급 기출 해설', task:'먼저 문제 풀기 → 강의'},
      {date:'5/7  Day10', lectures:'13강', topic:'2023 7급 기출 해설', task:'먼저 문제 풀기 → 강의'},
      {date:'5/8  Day11', lectures:'14강', topic:'2022 9급 기출 해설', task:'먼저 문제 풀기 → 강의'},
      {date:'5/9  Day12', lectures:'15강', topic:'2022 7급 기출 해설', task:'먼저 문제 풀기 → 강의'},
      {date:'5/10 Day13', lectures:'16강', topic:'2021 9급 기출 해설', task:'먼저 문제 풀기 → 강의'},
    ],
    result:'🔥 최근 3개년 기출 경험 완료! 국어 60점대 진입 가능 상태',
  },
];

/* ─── 기출 2회독 루틴 (5/15~5/31) ────────────────────── */
const KICHUL_ROUND2 = [
  {
    subject:'💻 컴퓨터일반', color:'text-violet-700', bg:'bg-violet-50', border:'border-violet-200',
    totalTime:'1시간 40분/일',
    steps:[
      {step:'1단계', time:'40분', task:'기출 20문제 풀기',   tip:'기억으로 X → 처음 보는 것처럼'},
      {step:'2단계', time:'40분', task:'채점 + 해설 확인',  tip:''},
      {step:'3단계', time:'20분', task:'틀린 개념 정리',    tip:'틀린 이유 한 줄로 압축'},
    ],
    examples:[
      {wrong:'❌ RR 스케줄링 틀림', right:'✅ 시간할당량 기준 순환 구조 다시 확인'},
    ],
  },
  {
    subject:'🔐 정보보호론', color:'text-cyan-700', bg:'bg-cyan-50', border:'border-cyan-200',
    totalTime:'1시간 10분/일',
    steps:[
      {step:'1단계', time:'30분', task:'기출 15문제 풀기',   tip:'처음 보는 것처럼'},
      {step:'2단계', time:'30분', task:'해설 확인',          tip:''},
      {step:'3단계', time:'10분', task:'틀린 개념 체크',     tip:'공개키/개인키 같은 핵심만'},
    ],
    examples:[
      {wrong:'❌ RSA 틀림', right:'✅ 공개키: 암호화 / 개인키: 복호화'},
    ],
  },
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
    importance:'기본 ⭐⭐',desc:'하루 1시간. 길게 하지 말고 꾸준히 + 문제 중심.',
    strategy:['문법: 13번 음운/발음부터 시작 (1번부터 X)','독해: 이유진 07~09번 (주제/결론) 먼저','강의 → 바로 문제. 인강만 듣기는 효과 없음','국어 욕심내면 컴일 망함. 하루 60분 고정'],
    exam:['국어 먼저 풀기 (스타트 과목)','문제 먼저 보고 지문 읽기 (키워드 파악)','선지 제거법 — 맞추는 게 아니라 틀린 거 빼기','3분 이상 한 지문 → 즉시 넘기기'],
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
  const isComp   = active === '컴퓨터일반';
  const isInfo   = active === '정보보호론';
  const isKorean = active === '국어';

  const TABS = [
    {id:'order',    label: isKorean ? '📋 문법 순서' : '📋 인강 듣는 순서'},
    ...(isKorean  ? [{id:'reading',  label:'📖 독해 수강 범위'}] : []),
    ...(isKorean  ? [{id:'korplan',  label:'📅 출제코드 일정'}] : []),
    ...(isComp    ? [{id:'plan',     label:'📅 14일 진도표'}] : []),
    ...(isInfo    ? [{id:'infoplan', label:'📅 4/28~5/10 진도표'}] : []),
    ...(isKorean  ? [{id:'routine',  label:'⏱️ 60분 루틴'}] : [{id:'schedule', label:'⏱️ 하루 시간표'}]),
    ...(isKorean  ? [{id:'template', label:'📝 오답 템플릿'}] : (isComp || isInfo ? [{id:'round2', label:'🔁 기출 2회독'}] : [])),
    ...(isKorean  ? [] : [{id:'kichul', label:'📚 기출 연결'}]),
    {id:'strategy', label:'🎯 학습 전략'},
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

      {/* ── 국어 독해 수강 범위 ── */}
      {tab === 'reading' && isKorean && (
        <div>
          <div className="card mb-4">
            <h3 className="font-bold text-slate-800 mb-1">📖 독해 수강 범위 (이유진)</h3>
            <p className="text-xs text-slate-400 mb-4">전부 듣지 말고 — 핵심 파트만 골라서 빠르게</p>
            <OrderList items={KOREAN_READING_ORDER} expandedGroup={expandedGroup} setExpandedGroup={setExpandedGroup} />
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">❌</span>
              <div>
                <div className="font-bold text-red-700 text-sm">50강 전부 듣기</div>
                <div className="text-xs text-red-500 mt-0.5">시간 낭비. 핵심 놓침</div>
              </div>
            </div>
            <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-xl flex-shrink-0">✅</span>
              <div>
                <div className="font-bold text-emerald-700 text-sm">07~09, 12~15, 16~22, 28~34 핵심만</div>
                <div className="text-xs text-emerald-600 mt-0.5">군무원이냐 공무원이냐보다 독해력이 중요</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 국어 60분 루틴 ── */}
      {tab === 'routine' && isKorean && (
        <div>
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-5 mb-5 text-white"
               style={{boxShadow:'0 4px 16px rgba(5,150,105,0.3)'}}>
            <div className="font-extrabold text-lg mb-1">⏱️ 하루 60분 국어 루틴</div>
            <div className="text-emerald-100 text-sm">"국어는 길게 하지 말고, 꾸준히 + 문제 중심으로"</div>
          </div>

          {/* 60분 3블록 */}
          <div className="grid grid-cols-3 gap-4 mb-5 max-sm:grid-cols-1">
            {[
              {time:'20분',emoji:'📚',label:'① 문법',desc:'김병태 1강 (또는 0.5강)\n핵심 포인트 1~2개만 체크',bg:'bg-violet-50',border:'border-violet-200',tc:'text-violet-700'},
              {time:'20분',emoji:'📖',label:'② 독해',desc:'이유진 1강 (핵심 파트만)\n"아 이렇게 푸는구나" 이해',bg:'bg-emerald-50',border:'border-emerald-200',tc:'text-emerald-700'},
              {time:'20분',emoji:'✏️',label:'③ 문제',desc:'독해 지문 3~5개 + 문법 3문제\n시간 재고 풀기 — 제일 중요',bg:'bg-amber-50',border:'border-amber-200',tc:'text-amber-700'},
            ].map(b => (
              <div key={b.label} className={`${b.bg} border ${b.border} rounded-2xl p-5`}>
                <div className={`text-xs font-extrabold ${b.tc} mb-2`}>{b.time}</div>
                <div className="text-2xl mb-2">{b.emoji}</div>
                <div className={`font-extrabold text-[15px] ${b.tc} mb-2`}>{b.label}</div>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{b.desc}</div>
              </div>
            ))}
          </div>

          {/* 60점 구조 */}
          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-4">🎯 60~70점 만드는 점수 구조</h3>
            <div className="grid grid-cols-2 gap-4 mb-4 max-sm:grid-cols-1">
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <div className="font-bold text-violet-700 mb-2">📚 문법 (20~30점)</div>
                <div className="text-sm text-slate-600 leading-relaxed">목표: <strong>아는 건 무조건 맞추기</strong><br/>음운/발음 집중 → 틀린 문제만 반복</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="font-bold text-emerald-700 mb-2">📖 독해 (40~50점)</div>
                <div className="text-sm text-slate-600 leading-relaxed">목표: <strong>확실한 것만 맞추기</strong><br/>지문 다 이해 X → 선지 기준으로 판단</div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium">
              💡 3주 유지하면 60점 안정권 진입. 국어에 시간 더 쓰면 컴일 망함!
            </div>
          </div>

          {/* 시험장 스킬 */}
          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-4">🔥 시험장 실전 스킬</h3>
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div>
                <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">독해 핵심 스킬</div>
                {[
                  {n:'1',t:'문제 먼저 보기',d:'뭘 찾을지 알고 지문 읽기'},
                  {n:'2',t:'키워드 잡기',   d:'지문 전체 이해 X → 핵심만'},
                  {n:'3',t:'선지 제거',     d:'맞추는 시험 X → 틀린 거 빼기'},
                ].map(s => (
                  <div key={s.n} className="flex gap-3 mb-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{s.n}</div>
                    <div><div className="font-semibold text-sm text-slate-700">{s.t}</div><div className="text-xs text-slate-500">{s.d}</div></div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">문법 핵심 스킬</div>
                {[
                  {n:'1',t:'100% 확신 없으면 보류',d:'나중에 다시 — 시간 잡아먹으면 손해'},
                  {n:'2',t:'음운변동 4가지 암기',  d:'교체/탈락/첨가/축약'},
                  {n:'3',t:'발음법 4가지 암기',    d:'비음화/유음화/경음화/구개음화'},
                ].map(s => (
                  <div key={s.n} className="flex gap-3 mb-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{s.n}</div>
                    <div><div className="font-semibold text-sm text-slate-700">{s.t}</div><div className="text-xs text-slate-500">{s.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 국어 망하는 패턴 */}
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-3">❌ 국어 망하는 패턴</h3>
            {[
              {bad:'국어에 시간 많이 씀',   result:'컴일 망함'},
              {bad:'독해 인강만 듣고 문제 안 품', result:'실력 안 오름'},
              {bad:'문법 완벽하게 하려 함', result:'시간 부족'},
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-red-400 flex-shrink-0">❌</span>
                <span className="font-medium text-sm text-slate-700 flex-1">{r.bad}</span>
                <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-1 rounded-full flex-shrink-0">→ {r.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 인강 듣는 순서 ── */}
      {tab === 'order' && (
        <div>
          <div className="card mb-4">
            <h3 className="font-bold text-slate-800 mb-1">
              🔢 {sub.id} 인강 듣는 순서 {isComp ? '— 24번부터!' : isInfo ? '— 05번부터!' : ''}
            </h3>
            <p className="text-xs text-slate-400 mb-4">강의 번호 순서 ❌ → 점수 순서 ✅ · 클릭하면 세부 강의 펼쳐짐</p>
            <OrderList
              items={isComp ? COMP_ORDER : isInfo ? INFOSEC_ORDER : isKorean ? KOREAN_GRAMMAR_ORDER : (sub.lectureOrder || []).map((lo) => ({
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
                <div className="font-bold text-emerald-700 text-sm">
                  지금 당장 {isComp ? '24' : isInfo ? '05' : isKorean ? '13' : '1'}번부터 시작!
                </div>
                <div className="text-xs text-emerald-600 mt-0.5">
                  {isKorean ? '음운/발음 (13~23) → 형태소 (08~12) 순서로' : '우선순위 순서로 점프하며 듣기'}
                </div>
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

      {/* ── 국어 출제코드 일정 ── */}
      {tab === 'korplan' && isKorean && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5 max-sm:grid-cols-1">
            {[
              {date:'4/30까지', goal:'문법 출제코드 완료',         c:'bg-red-50 border-red-200 text-red-700'},
              {date:'5/5까지',  goal:'출제코드 1~10강 + 경향 분석', c:'bg-emerald-50 border-emerald-200 text-emerald-700'},
              {date:'5/10까지', goal:'🔥 최근 3개년 기출 경험',    c:'bg-pink-50 border-pink-200 text-pink-700'},
            ].map(g => (
              <div key={g.date} className={`${g.c} border rounded-xl p-3.5 text-center`}>
                <div className="text-xs font-bold opacity-70 mb-1">{g.date}</div>
                <div className="font-extrabold text-[15px]">{g.goal}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 mb-5">
            {KOREAN_SCHEDULE.map((block, bi) => (
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
                      <div className="text-xs font-bold text-slate-400 min-w-[90px] flex-shrink-0 mt-0.5">{d.date}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-slate-700">{d.topic}</div>
                        <div className="text-xs text-emerald-600 font-bold mt-0.5">강의 {d.lectures}</div>
                      </div>
                      <div className="text-xs text-pink-600 font-semibold flex-shrink-0 max-w-[130px] text-right">{d.task}</div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border-t border-emerald-100">
                  <span className="text-sm font-bold text-emerald-700">{block.result}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card bg-red-50 border-red-200">
            <h3 className="font-bold text-slate-800 mb-3">💣 기출 풀 때 절대 규칙 3개</h3>
            <div className="flex flex-col gap-2">
              {[
                {num:'1', rule:'하루 1강이라도 "끊지 않기"', desc:'국어는 감 과목 — 끊기면 바로 실력 떨어짐'},
                {num:'2', rule:'기출은 "먼저 풀고 강의"',    desc:'반대로 하면 효과 50% 날아감'},
                {num:'3', rule:'틀린 선지 따로 적기',        desc:'시험 직전에 이거만 보면 됨'},
              ].map(r => (
                <div key={r.num} className="flex items-start gap-3 bg-white border border-red-100 rounded-xl px-4 py-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 mt-0.5">{r.num}</div>
                  <div>
                    <div className="font-bold text-[13.5px] text-red-700">{r.rule}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-[13px] font-bold text-emerald-700 bg-emerald-100 rounded-xl py-2.5">
              "출제코드 = 빠르게 훑고, 점수는 기출에서 만든다" 🎯
            </div>
          </div>
        </div>
      )}

      {/* ── 정보보호론 진도표 ── */}
      {tab === 'infoplan' && isInfo && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5 max-sm:grid-cols-1">
            {[
              {date:'4/30까지', goal:'암호화 흐름 50% 완성',         c:'bg-cyan-50 border-cyan-200 text-cyan-700'},
              {date:'5/4까지',  goal:'암호화 100% 완성 (RSA+해시)', c:'bg-orange-50 border-orange-200 text-orange-700'},
              {date:'5/10까지', goal:'🔥 60~70점 진입 준비 완료',   c:'bg-pink-50 border-pink-200 text-pink-700'},
            ].map(g => (
              <div key={g.date} className={`${g.c} border rounded-xl p-3.5 text-center`}>
                <div className="text-xs font-bold opacity-70 mb-1">{g.date}</div>
                <div className="font-extrabold text-[14px]">{g.goal}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 mb-5">
            {INFOSEC_SCHEDULE.map((block, bi) => (
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
                    <div key={di} className="px-5 py-4">
                      <div className="flex gap-4 items-start mb-2">
                        <div className="text-xs font-bold text-slate-400 min-w-[90px] flex-shrink-0 mt-0.5">{d.date}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-700">{d.topic}</div>
                          <div className="text-xs text-cyan-600 font-bold mt-0.5">강의 {d.lectures}</div>
                        </div>
                        <div className="text-xs text-pink-600 font-semibold flex-shrink-0 max-w-[150px] text-right">{d.task}</div>
                      </div>
                      <div className="pl-[94px] flex flex-wrap gap-1.5">
                        {d.points.map((p, pi) => (
                          <span key={pi} className="text-[11px] bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full font-medium">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gradient-to-r from-cyan-50 to-sky-50 border-t border-cyan-100">
                  <span className="text-sm font-bold text-cyan-700">{block.result}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 핵심 전략 */}
          <div className="grid grid-cols-2 gap-3 mb-4 max-sm:grid-cols-1">
            <div className="card bg-red-50 border-red-200">
              <div className="text-xs font-bold text-red-500 mb-2">❌ 이 기간 하지 말 것</div>
              <div className="flex flex-col gap-1.5">
                {['해시/인증 넘어가기 (순서대로)','완벽 이해하려 하기','RSA 수학 구조 깊게 파기'].map((r, i) => (
                  <div key={i} className="flex gap-2 text-sm text-red-700"><span className="flex-shrink-0">→</span>{r}</div>
                ))}
              </div>
            </div>
            <div className="card bg-emerald-50 border-emerald-200">
              <div className="text-xs font-bold text-emerald-500 mb-2">✅ 해야 할 것</div>
              <div className="flex flex-col gap-1.5">
                {['"아 이런 구조구나" 수준으로','문제 바로 붙이기','패턴 외우기 (이해 X)'].map((r, i) => (
                  <div key={i} className="flex gap-2 text-sm text-emerald-700"><span className="flex-shrink-0">→</span>{r}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 3회독 시스템 */}
          <div className="card bg-gradient-to-br from-slate-50 to-cyan-50 border-cyan-200">
            <h3 className="font-bold text-slate-800 mb-4">🔁 기출 3회독 시스템</h3>
            <div className="grid grid-cols-3 gap-3 mb-3 max-sm:grid-cols-1">
              {[
                {n:'1회독', period:'지금 (이 기간)', desc:'강의 + 기출 같이\n"개념 붙이기"', bg:'bg-slate-50', border:'border-slate-200', tc:'text-slate-600'},
                {n:'2회독', period:'5/15 이후', desc:'문제만 + 틀린 것만\n"속도 올리기"', bg:'bg-amber-50', border:'border-amber-200', tc:'text-amber-700'},
                {n:'3회독', period:'시험 직전', desc:'문제 보면 바로 답\n"자동반사화"', bg:'bg-emerald-50', border:'border-emerald-200', tc:'text-emerald-700'},
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
                  <div className={`font-extrabold text-[15px] ${s.tc} mb-1`}>{s.n}</div>
                  <div className="text-[10px] text-slate-400 mb-2">{s.period}</div>
                  <div className={`text-xs font-semibold ${s.tc} whitespace-pre-line leading-relaxed`}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-cyan-600 text-white rounded-xl px-4 py-3 text-center text-sm font-extrabold">
              "정보보호는 이해 과목이 아니라 패턴 암기 과목이다" 🎯
            </div>
          </div>
        </div>
      )}

      {/* ── 국어 오답 템플릿 ── */}
      {tab === 'template' && isKorean && (
        <div>
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-5 mb-5 text-white"
               style={{boxShadow:'0 4px 16px rgba(5,150,105,0.3)'}}>
            <div className="font-extrabold text-lg mb-1">📝 틀린 선지 정리법</div>
            <div className="text-emerald-100 text-sm">"그냥 틀림 체크 ❌ → 틀린 이유 한 줄 압축 ✅"</div>
          </div>

          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-3">📋 정리 템플릿 (그대로 써라)</h3>
            <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm leading-relaxed">
              <div className="text-slate-400">[날짜]</div>
              <div className="text-slate-300">문제번호:</div>
              <div className="mt-2 text-red-400">❌ 내가 고른 답:</div>
              <div className="text-emerald-400">⭕ 정답:</div>
              <div className="mt-2 text-amber-400">📌 틀린 이유:</div>
              <div className="text-white">👉 (한 줄)</div>
              <div className="mt-2 text-amber-400">📌 다시 보면 체크할 것:</div>
              <div className="text-white">👉 (한 줄)</div>
            </div>
          </div>

          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-4">✅ 이렇게 써라 (예시)</h3>
            <div className="flex flex-col gap-3">
              {[
                {wrong:"❌ '되'와 '돼' 구분 틀림", right:"✅ '되어 → 돼' 줄임 가능", note:"되/돼 구분 확인"},
                {wrong:'❌ 주제 문제 틀림',          right:'✅ 첫 문단 + 끝 문단 연결 확인', note:'주제는 처음+끝'},
              ].map((ex, i) => (
                <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-sm font-semibold text-red-600 mb-1">{ex.wrong}</div>
                  <div className="text-sm font-semibold text-emerald-700">{ex.right}</div>
                  <div className="text-xs text-slate-400 mt-1">다시 볼 것: {ex.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-1">🔁 5/15~5/31 기출 2회독 루틴</h3>
            <p className="text-xs text-slate-400 mb-4">하루 40분 · 이미 풀었던 거 다시 풀기</p>
            <div className="grid grid-cols-2 gap-3 mb-3 max-sm:grid-cols-1">
              {[
                {step:'1단계 (20분)', task:'기출 1회분 다시 풀기', tip:'기억으로 X, 처음 보듯이', bg:'bg-violet-50', border:'border-violet-200', tc:'text-violet-700'},
                {step:'2단계 (20분)', task:'채점 + 해설 확인',    tip:'',                       bg:'bg-emerald-50', border:'border-emerald-200', tc:'text-emerald-700'},
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                  <div className={`text-xs font-bold ${s.tc} mb-1`}>{s.step}</div>
                  <div className="font-semibold text-[13.5px] text-slate-700">{s.task}</div>
                  {s.tip && <div className="text-xs text-slate-400 mt-1">{s.tip}</div>}
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium">
              💡 핵심: "다시 풀 때 기억으로 X → 처음 보는 문제처럼 ✅"
            </div>
          </div>

          <div className="card bg-gradient-to-br from-slate-50 to-emerald-50 border-emerald-200">
            <h3 className="font-bold text-slate-800 mb-4">📊 이 루틴 유지하면 점수 변화</h3>
            <div className="flex flex-col gap-2 mb-3">
              {[
                {period:'5월 중순', score:'50~60점', icon:'😤', c:'text-slate-600'},
                {period:'5월 말',   score:'60~70점', icon:'📈', c:'text-amber-600'},
                {period:'6월',      score:'70+ 안정', icon:'🔥', c:'text-emerald-700'},
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm font-bold text-slate-500 min-w-[60px]">{r.period}</span>
                  <span className={`font-extrabold ${r.c}`}>{r.score}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-600 text-white rounded-xl px-4 py-3 text-center text-sm font-extrabold">
              "국어는 많이 푸는 게 아니라, 틀린 걸 줄이는 게임이다" 🎯
            </div>
          </div>
        </div>
      )}

      {/* ── 기출 2회독 루틴 (컴일/정보보호) ── */}
      {tab === 'round2' && (isComp || isInfo) && (
        <div>
          <div className="bg-gradient-to-r from-violet-600 to-indigo-500 rounded-2xl p-5 mb-5 text-white"
               style={{boxShadow:'0 4px 20px rgba(124,58,237,0.25)'}}>
            <div className="font-extrabold text-lg mb-1">🔁 5/15~5/31 기출 2회독 시스템</div>
            <div className="text-violet-200 text-sm">"기출 2회독에서 합격이 결정된다"</div>
          </div>

          {KICHUL_ROUND2.filter(r => isComp ? r.subject.includes('컴퓨터') : r.subject.includes('정보')).map((subj, si) => (
            <div key={si} className={`${subj.bg} border ${subj.border} rounded-2xl p-5 mb-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`font-extrabold text-[16px] ${subj.color}`}>{subj.subject}</div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-white border ${subj.border} ${subj.color}`}>{subj.totalTime}</span>
              </div>
              <div className="flex flex-col gap-2.5 mb-4">
                {subj.steps.map((step, i) => (
                  <div key={i} className="bg-white rounded-xl px-4 py-3 border border-white/80 shadow-sm flex gap-4 items-center">
                    <div className={`text-xs font-bold ${subj.color} min-w-[50px]`}>{step.step}</div>
                    <div className={`text-[11px] font-semibold bg-white border ${subj.border} px-2 py-1 rounded-full ${subj.color} flex-shrink-0`}>{step.time}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-700">{step.task}</div>
                      {step.tip && <div className="text-xs text-slate-400 mt-0.5">{step.tip}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${subj.bg} border ${subj.border} rounded-xl p-4`}>
                <div className="text-xs font-bold text-slate-500 mb-2">📌 틀린 문제 처리 예시</div>
                {subj.examples.map((ex, ei) => (
                  <div key={ei} className="flex flex-col gap-1">
                    <div className="text-sm font-semibold text-red-600">{ex.wrong}</div>
                    <div className="text-sm font-semibold text-emerald-700">{ex.right}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="card mb-5">
            <h3 className="font-bold text-slate-800 mb-1">⏱️ 하루 전체 시간표 (5/15~5/31)</h3>
            <p className="text-xs text-slate-400 mb-4">총 6시간 · 전 과목 균형 유지</p>
            <div className="flex flex-col gap-3">
              {DAILY_SCHEDULE_ROUND2.map((r, i) => (
                <div key={i} className={`flex gap-4 items-center ${r.bg} border ${r.border} rounded-xl px-5 py-4`}>
                  <div className="flex-shrink-0 min-w-[120px]">
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

          <div className="card mb-5 bg-violet-50 border-violet-200">
            <h3 className="font-bold text-slate-800 mb-3">🔁 6월: 3회독 (틀린 문제만)</h3>
            <div className="flex flex-col gap-2">
              {[
                {t:'틀린 문제만 모아서 풀기', d:'새 문제 X → 약점만 집중'},
                {t:'선지 하나하나 완벽 분석', d:'왜 맞고 왜 틀렸는지 명확히'},
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-white border border-violet-200 rounded-xl px-4 py-3">
                  <span className="text-violet-500 font-bold flex-shrink-0">→</span>
                  <div>
                    <div className="font-semibold text-sm text-slate-700">{item.t}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-red-50 border-red-200">
            <h3 className="font-bold text-slate-800 mb-3">💣 절대 금지 3개</h3>
            <div className="flex flex-col gap-2">
              {[
                {bad:'새로운 문제 계속 추가', result:'깊이 없음 = 점수 안 오름'},
                {bad:'개념 다시 처음부터',    result:'시간 낭비'},
                {bad:'강의 계속 들음',        result:'실전 감각 안 생김'},
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-red-100 rounded-xl px-4 py-3">
                  <span className="text-red-400 flex-shrink-0 font-bold">❌</span>
                  <span className="font-medium text-sm text-slate-700 flex-1">{r.bad}</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-1 rounded-full flex-shrink-0">→ {r.result}</span>
                </div>
              ))}
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
