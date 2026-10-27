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
  { id: 'p2', roman: 'II', title: '게임 프로젝트 II', open: true, rubric: {
      // levels: [최솟값, 최댓값, 기준] — 상/중/하 구간. 슬라이더 색상과 안내 문구에 쓰입니다.
      prof: [
        { label: '게임의 재미', max: 25, levels: {
            high: [20, 25, '핵심 재미가 분명하고, 진행할수록 변화가 있어 계속 플레이하고 싶음'],
            mid:  [12, 19, '재미 요소는 있으나 단조롭거나 밸런스가 어색함'],
            low:  [0, 11, '재미 요소가 약하거나 게임으로 성립하지 않음'] } },
        { label: '완성도 및 레벨 구성', max: 25, levels: {
            high: [20, 25, '타이틀부터 다시하기까지 끊김 없고 치명적 버그가 없음. 레벨(단계)이 있고 난이도가 적절히 올라감'],
            mid:  [12, 19, '흐름 일부가 빠졌거나 사소한 버그가 있음. 레벨은 있으나 난이도 변화가 약함'],
            low:  [0, 11, '진행 불가 버그가 있거나, 레벨 구분 없이 같은 내용이 반복됨'] } },
        { label: '스토리 구성 및 전달', max: 15, levels: {
            high: [12, 15, '스토리가 게임 안에서 전달되고, 스토리의 목표가 플레이 행동과 자연스럽게 이어짐'],
            mid:  [7, 11, '스토리는 있으나 게임 안에서 약하게 전달되거나 플레이와 따로 놂'],
            low:  [0, 6, '스토리가 기획서에만 있고 게임에서는 드러나지 않음'] } },
        { label: '이미지·사운드', max: 15, levels: {
            high: [12, 15, '이미지·배경음악·효과음이 모두 갖춰져 분위기와 스토리를 살림'],
            mid:  [7, 11, '일부가 부족하거나 서로 어울리지 않음'],
            low:  [0, 6, '기본 도형이 남아 있거나 사운드가 빠짐'] } },
        { label: '기획서 일치 및 피드백 반영', max: 10, levels: {
            high: [8, 10, '기획서대로 구현되었고, 바뀐 부분과 브리핑 피드백 반영 내용을 설명함'],
            mid:  [4, 7, '기획서와 부분적으로만 일치함'],
            low:  [0, 3, '기획서와 결과물이 크게 다름'] } },
        { label: '발표 및 생성형 AI 활용 과정', max: 10, levels: {
            high: [8, 10, 'AI 제안을 검증·수정한 과정이 구체적이고, 발표가 명확함'],
            mid:  [4, 7, 'AI 활용 설명이 형식적이거나 발표 구성이 산만함'],
            low:  [0, 3, 'AI 활용 과정 설명이 없음'] } }
      ],
      peer: [
        '직접 플레이해 보니 재미있었고, 한 판 더 하고 싶었다',
        '게임 안에서 스토리가 잘 전달되었고, 주인공의 목표와 상황이 플레이에 몰입하게 만들었다',
        '타이틀부터 엔딩(또는 게임오버), 다시하기까지 끊김 없이 플레이되었고 치명적인 버그가 없었다',
        '이미지와 사운드가 게임의 분위기와 스토리에 잘 어울렸다',
        '기획 의도와 생성형 AI 활용 과정이 발표에서 이해하기 쉽게 설명되었다'
      ],
      peerText: ['가장 인상 깊었던 부분', '개선하면 더 좋을 것 같은 점'],
      peerTextRequired: true,
      selfScale: [
        '내가 기획한 핵심 재미를 실제 게임에서 구현했다',
        '기획한 스토리가 게임 안에서 전달되도록 구현했다',
        '타이틀부터 다시하기까지 끊김 없이 완성했고, 치명적인 버그를 해결했다',
        '플레이 테스트 의견을 반영해 게임을 개선했다',
        '생성형 AI의 결과를 그대로 쓰지 않고 검증·수정하며 활용했다'
      ],
      selfText: [
        '내 게임에서 가장 재미있는 순간은 언제이며, 그 재미를 만들기 위해 무엇을 했는가?',
        '완성도 체크리스트 중 끝내 지키지 못한 항목과 그 이유는? (모두 지켰다면 가장 어려웠던 항목과 해결 방법)',
        '프로젝트 I과 비교해 나아진 점은 무엇인가?',
        '다음 프로젝트(프로젝트 III)에서 다르게 시도해 보고 싶은 것은?'
      ],
      profMax: 100, peerMax: 25, selfMax: 25,
      weights: { prof: 0.7, peer: 0.2, self: 0.1 }
  }},
  { id: 'p3', roman: 'III', title: '프로젝트 III', open: false }
];

/* ---------- 상태 ---------- */
// 비밀번호와 학번은 브라우저에 저장하지 않습니다. (공용 컴퓨터에서 다음 사람이 그대로 들어가는 것을 막기 위함)
const store = { get(){ return null; }, set(){} };
try { Object.keys(sessionStorage).filter(k => k.startsWith('xr_')).forEach(k => sessionStorage.removeItem(k)); } catch(e){}
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
        const sub = !p.open ? '준비 중' : closed ? (st.feedbackOpen ? '평가 종료' : '준비 중') : '평가 진행 중';
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
      ? (S.pstatus[P.id].feedbackOpen
          ? '<p class="note" style="margin-top:8px">평가가 종료되었습니다. 동료 피드백은 처음 화면의 "내 피드백 확인"에서 볼 수 있습니다.</p>'
          : '<p class="note" style="margin-top:8px">아직 평가가 열리지 않았습니다.</p>')
      : '<p class="muted">수업에서 안내받은 프로젝트 비밀번호를 입력하세요.</p>'}
      <label for="gate">프로젝트 비밀번호</label><input id="gate" type="password" autocomplete="new-password" value="">
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
      <label for="fbsid">학번</label><input id="fbsid" type="password" inputmode="numeric" autocomplete="new-password" maxlength="20" value="">
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
      <label for="sid">학번</label><input id="sid" type="password" inputmode="numeric" autocomplete="new-password" maxlength="20" value="">
      <button type="button" class="btn primary" data-act="student-login">확인</button>
      <p style="margin:14px 0 0;text-align:center"><button type="button" class="link" data-act="change-me">다른 이름 선택</button></p></div>
  </section>`;
}

/* ---------- 화면: 상호평가 목록 ---------- */
function vPeerList(){
  const others = S.students.filter(s => s.name !== S.me && !s.out);
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
    <h3 class="sub">서술형 <small>${R.peerTextRequired ? '(모든 문항 필수, 작성자 이름은 공개되지 않습니다)' : '(선택, 1~2개 작성)'}</small></h3>
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
      <label for="pw">비밀번호</label><input id="pw" type="password" autocomplete="new-password" value="">
      <button type="button" class="btn primary" data-act="login">로그인</button></div>
  </section>`;
}

/* ---------- 집계 ---------- */
function compute(){
  const R = proj().rubric, D = S.admin, W = R.weights, EX = D.exclusions || {};
  return D.students.map(s => {
    const pr = D.prof.find(x => x.name === s.name);
    const peers = D.peer.filter(x => x.target === s.name && EX[x.evaluator] !== '결석');
    const sf = D.self.find(x => x.name === s.name);
    const profT = pr ? pr.total : null;
    const peerAvg = peers.length ? peers.reduce((a, x) => a + x.total, 0) / peers.length : null;
    const selfT = sf ? sf.total : null;
    const cP = (profT || 0) / R.profMax * 100 * W.prof;
    const cQ = (peerAvg || 0) / R.peerMax * 100 * W.peer;
    const cS = (selfT || 0) / R.selfMax * 100 * W.self;
    const missing = [profT == null && '교수', peerAvg == null && '상호', selfT == null && '자기'].filter(Boolean);
    const ex = EX[s.name] || '';
    return { name: s.name, sid: s.sid || '', url: s.url, ex, pr, peers, sf, profT, peerAvg, peerN: peers.length, selfT, cP, cQ, cS, final: ex ? null : cP + cQ + cS, missing };
  });
}

/* ---------- 화면: 교수 ---------- */
function vAdmin(){
  const tabs = [['result','결과'],['prof','교수 평가'],['exclude','평가 제외'],['urls','배포 주소'],['status','제출 현황'],['settings','공개 설정']];
  const body = { result: vResult, prof: vProf, exclude: vExclude, urls: vUrls, status: vStatus, settings: vSettings }[S.tab]();
  return topbar('교수 전용', 'hub', `<button type="button" class="btn sm" data-act="refresh">새로고침</button><button type="button" class="btn primary sm" data-act="download">엑셀 다운로드</button><button type="button" class="btn sm" data-act="logout">로그아웃</button>`)
    + `<section class="page wide">
      <nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="tab" role="tab" aria-selected="${S.tab === k}" data-act="tab" data-tab="${k}">${l}</button>`).join('')}</nav>
      ${body}
    </section>` + (S.detail ? vDetail() : '');
}

function vResult(){
  const rows = compute(), D = S.admin, EX = D.exclusions || {};
  const inc = rows.filter(r => !r.ex), n = inc.length, incSet = new Set(inc.map(r => r.name));
  const evaluators = rows.filter(r => r.ex !== '결석');
  const peerExpected = evaluators.reduce((a, r) => a + inc.filter(t => t.name !== r.name).length, 0);
  const peerGot = D.peer.filter(p => incSet.has(p.target) && EX[p.evaluator] !== '결석').length;
  const sorted = S.sort === 'final' ? rows.slice().sort((a, b) => (b.final ?? -1) - (a.final ?? -1)) : rows;
  const exN = rows.length - n;
  return `<div class="stats">
      <div class="stat"><b>${D.prof.filter(p => incSet.has(p.name)).length} / ${n}</b><span>교수 평가 입력</span></div>
      <div class="stat"><b>${peerGot} / ${peerExpected}</b><span>상호평가 제출 건수</span></div>
      <div class="stat"><b>${D.self.filter(x => incSet.has(x.name)).length} / ${n}</b><span>자기평가 제출</span></div>
      ${exN ? `<div class="stat"><b>${exN}명</b><span>평가 제외 (결석·미제출)</span></div>` : ''}
    </div>
    <div class="tools"><p class="muted" style="margin:0">학생 이름을 누르면 문항별 점수와 서술형 응답을 볼 수 있습니다.</p>
      <select data-act-change="sort" aria-label="정렬"><option value="name" ${S.sort === 'name' ? 'selected' : ''}>명단순</option><option value="final" ${S.sort === 'final' ? 'selected' : ''}>최종 점수순</option></select></div>
    <div class="tablewrap"><table>
      <thead><tr><th>이름</th><th>교수 평가<br>(100)</th><th>상호평가 평균<br>(25)</th><th>평가 인원</th><th>자기평가<br>(25)</th><th>교수 반영<br>(70)</th><th>상호 반영<br>(20)</th><th>자기 반영<br>(10)</th><th>최종<br>(100)</th><th>누락</th></tr></thead>
      <tbody>${sorted.map(r => r.ex ? `<tr class="click excluded" data-act="detail" data-name="${esc(r.name)}">
        <td><strong>${esc(r.name)}</strong></td><td colspan="8" class="left"><span class="dash">평가 제외</span></td>
        <td><span class="chip ex">${esc(r.ex)}</span></td></tr>`
      : `<tr class="click" data-act="detail" data-name="${esc(r.name)}">
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
    ${r.ex ? `<p class="note" style="margin:0 0 14px">이번 프로젝트 평가에서 제외된 학생입니다 (${esc(r.ex)}). 최종 점수를 계산하지 않습니다.</p>` : ''}
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
    <div class="plist">${D.students.map(s => { const p = D.prof.find(x => x.name === s.name); const ex = (D.exclusions || {})[s.name]; return `<button type="button" class="pitem ${ex ? 'excluded' : ''}" aria-current="${f.name === s.name}" data-act="prof-sel" data-name="${esc(s.name)}"><span>${esc(s.name)}</span>${ex ? `<span class="chip ex">${esc(ex)}</span>` : p ? `<small>${r2(p.total)}</small>` : ''}</button>`; }).join('')}</div>
    <div class="pform">
      <h3>${esc(f.name)}</h3>
      ${(D.exclusions || {})[f.name] ? `<p class="note" style="margin:6px 0 10px">평가 제외(${esc(D.exclusions[f.name])}) 학생입니다. 점수를 입력해도 최종 점수는 계산하지 않습니다.</p>` : ''}
      <p style="margin:0 0 8px">${playLink((D.students.find(s => s.name === f.name) || {}).url, '게임 열기')}</p>
      ${R.prof.map((p, i) => sliderRow(p, i, f.scores[i])).join('')}
      <div class="total">합계 <b id="psum">${r2(total)}</b> / 100</div>
      <label class="ta"><span>코멘트 (선택, 학생에게 공개되지 않음)</span><textarea id="pcomment" rows="3" maxlength="2000">${esc(f.comment)}</textarea></label>
      <div class="pactions"><button type="button" class="btn" data-act="save-prof">저장</button><button type="button" class="btn primary" data-act="save-prof" data-next="1">저장하고 다음 학생</button></div>
    </div></div>`;
}
/* ---------- 교수 평가 슬라이더 ---------- */
// 상/중/하 구간: 항목에 levels가 없으면 배점의 80% / 48% 기준으로 나눕니다.
function levelsOf(item){
  if (item.levels) return item.levels;
  const m = item.max, hi = Math.ceil(m * 0.8), mi = Math.ceil(m * 0.48);
  return { high: [hi, m, ''], mid: [mi, hi - 1, ''], low: [0, mi - 1, ''] };
}
const LEVEL_NAME = { high: '상', mid: '중', low: '하' };
function levelFor(item, v){
  if (v === '' || v == null || !isFinite(Number(v))) return null;
  const L = levelsOf(item), x = Number(v);
  return x >= L.high[0] ? 'high' : x >= L.mid[0] ? 'mid' : 'low';
}
function sliderState(item, v){
  const lv = levelFor(item, v);
  const pct = lv ? Number(v) / item.max * 100 : 0;
  const L = levelsOf(item);
  return {
    lv, pct,
    badge: lv ? `${LEVEL_NAME[lv]} (${L[lv][0]}~${L[lv][1]})` : '미입력',
    desc: lv ? L[lv][2] : '슬라이더를 움직여 점수를 정하세요.'
  };
}
function sliderRow(item, i, v){
  const st = sliderState(item, v);
  return `<div class="srow ${st.lv ? 'lv-' + st.lv : 'unset'}" id="srow${i}" style="--pct:${st.pct}%">
    <div class="shead"><label for="pi${i}">${esc(item.label)}</label>
      <span class="sval"><b id="pv${i}">${st.lv ? Number(v) : '-'}</b> / ${item.max}</span></div>
    <input id="pi${i}" class="slider" type="range" min="0" max="${item.max}" step="1" data-pi="${i}" value="${st.lv ? Number(v) : 0}" aria-valuetext="${st.lv ? Number(v) + '점' : '미입력'}">
    <div class="sfoot"><span class="lvchip" id="pc${i}">${esc(st.badge)}</span><span class="sdesc" id="pd${i}">${esc(st.desc)}</span></div>
  </div>`;
}
function updateSlider(i){
  const item = proj().rubric.prof[i], v = S.pform.scores[i], st = sliderState(item, v);
  const row = document.getElementById('srow' + i);
  if (!row) return;
  row.className = 'srow ' + (st.lv ? 'lv-' + st.lv : 'unset');
  row.style.setProperty('--pct', st.pct + '%');
  document.getElementById('pv' + i).textContent = st.lv ? Number(v) : '-';
  document.getElementById('pc' + i).textContent = st.badge;
  document.getElementById('pd' + i).textContent = st.desc;
  document.getElementById('pi' + i).setAttribute('aria-valuetext', st.lv ? Number(v) + '점' : '미입력');
}

function selectProf(name){
  const p = S.admin.prof.find(x => x.name === name);
  S.pform = { name, scores: p ? p.scores.map(String) : proj().rubric.prof.map(() => ''), comment: p ? p.comment : '' };
}

/* ---------- 교수: 평가 제외 ---------- */
const EX_OPTIONS = [['', '평가 대상'], ['결석', '결석'], ['미제출', '미제출']];
function vExclude(){
  if (!S.exDraft) S.exDraft = Object.assign({}, S.admin.exclusions || {});
  const D = S.admin, saved = D.exclusions || {};
  const changed = D.students.some(s => (S.exDraft[s.name] || '') !== (saved[s.name] || ''));
  const cnt = k => D.students.filter(s => (S.exDraft[s.name] || '') === k).length;
  return `<div class="exhead">
      <p class="muted" style="margin:0">결석하거나 프로젝트를 제출하지 않은 학생을 표시하면 평가에서 제외됩니다.</p>
      <ul class="exrules">
        <li><b>결석</b>: 다른 학생의 상호평가 목록에서 빠지고, 본인도 상호평가·자기평가를 할 수 없습니다.</li>
        <li><b>미제출</b>: 상호평가 목록에서 빠지고 자기평가는 할 수 없지만, 다른 학생 상호평가는 할 수 있습니다.</li>
        <li>제외된 학생은 최종 점수를 계산하지 않으며, 엑셀에 제외 사유가 표시됩니다.</li>
      </ul>
    </div>
    <div class="pform">
      <p class="excount">평가 대상 <b>${cnt('')}명</b> · 결석 <b>${cnt('결석')}명</b> · 미제출 <b>${cnt('미제출')}명</b></p>
      ${D.students.map(s => { const cur = S.exDraft[s.name] || ''; return `<div class="exrow ${cur ? 'is-out' : ''}">
        <strong>${esc(s.name)}</strong>
        <div class="seg" role="radiogroup" aria-label="${esc(s.name)} 평가 구분">${EX_OPTIONS.map(([v, l]) =>
          `<button type="button" role="radio" aria-checked="${cur === v}" class="segbtn ${cur === v ? 'on' : ''} ${v ? 'out' : ''}" data-act="ex-set" data-name="${esc(s.name)}" data-v="${v}">${l}</button>`).join('')}</div>
      </div>`; }).join('')}
      <div class="pactions">${changed ? '<span class="muted" style="align-self:center">저장하지 않은 변경 사항이 있습니다</span><button type="button" class="btn" data-act="ex-reset">되돌리기</button>' : ''}
        <button type="button" class="btn primary" data-act="ex-save" ${changed ? '' : 'disabled'}>저장</button></div>
    </div>`;
}

/* ---------- 교수: 공개 설정 ---------- */
function vSettings(){
  const st = S.admin.settings || { gate: '', feedbackOpen: false };
  const open = !!st.gate;
  return `<div class="setgrid">
    <section class="pform setcard">
      <h3>학생 평가 입장</h3>
      <p class="setstate"><span class="chip ${open ? 'ok' : 'warn'}">${open ? '진행 중' : '닫힘'}</span>
        ${open ? '학생들이 입장 비밀번호로 들어와 평가할 수 있습니다.' : '학생은 평가 화면에 들어올 수 없습니다.'}</p>
      <label class="ta"><span>${open ? '새 입장 비밀번호' : '입장 비밀번호'}</span>
        <input type="text" id="setgate" value="" autocomplete="off" maxlength="50" placeholder="비밀번호 입력"></label>
      <div class="pactions">
        ${open ? '<button type="button" class="btn" data-act="close-eval">평가 종료 (입장 닫기)</button>' : ''}
        <button type="button" class="btn primary" data-act="save-gate">${open ? '비밀번호 변경' : '평가 열기'}</button>
      </div>
    </section>
    <section class="pform setcard">
      <h3>피드백 공개</h3>
      <p class="setstate"><span class="chip ${st.feedbackOpen ? 'ok' : ''}">${st.feedbackOpen ? '공개 중' : '비공개'}</span>
        ${st.feedbackOpen ? '학생들이 "내 피드백 확인"에서 볼 수 있습니다.' : '학생에게 보이지 않습니다.'}</p>
      <p class="muted setnote">공개하면 학생은 자신이 받은 <b>상호평가 서술형</b>만 볼 수 있습니다. 점수, 평가자 이름, 교수 평가, 자기평가는 공개되지 않습니다.</p>
      <div class="pactions">
        <button type="button" class="btn ${st.feedbackOpen ? '' : 'primary'}" data-act="toggle-feedback">${st.feedbackOpen ? '공개 중지' : '피드백 공개'}</button>
      </div>
    </section>
  </div>`;
}
async function saveSettings(patch, msg){
  let res = null;
  const ok = await withBusy(async () => { const d = await api('saveSettings', Object.assign({ password: S.pw }, patch)); res = d.settings; });
  if (!ok) return;
  S.admin.settings = res;
  if (S.pstatus) S.pstatus[S.project] = { evalOpen: !!res.gate, feedbackOpen: res.feedbackOpen };
  render(); toast(msg);
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
  const D = S.admin, EX = D.exclusions || {};
  const targets = D.students.filter(s => !EX[s.name]);
  return `<div class="tablewrap"><table>
    <thead><tr><th>이름</th><th>상호평가 제출</th><th>받은 상호평가</th><th>자기평가</th><th style="text-align:left">아직 평가하지 않은 대상</th></tr></thead>
    <tbody>${D.students.map(s => {
      const ex = EX[s.name];
      const mine = targets.filter(o => o.name !== s.name);
      const given = D.peer.filter(p => p.evaluator === s.name && !EX[p.target]).map(p => p.target);
      const recv = D.peer.filter(p => p.target === s.name).length;
      const selfOk = D.self.some(x => x.name === s.name);
      if (ex === '결석') return `<tr class="excluded"><td><strong>${esc(s.name)}</strong></td><td colspan="4" class="left"><span class="chip ex">결석</span> <span class="dash">평가 대상이 아니며 상호평가도 하지 않습니다</span></td></tr>`;
      const left = mine.filter(o => !given.includes(o.name)).map(o => o.name);
      return `<tr class="${ex ? 'excluded' : ''}"><td><strong>${esc(s.name)}</strong>${ex ? ` <span class="chip ex">${esc(ex)}</span>` : ''}</td>
        <td><span class="chip ${given.length === mine.length ? 'ok' : ''}">${given.length} / ${mine.length}</span></td>
        <td>${ex ? '<span class="dash">-</span>' : recv + '명'}</td><td>${ex ? '<span class="dash">-</span>' : selfOk ? '<span class="chip ok">제출</span>' : '<span class="chip warn">미제출</span>'}</td>
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

  add([['학번','이름','평가 제외','교수 평가(100)','상호평가 평균(25)','상호평가 인원','자기평가(25)','교수 반영(70%)','상호 반영(20%)','자기 반영(10%)','최종 점수(100)','누락','배포 주소']]
    .concat(rows.map(r => r.ex
      ? [r.sid, r.name, r.ex, '', '', '', '', '', '', '', '', '', r.url]
      : [r.sid, r.name, '', nz(r.profT), nz(r.peerAvg), r.peerN, nz(r.selfT), r2(r.cP), r2(r.cQ), r2(r.cS), r2(r.final), r.missing.join(', '), r.url])),
    '최종결과', [12,22,10,14,16,12,13,14,14,14,14,14,40]);

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
  setStudent(null, null);
  go('who');
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
  if (status.excluded === '결석' || (S.mode === 'self' && status.excluded)){
    toast(S.mode === 'self' ? '이번 프로젝트 평가에서 제외되어 자기평가를 할 수 없습니다.' : '결석으로 이번 프로젝트 평가에서 제외되어 상호평가를 할 수 없습니다.', 'err');
    return go('hub');
  }
  setStudent(S.pick, sid); S.status = status;
  if (S.mode === 'peer') go('peerList');
  else { const R = proj().rubric; S.form = { scores: R.selfScale.map(() => 0), texts: R.selfText.map(() => '') }; go('selfForm'); }
}

async function doLogin(){
  const pw = document.getElementById('pw').value;
  if (!pw) return toast('비밀번호를 입력하세요.', 'err');
  S.pw = pw;
  const ok = await withBusy(loadAdmin);
  if (ok){ store.set('xr_pw', pw); go('admin', { tab: 'result', pform: null, urlDraft: null, detail: null, exDraft: null }); }
  else { S.pw = null; store.set('xr_pw', null); }
}

const actions = {
  async project(el){
    const p = PROJECTS.find(x => x.id === el.dataset.id);
    if (!p.open) return toast(`${p.title} 평가는 아직 열리지 않았습니다.`);
    const reset = { project: p.id, gate: null, students: [], status: null, admin: null, pform: null, urlDraft: null, detail: null, exDraft: null };
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
    S.project = null; S.gate = null; S.fb = null;
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
      S.pw = null; S.admin = null;
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
    if (proj().rubric.peerTextRequired){
      const empty = S.form.texts.findIndex(t => t.trim().length < 10);
      if (empty >= 0) return toast(`서술형 ${empty + 1}번 문항을 10자 이상 작성하세요.`, 'err');
    }
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
  tab(el){ S.tab = el.dataset.tab; S.detail = null; S.exDraft = null; render(); },
  async refresh(){ const ok = await withBusy(loadAdmin); if (ok){ S.urlDraft = null; S.exDraft = null; if (S.pform) selectProf(S.pform.name); render(); toast('최신 데이터를 불러왔습니다.'); } },
  download(){ downloadXlsx(); },
  detail(el){ S.detail = el.dataset.name; render(); },
  'close-detail'(el, ev){ if (ev.target.closest('[data-stop]') && !ev.target.closest('.btn')) return; S.detail = null; render(); },
  'prof-sel'(el){ selectProf(el.dataset.name); render(); },
  async 'save-prof'(el){
    const R = proj().rubric, f = S.pform;
    for (let i = 0; i < R.prof.length; i++){
      const x = Number(f.scores[i]);
      if (f.scores[i] === '' || !isFinite(x) || x < 0 || x > R.prof[i].max)
        return toast(`${R.prof[i].label} 점수를 입력하세요.`, 'err');
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
  'ex-set'(el){
    const n = el.dataset.name, v = el.dataset.v;
    if (v) S.exDraft[n] = v; else delete S.exDraft[n];
    render();
  },
  'ex-reset'(){ S.exDraft = null; render(); },
  async 'ex-save'(){
    const list = Object.assign({}, S.exDraft);
    const ok = await withBusy(async () => { await api('saveExclusions', { password: S.pw, list }); await loadAdmin(); });
    if (!ok) return;
    S.exDraft = null; render(); toast('평가 제외 학생을 저장했습니다.');
  },
  'save-gate'(){
    const g = document.getElementById('setgate').value.trim();
    if (!g) return toast('입장 비밀번호를 입력하세요.', 'err');
    saveSettings({ entryPw: g }, '평가 입장 비밀번호를 저장했습니다.');
  },
  'close-eval'(){
    if (!confirm('평가를 종료할까요? 학생은 더 이상 평가 화면에 들어올 수 없습니다.')) return;
    saveSettings({ entryPw: '' }, '평가를 종료했습니다.');
  },
  'toggle-feedback'(){
    const on = !(S.admin.settings && S.admin.settings.feedbackOpen);
    if (on && !confirm('학생들에게 상호평가 서술형 피드백을 공개할까요?')) return;
    saveSettings({ feedbackOpen: on }, on ? '피드백을 공개했습니다.' : '피드백 공개를 중지했습니다.');
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
    updateSlider(+t.dataset.pi);
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
