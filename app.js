(() => {
  const projects = [
    ['Education','Monitoring & Evaluation','National-scale education evidence programme'],
    ['Governance','Research','Institutional systems and citizen experience study'],
    ['Agriculture','Data & Analytics','Agricultural livelihoods data collection and insight programme'],
    ['WASH','Field Research','Community water and sanitation assessment']
  ];
  const grid = document.getElementById('project-grid');
  const filters = document.querySelectorAll('[data-filter]');
  function render(filter='All') {
    const list = filter === 'All' ? projects : projects.filter(p => p[0] === filter);
    grid.innerHTML = list.map((p,i) => `<article class="project-card reveal-card"><div class="project-visual"><div class="noise"></div><div class="project-mark">0${i+1}</div><span>${p[0]}</span></div><div class="project-body"><div class="project-tag">${p[1]}</div><h3>${p[2]}</h3><a href="#contact">View case study <span>↗</span></a></div></article>`).join('');
    requestAnimationFrame(() => grid.querySelectorAll('.reveal-card').forEach((el,i) => setTimeout(() => el.classList.add('visible'), i*70)));
  }
  render();
  filters.forEach(btn => btn.addEventListener('click', () => { filters.forEach(b => b.classList.remove('active')); btn.classList.add('active'); render(btn.dataset.filter); }));

  const menu = document.getElementById('mobile-menu');
  document.getElementById('menu-open').addEventListener('click', () => { menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); document.body.classList.add('locked'); });
  document.getElementById('menu-close').addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  function closeMenu(){ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); }

  const progress = document.getElementById('progress');
  function onScroll(){
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${h ? scrollY/h : 0})`;
    document.getElementById('site-header').classList.toggle('scrolled', scrollY > 20);
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); }), {threshold:.12, rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const counter = document.querySelector('[data-count]');
  const countObserver = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting && !e.target.dataset.done){ e.target.dataset.done='1'; let n=0; const end=+e.target.dataset.count; const timer=setInterval(()=>{n++; e.target.textContent=n; if(n>=end) clearInterval(timer)},80); } }), {threshold:.8});
  if(counter) countObserver.observe(counter);

  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const note = document.getElementById('form-note');
    note.textContent = 'Thank you. Your enquiry is ready for submission once the production form endpoint is connected.';
    note.classList.add('show');
    e.target.reset();
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); history.replaceState(null,'',a.getAttribute('href')); }
  }));
})();
