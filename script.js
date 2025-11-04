// ===== Data =====
const STEDEN = ["Amsterdam","Rotterdam","Utrecht","Den Haag","Eindhoven","Groningen","Nijmegen","Haarlem","Tilburg","Breda","Leiden","Zwolle","Arnhem","’s-Hertogenbosch","Amersfoort","Enschede","Delft","Maastricht","Leeuwarden","Almere","Apeldoorn"];
const DAGEN = ["Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag"];
const SPORTS = ["Padel","Tennis","Boulderen","Klimmen","Wandelen","Bootcamp","Boksen","Yoga","Suppen","Kanoën","Bowlen","Lasergame"];
const ACTIVITEITEN = {
  licht: [
    { t: "Wandeling", d: "Bos, park of duinen" },
    { t: "City walk + koffie", d: "Kennis maken onderweg" },
    { t: "Yoga", d: "Stretch & focus (evt. instructeur)" },
    { t: "Jeu de boules", d: "Relaxed + borrel" },
    { t: "Suppen / kanoën", d: "Rustig water" },
    { t: "Pitch & putt / midgetgolf", d: "Laagdrempelig spel" }
  ],
  actief: [
    { t: "Padel / Tennis", d: "2 vs 2 = perfecte 4" },
    { t: "Bokszaktraining", d: "Energie + dopamine" },
    { t: "Boulderen / klimmen", d: "Uitdaging = bonding" },
    { t: "Bootcamp / HIIT", d: "In het park" },
    { t: "Trailrun / duinloop", d: "Frisse buitenlucht" },
    { t: "Winterdip + koffie", d: "Voor de durvers" }
  ],
  sociaal: [
    { t: "Lasergame / paintball", d: "Teamfun" },
    { t: "Beachvolley / zaalvoetbal", d: "Samen in beweging" },
    { t: "Bowlen", d: "Relaxed + drankjes" },
    { t: "Darten (kroeg)", d: "Gezellig en laagdrempelig" },
    { t: "Arcade / flipperkast", d: "Nostalgie + fun" },
    { t: "Pubquiz + 30m walk", d: "Combi brein & beweging" }
  ]
};

const THEMES = {
  sportief: { primary: '#ffc107', hover:'#e0ac06', from:'#ffc107', to:'#ffecb3', btnText:'#0f172a' }
};

// ===== Helpers =====
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const setVars = (theme) => {
  const t = THEMES[theme] || THEMES.sportief;
  const r = document.documentElement;
  r.style.setProperty('--primary', t.primary);
  r.style.setProperty('--primary-hover', t.hover);
  r.style.setProperty('--grad-from', t.from);
  r.style.setProperty('--grad-to', t.to);
  r.style.setProperty('--btn-text', t.btnText);
};

// ===== Populate selects =====
function populateSelect(el, arr){
  arr.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; el.appendChild(o); });
}

// ===== Activities render =====
function renderActivities(key){
  const grid = $('#activitiesGrid');
  grid.innerHTML = '';
  (ACTIVITEITEN[key] || []).forEach(({t,d}) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div style="font-size:14px; font-weight:600; color:#334155; margin-bottom:6px">${t}</div><p class="muted" style="font-size:14px">${d}</p>`;
    grid.appendChild(card);
  });
}

// ===== Form: geen validatie blokkade, Tally popup wordt gebruikt =====

// ===== Modal verwijderd (Tally handelt popups af) =====

// ===== Init =====
window.addEventListener('DOMContentLoaded', () => {
  // Theme (enkel sportief)
  setVars('sportief');

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Populate selects
  populateSelect($('#stad'), STEDEN);
  populateSelect($('#dag'), DAGEN);
  populateSelect($('#sport'), SPORTS);

  // Form: geen native submit/validatie nodig; Tally popup handlet de flow

  // Activities
  renderActivities('licht');
  $$('.pill').forEach(btn => btn.addEventListener('click', () => {
    $$('.pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderActivities(btn.dataset.tab);
  }));

  // FAQ
  $$('.faq-item').forEach(item => {
    const btn = $('.faq-btn', item);
    btn.addEventListener('click', () => item.classList.toggle('open'));
  });

  // Sticky CTA: geen custom click, Tally data-attributen openen popup
  // Sticky close verwijderd

  // Modal events verwijderd
});


