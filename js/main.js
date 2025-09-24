document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  mobileBtn && mobileBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });

  // Sticky header hide on scroll down
  const header = document.querySelector('.header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (current <= 0) header.classList.remove('scrolled');
    if (current > lastScroll) header.style.transform = 'translateY(-100%)';
    else header.style.transform = 'translateY(0)';
    if (current > 10) header.classList.add('scrolled');
    lastScroll = current;
  });

  // Animate ticker numbers on view
  function animateValue(el, start, end, duration) {
    let startTs = null;
    const step = ts => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      el.textContent = val.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const tickerVals = document.querySelectorAll('.ticker-value');
  if (tickerVals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = e.target;
          const value = parseInt(target.getAttribute('data-target'), 10);
          animateValue(target, 0, value, 1500);
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    tickerVals.forEach(v => obs.observe(v));
  }

  // ROI calculator
  const adSpend = document.getElementById('adSpend');
  const adSpendValue = document.getElementById('adSpendValue');
  const projectedLeads = document.getElementById('projectedLeads');
  const projectedRevenue = document.getElementById('projectedRevenue');
  const projectedROI = document.getElementById('projectedROI');
  let roiChart;

  function updateROIChart(leads, revenue) {
    const canvas = document.getElementById('roiChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const labels = ['Q1','Q2','Q3','Q4'];
    const leadData = labels.map((_, i) => Math.round(leads * (0.7 + i * 0.2) * (0.9 + Math.random() * 0.2)));
    const revenueData = labels.map((_, i) => Math.round(revenue * (0.7 + i * 0.1) * (0.9 + Math.random() * 0.2)));
    if (roiChart) {
      roiChart.data.datasets[0].data = leadData;
      roiChart.data.datasets[1].data = revenueData;
      roiChart.update();
      return;
    }
    roiChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Leads', data: leadData, borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.1)', borderWidth:2, tension:.3, fill:true },
          { label: 'Revenue ($)', data: revenueData, borderColor:'#8b5cf6', backgroundColor:'rgba(139,92,246,0.1)', borderWidth:2, tension:.3, fill:true },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  function updateROI() {
    if (!adSpend) return;
    const spend = parseInt(adSpend.value, 10);
    const leads = Math.round((spend / 50) * (0.85 + Math.random() * 0.3));
    const revenue = Math.round(leads * 500 * (0.7 + Math.random() * 0.6));
    const roi = Math.max(0, Math.round(((revenue - spend) / spend) * 100));
    adSpendValue.textContent = spend.toLocaleString();
    projectedLeads.textContent = leads.toLocaleString();
    projectedRevenue.textContent = revenue.toLocaleString();
    projectedROI.textContent = roi.toLocaleString();
    updateROIChart(leads, revenue);
  }
  adSpend && adSpend.addEventListener('input', updateROI);
  updateROI();

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        const el = document.querySelector(id);
        if (!el) return;
        if (mainNav && mainNav.classList.contains('active')) mainNav.classList.remove('active');
        window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }
    })
  })

  // Hero mini visualization (canvas)
  function initViz() {
    const container = document.getElementById('data-visualization');
    if (!container) return;
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    }

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      // grid
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      for (let x = 0; x <= w; x += w/10) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for (let y = 0; y <= h; y += h/6) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
      // points
      const n = 12, pad = 36; const pts = [];
      for (let i=0;i<n;i++){ const x = pad + i*(w-2*pad)/(n-1); const y = h - pad - Math.random()*(h-2*pad)*0.8; pts.push({x,y}); }
      // line
      ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
      pts.forEach((p,i)=>{ if(!i) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
      ctx.stroke();
      // dots
      pts.forEach((p,i)=>{ ctx.beginPath(); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
    }

    window.addEventListener('resize', resize);
    resize();
  }
  initViz();

  // Reveal cards on scroll
  const revealEls = document.querySelectorAll('.service-card, .pillar-card');
  revealEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = 'opacity .6s ease, transform .6s ease'; });
  function reveal() {
    revealEls.forEach(el => { const top = el.getBoundingClientRect().top; if (top < window.innerHeight - 140) { el.style.opacity='1'; el.style.transform='translateY(0)'; } });
  }
  reveal();
  window.addEventListener('scroll', reveal);

  // Theme toggle with localStorage persistence
  const root = document.documentElement;
  const toggleBtn = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', currentTheme);
  const setToggleIcon = () => {
    if (!toggleBtn) return;
    const i = toggleBtn.querySelector('i');
    if (!i) return;
    if (root.getAttribute('data-theme') === 'dark') { i.className = 'fas fa-sun'; }
    else { i.className = 'fas fa-moon'; }
  };
  setToggleIcon();
  toggleBtn && toggleBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setToggleIcon();
  });

  // Case studies filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-study-card');
  if (filterBtns.length && caseCards.length) {
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      caseCards.forEach(card => {
        const c = card.getAttribute('data-category');
        const show = cat === 'all' || cat === c;
        card.style.display = show ? '' : 'none';
      });
    }));
  }
});
