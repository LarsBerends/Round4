// ===== Data =====
const STEDEN = ["Amsterdam","Rotterdam","Utrecht","Den Haag","Eindhoven","Groningen","Nijmegen","Haarlem","Tilburg","Breda","Leiden","Zwolle","Arnhem","’s-Hertogenbosch","Amersfoort","Enschede","Delft","Maastricht","Leeuwarden","Almere","Apeldoorn"];
const DAGEN = ["Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag"];
const SPORTS = ["Padel","Tennis","Boulderen","Klimmen","Wandelen","Bootcamp","Boksen","Yoga","Suppen","Kanoën","Bowlen","Lasergame"];
// Get activities from translations
function getActivities() {
  try {
    if (window.i18n && window.i18n.translations()) {
      const trans = window.i18n.translations();
      if (trans && trans.activities) {
        return trans.activities;
      }
    }
  } catch (e) {
    console.error('Error getting activities:', e);
  }
  return {};
}

const THEMES = {
  sportief: { primary: '#ffc107', hover:'#e0ac06', from:'#ffc107', to:'#ffecb3', btnText:'#0f172a' }
};

// ===== Helpers =====
// Reuse helper functions if already defined (from i18n.js), otherwise define them
if (typeof window.$ === 'undefined') {
  window.$ = (sel, root=document) => root.querySelector(sel);
  window.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
}
const $ = window.$;
const $$ = window.$$;
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
  if (!activities || !activities[key]) {
    console.warn('Activities data not found for key:', key);
    return;
  }
  const data = activities[key];
  if(!data || !scope) return;
  const descEl = $('.activitiesDesc', scope);
  const listEl = $('.activitiesList', scope);
  if(!descEl || !listEl) {
    console.warn('Activities elements not found:', { descEl, listEl, scope });
    return;
  }
  const contentWrap = scope.closest('.benefits-content');
  const imageEl = contentWrap ? $('.activities-image', contentWrap) : null;
  
  // Set description
  if (data.desc) {
    descEl.textContent = data.desc;
  }
  
  // Clear and rebuild list
  listEl.innerHTML = '';
  if (data.items && data.items.length > 0) {
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
  }
  
  // Update image
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
  function initActivities() {
    const activities = getActivities();
    if (!activities || !activities.actief) {
      return false; // Translations not loaded yet, wait
    }
    
    $$('.activities-scope').forEach(scope => {
      const defaultBtn = $('.pill.active', scope) || $('.pill', scope);
      const defaultKey = defaultBtn ? defaultBtn.dataset.tab : 'actief';
      renderActivities(defaultKey, scope);
    });
    return true;
  }
  
  // Bind events using event delegation (works with dynamically translated content)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('pill') && e.target.dataset.tab) {
      const scope = e.target.closest('.activities-scope');
      if (!scope) return;
      $$('.pill', scope).forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderActivities(e.target.dataset.tab, scope);
    }
  });
  
  // Try to initialize activities - retry until translations are loaded
  function tryInitActivities() {
    if (!initActivities()) {
      setTimeout(tryInitActivities, 200);
    }
  }
  setTimeout(tryInitActivities, 300);
  
  // Re-render activities when language changes
  window.addEventListener('languageChanged', () => {
    setTimeout(() => {
      initActivities();
    }, 100);
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

  // Mobile menu toggle - bind directly to button
  const mobileToggle = $('.mobile-menu-toggle');
  const mobileNav = $('.mobile-nav');
  if(mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      const icon = $('i', mobileToggle);
      if(icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    
    // Close menu when clicking a mobile nav link
    $$('.mobile-nav a').forEach(link => {
      link.addEventListener('click', function() {
        if (!this.closest('.lang-switcher')) {
          mobileNav.classList.remove('open');
          const icon = $('i', mobileToggle);
          if(icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    });
  }

  // Sticky CTA: geen custom click, Tally data-attributen openen popup
  // Sticky close verwijderd

  // Modal events verwijderd
});


