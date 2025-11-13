// ===== Data =====
const STEDEN = ["Amsterdam","Rotterdam","Utrecht","Den Haag","Eindhoven","Groningen","Nijmegen","Haarlem","Tilburg","Breda","Leiden","Zwolle","Arnhem","’s-Hertogenbosch","Amersfoort","Enschede","Delft","Maastricht","Leeuwarden","Almere","Apeldoorn"];
const DAGEN = ["Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag"];
const SPORTS = ["Padel","Tennis","Boulderen","Klimmen","Wandelen","Bootcamp","Boksen","Yoga","Suppen","Kanoën","Bowlen","Lasergame"];
// Get activities from translations
function getActivities() {
  if (window.i18n && window.i18n.translations()) {
    return window.i18n.translations().activities || {};
  }
  return {};
}

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
  const activities = getActivities();
  const data = activities[key];
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

  // Activities (support meerdere scopes) - like original but with translations
  $$('.activities-scope').forEach(scope => {
    // Bind events per scope (like original)
    $$('.pill', scope).forEach(btn => {
      btn.addEventListener('click', function() {
        $$('.pill', scope).forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const activities = getActivities();
        if (activities[this.dataset.tab]) {
          renderActivities(this.dataset.tab, scope);
        }
      });
    });
    
    // Initial render - wait for translations
    function renderInitial() {
      const activities = getActivities();
      if (activities.actief) {
        const defaultBtn = $('.pill.active', scope) || $('.pill', scope);
        const defaultKey = defaultBtn ? defaultBtn.dataset.tab : 'actief';
        renderActivities(defaultKey, scope);
      } else {
        setTimeout(renderInitial, 200);
      }
    }
    setTimeout(renderInitial, 100);
  });
  
  // Re-render activities when language changes
  window.addEventListener('languageChanged', () => {
    $$('.activities-scope').forEach(scope => {
      const activeBtn = $('.pill.active', scope) || $('.pill', scope);
      const activeKey = activeBtn ? activeBtn.dataset.tab : 'actief';
      const activities = getActivities();
      if (activities[activeKey]) {
        renderActivities(activeKey, scope);
      }
    });
  });

  // FAQ - bind directly to buttons (works with translations)
  $$('.faq-item').forEach(item => {
    const btn = $('.faq-btn', item);
    if (btn) {
      btn.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });

  // Mobile menu toggle - use event delegation
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('mobile-menu-toggle') || e.target.closest('.mobile-menu-toggle')) {
      const toggle = e.target.classList.contains('mobile-menu-toggle') ? e.target : e.target.closest('.mobile-menu-toggle');
      const mobileNav = $('.mobile-nav');
      if (mobileNav) {
        mobileNav.classList.toggle('open');
        const icon = $('i', toggle);
        if(icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-times');
        }
      }
    }
    
    // Close menu when clicking a mobile nav link
    if (e.target.closest('.mobile-nav a') && !e.target.closest('.lang-switcher')) {
      const mobileNav = $('.mobile-nav');
      const mobileToggle = $('.mobile-menu-toggle');
      if(mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        const icon = $('i', mobileToggle);
        if(icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    }
  });

  // Sticky CTA: geen custom click, Tally data-attributen openen popup
  // Sticky close verwijderd

  // Modal events verwijderd
});


