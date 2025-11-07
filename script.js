// ===== Data =====
const STEDEN = ["Amsterdam","Rotterdam","Utrecht","Den Haag","Eindhoven","Groningen","Nijmegen","Haarlem","Tilburg","Breda","Leiden","Zwolle","Arnhem","’s-Hertogenbosch","Amersfoort","Enschede","Delft","Maastricht","Leeuwarden","Almere","Apeldoorn"];
const DAGEN = ["Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag"];
const SPORTS = ["Padel","Tennis","Boulderen","Klimmen","Wandelen","Bootcamp","Boksen","Yoga","Suppen","Kanoën","Bowlen","Lasergame"];
const ACTIVITEITEN = {
  actief: {
    desc: "Voor de groepsbinding en de dopamine.",
    image: "images/Tennis.webp",
    imageAlt: "Actief & energiek",
    items: [
      "Padel","Boulderen","Wielrennen","Boksen","Tennis","Bootcamp","Zaalvoetbal","Basketbal","Trailrun","HIIT-training","Beachvolleybal","Klimmen","Spinning","Kickboksen","Roeien","Squash","Hindernisbaan","Ski/Snowboarden","Rolschaatsen","Mountainbiken"
    ]
  },
  licht: {
    desc: "Ideaal voor kennismaken en een goed gesprek.",
    image: "images/Shuffleboard.webp",
    imageAlt: "Licht & toegankelijk",
    items: [
      "City walk","Yoga","Suppen","Poolen","Discgolf","Sjoelen","Pitch & Putt","Boswandeling","Golf","Jeu de boules","Shuffleboard","Biljart","Curling (indoor)","Picknick"
    ]
  },
  sociaal: {
    desc: "Niet de sportprestaties, maar een spelelement.",
    image: "images/darts.webp",
    imageAlt: "Sociaal & fun",
    items: [
      "Bowlen","Mini-golf","Lasergamen","Darten","Arcadehal","Bordspellen","Pubquiz","Paintball","VR-games","Escaperoom","Karten","Tafeltennis","Spelletjescafé"
    ]
  }
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
  if(!el) return;
  arr.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; el.appendChild(o); });
}

// ===== Activities render =====
function renderActivities(key, scope){
  const data = ACTIVITEITEN[key];
  if(!data || !scope) return;
  const descEl = $('.activitiesDesc', scope);
  const listEl = $('.activitiesList', scope);
  if(!descEl || !listEl) return;
  const contentWrap = scope.closest('.benefits-content');
  const imageEl = contentWrap ? $('.activities-image', contentWrap) : null;
  descEl.textContent = data.desc;
  listEl.innerHTML = '';
  const columns = [];
  for(let i = 0; i < data.items.length; i += 7){
    columns.push(data.items.slice(i, i + 7));
  }
  columns.forEach(colItems => {
    const col = document.createElement('ul');
    colItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      col.appendChild(li);
    });
    listEl.appendChild(col);
  });
  if(imageEl && data.image){
    imageEl.src = data.image;
    imageEl.alt = data.imageAlt || data.desc;
  }
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

  // Activities (support meerdere scopes)
  $$('.activities-scope').forEach(scope => {
    // Default render
    const defaultBtn = $('.pill.active', scope) || $('.pill', scope);
    const defaultKey = defaultBtn ? defaultBtn.dataset.tab : 'actief';
    renderActivities(defaultKey, scope);
    // Bind events per scope
    $$('.pill', scope).forEach(btn => btn.addEventListener('click', () => {
      $$('.pill', scope).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderActivities(btn.dataset.tab, scope);
    }));
  });

  // FAQ
  $$('.faq-item').forEach(item => {
    const btn = $('.faq-btn', item);
    btn.addEventListener('click', () => item.classList.toggle('open'));
  });

  // Sticky CTA: geen custom click, Tally data-attributen openen popup
  // Sticky close verwijderd

  // Modal events verwijderd
});


