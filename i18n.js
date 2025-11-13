// ===== i18n System =====
let currentLang = 'nl';
let translations = {};

// Helper functions - only declare if not already defined
if (typeof window.$ === 'undefined') {
  window.$ = (sel, root = document) => root.querySelector(sel);
  window.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
}
// Use window properties directly (no const to avoid redeclaration errors)
// In this file, we'll use window.$ and window.$$ directly

// Load translations from JSON file
async function loadTranslations(lang) {
  try {
    const response = await fetch(`translations/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
    translations = await response.json();
    return translations;
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to Dutch if English fails
    if (lang === 'en') {
      return await loadTranslations('nl');
    }
    throw error;
  }
}

// Detect language based on priority:
// 1. URL parameter ?lang=xx
// 2. localStorage round4_lang
// 3. navigator.language (check if 'en' or 'nl', default 'nl')
function detectLanguage() {
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang === 'nl' || urlLang === 'en') {
    // Remove parameter from URL without reload
    const newUrl = window.location.pathname + window.location.search.replace(/[?&]lang=[^&]*/, '').replace(/^&/, '?');
    window.history.replaceState({}, '', newUrl || window.location.pathname);
    return urlLang;
  }

  // Check localStorage
  const storedLang = localStorage.getItem('round4_lang');
  if (storedLang === 'nl' || storedLang === 'en') {
    return storedLang;
  }

  // Check navigator.language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  
  // Default to Dutch
  return 'nl';
}

// Set language and update everything
async function setLanguage(lang) {
  if (lang !== 'nl' && lang !== 'en') {
    console.warn('Invalid language:', lang);
    return;
  }

  currentLang = lang;
  localStorage.setItem('round4_lang', lang);
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Always load translations for the new language (in case switching from nl to en or vice versa)
  await loadTranslations(lang);

  // Update page title
  if (translations.meta && translations.meta.title) {
    document.title = translations.meta.title;
  }
  
  // Update meta tags
  updateMetaTags();

  // Apply translations
  translate();
  
  // Update language switcher active state
  updateLanguageSwitcher();
  
  // Trigger custom event for other scripts
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Translate all elements with data-i18n attributes
function translate() {
  // Translate elements with data-i18n
  window.$$('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.value = value;
      } else if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
        el.value = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Translate elements with data-i18n-html (for HTML content)
  window.$$('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.innerHTML = value;
    }
  });

  // Translate placeholder attributes
  window.$$('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.placeholder = value;
    }
  });

  // Translate aria-label attributes
  window.$$('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.setAttribute('aria-label', value);
    }
  });

  // Translate alt attributes
  window.$$('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.alt = value;
    }
  });

  // Translate meta tags with data-i18n-content
  window.$$('[data-i18n-content]').forEach(el => {
    const key = el.getAttribute('data-i18n-content');
    const value = getNestedValue(translations, key);
    if (value !== undefined) {
      el.setAttribute('content', value);
    }
  });
}

// Update meta tags separately (called after translations are loaded)
function updateMetaTags() {
  if (!translations.meta) return;
  
  // Update standard meta tags
  const metaTitle = window.$('meta[name="title"]');
  const metaDescription = window.$('meta[name="description"]');
  const metaKeywords = window.$('meta[name="keywords"]');
  
  if (metaTitle && translations.meta.title) {
    metaTitle.setAttribute('content', translations.meta.title);
  }
  if (metaDescription && translations.meta.description) {
    metaDescription.setAttribute('content', translations.meta.description);
  }
  if (metaKeywords && translations.meta.keywords) {
    metaKeywords.setAttribute('content', translations.meta.keywords);
  }
  
  // Update Open Graph tags
  const ogTitle = window.$('meta[property="og:title"]');
  const ogDescription = window.$('meta[property="og:description"]');
  
  if (ogTitle && translations.meta.title) {
    ogTitle.setAttribute('content', translations.meta.title);
  }
  if (ogDescription && translations.meta.description) {
    ogDescription.setAttribute('content', translations.meta.description);
  }
  
  // Update Twitter tags
  const twitterTitle = window.$('meta[property="twitter:title"]');
  const twitterDescription = window.$('meta[property="twitter:description"]');
  
  if (twitterTitle && translations.meta.title) {
    twitterTitle.setAttribute('content', translations.meta.title);
  }
  if (twitterDescription && translations.meta.description) {
    twitterDescription.setAttribute('content', translations.meta.description);
  }
}

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Update language switcher active state
function updateLanguageSwitcher() {
  window.$$('.lang-switcher-btn').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
      btn.style.opacity = '1';
      btn.style.fontWeight = '600';
    } else {
      btn.classList.remove('active');
      btn.style.opacity = '0.7';
      btn.style.fontWeight = '400';
    }
  });
}

// Initialize i18n system
async function initI18n() {
  const detectedLang = detectLanguage();
  await setLanguage(detectedLang);
}

// Export for use in other scripts
window.i18n = {
  currentLang: () => currentLang,
  translations: () => translations,
  setLanguage,
  loadTranslations,
  translate
};

// Language switcher event handlers - use event delegation
function setupLanguageSwitcher() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lang-switcher-btn') || e.target.closest('.lang-switcher-btn')) {
      const btn = e.target.classList.contains('lang-switcher-btn') ? e.target : e.target.closest('.lang-switcher-btn');
      if (btn && btn.dataset.lang) {
        const lang = btn.dataset.lang;
        if (lang === 'nl' || lang === 'en') {
          setLanguage(lang);
        }
      }
    }
  });
}

// Setup language switcher immediately (uses event delegation, so safe to call early)
setupLanguageSwitcher();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initI18n();
  });
} else {
  initI18n();
}

