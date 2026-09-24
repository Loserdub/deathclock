// ─── REGIONAL LIFE EXPECTANCY BASE ──────────────────────────────────────────
const REGIONAL_BASE = {
  us:           { male: 74, female: 80 },
  uk:           { male: 79, female: 83 },
  canada:       { male: 80, female: 84 },
  australia:    { male: 81, female: 85 },
  japan:        { male: 82, female: 88 },
  germany:      { male: 79, female: 83 },
  france:       { male: 80, female: 85 },
  brazil:       { male: 72, female: 79 },
  india:        { male: 68, female: 71 },
  china:        { male: 75, female: 79 },
  mexico:       { male: 72, female: 78 },
  other:        { male: 73, female: 77 },
};

// ─── EXPANDED LIFESPAN ENGINE ────────────────────────────────────────────────
function calcLifespan(data) {
  const region = REGIONAL_BASE[data.country] || REGIONAL_BASE.other;
  let base = region[data.sex];

  // Body (Step 2)
  const smokeAdj  = [0, -4, -7, -10];
  const alcAdj    = [0, 0, -2, -5];
  const exAdj     = [0, 2, 3, 5];
  const dietAdj   = [0, 1, 2, 4];
  const sleepAdj  = [0, 1, 2];
  const bmiAdj    = parseInt(data.bmi); // -3 to +1

  base += smokeAdj[parseInt(data.smoke)]  || 0;
  base += alcAdj[parseInt(data.alcohol)]  || 0;
  base += exAdj[parseInt(data.exercise)]  || 0;
  base += dietAdj[parseInt(data.diet)]    || 0;
  base += sleepAdj[parseInt(data.sleep)]  || 0;
  base += bmiAdj;

  // Mind (Step 3)
  const stressAdj  = [0, 1, 3];
  const mhAdj      = [0, 1, 2];
  const socialAdj  = [0, 1, 3]; // loneliness is as deadly as smoking
  const jobAdj     = [0, 0, 1];
  const purposeAdj = [0, 1, 2]; // Ikigai research-backed +2

  base += stressAdj[parseInt(data.stress)]      || 0;
  base += mhAdj[parseInt(data.mentalhealth)]    || 0;
  base += socialAdj[parseInt(data.social)]      || 0;
  base += jobAdj[parseInt(data.jobsat)]         || 0;
  base += purposeAdj[parseInt(data.purpose)]    || 0;

  return Math.max(base, 50);
}

// ─── PHILOSOPHY SYSTEM ───────────────────────────────────────────────────────
const PHILOSOPHIES = {
  stoic: {
    label: 'Stoic',
    icon: '🏛',
    color: '#8b94ff',
    quotes: [
      { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
      { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
      { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
      { text: "We suffer more in imagination than in reality.", author: "Seneca" },
      { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
    ]
  },
  buddhist: {
    label: 'Buddhist',
    icon: '☸️',
    color: '#f4a53a',
    quotes: [
      { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "The Buddha" },
      { text: "The root of suffering is attachment.", author: "The Buddha" },
      { text: "In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go.", author: "Buddhist teaching" },
      { text: "Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened.", author: "The Buddha" },
    ]
  },
  existentialist: {
    label: 'Existentialist',
    icon: '🌀',
    color: '#e63946',
    quotes: [
      { text: "Life has no meaning a priori. Before you come alive, life is nothing; it's up to you to give it a meaning.", author: "Jean-Paul Sartre" },
      { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
      { text: "One must imagine Sisyphus happy.", author: "Albert Camus" },
      { text: "The most important kind of freedom is to be what you really are.", author: "Jim Morrison" },
      { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
    ]
  },
  faith: {
    label: 'Faith-Based',
    icon: '✝️',
    color: '#ffd166',
    quotes: [
      { text: "Teach us to number our days, that we may gain a heart of wisdom.", author: "Psalm 90:12" },
      { text: "For everything there is a season, and a time for every purpose under heaven.", author: "Ecclesiastes 3:1" },
      { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
      { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.", author: "Ralph Waldo Emerson" },
    ]
  },
  yolo: {
    label: 'YOLO',
    icon: '🔥',
    color: '#ff6b35',
    quotes: [
      { text: "Life is either a daring adventure or nothing.", author: "Helen Keller" },
      { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
      { text: "Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did.", author: "Mark Twain" },
      { text: "Do not go gentle into that good night. Rage, rage against the dying of the light.", author: "Dylan Thomas" },
    ]
  },
  nihilist: {
    label: 'Nihilist',
    icon: '∅',
    color: '#888aaa',
    quotes: [
      { text: "God is dead. God remains dead. And we have killed him.", author: "Friedrich Nietzsche" },
      { text: "To live is to suffer, to survive is to find some meaning in the suffering.", author: "Friedrich Nietzsche" },
      { text: "The world is will to power — and nothing besides!", author: "Friedrich Nietzsche" },
      { text: "Freedom is what you do with what's been done to you.", author: "Jean-Paul Sartre" },
    ]
  },
  humanist: {
    label: 'Humanist',
    icon: '🤝',
    color: '#2fcc74',
    quotes: [
      { text: "The purpose of human life is to serve, and to show compassion and the will to help others.", author: "Albert Schweitzer" },
      { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
      { text: "No one is born hating another person. Love comes more naturally to the human heart than its opposite.", author: "Nelson Mandela" },
      { text: "The life of every man is a diary in which he means to write one story, and writes another.", author: "J.M. Barrie" },
    ]
  },
};

const BUCKET_CAT_ICONS = {
  adventure: '🏔',
  relationships: '❤️',
  career: '🚀',
  creative: '🎨',
  health: '💪',
  spiritual: '🌿',
  travel: '✈️',
  learning: '📚',
};

// ─── STATE ───────────────────────────────────────────────────────────────────
let state = {};
let countdownInterval = null;
let currentStep = 1;
let bucketOnboard = []; // Temp bucket items during onboarding

const GOAL_EMOJIS = ['🎯','🌍','💪','💡','❤️','🚀','📚','🎨','🏆','🌱'];

const HABITS = [
  { icon:'🚬', name:'Smoking (daily)',          desc:'Each cigarette costs ~11 minutes of life expectancy.',              impact:-3,   unit:'yrs', negative:true  },
  { icon:'🍺', name:'Heavy Drinking',           desc:'Chronic heavy drinking reduces lifespan by 3–5 years.',             impact:-3,   unit:'yrs', negative:true  },
  { icon:'📱', name:'4+ Hours Screen Time',     desc:'Sedentary screen lifestyle associated with shorter lifespan.',      impact:-1,   unit:'yrs', negative:true  },
  { icon:'🍔', name:'Ultra-processed Diet',     desc:'Daily fast food linked to 2–4 year reduction in life expectancy.', impact:-2,   unit:'yrs', negative:true  },
  { icon:'😴', name:'Chronic Sleep Deprivation',desc:'Under 6h nightly: linked to 2–3 years shorter lifespan.',          impact:-2.5, unit:'yrs', negative:true  },
  { icon:'🏃', name:'Cardio Exercise (3x/wk)', desc:'Regular cardio adds 3–5 years to your life expectancy.',            impact:+4,   unit:'yrs', negative:false },
  { icon:'🏋️', name:'Strength Training',        desc:'Resistance training linked to +1–2 years via metabolic health.',   impact:+1.5, unit:'yrs', negative:false },
  { icon:'🥗', name:'Mediterranean Diet',       desc:'A Mediterranean diet is linked to +4 years of life.',              impact:+4,   unit:'yrs', negative:false },
  { icon:'😴', name:'Quality Sleep (7–9h)',     desc:'Consistent good sleep adds 2–3 years to your life expectancy.',    impact:+2.5, unit:'yrs', negative:false },
  { icon:'🧘', name:'Meditation / Mindfulness', desc:'Stress reduction via meditation linked to +1–2 years.',            impact:+1.5, unit:'yrs', negative:false },
  { icon:'👫', name:'Strong Social Bonds',      desc:'Loneliness is as deadly as smoking 15 cigarettes/day.',            impact:+3,   unit:'yrs', negative:false },
  { icon:'🌞', name:'Daily Sunlight / Vit D',   desc:'Regular sun exposure and Vit D linked to +1 year and lower cancer risk.', impact:+1, unit:'yrs', negative:false },
  { icon:'🚰', name:'Proper Hydration',         desc:'Adequate daily water intake linked to better cellular aging.',     impact:+0.5, unit:'yrs', negative:false },
  { icon:'🧠', name:'Continuous Learning',      desc:'Staying intellectually active linked to dementia prevention, +1–2 yrs.', impact:+1.5, unit:'yrs', negative:false },
];

let habitActive = new Array(HABITS.length).fill(false);
let tasks = [];
let goals = [];
let bucketList = [];

// ─── WIZARD NAVIGATION ────────────────────────────────────────────────────────
function wizardNext(fromStep) {
  if (fromStep === 1) {
    const dob = document.getElementById('dob').value;
    if (!dob) { alert('Please enter your date of birth.'); return; }
    const age = calcCurrentAge(new Date(dob));
    if (age < 1 || age > 120) { alert('Please enter a valid date of birth.'); return; }
  }
  goToStep(fromStep + 1);
}

function wizardBack(fromStep) {
  goToStep(fromStep - 1);
}

function goToStep(n) {
  // Hide current
  document.getElementById('step-' + currentStep).classList.remove('active');
  document.getElementById('step-' + currentStep).classList.add('exit');
  setTimeout(() => {
    document.getElementById('step-' + currentStep).classList.remove('exit');
  }, 300);

  // Update dots and lines
  updateStepIndicator(n);

  currentStep = n;

  // Show next
  const next = document.getElementById('step-' + n);
  next.classList.add('entering');
  next.classList.add('active');
  setTimeout(() => next.classList.remove('entering'), 300);
}

function updateStepIndicator(step) {
  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById('dot-' + i);
    dot.classList.toggle('active', i <= step);
    dot.classList.toggle('done', i < step);
  }
  for (let i = 1; i <= 4; i++) {
    const line = document.getElementById('line-' + i + '-' + (i+1));
    if (line) line.classList.toggle('done', i < step);
  }
}

function calcCurrentAge(birth) {
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// ─── BUCKET LIST (ONBOARDING) ─────────────────────────────────────────────────
function addBucketOnboard() {
  const input = document.getElementById('bucket-input-onboard');
  const cat   = document.getElementById('bucket-cat-input').value;
  const text  = input.value.trim();
  if (!text) return;
  bucketOnboard.push({ text, cat, done: false });
  input.value = '';
  renderBucketOnboard();
}

function removeBucketOnboard(i) {
  bucketOnboard.splice(i, 1);
  renderBucketOnboard();
}

function renderBucketOnboard() {
  const list = document.getElementById('bucket-list-onboard');
  if (!bucketOnboard.length) { list.innerHTML = ''; return; }
  list.innerHTML = bucketOnboard.map((b, i) => `
    <div class="bucket-onboard-item">
      <span class="bucket-cat-icon">${BUCKET_CAT_ICONS[b.cat]}</span>
      <span class="bucket-onboard-text">${b.text}</span>
      <button class="task-del" onclick="removeBucketOnboard(${i})">✕</button>
    </div>
  `).join('');
}

// ─── START CLOCK ─────────────────────────────────────────────────────────────
function startClock() {
  const dob = document.getElementById('dob').value;
  if (!dob) { goToStep(1); return; }

  const data = {
    dob,
    sex:         document.getElementById('sex').value,
    country:     document.getElementById('country').value,
    smoke:       document.getElementById('smoke').value,
    alcohol:     document.getElementById('alcohol').value,
    exercise:    document.getElementById('exercise').value,
    diet:        document.getElementById('diet').value,
    sleep:       document.getElementById('sleep').value,
    bmi:         document.getElementById('bmi').value,
    stress:      document.getElementById('stress').value,
    mentalhealth:document.getElementById('mentalhealth').value,
    social:      document.getElementById('social').value,
    jobsat:      document.getElementById('jobsat').value,
    purpose:     document.getElementById('purpose').value,
    philosophy:  document.getElementById('philosophy').value,
    legacyText:  document.getElementById('legacy-text').value.trim(),
    regretText:  document.getElementById('regret-text').value.trim(),
    dependents:  document.getElementById('dependents').value,
  };

  const lifespan = calcLifespan(data);
  const birthDate = new Date(dob);
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + lifespan);

  bucketList = [...bucketOnboard];

  state = { data, lifespan, birthDate, deathDate, baseDeathDate: new Date(deathDate) };

  const saveObj = {
    ...state,
    birthDate: birthDate.toISOString(),
    deathDate: deathDate.toISOString(),
    baseDeathDate: deathDate.toISOString(),
    goals,
    tasks,
    bucketList,
    habitActive,
  };
  localStorage.setItem('deathclock', JSON.stringify(saveObj));

  launchApp();
}

function launchApp() {
  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('app').classList.add('active');
  renderGoals();
  renderHabits();
  buildWeekGrid();
  renderBucketTab();
  updateDashboardStats();
  renderPhilosophyCard();
  renderRegretCard();
  startCountdown();
}

// ─── PHILOSOPHY CARD ──────────────────────────────────────────────────────────
function renderPhilosophyCard() {
  const phi = PHILOSOPHIES[state.data.philosophy] || PHILOSOPHIES.stoic;
  const card = document.getElementById('philosophy-card');
  const q = phi.quotes[Math.floor(Date.now() / 86400000) % phi.quotes.length];

  document.getElementById('phi-icon').textContent = phi.icon;
  document.getElementById('phi-label').textContent = phi.label + ' Philosophy';
  document.getElementById('phi-quote').textContent = `"${q.text}"`;
  document.getElementById('phi-author').textContent = `— ${q.author}`;
  card.style.setProperty('--phi-color', phi.color);
}

// ─── REGRET CARD ─────────────────────────────────────────────────────────────
function renderRegretCard() {
  const regret = state.data && state.data.regretText;
  const section = document.getElementById('regret-section');
  const card    = document.getElementById('regret-card');
  if (regret) {
    section.style.display = 'block';
    card.textContent = `"${regret}"`;
  } else {
    section.style.display = 'none';
  }
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
function updateDashboardStats() {
  const { birthDate, deathDate, baseDeathDate, lifespan } = state;
  const now = new Date();
  const totalMs  = baseDeathDate - birthDate;
  const livedMs  = now - birthDate;
  const pct      = Math.min(100, (livedMs / totalMs * 100)).toFixed(1);
  const remainMs = deathDate - now;
  const dayMs    = 86400000;
  const todayPct = (dayMs / remainMs * 100).toFixed(4);

  document.getElementById('death-date').textContent = deathDate.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  document.getElementById('lifespan-val').textContent = `~${lifespan} years`;
  document.getElementById('life-pct').textContent = `${pct}%`;
  document.getElementById('today-pct').textContent = `${todayPct}% of life left`;
  document.getElementById('urgency-text').textContent = `You have ${Math.round(remainMs / dayMs).toLocaleString()} days remaining`;

  // Urgency bar — % of THIS day already gone
  const dayProgress = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400 * 100;
  document.getElementById('urgency-fill').style.width = dayProgress.toFixed(2) + '%';

  setUrgencyMsg(remainMs);
}

function setUrgencyMsg(remainMs) {
  const days = Math.round(remainMs / 86400000);
  const phi  = state.data ? state.data.philosophy : null;
  const phiQuotes = phi && PHILOSOPHIES[phi] ? PHILOSOPHIES[phi].quotes : [];

  const msgs = [
    `Today is ${(1/days*100).toFixed(5)}% of your remaining life. Every hour counts.`,
    `You have ${days.toLocaleString()} days left. What will you make of today?`,
    `Time is the only non-renewable resource. Spend it wisely.`,
    `The clock doesn't pause. Neither should your dreams.`,
    phiQuotes.length ? `"${phiQuotes[(Math.floor(Date.now() / 86400000) + 1) % phiQuotes.length].text}"` : null,
  ].filter(Boolean);

  const idx = Math.floor(Date.now() / 86400000) % msgs.length;
  document.getElementById('urgency-msg').textContent = msgs[idx];
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
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

// ─── BUCKET LIST (TAB) ────────────────────────────────────────────────────────
function addBucketFromTab() {
  const input = document.getElementById('bucket-input-tab');
  const cat   = document.getElementById('bucket-cat-tab').value;
  const text  = input.value.trim();
  if (!text) return;
  bucketList.push({ text, cat, done: false });
  input.value = '';
  saveBucket();
  renderBucketTab();
}

function toggleBucket(i) {
  bucketList[i].done = !bucketList[i].done;
  saveBucket();
  renderBucketTab();
}

function deleteBucket(i) {
  bucketList.splice(i, 1);
  saveBucket();
  renderBucketTab();
}

function saveBucket() {
  const saved = JSON.parse(localStorage.getItem('deathclock') || '{}');
  saved.bucketList = bucketList;
  localStorage.setItem('deathclock', JSON.stringify(saved));
}

const BUCKET_MOTIVATIONS = [
  "Every item checked is a life fully lived.",
  "The clock is ticking. Which one will you chase this year?",
  "Regret nothing. Chase everything.",
  "Your bucket list is a letter to your future self.",
  "The only bucket list item you'll regret is the one you never tried.",
];

function renderBucketTab() {
  const grid = document.getElementById('bucket-list-tab');
  const doneCount = bucketList.filter(b => b.done).length;
  const total     = bucketList.length;

  // Update ring
  const circumference = 314; // 2πr ≈ 2 * 3.14159 * 50
  const offset = total > 0 ? circumference * (1 - doneCount / total) : circumference;
  const fill = document.getElementById('bucket-ring-fill');
  if (fill) fill.style.strokeDashoffset = offset;
  document.getElementById('bucket-done-count').textContent = doneCount;
  document.getElementById('bucket-ring-denom').textContent = `/ ${total}`;

  const motIdx = Math.floor(Date.now() / 86400000) % BUCKET_MOTIVATIONS.length;
  document.getElementById('bucket-motivation').textContent = total > 0 ? BUCKET_MOTIVATIONS[motIdx] : 'Add your first bucket list item above.';

  if (!bucketList.length) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:14px;">No items yet. Add your first above.</p>';
    return;
  }

  grid.innerHTML = bucketList.map((b, i) => `
    <div class="bucket-card ${b.done ? 'done' : ''}">
      <div class="bucket-card-top">
        <span class="bucket-cat-icon-lg">${BUCKET_CAT_ICONS[b.cat] || '🪣'}</span>
        <span class="bucket-cat-name">${b.cat}</span>
        <button class="task-del" onclick="deleteBucket(${i})">✕</button>
      </div>
      <p class="bucket-card-text ${b.done ? 'done-text' : ''}">${b.text}</p>
      <button class="bucket-toggle ${b.done ? 'active' : ''}" onclick="toggleBucket(${i})">
        ${b.done ? '✓ Done' : 'Mark as Done'}
      </button>
    </div>
  `).join('');
}

// ─── TASKS ────────────────────────────────────────────────────────────────────
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
  saveTasks();
  renderTasks();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  const saved = JSON.parse(localStorage.getItem('deathclock') || '{}');
  saved.tasks = tasks;
  localStorage.setItem('deathclock', JSON.stringify(saved));
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

// ─── GOALS ────────────────────────────────────────────────────────────────────
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
  const tab = document.getElementById('tab-goals-tab');
  if (tab) { tab.classList.add('flash'); setTimeout(() => tab.classList.remove('flash'), 700); }
}

function saveGoals() {
  if (state && state.data) {
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
  document.querySelectorAll('.priority-dropdown').forEach(d => d.remove());
}

function openPriorityMenu(i, el) {
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
    list.innerHTML = '<p style="color:var(--muted);font-size:14px;margin-bottom:20px;">No goals set. Add your life goals above.</p>';
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

// ─── HABITS ───────────────────────────────────────────────────────────────────
function toggleHabit(i) {
  habitActive[i] = !habitActive[i];
  renderHabits();
  if (state.baseDeathDate) {
    let totalAdjust = 0;
    habitActive.forEach((active, idx) => { if (active) totalAdjust += HABITS[idx].impact; });
    const adjDate = new Date(state.baseDeathDate);
    adjDate.setFullYear(adjDate.getFullYear() + Math.round(totalAdjust));
    state.deathDate = adjDate;
    updateDashboardStats();
    startCountdown();
    buildWeekGrid();
  }
  // Persist
  const saved = JSON.parse(localStorage.getItem('deathclock') || '{}');
  saved.habitActive = habitActive;
  localStorage.setItem('deathclock', JSON.stringify(saved));
}

function renderHabits() {
  const grid = document.getElementById('habits-grid');
  let totalAdjust = 0;
  habitActive.forEach((active, i) => { if (active) totalAdjust += HABITS[i].impact; });

  const sign = totalAdjust >= 0 ? '+' : '';
  const bannerCls = totalAdjust > 0 ? 'impact-pos' : totalAdjust < 0 ? 'impact-neg' : '';
  const banner = totalAdjust !== 0
    ? `<div class="habit-banner ${bannerCls}">Net habit impact: ${sign}${totalAdjust.toFixed(1)} years on your clock</div>`
    : `<div class="habit-banner-neutral">Toggle habits below to see their impact on your lifespan.</div>`;

  grid.innerHTML = banner + HABITS.map((h, i) => {
    const active = habitActive[i];
    const impactStr = (h.impact > 0 ? '+' : '') + h.impact + ' ' + h.unit;
    const impactCls = h.negative ? 'impact-neg' : 'impact-pos';
    return `
      <div class="habit-card ${active ? 'habit-active' : ''}">
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

// ─── TAB NAVIGATION ───────────────────────────────────────────────────────────
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function resetApp() {
  if (!confirm('Reset your DeathClock? All data will be lost.')) return;
  clearInterval(countdownInterval);
  countdownInterval = null;
  localStorage.removeItem('deathclock');
  state = {}; tasks = []; goals = []; bucketList = []; bucketOnboard = [];
  habitActive = new Array(HABITS.length).fill(false);
  currentStep = 1;

  // Reset wizard form
  ['dob','legacy-text','regret-text'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  ['sex','country','smoke','alcohol','exercise','diet','sleep','bmi',
   'stress','mentalhealth','social','jobsat','purpose','philosophy','dependents'].forEach(id => {
    const el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });

  // Reset step dots
  for (let i = 1; i <= 5; i++) {
    document.getElementById('step-' + i).classList.remove('active','entering','exit');
    document.getElementById('dot-' + i).classList.remove('active','done');
  }
  document.getElementById('step-1').classList.add('active');
  document.getElementById('dot-1').classList.add('active');
  for (let i = 1; i <= 4; i++) {
    const line = document.getElementById('line-' + i + '-' + (i+1));
    if (line) line.classList.remove('done');
  }

  // Clear counters
  ['cd-years','cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
    const el = document.getElementById(id); if(el) el.textContent = '--';
  });
  ['task-list','goals-list','habits-grid','week-grid','bucket-list-tab','bucket-list-onboard'].forEach(id => {
    const el = document.getElementById(id); if(el) el.innerHTML = '';
  });

  document.getElementById('app').classList.remove('active');
  document.getElementById('onboarding').classList.add('active');
  showTab('dashboard');
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
(function init() {
  const saved = localStorage.getItem('deathclock');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      s.birthDate    = new Date(s.birthDate);
      s.deathDate    = new Date(s.deathDate);
      s.baseDeathDate = s.baseDeathDate ? new Date(s.baseDeathDate) : new Date(s.deathDate);
      state = s;
      goals       = (s.goals       || []).map(g => typeof g === 'string' ? { text: g, priority: 'med' } : g);
      tasks       = s.tasks       || [];
      bucketList  = s.bucketList  || [];
      habitActive = s.habitActive || new Array(HABITS.length).fill(false);
      // Ensure habitActive length matches HABITS
      while (habitActive.length < HABITS.length) habitActive.push(false);
      launchApp();
      renderTasks();
    } catch(e) { localStorage.removeItem('deathclock'); }
  }
})();
