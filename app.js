(() => {
  const body = document.body;
  const loader = document.getElementById('loader');
  const header = document.getElementById('site-header');
  const progress = document.getElementById('progress');

  // Intro loader: short, intentional, then get out of the user's way.
  let count = 0;
  const countEl = document.querySelector('.loader-count');
  const countTimer = setInterval(() => {
    count += 8;
    if (count >= 100) { count = 100; clearInterval(countTimer); setTimeout(() => loader?.classList.add('done'), 220); }
    if (countEl) countEl.textContent = String(count).padStart(2, '0');
  }, 28);

  // Custom cursor intentionally disabled in V14 to keep navigation and content unobstructed.
  const cursor = null;
  const cursorLabel = null;
  if (false) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursorLabel.style.left = `${mx}px`; cursorLabel.style.top = `${my}px`; });
    const loop = () => { cx += (mx - cx) * .16; cy += (my - cy) * .16; cursor.style.left = `${cx}px`; cursor.style.top = `${cy}px`; requestAnimationFrame(loop); };
    loop();
    const bindCursor = () => document.querySelectorAll('a,button,.service-row,.sector-row,.project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
    bindCursor();
  }

  // Hero title: fail-safe cinematic entrance. The title remains visible even if motion JS is unavailable.
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroLines = heroTitle.querySelectorAll('span');
    heroLines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(58px)';
      line.style.transition = `opacity .9s cubic-bezier(.16,1,.3,1) ${i * 120}ms, transform .9s cubic-bezier(.16,1,.3,1) ${i * 120}ms`;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => heroLines.forEach(line => { line.style.opacity = '1'; line.style.transform = 'none'; })));
  }

  // Scroll state.
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max ? scrollY / max : 0})`;
    header?.classList.toggle('scrolled', scrollY > 30);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal choreography.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { threshold: .12, rootMargin: '0px 0px -55px' });
  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

  // Stats counter.
  const counter = document.querySelector('[data-count]');
  if (counter) {
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';
      let n = 0; const end = Number(entry.target.dataset.count);
      const timer = setInterval(() => { n += 1; entry.target.textContent = n; if (n >= end) clearInterval(timer); }, 85);
    }), { threshold: .8 });
    counterObserver.observe(counter);
  }

  // Mobile menu.
  const menu = document.getElementById('mobile-menu');
  const openMenu = document.getElementById('menu-open');
  const closeMenu = document.getElementById('menu-close');
  const setMenu = open => { menu?.classList.toggle('open', open); body.classList.toggle('locked', open); };
  openMenu?.addEventListener('click', () => setMenu(true));
  closeMenu?.addEventListener('click', () => setMenu(false));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Magnetic controls.
  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .16}px, ${y * .16}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // Projects: varied visual language rather than identical cards.
  const projects = [
    ['Education','Monitoring & Evaluation','National-scale education evidence programme'],
    ['Governance','Research','Institutional systems and citizen experience study'],
    ['Agriculture','Data & Analytics','Agricultural livelihoods data and insight programme'],
    ['WASH','Field Research','Community water and sanitation assessment'],
    ['Education','Data Systems','Workforce data and decision-support study'],
    ['Governance','Impact Assessment','Public-sector programme learning and evaluation'],
    ['Agriculture','Field Research','Smallholder market and livelihoods research'],
    ['WASH','Monitoring & Evaluation','Water access and service quality assessment']
  ];
  const grid = document.getElementById('project-grid');
  function render(filter = 'All') {
    const list = filter === 'All' ? projects : projects.filter(p => p[0] === filter);
    if (!grid) return;
    grid.innerHTML = list.map((p, i) => `
      <article class="project-card">
        <div class="project-visual"><span class="project-number">${String(i + 1).padStart(2,'0')}</span><span class="project-sector">${p[0]}</span></div>
        <div class="project-body"><span class="project-tag">${p[1]}</span><h3>${p[2]}</h3><a href="#contact">View case study ↗</a></div>
      </article>`).join('');
    requestAnimationFrame(() => grid.querySelectorAll('.project-card').forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 65)));
  }
  render();
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); render(btn.dataset.filter);
  }));

  // Project hover label for the custom cursor.
  document.addEventListener('mouseover', e => {
    if (e.target.closest('.project-card')) cursorLabel?.classList.add('show');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('.project-card')) cursorLabel?.classList.remove('show');
  });

  // Native anchor scrolling with offset for fixed navigation.
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + scrollY - 82;
    scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));


  // Premium ambient motion: pointer + scroll parallax, intentionally subtle.
  const motionFine = matchMedia('(pointer:fine)').matches;
  let rafPending = false;
  const updateAmbient = () => {
    const root = document.documentElement;
    root.style.setProperty('--scroll-y', `${Math.min(scrollY, 1400)}px`);
    rafPending = false;
  };
  addEventListener('scroll', () => { if (!rafPending) { rafPending = true; requestAnimationFrame(updateAmbient); } }, {passive:true});
  updateAmbient();
  if (motionFine) {
    addEventListener('pointermove', e => {
      document.documentElement.style.setProperty('--pointer-x', `${e.clientX - innerWidth / 2}px`);
      document.documentElement.style.setProperty('--pointer-y', `${e.clientY - innerHeight / 2}px`);
    }, {passive:true});
  }

  // Tactile tilt on project cards; removed automatically on coarse pointers.
  if (motionFine) {
    document.addEventListener('pointermove', e => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -4;
      const ry = ((e.clientX - r.left) / r.width - .5) * 4;
      card.style.transform = `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }, {passive:true});
    document.addEventListener('pointerout', e => {
      const card = e.target.closest('.project-card');
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  // Prototype contact feedback.
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const note = document.getElementById('form-note');
    if (note) { note.textContent = 'Thank you. Your enquiry is ready for the production endpoint.'; note.classList.add('show'); }
    form.reset();
  });
})();


  // Active section navigation: the header quietly tracks the section in view.
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (navSections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
    navSections.forEach(section => navObserver.observe(section));
  }


// Hero visual responds to the pointer as a single composed instrument.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('mouseenter', () => heroVisual.classList.add('is-active'));
  heroVisual.addEventListener('mouseleave', () => heroVisual.classList.remove('is-active'));
}
