/* Keshav Sharma — portfolio interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Theme ---------- */
  var themeBtn = $('#themeToggle');
  var metaTheme = $('meta[name="theme-color"]');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#07060b' : '#f7f4fc');
  }
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('ks-theme', next); } catch (e) {}
  });

  /* ---------- Header + mobile menu ---------- */
  var header = $('#header');
  var burger = $('#burger');
  var menu = $('#mobileMenu');

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 12); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
    } else {
      menu.classList.remove('is-open');
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 400);
    }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1060 && burger.getAttribute('aria-expanded') === 'true') setMenu(false); });

  /* ---------- Scroll spy ---------- */
  var links = $$('.nav__link');
  var sections = links.map(function (l) { return $(l.getAttribute('href')); }).filter(Boolean);
  function spy() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + current.id); });
  }
  spy();
  window.addEventListener('scroll', spy, { passive: true });

  /* ---------- Reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    $$('[data-count]').forEach(countUp);
  }

  /* ---------- Process line progress ---------- */
  var steps = $('#steps');
  function stepsProgress() {
    if (!steps) return;
    var r = steps.getBoundingClientRect();
    var p = (window.innerHeight * 0.75 - r.top) / (r.height + window.innerHeight * 0.25);
    steps.style.setProperty('--progress', Math.max(0, Math.min(1, p)).toFixed(3));
  }
  stepsProgress();
  window.addEventListener('scroll', stepsProgress, { passive: true });

  /* ---------- Service card cursor glow ---------- */
  $$('[data-glow]').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Pre-select project type from service links */
  var typeSelect = $('#f-type');
  $$('[data-project]').forEach(function (a) {
    a.addEventListener('click', function () { typeSelect.value = a.getAttribute('data-project'); });
  });

  /* ---------- Work filters ---------- */
  var filters = $$('.filter');
  var projects = $$('.project');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      projects.forEach(function (p) {
        var cats = (p.getAttribute('data-cat') || '').split(' ');
        var show = f === 'all' || cats.indexOf(f) > -1;
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('is-visible');
      });
    });
  });

  /* ---------- Testimonial slider ---------- */
  var track = $('#sliderTrack');
  var slides = $$('.t-card', track);
  var dotsWrap = $('#tDots');
  var index = 0, timer = null;
  var dots = slides.map(function (_, i) {
    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
    d.addEventListener('click', function () { go(i); restart(); });
    dotsWrap.appendChild(d);
    return d;
  });
  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    slides.forEach(function (s, n) { s.setAttribute('aria-hidden', String(n !== index)); });
    dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === index)); });
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(function () { go(index + 1); }, 6000);
  }
  $('#tPrev').addEventListener('click', function () { go(index - 1); restart(); });
  $('#tNext').addEventListener('click', function () { go(index + 1); restart(); });
  var slider = $('#slider');
  slider.addEventListener('mouseenter', function () { clearInterval(timer); });
  slider.addEventListener('mouseleave', restart);
  var sx = null;
  slider.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    sx = null;
  });
  go(0); restart();

  /* ---------- Contact form ---------- */
  var form = $('#contactForm');
  var statusEl = $('#formStatus');
  var submitBtn = $('#submitBtn');
  var msg = $('#f-msg');
  var counter = $('#msgCounter');
  var started = $('#f-started');

  /* Cloudflare Turnstile (enabled when the form has a site key) */
  var siteKey = (form.getAttribute('data-turnstile-sitekey') || '').trim();
  var captchaBox = $('#captcha');
  var captchaError = $('#captchaError');
  var widgetId = null;
  function renderCaptcha() {
    if (!window.turnstile) return;
    if (widgetId !== null) { window.turnstile.remove(widgetId); widgetId = null; }
    widgetId = window.turnstile.render('#turnstile', {
      sitekey: siteKey,
      theme: root.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
      callback: function () { captchaError.textContent = ''; }
    });
  }
  if (siteKey) {
    captchaBox.hidden = false;
    window.onTurnstileLoad = renderCaptcha;
    var ts = document.createElement('script');
    ts.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
    ts.async = true; ts.defer = true;
    document.head.appendChild(ts);
    themeBtn.addEventListener('click', function () { if (widgetId !== null) renderCaptcha(); });
  }
  function captchaToken() {
    return siteKey && window.turnstile && widgetId !== null ? window.turnstile.getResponse(widgetId) || '' : '';
  }
  function resetCaptcha() { if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId); }
  started.value = String(Date.now());

  msg.addEventListener('input', function () { counter.textContent = msg.value.length + ' / 2000'; });

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validateField(el) {
    var v = el.value.trim(), err = '';
    if (el.name === 'name') { if (v.length < 2) err = 'Please enter your name.'; }
    else if (el.name === 'email') { if (!EMAIL_RE.test(v)) err = 'Please enter a valid email address.'; }
    else if (el.name === 'projectType') { if (!v) err = 'Please choose a project type.'; }
    else if (el.name === 'description') { if (v.length < 10) err = 'Tell me a little more (at least 10 characters).'; }
    var field = el.closest('.field');
    field.classList.toggle('has-error', !!err);
    $('.field__error', field).textContent = err;
    el.setAttribute('aria-invalid', String(!!err));
    return !err;
  }
  var inputs = ['#f-name', '#f-email', '#f-type', '#f-msg'].map(function (s) { return $(s); });
  inputs.forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value) validateField(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
    el.addEventListener('change', function () { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
  });

  function setStatus(type, text) {
    statusEl.className = 'form__status' + (type ? ' is-' + type : '');
    statusEl.textContent = text || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');
    var ok = inputs.map(validateField).every(Boolean);
    if (!ok) {
      var firstBad = inputs.filter(function (el) { return el.getAttribute('aria-invalid') === 'true'; })[0];
      if (firstBad) firstBad.focus();
      return;
    }
    if (siteKey && !captchaToken()) {
      captchaError.textContent = 'Please complete the verification.';
      return;
    }

    var payload = {
      name: $('#f-name').value.trim(),
      email: $('#f-email').value.trim(),
      projectType: typeSelect.value,
      description: msg.value.trim(),
      website: $('#f-website').value,
      turnstileToken: captchaToken(),
      startedAt: Number(started.value)
    };

    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('aria-busy', 'true');

    fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (r) {
        if (r.ok && r.data.ok) {
          setStatus('success', r.data.message || 'Thanks! Your message has been sent. I\'ll get back to you within 24 hours.');
          form.reset();
          counter.textContent = '0 / 2000';
          started.value = String(Date.now());
        } else {
          if (r.data.errors) {
            Object.keys(r.data.errors).forEach(function (k) {
              var el = form.elements[k];
              if (!el) return;
              var field = el.closest('.field');
              field.classList.add('has-error');
              $('.field__error', field).textContent = r.data.errors[k];
            });
          }
          setStatus('error', r.data.error || 'Something went wrong. Please try again or email hello@keshavsharma.in.');
        }
      })
      .catch(function () {
        setStatus('error', 'Network error. Please check your connection and try again.');
      })
      .then(function () {
        resetCaptcha();
        submitBtn.classList.remove('is-loading');
        submitBtn.removeAttribute('aria-busy');
      });
  });

  /* Footer year */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
