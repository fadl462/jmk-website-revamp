(() => {
  const body = document.body;
  const loader = document.getElementById('loader');
  let count = 0;
  const countTimer = setInterval(() => { count += 7; if (count >= 100) { count = 100; clearInterval(countTimer); setTimeout(() => loader.classList.add('done'), 250); } document.querySelector('.loader-count').textContent = String(count).padStart(2,'0'); }, 35);

  const cursor = document.getElementById('cursor');
  const cursorLabel = document.getElementById('cursor-label');
  if (cursor && matchMedia('(pointer:fine)').matches) {
    let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursorLabel.style.left=mx+'px'; cursorLabel.style.top=my+'px'; });
    const loop = () => { cx += (mx-cx)*.18; cy += (my-cy)*.18; cursor.style.left=cx+'px'; cursor.style.top=cy+'px'; requestAnimationFrame(loop); }; loop();
    document.querySelectorAll('a,button,.service-row,.sector-row,.project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
    document.querySelectorAll('.project-card').forEach(el => { el.addEventListener('mouseenter',()=>cursorLabel.classList.add('show')); el.addEventListener('mouseleave',()=>cursorLabel.classList.remove('show')); });
  }

  const header = document.getElementById('site-header');
  const progress = document.getElementById('progress');
  const onScroll = () => { const max = document.documentElement.scrollHeight-innerHeight; progress.style.transform=`scaleX(${max ? scrollY/max : 0})`; header.classList.toggle('scrolled',scrollY>30); };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.12, rootMargin:'0px 0px -50px'});
  document.querySelectorAll('.reveal-up').forEach(el=>observer.observe(el));

  const counter = document.querySelector('[data-count]');
  if (counter) { const co = new IntersectionObserver(entries => entries.forEach(e=>{ if(e.isIntersecting && !e.target.dataset.done){ e.target.dataset.done='1'; let n=0; const end=Number(e.target.dataset.count); const t=setInterval(()=>{n++;e.target.textContent=n;if(n>=end)clearInterval(t)},90); }}), {threshold:.8}); co.observe(counter); }

  const menu = document.getElementById('mobile-menu');
  document.getElementById('menu-open').addEventListener('click',()=>{menu.classList.add('open');body.classList.add('locked');});
  document.getElementById('menu-close').addEventListener('click',()=>{menu.classList.remove('open');body.classList.remove('locked');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');body.classList.remove('locked');}));

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect(); const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2; el.style.transform=`translate(${x*.18}px,${y*.18}px)`; });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });

  const projects=[
    ['Education','Monitoring & Evaluation','National-scale education evidence programme'],
    ['Governance','Research','Institutional systems and citizen experience study'],
    ['Agriculture','Data & Analytics','Agricultural livelihoods data and insight programme'],
    ['WASH','Field Research','Community water and sanitation assessment'],
    ['Education','Data Systems','Workforce data and decision-support study'],
    ['Governance','Impact Assessment','Public-sector programme learning and evaluation'],
    ['Agriculture','Field Research','Smallholder market and livelihoods research'],
    ['WASH','Monitoring & Evaluation','Water access and service quality assessment']
  ];
  const grid=document.getElementById('project-grid');
  function render(filter='All'){
    const list=filter==='All'?projects:projects.filter(p=>p[0]===filter);
    grid.innerHTML=list.map((p,i)=>`<article class="project-card"><div class="project-visual"><span class="project-number">${String(i+1).padStart(2,'0')}</span><span class="project-sector">${p[0]}</span></div><div class="project-body"><span class="project-tag">${p[1]}</span><h3>${p[2]}</h3><a href="#contact">View case study ↗</a></div></article>`).join('');
    requestAnimationFrame(()=>grid.querySelectorAll('.project-card').forEach((el,i)=>setTimeout(()=>el.classList.add('visible'),i*70)));
  }
  render();
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.filter);}));

  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',a.getAttribute('href'));}}));

  const form=document.getElementById('contact-form');
  form.addEventListener('submit',e=>{e.preventDefault();const note=document.getElementById('form-note');note.textContent='Thank you. Your enquiry has been captured in this prototype. Connect the production endpoint/CMS before launch.';note.classList.add('show');form.reset();});
})();
