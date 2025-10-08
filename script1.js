/* SkillSwap — Interactivity
   - Grid population
   - Search & filter
   - Signup modal
   - Beginner lesson flow + badge awarding (localStorage)
   - Save favorite cards (localStorage)
   - Responsive hamburger
*/

/* ---------- Helpers ---------- */
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));
const uid = (p = 'id') => p + Math.random().toString(36).slice(2,9);

/* ---------- DOM ---------- */
const navLinks = $('#navLinks');
const hamburger = $('#hamburger');
const loginBtn = $('#loginBtn');
const signupBtn = $('#signupBtn');
const modalOverlay = $('#modalOverlay');
const modalClose = $('#modalClose');
const signupForm = $('#signupForm');
const cancelModal = $('#cancelModal');

const gridExplore = $('#gridExplore');
const searchInput = $('#searchInput');
const filterSelect = $('#filterSelect');
const loadMoreBtn = $('#loadMoreBtn');

const lessonOverlay = $('#lessonOverlay');
const lessonClose = $('#lessonClose');
const lessonBody = $('#lessonBody');
const completeLesson = $('#completeLesson');
const badgesWrap = $('#badges');
const lessonStarts = $$('.lesson-start');

const signupFooter = $('#signupFooter');
const ctaExplore = $('#ctaExplore');
const ctaLearn = $('#ctaLearn');
const yearSpan = $('#year');

/* ---------- State & storage keys ---------- */
const STORAGE = {
  badges: 'skillswap_badges_v1',
  favorites: 'skillswap_favs_v1'
};

let badges = JSON.parse(localStorage.getItem(STORAGE.badges) || '[]');
let favorites = JSON.parse(localStorage.getItem(STORAGE.favorites) || '[]');

/* ---------- Sample data for explore grid ---------- */
const SAMPLE_CARDS = [
  { id: uid('s'), name: 'Aisha', skills: ['English conversation','Tutoring'], wants: ['Graphic design'], category: 'Language', level:'Beginner', bio:'Friendly teacher for speaking practice.' },
  { id: uid('s'), name: 'Bilal', skills: ['Photoshop', 'UI Design'], wants: ['Social media'], category: 'Design', level:'Intermediate', bio:'Designer who loves simple UI systems.' },
  { id: uid('s'), name: 'Chen', skills: ['JavaScript','React'], wants: ['Public speaking'], category: 'Development', level:'Advanced', bio:'Fullstack dev available for pair-programming.' },
  { id: uid('s'), name: 'Dina', skills: ['Canva','Content creation'], wants: ['SEO'], category: 'Marketing', level:'Beginner', bio:'Create quick social posts & templates.' },
  { id: uid('s'), name: 'Eli', skills: ['Guitar lessons'], wants: ['English'], category: 'Music', level:'Intermediate', bio:'Acoustic guitarist and patient teacher.' },
  { id: uid('s'), name: 'Fatima', skills: ['Resume Review','Interview Prep'], wants: ['Web basics'], category: 'Life Skills', level:'Intermediate', bio:'Career coach with hiring experience.' },
  // ... more can be added
];

let visibleCount = 6;

/* ---------- Render utilities ---------- */
function createCardHTML(card){
  const wrapper = document.createElement('article');
  wrapper.className = 'card';
  wrapper.innerHTML = `
    <div><h3>${card.name} <small class="muted">• ${card.level}</small></h3>
    <div class="meta">${card.bio}</div></div>
    <div class="tags" style="margin-top:10px">
      ${card.skills.map(s => `<span class="tag">${s}</span>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
      <div class="meta muted">Wants: ${card.wants.join(', ')}</div>
      <div class="card-actions">
        <button class="btn primary connect">Connect</button>
        <button class="btn ghost save">${favorites.includes(card.id) ? 'Saved' : 'Save'}</button>
      </div>
    </div>
  `;
  // wiring buttons
  wrapper.querySelector('.connect').addEventListener('click', ()=> {
    alert(`Open chat / schedule with ${card.name} (demo).`);
  });
  wrapper.querySelector('.save').addEventListener('click', (e) => {
    toggleFavorite(card.id, e.target);
  });
  return wrapper;
}

function renderExploreGrid(data){
  gridExplore.innerHTML = '';
  data.slice(0, visibleCount).forEach(card => {
    gridExplore.appendChild(createCardHTML(card));
  });
}

/* ---------- favorites ---------- */
function toggleFavorite(id, btn){
  if(favorites.includes(id)){
    favorites = favorites.filter(x=>x!==id);
    btn.textContent = 'Save';
  } else {
    favorites.push(id);
    btn.textContent = 'Saved';
  }
  localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites));
}

/* ---------- search & filter ---------- */
function applyFilters(){
  const q = (searchInput.value || '').trim().toLowerCase();
  const f = filterSelect.value;
  const filtered = SAMPLE_CARDS.filter(c => {
    const inCategory = !f || c.category === f;
    const matchesQ = !q || (c.name + ' ' + c.skills.join(' ') + ' ' + c.wants.join(' ') + ' ' + c.bio).toLowerCase().includes(q);
    return inCategory && matchesQ;
  });
  renderExploreGrid(filtered);
}

/* ---------- load more ---------- */
loadMoreBtn.addEventListener('click', ()=> {
  visibleCount += 6; applyFilters();
});

/* ---------- hamburger responsive nav ---------- */
hamburger.addEventListener('click', ()=> {
  if(navLinks.getAttribute('aria-hidden') === 'true'){
    navLinks.setAttribute('aria-hidden','false'); navLinks.style.display = 'flex';
  } else {
    navLinks.setAttribute('aria-hidden','true'); navLinks.style.display = 'none';
  }
});

/* ---------- signup modal ---------- */
signupBtn.addEventListener('click', openModal);
loginBtn.addEventListener('click', openModal);
signupFooter.addEventListener('click', openModal);
function openModal(){
  modalOverlay.classList.remove('hidden'); modalOverlay.setAttribute('aria-hidden','false');
  $('#modalTitle').textContent = 'Sign up';
}
modalClose.addEventListener('click', closeModal);
cancelModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e)=> { if(e.target === modalOverlay) closeModal(); });
function closeModal(){ modalOverlay.classList.add('hidden'); modalOverlay.setAttribute('aria-hidden','true'); }

/* form submit: demo create account */
signupForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(signupForm);
  const name = data.get('name');
  const email = data.get('email');
  const skill = data.get('skill') || '—';
  // quick demo flow: thank you & close
  alert(`Welcome, ${name}! You listed: ${skill}. Your profile is ready (demo).`);
  signupForm.reset();
  closeModal();
});

/* ---------- lesson flow & badges ---------- */
lessonStarts.forEach(btn => btn.addEventListener('click', (e) => {
  const lesson = e.target.closest('.lesson').dataset.lesson;
  openLessonModal(lesson);
}));

function openLessonModal(lessonKey){
  lessonOverlay.classList.remove('hidden'); lessonOverlay.setAttribute('aria-hidden','false');
  $('#lessonTitle').textContent = {
    'html':'Intro to HTML',
    'css':'Basics of CSS',
    'comm':'Communication Skills',
    'canva':'Design with Canva'
  }[lessonKey] || 'Lesson';

  // demo lesson content
  lessonBody.innerHTML = `
    <p class="muted">This is a short interactive lesson for <strong>${$('#lessonTitle').textContent}</strong>. Read quickly and practice.</p>
    <ol>
      <li>Watch a 1–2 min explanation (demo).</li>
      <li>Try a tiny exercise (open console / try an edit).</li>
      <li>Reflect: write what you learned.</li>
    </ol>
    <label>Quick note (what I learned): <input id="lessonNote" placeholder="Type 1–2 lines"></label>
  `;
  // attach complete action
  completeLesson.onclick = () => {
    const note = $('#lessonNote')?.value || '';
    const badgeId = `badge_${lessonKey}`;
    if(!badges.includes(badgeId)) badges.push(badgeId);
    localStorage.setItem(STORAGE.badges, JSON.stringify(badges));
    renderBadges();
    alert('Lesson complete — you earned a badge! ' + (note ? `Note: "${note}"` : ''));
    closeLessonModal();
  };
}

lessonClose.addEventListener('click', closeLessonModal);
$('#cancelLesson').addEventListener('click', closeLessonModal);
lessonOverlay.addEventListener('click', (e)=> { if(e.target === lessonOverlay) closeLessonModal(); });

function closeLessonModal(){
  lessonOverlay.classList.add('hidden'); lessonOverlay.setAttribute('aria-hidden','true');
}

/* ---------- badges rendering ---------- */
function renderBadges(){
  badgesWrap.innerHTML = '';
  if(!badges.length) { badgesWrap.innerHTML = '<div class="muted">No badges yet — complete a lesson to earn one.</div>'; return; }
  badges.forEach(b => {
    const el = document.createElement('div'); el.className = 'badge'; el.textContent = b.replace('badge_','').toUpperCase();
    badgesWrap.appendChild(el);
  });
}

/* ---------- utilities & initial render ---------- */
searchInput.addEventListener('input', applyFilters);
filterSelect.addEventListener('change', applyFilters);

ctaExplore.addEventListener('click', ()=> location.href = '#explore');
ctaLearn.addEventListener('click', ()=> location.href = '#learn');

signupFooter.addEventListener('click', openModal);

// favorites pre-load
function init(){
  renderExploreGrid(SAMPLE_CARDS);
  renderBadges();
  yearSpan.textContent = new Date().getFullYear();
  // if there are saved favorites, mark them (initial render will show Save text updated when createCardHTML button clicked)
}
init();
