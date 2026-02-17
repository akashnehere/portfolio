const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const themeCycleBtn = document.getElementById('themeCycleBtn');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const THEME_KEY = 'portfolio-theme-mode';
const THEME_ORDER = ['auto', 'dark', 'light'];
const THEME_ICONS = {
  auto: '<i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>',
  dark: '<i class="fa-regular fa-moon" aria-hidden="true"></i>',
  light: '<i class="fa-regular fa-sun" aria-hidden="true"></i>'
};

const media = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;

let themeMode = 'auto';

const readStore = (key, fallback = null) => {
  try {
    const value = window.localStorage.getItem(key);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
};

const writeStore = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
};

const themeByTime = () => {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? 'light' : 'dark';
};

const resolvedTheme = () => {
  if (themeMode === 'dark' || themeMode === 'light') return themeMode;
  if (media) return media.matches ? 'dark' : 'light';
  return themeByTime();
};

const applyTheme = () => {
  const applied = resolvedTheme();
  document.documentElement.setAttribute('data-theme', applied);

  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', applied === 'dark' ? '#0f172a' : '#f7faff');
  }

  if (!themeCycleBtn) return;
  themeCycleBtn.innerHTML = THEME_ICONS[themeMode] || THEME_ICONS.auto;
  const label = themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
  themeCycleBtn.setAttribute('title', label);
  themeCycleBtn.setAttribute('aria-label', label);
};

const initTheme = () => {
  const stored = readStore(THEME_KEY, 'auto');
  if (THEME_ORDER.includes(stored)) {
    themeMode = stored;
  }
  applyTheme();
};

initTheme();

if (themeCycleBtn) {
  themeCycleBtn.addEventListener('click', () => {
    const index = THEME_ORDER.indexOf(themeMode);
    themeMode = THEME_ORDER[(index + 1) % THEME_ORDER.length];
    writeStore(THEME_KEY, themeMode);
    applyTheme();
  });
}

if (media) {
  const onChange = () => {
    if (themeMode === 'auto') applyTheme();
  };
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onChange);
  }
} else {
  window.setInterval(() => {
    if (themeMode === 'auto') applyTheme();
  }, 60 * 60 * 1000);
}

if (menuBtn && mobileMenu) {
  const setOpen = (open) => {
    mobileMenu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  menuBtn.addEventListener('click', () => {
    setOpen(!mobileMenu.classList.contains('open'));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (mobileMenu.contains(event.target) || menuBtn.contains(event.target)) return;
    setOpen(false);
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const revealNodes = document.querySelectorAll('[data-reveal]');
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

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
}

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
