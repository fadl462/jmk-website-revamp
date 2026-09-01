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

  // Native hand cursor stays visible on clickable elements. A small animated follower adds motion without obscuring UI.
  const cursor = document.getElementById('cursor');
  const cursorLabel = document.getElementById('cursor-label');
  if (cursorLabel) cursorLabel.style.display = 'none';
  if (cursor && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    let visible = false;
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      if (!visible) { cursor.classList.add('visible'); visible = true; }
    }, { passive: true });
    addEventListener('pointerleave', () => cursor.classList.remove('visible'));
    addEventListener('pointerenter', () => cursor.classList.add('visible'));
    const loop = () => {
      cx += (mx - cx) * .22; cy += (my - cy) * .22;
      cursor.style.left = `${cx}px`; cursor.style.top = `${cy}px`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a,button,.service-row,.sector-row,.project-card,.line-link,.text-arrow').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
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

  // Projects: real JMK corporate-experience examples sourced from the current site.
  const projects = [
    {sector:'Education',service:'Baseline Study',title:'Baseline Study of Pre-Tertiary Reform in Ghana',client:'BigWin Philanthropy / Ministry of Education Reform Secretariat',year:'2019',image:'https://static.wixstatic.com/media/573cbf_f6b01455385a4c278defc5324df72233~mv2.jpg/v1/fill/w_980%2Ch_458%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_f6b01455385a4c278defc5324df72233~mv2.jpg'},
    {sector:'Governance',service:'Research',title:'Research into the feasible Public-Private Partnership model for the establishment of a Commodity Exchange in Ghana',client:'Ghana Chamber of Commerce and Industry / BUSAC Fund',year:'2011',image:'https://static.wixstatic.com/media/573cbf_a4d627ba158043b49bdc9c2583e69d8e~mv2.jpg/v1/fill/w_980%2Ch_345%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_a4d627ba158043b49bdc9c2583e69d8e~mv2.jpg'},
    {sector:'Education',service:'Needs Assessment',title:'Needs assessment of community schools in 40 target cocoa growing communities in Ghana',client:'International Labour Organization',year:'2012',image:'https://static.wixstatic.com/media/573cbf_20165595bd854df3840a805988140485~mv2.png/v1/fill/w_980%2Ch_326%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_20165595bd854df3840a805988140485~mv2.png'},
    {sector:'Inclusion',service:'Gender Analysis',title:'Project-based participatory Gender analysis of the PAGES project',client:'Plan Ghana',year:'2011',image:'https://static.wixstatic.com/media/573cbf_f6b01455385a4c278defc5324df72233~mv2.jpg/v1/fill/w_980%2Ch_458%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_f6b01455385a4c278defc5324df72233~mv2.jpg'},
    {sector:'Governance',service:'Impact Assessment',title:'Development of performance management systems and governance assessments',client:'SEND Ghana / public-sector partners',year:'Selected experience',image:'https://static.wixstatic.com/media/573cbf_a4d627ba158043b49bdc9c2583e69d8e~mv2.jpg/v1/fill/w_980%2Ch_345%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_a4d627ba158043b49bdc9c2583e69d8e~mv2.jpg'},
    {sector:'Livelihoods',service:'Household Data Collection',title:'Data collection in the Savannah Region for the Ghana National Household Registry',client:'MOGCSP / GNHR',year:'2020',image:'https://static.wixstatic.com/media/573cbf_20165595bd854df3840a805988140485~mv2.png/v1/fill/w_980%2Ch_326%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_20165595bd854df3840a805988140485~mv2.png'},
    {sector:'Agriculture',service:'Baseline Survey',title:'Baseline survey of vulnerable farmer households for the Bono-Asante Atea (BAAT) project',client:'ADRA',year:'2019',image:'https://static.wixstatic.com/media/573cbf_f6b01455385a4c278defc5324df72233~mv2.jpg/v1/fill/w_980%2Ch_458%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_f6b01455385a4c278defc5324df72233~mv2.jpg'},
    {sector:'Education',service:'Evaluation',title:'Baseline evaluation of Making Ghanaian Girls Great (MGCubed) project',client:'Social Impact / Varkey Foundation',year:'2018',image:'https://static.wixstatic.com/media/573cbf_a4d627ba158043b49bdc9c2583e69d8e~mv2.jpg/v1/fill/w_980%2Ch_345%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/573cbf_a4d627ba158043b49bdc9c2583e69d8e~mv2.jpg'}
  ];
  const grid = document.getElementById('project-grid');
  function render(filter = 'All') {
    const list = filter === 'All' ? projects : projects.filter(p => p.sector === filter);
    if (!grid) return;
    grid.innerHTML = list.map((p, i) => `
      <article class="project-card">
        <div class="project-visual" style="--project-image:url('${p.image}')"><span class="project-number">${String(i + 1).padStart(2,'0')}</span><span class="project-sector">${p.sector}</span></div>
        <div class="project-body"><span class="project-tag">${p.service} · ${p.year}</span><h3>${p.title}</h3><p class="project-client">${p.client}</p><a href="https://www.jmkconsultinggroup.com/featured-projects" target="_blank" rel="noopener">View JMK experience ↗</a></div>
      </article>`).join('');
    requestAnimationFrame(() => grid.querySelectorAll('.project-card').forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 65)));
  }
  render();
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); render(btn.dataset.filter);
  }));

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
