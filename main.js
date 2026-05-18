/* ======================================================
   JUSTIZMINISTERIUM – HAUPT-JAVASCRIPT
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HEADER SCROLL EFFEKT ---------- */
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
      scrollTopBtn?.classList.add('visible');
    } else {
      header?.classList.remove('scrolled');
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- HAMBURGER / MOBILE NAV ---------- */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !mobileNav?.contains(e.target)) {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    }
  });

  /* ---------- AKTIVER NAV LINK ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- AKKORDEON ---------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body   = header.nextElementSibling;
      const isOpen = header.classList.contains('active');

      document.querySelectorAll('.accordion-header.active').forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling?.classList.remove('open');
      });

      if (!isOpen) {
        header.classList.add('active');
        body?.classList.add('open');
      }
    });
  });

  /* ---------- BEWERBUNGSFORMULAR ---------- */
  const appForm = document.getElementById('bewerbungsformular');
  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('form-success');
      successMsg?.classList.add('visible');
      appForm.reset();
      appForm.style.display = 'none';
      successMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- BÜRGER SERVICE FORMULARE ---------- */
  ['anzeige-form', 'anwalt-form', 'beschwerde-form'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successId = id.replace('-form', '-success');
      const successEl = document.getElementById(successId);
      successEl?.classList.add('visible');
      form.reset();
      form.style.display = 'none';
      successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ---------- ZAHL-ANIMATION (HERO STATS) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el      = entry.target;
          const target  = parseInt(el.dataset.count, 10);
          const suffix  = el.dataset.suffix || '';
          const prefix  = el.dataset.prefix || '';
          const duration = 1800;
          const step    = Math.ceil(target / (duration / 16));
          let current   = 0;
          const timer   = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = prefix + current.toLocaleString('de-DE') + suffix;
            if (current >= target) clearInterval(timer);
          }, 16);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ---------- SMOOTH SCROLL FÜR ANKER ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 88;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- TICKER DUPLIKATION ---------- */
  const tickerInner = document.querySelector('.ticker-inner');
  if (tickerInner) {
    tickerInner.innerHTML += tickerInner.innerHTML;
  }

  /* ---------- TAB SYSTEM ---------- */
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tabTarget;
      const tabGroup = btn.closest('[data-tab-group]')?.dataset.tabGroup;

      document.querySelectorAll(`[data-tab-group="${tabGroup}"] [data-tab-target]`).forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`[data-tab-content="${tabGroup}"]`).forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const content = document.getElementById(targetId);
      if (content) content.style.display = 'block';
    });
  });

});
