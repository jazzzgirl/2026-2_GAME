/* =========================================================
   설정: Apps Script 웹 앱 배포 후 받은 URL을 아래에 붙여 넣으세요.
   ========================================================= */
const API_URL = 'https://script.google.com/macros/s/AKfycbzfUkP90LsFPeCkCoWH_I25bzJPmTXae81TCCJv8vf_xH7pOI8tv1vU8xvCxKT73JaT/exec';

const COURSE = { title: '몰입형 XR 프로젝트', term: '2026학년도 2학기 프로젝트 평가', org: '신라대학교 컴퓨터공학과' };

const PROJECTS = [
  { id: 'p1', roman: 'I', title: '게임 프로젝트 I', open: true, rubric: {
      prof: [
        { label: '게임 완성도 및 재미', max: 25 },
        { label: '이미지·사운드 완성도', max: 20 },
        { label: '생성형 AI 활용 과정', max: 25 },
        { label: '기획서-결과물 일치도', max: 10 },
        { label: '배포 및 실행 가능성', max: 10 },
        { label: '발표력', max: 10 }
      ],
      peer: [
        '이 게임은 실제로 재미있었다',
        '이미지와 사운드가 게임 분위기와 잘 어울렸다',
        '생성형 AI를 어떻게 활용했는지 설명이 흥미롭고 이해하기 쉬웠다',
        '시연이 매끄러웠고 게임이 안정적으로 작동했다',
        '기회가 된다면 이 게임을 다시 플레이해보고 싶다'
      ],
      peerText: ['가장 인상 깊었던 부분', '개선하면 더 좋을 것 같은 점'],
      selfScale: [
        '내가 기획한 핵심 재미(Core Fun)를 실제로 구현해냈다',
        '이미지·사운드를 목표한 수준으로 완성했다',
        'AI가 제안한 결과를 그대로 쓰지 않고 검증·수정하며 활용했다',
        '3주 일정 안에 계획했던 기능을 대부분 구현했다',
        '배포 후 다른 사람이 문제없이 플레이할 수 있는 상태로 완성했다'
      ],
      selfText: [
        '이번 프로젝트에서 가장 잘했다고 생각하는 부분은?',
        '가장 아쉬웠던 점과 그 이유는? (시간 부족, 기술적 어려움, 기획 미흡 등)',
        'AI 활용 중 가장 도움이 되었던 프롬프트나 전략은 무엇인가?',
        '다음 프로젝트(프로젝트 II)에서 다르게 시도해보고 싶은 것은?'
      ],
      profMax: 100, peerMax: 25, selfMax: 25,
      weights: { prof: 0.7, peer: 0.2, self: 0.1 }
  }},
  { id: 'p2', roman: 'II', title: '프로젝트 II', open: false },
  { id: 'p3', roman: 'III', title: '프로젝트 III', open: false }
];

/* ---------- 상태 ---------- */
const store = {
  get(k){ try { return sessionStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { v==null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k,v); } catch(e){} }
};
const S = {
  view: 'home', project: null, mode: null,
  gate: null, pstatus: null, fb: null, fbPick: null, students: [], me: store.get('xr_me'), sid: store.get('xr_sid'), pick: null, status: null, target: null,
  form: null, pw: store.get('xr_pw'), admin: null, tab: 'result', sort: 'name',
  pform: null, urlDraft: null, detail: null
};
const proj = () => PROJECTS.find(p => p.id === S.project);
const $app = document.getElementById('app');

/* ---------- 유틸 ---------- */
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const safeUrl = u => /^https?:\/\/\S+$/i.test(u || '');
const r2 = x => Math.round(x * 100) / 100;
const fmt = x => x == null ? '<span class="dash">-</span>' : r2(x).toString();
let toastTimer;
function toast(msg, type){
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'on' + (type === 'err' ? ' err' : '');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.className = '', 3200);
}
function busy(on){ document.getElementById('busy').classList.toggle('on', on); }
async function withBusy(fn){
  busy(true);
  try { await fn(); return true; }
  catch(e){ toast(e.message || '요청을 처리하지 못했습니다.', 'err'); return false; }
  finally { busy(false); }
}
const apiReady = () => API_URL && !API_URL.startsWith('PASTE_');
async function api(action, payload){
  if (!apiReady()) throw new Error('서버 주소가 설정되지 않았습니다. index.html의 API_URL을 입력하세요.');
  let res;
  try {
    res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(Object.assign({ action, project: S.project, gate: S.gate }, payload || {})) });
  } catch(e){ throw new Error('서버에 연결하지 못했습니다. 인터넷 연결을 확인하세요.'); }
  const data = await res.json().catch(() => ({ ok: false, error: '서버 응답을 읽지 못했습니다.' }));
  if (!data.ok){
    if (data.code === 'gate' && action !== 'enter'){
      // 입장 비밀번호가 바뀌었거나 평가가 종료됨 → 처음 화면으로
      store.set('xr_gate_' + S.project, null); S.gate = null;
      setTimeout(() => go('home'), 0);
    }
    throw new Error(data.error || '요청을 처리하지 못했습니다.');
  }
  return data;
}
function go(view, extra){ Object.assign(S, extra || {}); S.view = view; render(); window.scrollTo(0, 0); }

/* ---------- 화면: 홈 ---------- */
function vHome(){
  return `<main class="home">
    <p class="org">${esc(COURSE.org)}</p>
    <h1 class="course">몰입형<br>XR 프로젝트</h1>
    <p class="term">${esc(COURSE.term)}. 평가할 프로젝트를 고르세요.</p>
    <ol class="stages">
      ${PROJECTS.map(p => {
        const st = S.pstatus && S.pstatus[p.id];
        const closed = p.open && st && !st.evalOpen;
        const cls = !p.open ? 'is-soon' : closed ? 'is-closed' : 'is-open';
        const sub = !p.open ? '준비 중' : closed ? '평가 종료' : '평가 진행 중';
        return `<li><button type="button" class="stage ${cls}" data-act="project" data-id="${p.id}">
        <span class="rn" aria-hidden="true">${p.roman}</span>
        <span class="txt"><span class="st">${esc(p.title)}</span><span class="ss">${sub}</span></span>
      </button></li>`; }).join('')}
    </ol>
    <div class="fbentry"><div><strong>내 피드백 확인</strong><span>동료들이 남긴 상호평가 피드백을 작성자 이름 없이 모아 봅니다.</span></div>
      <button type="button" class="btn primary" data-act="fb-start">피드백 보기</button></div>
    ${apiReady() ? '' : '<p class="setup-note">서버 주소가 아직 설정되지 않았습니다. index.html 상단의 API_URL에 Apps Script 웹 앱 주소를 넣어 주세요.</p>'}
  </main>`;
}

function topbar(title, back, right){
  const P = proj();
  return `<header class="bar">
    <button type="button" class="back" data-act="back" data-to="${back}">‹ ${back === 'home' ? '처음으로' : '뒤로'}</button>
    <div class="bt">${P && title !== P.title ? `<span class="crumb">${esc(P.title)}</span>` : ''}<strong>${esc(title)}</strong></div>
    <div class="br">${right || ''}</div>
  </header>`;
}

/* ---------- 화면: 프로젝트 허브 ---------- */
function vHub(){
  const P = proj(), w = P.rubric.weights;
  return topbar(P.title, 'home') + `<section class="page">
    <div class="hubhead"><span class="rn" aria-hidden="true">${P.roman}</span>
      <div><h1>${esc(P.title)}</h1><p>평가 방식을 선택하세요</p></div></div>
    <div class="roles">
      <button type="button" class="role" data-act="role" data-role="peer"><strong>상호평가</strong><span>다른 학생의 게임을 플레이하고 5개 문항으로 평가합니다.</span></button>
      <button type="button" class="role" data-act="role" data-role="self"><strong>자기평가</strong><span>내 프로젝트를 점수와 성찰 글로 돌아봅니다.</span></button>
      <button type="button" class="role admin" data-act="role" data-role="admin"><strong>교수 전용</strong><span>배포 주소 입력, 교수 평가, 결과 확인과 다운로드</span></button>
    </div>
    <p class="weights">최종 점수는 교수 평가 ${w.prof*100}%, 상호평가 ${w.peer*100}%, 자기평가 ${w.self*100}%로 반영됩니다.</p>
  </section>`;
}

/* ---------- 화면: 프로젝트 입장 ---------- */
function vGate(){
  const P = proj();
  return topbar(P.title, 'home') + `<section class="page">
    <div class="login"><h2>${esc(P.title)}</h2>${S.pstatus && S.pstatus[P.id] && !S.pstatus[P.id].evalOpen
      ? '<p class="note" style="margin-top:8px">평가가 종료되었습니다. 동료 피드백은 처음 화면의 "내 피드백 확인"에서 볼 수 있습니다.</p>'
      : '<p class="muted">수업에서 안내받은 프로젝트 비밀번호를 입력하세요.</p>'}
      <label for="gate">프로젝트 비밀번호</label><input id="gate" type="password" autocomplete="off">
      <button type="button" class="btn primary" data-act="enter">입장</button></div>
  </section>`;
}

/* ---------- 화면: 피드백 확인 ---------- */
function vFbWho(){
  return topbar('내 피드백 확인', 'home') + `<section class="page">
    <h2>본인 이름을 선택하세요</h2>
    <p class="muted">이름을 누른 뒤 본인 학번을 입력하면 피드백을 볼 수 있습니다.</p>
    <div class="names">${S.students.map(s => `<button type="button" class="name" data-act="fb-me" data-name="${esc(s.name)}">${esc(s.name)}</button>`).join('')}</div>
  </section>`;
}
function vFbAuth(){
  return topbar('내 피드백 확인', 'fbWho') + `<section class="page">
    <div class="login"><h2>${esc(S.fbPick)}</h2><p class="muted">본인 확인을 위해 학번을 입력하세요.</p>
      <label for="fbsid">학번</label><input id="fbsid" type="password" inputmode="numeric" autocomplete="off" maxlength="20">
      <button type="button" class="btn primary" data-act="fb-login">확인</button></div>
  </section>`;
}
function vFeedback(){
  const F = S.fb, P = PROJECTS.find(p => p.id === F.cur), d = F.data[F.cur];
  const labels = (P && P.rubric && P.rubric.peerText) || ['좋았던 점', '개선하면 좋을 점'];
  const group = (cls, title, list) => `<section class="fbgroup ${cls}"><h3>${esc(title)} <span class="chip">${list.length}건</span></h3>
    ${list.length ? `<ul class="fblist">${list.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p class="empty">작성된 피드백이 없습니다.</p>'}</section>`;
  let body;
  if (!F.open.length) body = '<p class="empty">아직 공개된 피드백이 없습니다.</p>';
  else if (!d) body = '<p class="muted">프로젝트를 선택하세요.</p>';
  else body = `<div class="fbhead"><h2>${esc(P.title)}</h2>
      <p>동료 ${d.count}명이 평가했습니다. 작성자는 공개되지 않으며, 표시 순서는 무작위입니다.</p></div>
      ${group('good', labels[0], d.good)}${group('improve', labels[1], d.improve)}`;
  return topbar('내 피드백 확인', 'home', '<button type="button" class="btn sm" data-act="fb-logout">로그아웃</button>') + `<section class="page">
    <div class="who" style="margin-bottom:18px"><strong>${esc(F.name)}</strong> 님의 피드백</div>
    <nav class="tabs" role="tablist">${PROJECTS.map(p => { const on = F.open.includes(p.id); return `<button type="button" class="tab" role="tab" aria-selected="${F.cur === p.id}" ${on ? '' : 'disabled'} data-act="fb-tab" data-id="${p.id}">프로젝트 ${p.roman}${on ? '' : ' (미공개)'}</button>`; }).join('')}</nav>
    ${body}
  </section>`;
}
async function loadFeedback(pid){
  const d = await api('myFeedback', { project: pid, name: S.fb.name, sid: S.fb.sid });
  S.fb.data[pid] = d.feedback;
}
async function doFbLogin(){
  const sid = document.getElementById('fbsid').value.trim();
  if (!sid) return toast('학번을 입력하세요.', 'err');
  let open = [];
  const ok = await withBusy(async () => {
    const d = await api('feedbackLogin', { name: S.fbPick, sid });
    open = d.open.filter(id => PROJECTS.some(p => p.id === id));
    S.fb = { name: S.fbPick, sid, open, cur: open[0] || null, data: {} };
    if (S.fb.cur) await loadFeedback(S.fb.cur);
  });
  if (!ok){ S.fb = null; const el = document.getElementById('fbsid'); if (el){ el.value = ''; el.focus(); } return; }
  go('feedback');
}
async function loadStatus(){
  if (!apiReady()) return;
  try { const d = await api('projectStatus'); S.pstatus = d.status; if (S.view === 'home') render(); } catch(e){}
}

/* ---------- 화면: 이름 선택 ---------- */
function vWho(){
  return topbar(S.mode === 'peer' ? '상호평가' : '자기평가', 'hub') + `<section class="page">
    <h2>본인 이름을 선택하세요</h2>
    <p class="muted">이름을 누른 뒤 본인 학번을 입력하면 평가를 시작할 수 있습니다.</p>
    <div class="names">${S.students.map(s => `<button type="button" class="name" data-act="me" data-name="${esc(s.name)}">${esc(s.name)}</button>`).join('')}</div>
  </section>`;
}

function playLink(url, label){
  return safeUrl(url)
    ? `<a class="play" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label || '게임 플레이'}</a>`
    : `<span class="play off">배포 주소 미등록</span>`;
}

/* ---------- 화면: 학번 확인 ---------- */
function vAuth(){
  return topbar(S.mode === 'peer' ? '상호평가' : '자기평가', 'who') + `<section class="page">
    <div class="login"><h2>${esc(S.pick)}</h2><p class="muted">본인 확인을 위해 학번을 입력하세요.</p>
      <label for="sid">학번</label><input id="sid" type="password" inputmode="numeric" autocomplete="off" maxlength="20">
      <button type="button" class="btn primary" data-act="student-login">확인</button>
      <p style="margin:14px 0 0;text-align:center"><button type="button" class="link" data-act="change-me">다른 이름 선택</button></p></div>
  </section>`;
}

/* ---------- 화면: 상호평가 목록 ---------- */
function vPeerList(){
  const others = S.students.filter(s => s.name !== S.me);
  const done = new Set(S.status.peerDone);
  const n = others.filter(s => done.has(s.name)).length;
  return topbar('상호평가', 'hub') + `<section class="page">
    <div class="who">평가자 <strong>${esc(S.me)}</strong> <button type="button" class="link" data-act="change-me">로그아웃</button></div>
    <div class="progress"><div class="track"><span style="width:${others.length ? n / others.length * 100 : 0}%"></span></div>
      <p>${others.length}명 중 <b>${n}명</b> 평가 완료</p></div>
    <ul class="roster">${others.map(s => { const d = done.has(s.name); return `<li class="${d ? 'done' : ''}">
      <span class="nm">${esc(s.name)}</span>
      <span class="meta">${playLink(s.url)}<span class="chip ${d ? 'ok' : ''}">${d ? '완료' : '미평가'}</span></span>
      <button type="button" class="btn ${d ? '' : 'primary'} sm" data-act="eval" data-name="${esc(s.name)}">${d ? '다시 평가' : '평가하기'}</button>
    </li>`; }).join('')}</ul>
  </section>`;
}

function ratingGroup(i, text, val){
  return `<fieldset class="q"><legend><span class="qn">${i + 1}</span><span>${esc(text)}</span></legend>
    <div class="scale" role="radiogroup">${[1,2,3,4,5].map(v => `<button type="button" role="radio" aria-checked="${val === v}" aria-label="${v}점" class="dot ${val === v ? 'on' : ''}" data-act="rate" data-i="${i}" data-v="${v}">${v}</button>`).join('')}</div>
    <div class="ends"><span>전혀 아니다</span><span>매우 그렇다</span></div></fieldset>`;
}
const formSum = () => S.form.scores.reduce((a, x) => a + (x || 0), 0);

/* ---------- 화면: 상호평가 폼 ---------- */
function vPeerForm(){
  const R = proj().rubric, t = S.students.find(s => s.name === S.target) || {};
  const again = S.status.peerDone.includes(S.target);
  return topbar('상호평가', 'peerList') + `<section class="page">
    <div class="target"><div><p class="muted">평가 대상</p><h2>${esc(S.target)}</h2></div>
      ${safeUrl(t.url) ? `<a class="btn primary big" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">게임 플레이하기</a>` : '<span class="play off">배포 주소가 아직 등록되지 않았습니다</span>'}</div>
    ${again ? '<p class="note">이미 평가한 학생입니다. 다시 제출하면 이전 평가가 새 내용으로 바뀝니다.</p>' : ''}
    ${R.peer.map((q, i) => ratingGroup(i, q, S.form.scores[i])).join('')}
    <div class="total">합계 <b id="sum">${formSum()}</b> / 25</div>
    <h3 class="sub">서술형 <small>(선택, 1~2개 작성)</small></h3>
    ${R.peerText.map((q, i) => `<label class="ta"><span>${esc(q)}</span><textarea data-t="${i}" rows="3" maxlength="1000">${esc(S.form.texts[i])}</textarea></label>`).join('')}
    <button type="button" class="btn primary block" data-act="submit-peer">평가 제출</button>
  </section>`;
}

/* ---------- 화면: 자기평가 폼 ---------- */
function vSelfForm(){
  const R = proj().rubric;
  return topbar('자기평가', 'hub') + `<section class="page">
    <div class="who">개발자 <strong>${esc(S.me)}</strong> <button type="button" class="link" data-act="change-me">로그아웃</button></div>
    ${S.status.selfDone ? '<p class="note">이미 자기평가를 제출했습니다. 다시 제출하면 이전 내용이 새 내용으로 바뀝니다.</p>' : ''}
    <h3 class="sub" style="margin-top:26px">A. 척도 평가</h3>
    ${R.selfScale.map((q, i) => ratingGroup(i, q, S.form.scores[i])).join('')}
    <div class="total">합계 <b id="sum">${formSum()}</b> / 25</div>
    <h3 class="sub">B. 서술형 성찰 <small>(모든 문항 필수)</small></h3>
    ${R.selfText.map((q, i) => `<label class="ta"><span>${i + 1}. ${esc(q)}</span><textarea data-t="${i}" rows="4" maxlength="2000">${esc(S.form.texts[i])}</textarea></label>`).join('')}
    <button type="button" class="btn primary block" data-act="submit-self">자기평가 제출</button>
  </section>`;
}

/* ---------- 화면: 교수 로그인 ---------- */
function vLogin(){
  return topbar('교수 전용', 'hub') + `<section class="page">
    <div class="login"><h2>교수 로그인</h2><p class="muted">평가 결과는 교수만 볼 수 있습니다.</p>
      <label for="pw">비밀번호</label><input id="pw" type="password" autocomplete="current-password">
      <button type="button" class="btn primary" data-act="login">로그인</button></div>
  </section>`;
}

/* ---------- 집계 ---------- */
function compute(){
  const R = proj().rubric, D = S.admin, W = R.weights;
  return D.students.map(s => {
    const pr = D.prof.find(x => x.name === s.name);
    const peers = D.peer.filter(x => x.target === s.name);
    const sf = D.self.find(x => x.name === s.name);
    const profT = pr ? pr.total : null;
    const peerAvg = peers.length ? peers.reduce((a, x) => a + x.total, 0) / peers.length : null;
    const selfT = sf ? sf.total : null;
    const cP = (profT || 0) / R.profMax * 100 * W.prof;
    const cQ = (peerAvg || 0) / R.peerMax * 100 * W.peer;
    const cS = (selfT || 0) / R.selfMax * 100 * W.self;
    const missing = [profT == null && '교수', peerAvg == null && '상호', selfT == null && '자기'].filter(Boolean);
    return { name: s.name, sid: s.sid || '', url: s.url, pr, peers, sf, profT, peerAvg, peerN: peers.length, selfT, cP, cQ, cS, final: cP + cQ + cS, missing };
  });
}

/* ---------- 화면: 교수 ---------- */
function vAdmin(){
  const tabs = [['result','결과'],['prof','교수 평가'],['urls','배포 주소'],['status','제출 현황']];
  const body = { result: vResult, prof: vProf, urls: vUrls, status: vStatus }[S.tab]();
  return topbar('교수 전용', 'hub', `<button type="button" class="btn sm" data-act="refresh">새로고침</button><button type="button" class="btn primary sm" data-act="download">엑셀 다운로드</button><button type="button" class="btn sm" data-act="logout">로그아웃</button>`)
    + `<section class="page wide">
      <nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="tab" role="tab" aria-selected="${S.tab === k}" data-act="tab" data-tab="${k}">${l}</button>`).join('')}</nav>
      ${body}
    </section>` + (S.detail ? vDetail() : '');
}

function vResult(){
  const rows = compute(), n = rows.length, D = S.admin;
  const sorted = S.sort === 'final' ? rows.slice().sort((a, b) => b.final - a.final) : rows;
  return `<div class="stats">
      <div class="stat"><b>${D.prof.length} / ${n}</b><span>교수 평가 입력</span></div>
      <div class="stat"><b>${D.peer.length} / ${n * (n - 1)}</b><span>상호평가 제출 건수</span></div>
      <div class="stat"><b>${D.self.length} / ${n}</b><span>자기평가 제출</span></div>
    </div>
    <div class="tools"><p class="muted" style="margin:0">학생 이름을 누르면 문항별 점수와 서술형 응답을 볼 수 있습니다.</p>
      <select data-act-change="sort" aria-label="정렬"><option value="name" ${S.sort === 'name' ? 'selected' : ''}>명단순</option><option value="final" ${S.sort === 'final' ? 'selected' : ''}>최종 점수순</option></select></div>
    <div class="tablewrap"><table>
      <thead><tr><th>이름</th><th>교수 평가<br>(100)</th><th>상호평가 평균<br>(25)</th><th>평가 인원</th><th>자기평가<br>(25)</th><th>교수 반영<br>(70)</th><th>상호 반영<br>(20)</th><th>자기 반영<br>(10)</th><th>최종<br>(100)</th><th>누락</th></tr></thead>
      <tbody>${sorted.map(r => `<tr class="click" data-act="detail" data-name="${esc(r.name)}">
        <td><strong>${esc(r.name)}</strong></td><td>${fmt(r.profT)}</td><td>${fmt(r.peerAvg)}</td><td>${r.peerN}명</td><td>${fmt(r.selfT)}</td>
        <td>${fmt(r.cP)}</td><td>${fmt(r.cQ)}</td><td>${fmt(r.cS)}</td><td class="final">${fmt(r.final)}</td>
        <td>${r.missing.length ? `<span class="chip warn">${r.missing.join(', ')}</span>` : '<span class="chip ok">완료</span>'}</td></tr>`).join('')}</tbody>
    </table></div>`;
}

function vDetail(){
  const R = proj().rubric, r = compute().find(x => x.name === S.detail);
  if (!r) return '';
  const peerItemAvg = R.peer.map((q, i) => r.peers.length ? r.peers.reduce((a, p) => a + p.scores[i], 0) / r.peers.length : null);
  const comments = r.peers.filter(p => p.good || p.improve);
  return `<div class="overlay" data-act="close-detail"><aside class="drawer" role="dialog" aria-label="${esc(r.name)} 상세" data-stop>
    <header><h2>${esc(r.name)}</h2><button type="button" class="btn sm" data-act="close-detail">닫기</button></header>
    <section><h4>최종 ${fmt(r.final)}점</h4><div class="kv">
      <span>교수 평가 × 70%</span><span>${fmt(r.cP)}</span><span>상호평가 × 20%</span><span>${fmt(r.cQ)}</span><span>자기평가 × 10%</span><span>${fmt(r.cS)}</span></div>
      <p style="margin:10px 0 0">${playLink(r.url, '게임 열기')}</p></section>
    <section><h4>교수 평가 ${r.pr ? `(${fmt(r.profT)} / 100)` : ''}</h4>${r.pr ? `<div class="kv">${R.prof.map((p, i) => `<span>${esc(p.label)}</span><span>${fmt(r.pr.scores[i])} / ${p.max}</span>`).join('')}</div>${r.pr.comment ? `<p class="cmt">${esc(r.pr.comment)}</p>` : ''}` : '<p class="muted">아직 입력하지 않았습니다.</p>'}</section>
    <section><h4>상호평가 문항별 평균 (${r.peerN}명)</h4><div class="kv">${R.peer.map((q, i) => `<span>${i + 1}. ${esc(q)}</span><span>${fmt(peerItemAvg[i])}</span>`).join('')}</div></section>
    <section><h4>상호평가 서술형 (${comments.length}건)</h4>${comments.length ? comments.map(p => `<div class="cmt"><b>${esc(p.evaluator)}</b>${p.good ? `<p>인상 깊었던 부분: ${esc(p.good)}</p>` : ''}${p.improve ? `<p>개선할 점: ${esc(p.improve)}</p>` : ''}</div>`).join('') : '<p class="muted">작성된 서술형이 없습니다.</p>'}</section>
    <section><h4>자기평가 ${r.sf ? `(${fmt(r.selfT)} / 25)` : ''}</h4>${r.sf ? `<div class="kv">${R.selfScale.map((q, i) => `<span>${i + 1}. ${esc(q)}</span><span>${r.sf.scores[i]}</span>`).join('')}</div>
      ${R.selfText.map((q, i) => `<div class="cmt"><b>${i + 1}. ${esc(q)}</b><p>${esc(r.sf.texts[i])}</p></div>`).join('')}` : '<p class="muted">아직 제출하지 않았습니다.</p>'}</section>
  </aside></div>`;
}

function vProf(){
  const R = proj().rubric, D = S.admin;
  if (!S.pform) selectProf(D.students[0] && D.students[0].name);
  const f = S.pform, total = f.scores.reduce((a, x) => a + (Number(x) || 0), 0);
  return `<div class="profgrid">
    <div class="plist">${D.students.map(s => { const p = D.prof.find(x => x.name === s.name); return `<button type="button" class="pitem" aria-current="${f.name === s.name}" data-act="prof-sel" data-name="${esc(s.name)}"><span>${esc(s.name)}</span>${p ? `<small>${r2(p.total)}</small>` : ''}</button>`; }).join('')}</div>
    <div class="pform">
      <h3>${esc(f.name)}</h3>
      <p style="margin:0 0 8px">${playLink((D.students.find(s => s.name === f.name) || {}).url, '게임 열기')}</p>
      ${R.prof.map((p, i) => `<div class="prow"><label for="pi${i}">${esc(p.label)}<small>0 ~ ${p.max}점</small></label>
        <input id="pi${i}" type="number" inputmode="decimal" min="0" max="${p.max}" step="0.5" data-pi="${i}" value="${esc(f.scores[i])}"></div>`).join('')}
      <div class="total">합계 <b id="psum">${r2(total)}</b> / 100</div>
      <label class="ta"><span>코멘트 (선택, 학생에게 공개되지 않음)</span><textarea id="pcomment" rows="3" maxlength="2000">${esc(f.comment)}</textarea></label>
      <div class="pactions"><button type="button" class="btn" data-act="save-prof">저장</button><button type="button" class="btn primary" data-act="save-prof" data-next="1">저장하고 다음 학생</button></div>
    </div></div>`;
}
function selectProf(name){
  const p = S.admin.prof.find(x => x.name === name);
  S.pform = { name, scores: p ? p.scores.map(String) : proj().rubric.prof.map(() => ''), comment: p ? p.comment : '' };
}

function vUrls(){
  if (!S.urlDraft){ S.urlDraft = {}; S.admin.students.forEach(s => S.urlDraft[s.name] = s.url || ''); }
  return `<p class="muted" style="margin-top:0">학생이 제출한 게임 배포 주소(WebGL, 스토어 링크 등)를 입력하세요. 저장하면 상호평가 화면의 학생 이름 옆에 플레이 버튼이 나타납니다.</p>
    <div class="pform">${S.admin.students.map(s => `<div class="urlrow"><strong>${esc(s.name)}</strong>
      <input type="url" placeholder="https://" data-url="${esc(s.name)}" value="${esc(S.urlDraft[s.name])}" aria-label="${esc(s.name)} 배포 주소">
      ${safeUrl(S.urlDraft[s.name]) ? `<a class="btn sm" href="${esc(S.urlDraft[s.name])}" target="_blank" rel="noopener noreferrer">열기</a>` : '<span></span>'}</div>`).join('')}
      <div class="pactions"><button type="button" class="btn primary" data-act="save-urls">배포 주소 저장</button></div></div>`;
}

function vStatus(){
  const D = S.admin, n = D.students.length;
  return `<div class="tablewrap"><table>
    <thead><tr><th>이름</th><th>상호평가 제출</th><th>받은 상호평가</th><th>자기평가</th><th style="text-align:left">아직 평가하지 않은 대상</th></tr></thead>
    <tbody>${D.students.map(s => {
      const given = D.peer.filter(p => p.evaluator === s.name).map(p => p.target);
      const recv = D.peer.filter(p => p.target === s.name).length;
      const left = D.students.filter(o => o.name !== s.name && !given.includes(o.name)).map(o => o.name);
      const selfOk = D.self.some(x => x.name === s.name);
      return `<tr><td><strong>${esc(s.name)}</strong></td>
        <td><span class="chip ${given.length === n - 1 ? 'ok' : ''}">${given.length} / ${n - 1}</span></td>
        <td>${recv}명</td><td>${selfOk ? '<span class="chip ok">제출</span>' : '<span class="chip warn">미제출</span>'}</td>
        <td class="left">${left.length ? esc(left.join(', ')) : '<span class="dash">없음</span>'}</td></tr>`; }).join('')}</tbody>
  </table></div>`;
}

/* ---------- 엑셀 다운로드 ---------- */
function downloadXlsx(){
  if (typeof XLSX === 'undefined') return toast('엑셀 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하세요.', 'err');
  const R = proj().rubric, D = S.admin, rows = compute();
  const wb = XLSX.utils.book_new();
  const add = (aoa, name, widths) => { const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = widths.map(w => ({ wch: w })); XLSX.utils.book_append_sheet(wb, ws, name); };
  const nz = x => x == null ? '' : r2(x);

  add([['학번','이름','교수 평가(100)','상호평가 평균(25)','상호평가 인원','자기평가(25)','교수 반영(70%)','상호 반영(20%)','자기 반영(10%)','최종 점수(100)','누락','배포 주소']]
    .concat(rows.map(r => [r.sid, r.name, nz(r.profT), nz(r.peerAvg), r.peerN, nz(r.selfT), r2(r.cP), r2(r.cQ), r2(r.cS), r2(r.final), r.missing.join(', '), r.url])),
    '최종결과', [12,22,14,16,12,13,14,14,14,14,14,40]);

  add([['이름'].concat(R.prof.map(p => `${p.label}(${p.max})`), ['합계(100)','코멘트','수정일시'])]
    .concat(D.students.map(s => { const p = D.prof.find(x => x.name === s.name); return p ? [s.name].concat(p.scores, [p.total, p.comment, p.time]) : [s.name]; })),
    '교수평가', [22].concat(R.prof.map(() => 16), [11, 40, 20]));

  add([['평가자','피평가자'].concat(R.peer.map((q, i) => `${i + 1}. ${q}`), ['합계(25)', R.peerText[0], R.peerText[1], '제출일시'])]
    .concat(D.peer.map(p => [p.evaluator, p.target].concat(p.scores, [p.total, p.good, p.improve, p.time]))),
    '상호평가', [18,18].concat(R.peer.map(() => 14), [10, 40, 40, 20]));

  add([['이름'].concat(R.selfScale.map((q, i) => `A${i + 1}. ${q}`), ['합계(25)'], R.selfText.map((q, i) => `B${i + 1}. ${q}`), ['제출일시'])]
    .concat(D.students.map(s => { const x = D.self.find(v => v.name === s.name); return x ? [s.name].concat(x.scores, [x.total], x.texts, [x.time]) : [s.name]; })),
    '자기평가', [22].concat(R.selfScale.map(() => 14), [10], R.selfText.map(() => 45), [20]));

  const d = new Date(), ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `몰입형XR_${proj().title.replace(/\s/g, '')}_평가결과_${ymd}.xlsx`);
}

/* ---------- 흐름 ---------- */
async function loadRoster(){ const d = await api('roster'); S.students = d.students; }
async function loadAdmin(){ const d = await api('adminData', { password: S.pw }); S.admin = d.data; }

async function enterStudent(mode){
  S.mode = mode;
  const ok = await withBusy(loadRoster);
  if (!ok) return;
  if (!S.me || !S.sid || !S.students.some(s => s.name === S.me)) return go('who');
  afterMe();
}
function setStudent(name, sid){
  S.me = name; S.sid = sid;
  store.set('xr_me', name); store.set('xr_sid', sid);
}
async function afterMe(){
  const ok = await withBusy(async () => { const d = await api('myStatus', { name: S.me, sid: S.sid }); S.status = d.status; });
  if (!ok){ setStudent(null, null); return go('who'); }
  if (S.mode === 'peer') go('peerList');
  else { const R = proj().rubric; S.form = { scores: R.selfScale.map(() => 0), texts: R.selfText.map(() => '') }; go('selfForm'); }
}

function render(){
  const v = {
    home: vHome, hub: vHub, who: vWho, peerList: vPeerList, peerForm: vPeerForm,
    selfForm: vSelfForm, login: vLogin, admin: vAdmin, auth: vAuth, gate: vGate, fbWho: vFbWho, fbAuth: vFbAuth, feedback: vFeedback
  }[S.view] || vHome;
  $app.innerHTML = v();
  if (S.view === 'login'){ const pw = document.getElementById('pw'); pw && pw.focus(); }
  if (S.view === 'fbAuth'){ const el = document.getElementById('fbsid'); el && el.focus(); }
  if (S.view === 'gate'){ const el = document.getElementById('gate'); el && el.focus(); }
  if (S.view === 'auth'){ const el = document.getElementById('sid'); el && el.focus(); }
}

async function doEnter(){
  const g = document.getElementById('gate').value;
  if (!g) return toast('프로젝트 비밀번호를 입력하세요.', 'err');
  S.gate = g;
  const ok = await withBusy(() => api('enter'));
  if (!ok){ S.gate = null; const el = document.getElementById('gate'); if (el){ el.value = ''; el.focus(); } return; }
  store.set('xr_gate_' + S.project, g);
  go('hub');
}

async function doStudentLogin(){
  const sid = document.getElementById('sid').value.trim();
  if (!sid) return toast('학번을 입력하세요.', 'err');
  let status = null;
  const ok = await withBusy(async () => { const d = await api('studentLogin', { name: S.pick, sid }); status = d.status; });
  if (!ok){ const el = document.getElementById('sid'); if (el){ el.value = ''; el.focus(); } return; }
  setStudent(S.pick, sid); S.status = status;
  if (S.mode === 'peer') go('peerList');
  else { const R = proj().rubric; S.form = { scores: R.selfScale.map(() => 0), texts: R.selfText.map(() => '') }; go('selfForm'); }
}

async function doLogin(){
  const pw = document.getElementById('pw').value;
  if (!pw) return toast('비밀번호를 입력하세요.', 'err');
  S.pw = pw;
  const ok = await withBusy(loadAdmin);
  if (ok){ store.set('xr_pw', pw); go('admin', { tab: 'result', pform: null, urlDraft: null, detail: null }); }
  else { S.pw = null; store.set('xr_pw', null); }
}

const actions = {
  async project(el){
    const p = PROJECTS.find(x => x.id === el.dataset.id);
    if (!p.open) return toast(`${p.title} 평가는 아직 열리지 않았습니다.`);
    const reset = { project: p.id, gate: null, students: [], status: null, admin: null, pform: null, urlDraft: null, detail: null };
    Object.assign(S, reset);
    const saved = store.get('xr_gate_' + p.id);
    if (saved){
      S.gate = saved;
      const ok = await withBusy(() => api('enter'));
      if (ok) return go('hub');
      S.gate = null; store.set('xr_gate_' + p.id, null);
    }
    go('gate');
  },
  enter(){ doEnter(); },
  async 'fb-start'(){
    S.project = null; S.gate = null;
    if (S.fb) return go('feedback');
    const ok = await withBusy(async () => { const d = await api('fbRoster'); S.students = d.students; });
    if (ok) go('fbWho');
  },
  'fb-me'(el){ go('fbAuth', { fbPick: el.dataset.name }); },
  'fb-login'(){ doFbLogin(); },
  'fb-logout'(){ S.fb = null; go('home'); },
  async 'fb-tab'(el){
    const id = el.dataset.id;
    if (!S.fb.open.includes(id)) return;
    S.fb.cur = id;
    if (!S.fb.data[id]){ const ok = await withBusy(() => loadFeedback(id)); if (!ok) return; }
    render();
  },
  back(el){ go(el.dataset.to, { detail: null }); },
  async role(el){
    const r = el.dataset.role;
    if (r === 'admin'){
      if (S.pw){
        const ok = await withBusy(loadAdmin);
        if (ok) return go('admin', { tab: 'result', pform: null, urlDraft: null });
        S.pw = null; store.set('xr_pw', null);
      }
      return go('login');
    }
    enterStudent(r);
  },
  me(el){ go('auth', { pick: el.dataset.name }); },
  'change-me'(){ setStudent(null, null); S.status = null; go('who'); },
  'student-login'(){ doStudentLogin(); },
  eval(el){
    const R = proj().rubric;
    go('peerForm', { target: el.dataset.name, form: { scores: R.peer.map(() => 0), texts: R.peerText.map(() => '') } });
  },
  rate(el){
    const i = +el.dataset.i, v = +el.dataset.v;
    S.form.scores[i] = v;
    el.parentElement.querySelectorAll('.dot').forEach(b => { const on = +b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    const s = document.getElementById('sum'); if (s) s.textContent = formSum();
  },
  async 'submit-peer'(){
    const miss = S.form.scores.findIndex(x => !x);
    if (miss >= 0) return toast(`${miss + 1}번 문항의 점수를 선택하세요.`, 'err');
    const ok = await withBusy(() => api('submitPeer', { evaluator: S.me, sid: S.sid, target: S.target, scores: S.form.scores, texts: S.form.texts }));
    if (!ok) return;
    if (!S.status.peerDone.includes(S.target)) S.status.peerDone.push(S.target);
    toast(`${S.target} 학생 평가를 제출했습니다.`);
    go('peerList');
  },
  async 'submit-self'(){
    const miss = S.form.scores.findIndex(x => !x);
    if (miss >= 0) return toast(`A-${miss + 1}번 문항의 점수를 선택하세요.`, 'err');
    const empty = S.form.texts.findIndex(t => t.trim().length < 10);
    if (empty >= 0) return toast(`B-${empty + 1}번 문항을 10자 이상 작성하세요.`, 'err');
    const ok = await withBusy(() => api('submitSelf', { name: S.me, sid: S.sid, scores: S.form.scores, texts: S.form.texts }));
    if (!ok) return;
    S.status.selfDone = true;
    toast('자기평가를 제출했습니다.');
    go('hub');
  },
  login(){ doLogin(); },
  logout(){ S.pw = null; S.admin = null; store.set('xr_pw', null); go('hub'); },
  tab(el){ S.tab = el.dataset.tab; S.detail = null; render(); },
  async refresh(){ const ok = await withBusy(loadAdmin); if (ok){ S.urlDraft = null; if (S.pform) selectProf(S.pform.name); render(); toast('최신 데이터를 불러왔습니다.'); } },
  download(){ downloadXlsx(); },
  detail(el){ S.detail = el.dataset.name; render(); },
  'close-detail'(el, ev){ if (ev.target.closest('[data-stop]') && !ev.target.closest('.btn')) return; S.detail = null; render(); },
  'prof-sel'(el){ selectProf(el.dataset.name); render(); },
  async 'save-prof'(el){
    const R = proj().rubric, f = S.pform;
    for (let i = 0; i < R.prof.length; i++){
      const x = Number(f.scores[i]);
      if (f.scores[i] === '' || !isFinite(x) || x < 0 || x > R.prof[i].max)
        return toast(`${R.prof[i].label}: 0~${R.prof[i].max} 사이로 입력하세요.`, 'err');
    }
    const ok = await withBusy(async () => { await api('saveProf', { password: S.pw, name: f.name, scores: f.scores.map(Number), comment: f.comment }); await loadAdmin(); });
    if (!ok) return;
    toast(`${f.name} 학생 교수 평가를 저장했습니다.`);
    if (el.dataset.next){
      const list = S.admin.students, idx = list.findIndex(s => s.name === f.name);
      if (idx < list.length - 1) selectProf(list[idx + 1].name);
      else selectProf(f.name);
    } else selectProf(f.name);
    render();
  },
  async 'save-urls'(){
    const bad = Object.entries(S.urlDraft).find(([, u]) => u.trim() && !safeUrl(u.trim()));
    if (bad) return toast(`${bad[0]}: 주소는 http:// 또는 https://로 시작해야 합니다.`, 'err');
    const urls = {}; Object.entries(S.urlDraft).forEach(([k, v]) => urls[k] = v.trim());
    const ok = await withBusy(async () => { await api('saveUrls', { password: S.pw, urls }); await loadAdmin(); });
    if (!ok) return;
    S.urlDraft = null; render(); toast('배포 주소를 저장했습니다.');
  }
};

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]');
  if (!el || !$app.contains(el) && !el.closest('.overlay')) return;
  const fn = actions[el.dataset.act];
  if (fn){ fn(el, ev); }
});
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.dataset.t != null && S.form){ S.form.texts[+t.dataset.t] = t.value; }
  else if (t.dataset.pi != null && S.pform){
    S.pform.scores[+t.dataset.pi] = t.value;
    const max = +t.max, x = Number(t.value);
    t.classList.toggle('bad', t.value !== '' && (!isFinite(x) || x < 0 || x > max));
    const s = document.getElementById('psum'); if (s) s.textContent = r2(S.pform.scores.reduce((a, v) => a + (Number(v) || 0), 0));
  }
  else if (t.id === 'pcomment' && S.pform){ S.pform.comment = t.value; }
  else if (t.dataset.url != null && S.urlDraft){ S.urlDraft[t.dataset.url] = t.value; }
});
document.addEventListener('change', ev => {
  if (ev.target.dataset.actChange === 'sort'){ S.sort = ev.target.value; render(); }
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Enter' && ev.target.id === 'pw') doLogin();
  if (ev.key === 'Enter' && ev.target.id === 'sid') doStudentLogin();
  if (ev.key === 'Enter' && ev.target.id === 'gate') doEnter();
  if (ev.key === 'Enter' && ev.target.id === 'fbsid') doFbLogin();
  if (ev.key === 'Escape' && S.detail){ S.detail = null; render(); }
});

render();
loadStatus();
