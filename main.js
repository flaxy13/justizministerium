/* ======================================================
   JUSTIZMINISTERIUM – HAUPT-JAVASCRIPT
   ====================================================== */

/* ========== DISCORD WEBHOOK KONFIGURATION ========== */
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1506128469271117878/83qj8G9Z1p1_FwWoA2pYoQoSLZ1A2qduTszii2__NDoU_OmLMZQCZ42wWj9U7TDZvK-F';

async function sendWebhook(embed) {
  try {
    const res = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
    if (!res.ok) console.warn('Webhook HTTP-Fehler:', res.status);
  } catch (err) {
    console.warn('Webhook konnte nicht gesendet werden:', err);
  }
}

// Hilfsfunktion: Alle Formularwerte der Reihe nach auslesen
function getVals(form) {
  return [...form.querySelectorAll('input:not([type=submit]), select, textarea')]
    .map(el => el.value.trim() || '–');
}

// Zeitstempel für Discord
function timestamp() {
  return new Date().toISOString();
}

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

  /* ========================================================
     BEWERBUNGSFORMULAR → DISCORD WEBHOOK
  ======================================================== */
  const appForm = document.getElementById('bewerbungsformular');
  if (appForm) {
    appForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = getVals(appForm);
      // v[0]=Name, v[1]=Discord, v[2]=Alter, v[3]=Spielzeit, v[4]=Position,
      // v[5]=Motivation, v[6]=Erfahrungen, v[7]=Strafregister, v[8]=Anmerkungen

      await sendWebhook({
        title: '📋 Neue Bewerbung eingegangen',
        color: 13150283, // Gold #c8a84b
        timestamp: timestamp(),
        footer: { text: 'Justizministerium Berlin · Bewerbungsportal' },
        fields: [
          { name: '👤 Name (IC)',             value: v[0],  inline: true  },
          { name: '🎮 Discord-Tag',           value: v[1],  inline: true  },
          { name: '🎂 Alter (IC)',             value: v[2],  inline: true  },
          { name: '⏱️ Spielzeit auf Server',  value: v[3],  inline: true  },
          { name: '💼 Angestrebte Position',  value: v[4],  inline: false },
          { name: '✍️ Motivation',            value: v[5].substring(0,1024), inline: false },
          { name: '📚 Erfahrungen',           value: v[6].substring(0,1024), inline: false },
          { name: '⚖️ Strafregister',         value: v[7],  inline: true  },
          { name: '📝 Anmerkungen',           value: v[8].substring(0,512), inline: false },
        ]
      });

      const successMsg = document.getElementById('form-success');
      successMsg?.classList.add('visible');
      appForm.reset();
      appForm.style.display = 'none';
      successMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ========================================================
     ANZEIGE FORMULAR → DISCORD WEBHOOK
  ======================================================== */
  const anzeigForm = document.getElementById('anzeige-form');
  if (anzeigForm) {
    anzeigForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = getVals(anzeigForm);
      // v[0]=Name, v[1]=Discord, v[2]=Beschuldigter, v[3]=Tatzeit,
      // v[4]=Tatort, v[5]=Beschreibung, v[6]=Zeugen, v[7]=Beweise

      await sendWebhook({
        title: '🚨 Neue Strafanzeige eingegangen',
        color: 16711680, // Rot
        timestamp: timestamp(),
        footer: { text: 'Justizministerium Berlin · Bürger Service' },
        fields: [
          { name: '👤 Anzeigeerstatter (IC)', value: v[0], inline: true  },
          { name: '🎮 Discord-Tag',           value: v[1], inline: true  },
          { name: '🔍 Beschuldigte Person',   value: v[2], inline: true  },
          { name: '🕐 Tatzeit',               value: v[3], inline: true  },
          { name: '📍 Tatort',                value: v[4], inline: false },
          { name: '📄 Tathergang',            value: v[5].substring(0,1024), inline: false },
          { name: '👥 Zeugen',                value: v[6], inline: true  },
          { name: '🖼️ Beweise / Links',       value: v[7], inline: true  },
        ]
      });

      const successEl = document.getElementById('anzeige-success');
      successEl?.classList.add('visible');
      anzeigForm.reset();
      anzeigForm.style.display = 'none';
      successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ========================================================
     ANWALT FORMULAR → DISCORD WEBHOOK
  ======================================================== */
  const anwaltForm = document.getElementById('anwalt-form');
  if (anwaltForm) {
    anwaltForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = getVals(anwaltForm);
      // v[0]=Name, v[1]=Discord, v[2]=Art des Beistands,
      // v[3]=Beschreibung, v[4]=Dringlichkeit

      await sendWebhook({
        title: '⚖️ Anwalt-Anfrage eingegangen',
        color: 43520, // Grün
        timestamp: timestamp(),
        footer: { text: 'Justizministerium Berlin · Bürger Service' },
        fields: [
          { name: '👤 Antragsteller (IC)', value: v[0], inline: true  },
          { name: '🎮 Discord-Tag',        value: v[1], inline: true  },
          { name: '📋 Art des Beistands',  value: v[2], inline: false },
          { name: '⚡ Dringlichkeit',       value: v[4], inline: true  },
          { name: '📝 Situationsbeschreibung', value: v[3].substring(0,1024), inline: false },
        ]
      });

      const successEl = document.getElementById('anwalt-success');
      successEl?.classList.add('visible');
      anwaltForm.reset();
      anwaltForm.style.display = 'none';
      successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ========================================================
     BESCHWERDE FORMULAR → DISCORD WEBHOOK
  ======================================================== */
  const beschwerdeForm = document.getElementById('beschwerde-form');
  if (beschwerdeForm) {
    beschwerdeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = getVals(beschwerdeForm);
      // v[0]=Name, v[1]=Discord, v[2]=Art der Beschwerde,
      // v[3]=Aktenzeichen, v[4]=Beschreibung, v[5]=Beweise

      await sendWebhook({
        title: '📣 Beschwerde eingegangen',
        color: 16744448, // Orange
        timestamp: timestamp(),
        footer: { text: 'Justizministerium Berlin · Bürger Service' },
        fields: [
          { name: '👤 Beschwerdeführer (IC)', value: v[0], inline: true  },
          { name: '🎮 Discord-Tag',           value: v[1], inline: true  },
          { name: '📋 Art der Beschwerde',    value: v[2], inline: false },
          { name: '🗂️ Aktenzeichen',          value: v[3], inline: true  },
          { name: '📄 Beschreibung',          value: v[4].substring(0,1024), inline: false },
          { name: '🖼️ Beweise / Links',       value: v[5], inline: false },
        ]
      });

      const successEl = document.getElementById('beschwerde-success');
      successEl?.classList.add('visible');
      beschwerdeForm.reset();
      beschwerdeForm.style.display = 'none';
      successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

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
