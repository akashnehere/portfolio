// Mobile navigation toggle (shown on smaller screens).
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.querySelector('.header');
const root = document.documentElement;
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeCycleBtn = document.getElementById('themeCycleBtn');
const THEME_MODE_KEY = 'portfolio-theme-mode';
const supportsMatchMedia = typeof window.matchMedia === 'function';
const darkScheme = supportsMatchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
let themeMode = 'auto';
const THEME_ORDER = ['auto', 'light', 'dark'];
const THEME_ICON_HTML = {
  auto: '<i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>',
  light: '<i class="fa-regular fa-sun" aria-hidden="true"></i>',
  dark: '<i class="fa-regular fa-moon" aria-hidden="true"></i>'
};

const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', theme === 'dark' ? '#0b0f19' : '#f8fafc');
  }
};

const getThemeByTime = () => {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? 'light' : 'dark';
};

const resolveTheme = () => {
  if (themeMode === 'light' || themeMode === 'dark') return themeMode;
  if (darkScheme) return darkScheme.matches ? 'dark' : 'light';
  return getThemeByTime();
};

const applyThemeMode = () => {
  const appliedTheme = resolveTheme();
  setTheme(appliedTheme);
  if (!themeCycleBtn) return;
  themeCycleBtn.innerHTML = THEME_ICON_HTML[themeMode] || THEME_ICON_HTML.auto;
  const modeText = `${themeMode.charAt(0).toUpperCase()}${themeMode.slice(1)}`;
  themeCycleBtn.setAttribute('aria-label', modeText);
  themeCycleBtn.setAttribute('title', modeText);
};

const saveThemeMode = () => {
  try {
    window.localStorage.setItem(THEME_MODE_KEY, themeMode);
  } catch (_) {
    // Ignore storage failures in private/restricted contexts.
  }
};

const loadThemeMode = () => {
  try {
    const stored = window.localStorage.getItem(THEME_MODE_KEY);
    if (stored === 'auto' || stored === 'light' || stored === 'dark') {
      themeMode = stored;
    }
  } catch (_) {
    // Ignore storage failures and use default.
  }
};

loadThemeMode();
applyThemeMode();

if (darkScheme) {
  const onSystemThemeChange = () => {
    if (themeMode === 'auto') applyThemeMode();
  };
  if (typeof darkScheme.addEventListener === 'function') {
    darkScheme.addEventListener('change', onSystemThemeChange);
  } else if (typeof darkScheme.addListener === 'function') {
    darkScheme.addListener(onSystemThemeChange);
  }
} else {
  window.setInterval(() => {
    if (themeMode === 'auto') applyThemeMode();
  }, 60 * 60 * 1000);
}

if (themeCycleBtn) {
  themeCycleBtn.addEventListener('click', () => {
    const currentIndex = THEME_ORDER.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    themeMode = THEME_ORDER[nextIndex];
    saveThemeMode();
    applyThemeMode();
  });
}

if (menuBtn && mobileMenu) {
  const setMenuState = (isOpen) => {
    mobileMenu.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('open');
    setMenuState(isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (mobileMenu.contains(event.target) || menuBtn.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });
}

// Keep copyright year current.
const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

// Subtle header state change after scroll.
const syncHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 18);
};

syncHeaderState();
window.addEventListener('scroll', syncHeaderState, { passive: true });

// Scroll reveal transitions inspired by modern portfolio motion patterns.
const revealGroups = document.querySelectorAll('section');
revealGroups.forEach((section) => {
  const targets = section.querySelectorAll('.section-title, .card, .tile, .journey-feature, .trip-card');
  targets.forEach((el, index) => {
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
  });
});

const revealTargets = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// Travel bike animation trigger when section enters viewport.
const travelSection = document.getElementById('travel');
if (travelSection && 'IntersectionObserver' in window) {
  const travelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          travelSection.classList.add('is-active');
        }
      });
    },
    { threshold: 0.35 }
  );
  travelObserver.observe(travelSection);
}
