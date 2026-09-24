// ─── LIFE EXPECTANCY ENGINE ─────────────────────────────────────────────────
const BASE_LIFESPAN = { male: 76, female: 81 }; // WHO global averages

function calcLifespan(data) {
  let base = BASE_LIFESPAN[data.sex];
  // Adjustments in years
  base += parseInt(data.exercise) * 3;  // up to +6
  base += parseInt(data.diet)     * 2;  // up to +4
  base += parseInt(data.sleep)    * 2;  // up to +4
  base += parseInt(data.stress)   * 2;  // up to +4
  base -= parseInt(data.smoke)    * 5;  // up to -10
  return Math.max(base, 55);
}

// ─── STATE ───────────────────────────────────────────────────────────────────
let state = {};
let countdownInterval = null;

const GOAL_EMOJIS = ['🎯','🌍','💪','💡','❤️','🚀','📚','🎨','🏆','🌱'];

const HABITS = [
  { icon:'🚬', name:'Smoking (daily)', desc:'Each cigarette costs ~11 minutes of life expectancy.', impact:-2.5, unit:'yrs/yr', negative:true },
  { icon:'🍺', name:'Heavy Drinking', desc:'Chronic heavy drinking reduces lifespan by 2–3 years on average.', impact:-2, unit:'yrs', negative:true },
  { icon:'🏃', name:'Running / Cardio', desc:'Regular cardio can add 3–5 years to your life expectancy.', impact:+4, unit:'yrs', negative:false },
  { icon:'🥗', name:'Healthy Diet', desc:'A Mediterranean-style diet is linked to +4 years of life.', impact:+4, unit:'yrs', negative:false },
  { icon:'😴', name:'Quality Sleep (7-9h)', desc:'Chronic sleep deprivation cuts life expectancy by 2–3 years.', impact:+3, unit:'yrs', negative:false },
  { icon:'🧘', name:'Meditation / Mindfulness', desc:'Stress reduction via meditation linked to +1–2 years.', impact:+1.5, unit:'yrs', negative:false },
  { icon:'📱', name:'4+ Hours Screen Time', desc:'Sedentary screen lifestyle associated with shorter lifespan.', impact:-1, unit:'yrs', negative:true },
  { icon:'👫', name:'Strong Social Bonds', desc:'Loneliness is as deadly as smoking 15 cigarettes/day.', impact:+3, unit:'yrs', negative:false },
];

let habitActive = new Array(HABITS.length).fill(false);
let tasks = [];
let goals = [];

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
function startClock() {
  const dob = document.getElementById('dob').value;
  if (!dob) { alert('Please enter your date of birth.'); return; }

  const rawGoals = document.getElementById('goals').value.trim();
  goals = rawGoals
    ? rawGoals.split('\n').map(g => g.trim()).filter(Boolean).map(text => ({ text, priority: 'med' }))
    : [];

  const data = {
    dob,
    sex:      document.getElementById('sex').value,
    smoke:    document.getElementById('smoke').value,
    exercise: document.getElementById('exercise').value,
    diet:     document.getElementById('diet').value,
    sleep:    document.getElementById('sleep').value,
    stress:   document.getElementById('stress').value,
  };

  const lifespan = calcLifespan(data);
  const birthDate = new Date(dob);
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + lifespan);

  state = { data, lifespan, birthDate, deathDate, baseDeathDate: new Date(deathDate), goals };

  localStorage.setItem('deathclock', JSON.stringify({ ...state, birthDate: birthDate.toISOString(), deathDate: deathDate.toISOString(), baseDeathDate: deathDate.toISOString() }));

  launchApp();
}

function launchApp() {
  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('app').classList.add('active');
  renderGoals();
  renderHabits();   // sets state.deathDate based on active habits
  buildWeekGrid();
  updateDashboardStats();
  startCountdown();
}

// Called whenever the effective death date might change (on load or habit toggle)
function updateDashboardStats() {
  const { birthDate, deathDate, baseDeathDate, lifespan } = state;
  const now = new Date();
  const totalMs = baseDeathDate - birthDate;
  const livedMs = now - birthDate;
  const pct = Math.min(100, (livedMs / totalMs * 100)).toFixed(1);
  const remainMs = deathDate - now;
  const dayMs = 86400000;
  const todayPct = (dayMs / remainMs * 100).toFixed(4);

  document.getElementById('death-date').textContent = deathDate.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  document.getElementById('lifespan-val').textContent = `~${lifespan} years (base)`;
  document.getElementById('life-pct').textContent = `${pct}%`;
  document.getElementById('today-pct').textContent = `${todayPct}% of life left`;
  document.getElementById('urgency-text').textContent = `You have ${Math.round(remainMs / dayMs).toLocaleString()} days remaining`;
  setUrgencyMsg(remainMs);
}

function setUrgencyMsg(remainMs) {
  const days = Math.round(remainMs / 86400000);
  const msgs = [
    `Today is ${(1/days*100).toFixed(5)}% of your remaining life. Every hour counts.`,
    `You have ${days.toLocaleString()} days left. What will you make of today?`,
    `Time is the only non-renewable resource. Spend it wisely.`,
    `The clock doesn't pause. Neither should your dreams.`,
  ];
  const idx = Math.floor(Date.now() / 86400000) % msgs.length;
  document.getElementById('urgency-msg').textContent = msgs[idx];
}

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  tick();
  countdownInterval = setInterval(tick, 1000);
}

function tick() {
  const now = new Date();
  let diff = state.deathDate - now;
  if (diff <= 0) { diff = 0; }

  const secs  = Math.floor(diff / 1000) % 60;
  const mins  = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  let totalDays = Math.floor(diff / 86400000);
  const years = Math.floor(totalDays / 365);
  const days  = totalDays % 365;

  document.getElementById('cd-years').textContent = pad(years);
  document.getElementById('cd-days').textContent  = pad(days, 3);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}

function pad(n, len = 2) { return String(n).padStart(len, '0'); }

// ─── WEEK GRID ────────────────────────────────────────────────────────────────
function buildWeekGrid() {
  const grid = document.getElementById('week-grid');
  grid.innerHTML = '';
  const { birthDate, deathDate } = state;
  const now = new Date();
  const totalWeeks = Math.round((deathDate - birthDate) / (7 * 86400000));
  const livedWeeks = Math.round((now - birthDate) / (7 * 86400000));

  for (let i = 0; i < totalWeeks; i++) {
    const cell = document.createElement('div');
    cell.className = 'week-cell';
    if (i < livedWeeks - 1) cell.classList.add('lived');
    else if (i === livedWeeks - 1) cell.classList.add('now');
    else cell.classList.add('left');
    cell.title = `Week ${i + 1}`;
    grid.appendChild(cell);
  }
}

// ─── TASKS ───────────────────────────────────────────────────────────────────
function scoreTask(text) {
  if (!goals.length) return { score: 'N/A', cls: 'score-mid' };
  const lower = text.toLowerCase();
  const keywords = goals.flatMap(g => g.text.toLowerCase().split(/\s+/)).filter(w => w.length > 3);
  const hits = keywords.filter(k => lower.includes(k)).length;
  if (hits >= 2)  return { score: '🔥 High', cls: 'score-high' };
  if (hits === 1) return { score: '⚡ Mid',  cls: 'score-mid' };
  return { score: '❄ Low', cls: 'score-low' };
}

function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ text, done: false });
  input.value = '';
  renderTasks();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  if (!tasks.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:14px;">No tasks yet. Add one above.</p>';
    return;
  }
  list.innerHTML = tasks.map((t, i) => {
    const s = scoreTask(t.text);
    return `
      <div class="task-item">
        <div class="task-check ${t.done ? 'done' : ''}" onclick="toggleTask(${i})">${t.done ? '✓' : ''}</div>
        <span class="task-text ${t.done ? 'done' : ''}">${t.text}</span>
        <span class="task-score ${s.cls}">${s.score}</span>
        <button class="task-del" onclick="deleteTask(${i})">✕</button>
      </div>`;
  }).join('');
}

// ─── GOALS ───────────────────────────────────────────────────────────────────
function addGoal() {
  const input = document.getElementById('goal-input');
  const text = input.value.trim();
  if (!text) return;
  goals.push({ text, priority: 'med' });
  input.value = '';
  saveGoals();
  renderGoals();
}

function addGoalFromDashboard() {
  const input = document.getElementById('dash-goal-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  goals.push({ text, priority: 'med' });
  input.value = '';
  saveGoals();
  renderGoals();
  // Flash tab to hint goal was saved
  const tab = document.getElementById('tab-goals-tab');
  if (tab) { tab.classList.add('flash'); setTimeout(() => tab.classList.remove('flash'), 700); }
}

function saveGoals() {
  if (state && state.data) {
    state.goals = goals;
    const saved = JSON.parse(localStorage.getItem('deathclock') || '{}');
    saved.goals = goals;
    localStorage.setItem('deathclock', JSON.stringify(saved));
  }
}

function deleteGoal(i) {
  goals.splice(i, 1);
  saveGoals();
  renderGoals();
}

function moveGoalUp(i) {
  if (i === 0) return;
  [goals[i - 1], goals[i]] = [goals[i], goals[i - 1]];
  saveGoals();
  renderGoals();
}

function moveGoalDown(i) {
  if (i === goals.length - 1) return;
  [goals[i], goals[i + 1]] = [goals[i + 1], goals[i]];
  saveGoals();
  renderGoals();
}

function setPriority(i, level) {
  goals[i].priority = level;
  saveGoals();
  renderGoals();
  // close any open dropdowns
  document.querySelectorAll('.priority-dropdown').forEach(d => d.remove());
}

function openPriorityMenu(i, el) {
  // Close any existing dropdown
  document.querySelectorAll('.priority-dropdown').forEach(d => d.remove());
  const menu = document.createElement('div');
  menu.className = 'priority-dropdown';
  const options = [
    { level: 'high', label: '🟢 High',   cls: 'pri-high' },
    { level: 'med',  label: '🟡 Medium', cls: 'pri-med'  },
    { level: 'low',  label: '🔴 Low',    cls: 'pri-low'  },
  ];
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'pri-option ' + opt.cls + (goals[i].priority === opt.level ? ' selected' : '');
    btn.textContent = opt.label;
    btn.onclick = (e) => { e.stopPropagation(); setPriority(i, opt.level); };
    menu.appendChild(btn);
  });
  el.appendChild(menu);
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function handler() {
      menu.remove();
      document.removeEventListener('click', handler);
    });
  }, 0);
}

const PRIORITY_LABELS = {
  high: { label: 'High',   cls: 'pri-badge-high', dot: '🟢' },
  med:  { label: 'Medium', cls: 'pri-badge-med',  dot: '🟡' },
  low:  { label: 'Low',    cls: 'pri-badge-low',  dot: '🔴' },
};

function renderGoals() {
  const list = document.getElementById('goals-list');
  if (!goals.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:14px;margin-bottom:20px;">No goals set. Add your life goals below.</p>';
    return;
  }
  list.innerHTML = goals.map((g, i) => {
    const pri = PRIORITY_LABELS[g.priority] || PRIORITY_LABELS.med;
    return `
    <div class="goal-item">
      <span class="goal-rank">#${i + 1}</span>
      <span class="goal-emoji">${GOAL_EMOJIS[i % GOAL_EMOJIS.length]}</span>
      <span class="goal-text">${g.text}</span>
      <div class="priority-badge-wrap" style="position:relative">
        <button class="priority-badge ${pri.cls}" onclick="openPriorityMenu(${i}, this.parentElement)" title="Change priority">${pri.dot} ${pri.label}</button>
      </div>
      <div class="goal-priority-btns">
        <button class="priority-btn" onclick="moveGoalUp(${i})" ${i === 0 ? 'disabled' : ''} title="Move up">▲</button>
        <button class="priority-btn" onclick="moveGoalDown(${i})" ${i === goals.length - 1 ? 'disabled' : ''} title="Move down">▼</button>
      </div>
      <button class="goal-del" onclick="deleteGoal(${i})">✕</button>
    </div>`;
  }).join('');
}

// ─── HABITS ──────────────────────────────────────────────────────────────────
function toggleHabit(i) {
  habitActive[i] = !habitActive[i];
  renderHabits();
  // Recompute effective death date from base + active habit adjustments
  if (state.baseDeathDate) {
    let totalAdjust = 0;
    habitActive.forEach((active, idx) => { if (active) totalAdjust += HABITS[idx].impact; });
    const adjDate = new Date(state.baseDeathDate);
    adjDate.setFullYear(adjDate.getFullYear() + Math.round(totalAdjust));
    state.deathDate = adjDate;
    // Refresh dashboard stats and restart countdown with new date
    updateDashboardStats();
    startCountdown();
  }
}

function renderHabits() {
  const grid = document.getElementById('habits-grid');
  let totalAdjust = 0;
  habitActive.forEach((active, i) => { if (active) totalAdjust += HABITS[i].impact; });

  // Summary banner
  const sign = totalAdjust >= 0 ? '+' : '';
  const bannerCls = totalAdjust > 0 ? 'impact-pos' : totalAdjust < 0 ? 'impact-neg' : '';
  const banner = totalAdjust !== 0
    ? `<div style="margin-bottom:16px;font-size:15px;font-weight:700;" class="habit-impact ${bannerCls}" style="display:inline-block">Net habit impact: ${sign}${Math.round(totalAdjust)} years on your clock</div>`
    : `<div style="margin-bottom:16px;font-size:13px;color:var(--muted)">Toggle habits below to see their impact on your lifespan.</div>`;

  grid.innerHTML = banner + HABITS.map((h, i) => {
    const active = habitActive[i];
    const impactStr = (h.impact > 0 ? '+' : '') + h.impact + ' ' + h.unit;
    const impactCls = h.negative ? 'impact-neg' : 'impact-pos';
    return `
      <div class="habit-card">
        <span class="habit-icon">${h.icon}</span>
        <span class="habit-name">${h.name}</span>
        <span class="habit-desc">${h.desc}</span>
        <span class="habit-impact ${impactCls}">${impactStr}</span>
        <button class="habit-toggle ${active ? 'active' : ''}" onclick="toggleHabit(${i})">
          ${active ? '✓ I do this' : 'I do this'}
        </button>
      </div>`;
  }).join('');
}

// ─── TAB NAVIGATION ──────────────────────────────────────────────────────────
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

// ─── RESET ───────────────────────────────────────────────────────────────────
function resetApp() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  localStorage.removeItem('deathclock');
  state = {}; tasks = []; goals = []; habitActive = new Array(HABITS.length).fill(false);

  // Clear onboarding form
  ['dob','goals'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  ['sex','smoke','exercise','diet','sleep','stress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });

  // Clear dashboard displays
  ['cd-years','cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
    const el = document.getElementById(id); if(el) el.textContent = '--';
  });
  ['task-list','goals-list','habits-grid','week-grid'].forEach(id => {
    const el = document.getElementById(id); if(el) el.innerHTML = '';
  });

  document.getElementById('app').classList.remove('active');
  document.getElementById('onboarding').classList.add('active');
  showTab('dashboard');
}

// ─── BOOT: restore from localStorage ────────────────────────────────────────
(function init() {
  const saved = localStorage.getItem('deathclock');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      s.birthDate = new Date(s.birthDate);
      s.deathDate = new Date(s.deathDate);
      s.baseDeathDate = s.baseDeathDate ? new Date(s.baseDeathDate) : new Date(s.deathDate);
      state = s;
      // Migrate old string[] goals to object[]
      goals = (s.goals || []).map(g => typeof g === 'string' ? { text: g, priority: 'med' } : g);
      launchApp();
    } catch(e) { localStorage.removeItem('deathclock'); }
  }
})();
