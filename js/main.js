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
  var metaThemes = $$('meta[name="theme-color"]');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    metaThemes.forEach(function (m) { m.setAttribute('content', theme === 'dark' ? '#07060b' : '#f7f4fc'); });
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

  /* Hide header on scroll down, reveal on scroll up */
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = Math.max(window.scrollY, 0);
    header.classList.toggle('is-scrolled', y > 12);
    var menuOpen = burger.getAttribute('aria-expanded') === 'true';
    var focused = header.contains(document.activeElement) && document.activeElement !== document.body;
    if (y < 120 || menuOpen || focused) {
      header.classList.remove('is-hidden');
    } else if (y > lastY + 6) {
      header.classList.add('is-hidden');
    } else if (y < lastY - 6) {
      header.classList.remove('is-hidden');
    }
    if (Math.abs(y - lastY) > 6) lastY = y;
    ticking = false;
  }
  onScroll();
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

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
  var stepItems = steps ? $$('.step', steps) : [];
  function stepsProgress() {
    if (!steps) return;
    var vh = window.innerHeight;
    var r = steps.getBoundingClientRect();
    var w = window.innerWidth;
    var p;
    if (w > 820) {
      /* Horizontal line: fills left to right, each step lights up as the line reaches it */
      p = Math.max(0, Math.min(1, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      stepItems.forEach(function (s, i) {
        var at = Math.max(i / (stepItems.length - 1) - 0.05, 0.02);
        s.classList.toggle('is-active', p >= at);
      });
    } else {
      /* Stacked layouts: line (phones) fills top to bottom; a step lights up once it reaches 60% of the screen */
      var mark = vh * 0.6;
      p = Math.max(0, Math.min(1, (mark - r.top - 30) / Math.max(r.height - 60, 1)));
      stepItems.forEach(function (s) {
        var ic = $('.step__icon', s).getBoundingClientRect();
        s.classList.toggle('is-active', ic.top + ic.height / 2 <= mark);
      });
    }
    steps.style.setProperty('--progress', p.toFixed(3));
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

  /* ---------- Scroll progress line ---------- */
  /* Browsers with CSS scroll-driven animations animate the bar natively on the compositor
     (see .scroll-progress in style.css). Others get a JS fallback that eases toward the
     target every frame, so the bar glides instead of jumping between scroll events. */
  var progressBar = $('#scrollProgress');
  var nativeProgress = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
  if (progressBar && !nativeProgress) {
    var progressTarget = 0, progressCurrent = 0, progressRunning = false;
    function readProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressTarget = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    }
    function animateProgress() {
      var diff = progressTarget - progressCurrent;
      progressCurrent = Math.abs(diff) < 0.0005 ? progressTarget : progressCurrent + diff * 0.22;
      progressBar.style.transform = 'scaleX(' + progressCurrent + ')';
      if (progressCurrent !== progressTarget) requestAnimationFrame(animateProgress);
      else progressRunning = false;
    }
    function kickProgress() {
      readProgress();
      if (!progressRunning) { progressRunning = true; requestAnimationFrame(animateProgress); }
    }
    readProgress();
    progressCurrent = progressTarget;
    progressBar.style.transform = 'scaleX(' + progressCurrent + ')';
    window.addEventListener('scroll', kickProgress, { passive: true });
    window.addEventListener('resize', kickProgress);
  }

  /* ---------- Rotating headline word ---------- */
  var rotatorWords = $$('#rotator .rotator__word');
  if (rotatorWords.length > 1 && !reduceMotion) {
    var wordIndex = 0;
    setInterval(function () {
      if (document.hidden) return;
      var current = rotatorWords[wordIndex];
      wordIndex = (wordIndex + 1) % rotatorWords.length;
      var next = rotatorWords[wordIndex];
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.classList.add('is-active');
      setTimeout(function () { current.classList.remove('is-leaving'); }, 700);
    }, 2600);
  }

  /* ---------- Blur-up images ---------- */
  $$('.project__media img, .about__photo img, .portrait__frame img').forEach(function (img) {
    img.classList.add('blur-up');
    function done() { img.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });

  /* ---------- Custom cursor (mouse / trackpad only) ---------- */
  var cursor = $('#cursor');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursor && finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    var ring = $('.cursor__ring', cursor);
    var dot = $('.cursor__dot', cursor);
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('is-out');
      var t = e.target;
      var view = t.closest && t.closest('.project[data-project]');
      var hover = !view && t.closest && t.closest('a, button, [role="button"], label, select, .filter, summary');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-hover', !!hover);
    }, { passive: true });
    document.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
    document.documentElement.addEventListener('mouseleave', function () { cursor.classList.add('is-out'); });
    window.addEventListener('blur', function () { cursor.classList.add('is-out'); });
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget || e.relatedTarget.tagName === 'IFRAME') cursor.classList.add('is-out'); });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Project viewer ---------- */
  var modal = $('#projectModal');
  var dataEl = $('#projectData');
  var projectsData = {};
  try { projectsData = JSON.parse(dataEl.textContent); } catch (e) {}
  var projectIds = $$('.project[data-project]').map(function (p) { return p.getAttribute('data-project'); });
  var currentProject = null, lastTrigger = null;

  function setText(id, text) { $(id).textContent = text || ''; }
  function showImage(src, alt, thumbBtn) {
    var img = $('#pmImage');
    img.classList.remove('is-loaded');
    img.classList.add('blur-up');
    img.onload = function () { img.classList.add('is-loaded'); };
    img.src = src; img.alt = alt;
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
    $$('#pmThumbs button').forEach(function (b) { b.setAttribute('aria-current', String(b === thumbBtn)); });
  }
  function renderProject(id) {
    var d = projectsData[id];
    if (!d) return;
    currentProject = id;
    setText('#pmTag', d.tag);
    setText('#pmTitle', d.title);
    setText('#pmClient', d.client);
    setText('#pmYear', d.year);
    setText('#pmService', d.service);
    setText('#pmSummary', d.summary);
    setText('#pmChallenge', d.challenge);
    setText('#pmSolution', d.solution);
    var list = $('#pmDeliverables');
    list.innerHTML = '';
    (d.deliverables || []).forEach(function (item) {
      var li = document.createElement('li'); li.textContent = item; list.appendChild(li);
    });
    var thumbs = $('#pmThumbs');
    thumbs.innerHTML = '';
    var images = d.images || [];
    var firstBtn = null;
    if (images.length > 1) {
      images.forEach(function (src, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show image ' + (i + 1) + ' of ' + images.length);
        var t = document.createElement('img'); t.src = src; t.alt = ''; t.loading = 'lazy';
        b.appendChild(t);
        b.addEventListener('click', function () { showImage(src, d.title + ', image ' + (i + 1), b); });
        thumbs.appendChild(b);
        if (i === 0) firstBtn = b;
      });
    }
    showImage(images[0] || '', d.title, firstBtn);
    $('.pmodal__body').scrollTop = 0;
    $('.pmodal__inner').scrollTop = 0;
  }
  function openProject(id, trigger) {
    if (!modal || !projectsData[id]) return;
    lastTrigger = trigger || null;
    renderProject(id);
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
    header.classList.add('is-hidden');
  }
  function closeProject() {
    if (!modal || !modal.open) return;
    if (typeof modal.close === 'function') modal.close(); else { modal.removeAttribute('open'); onModalClosed(); }
  }
  function onModalClosed() {
    document.body.classList.remove('modal-open');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  function stepProject(dir) {
    var visible = projectIds.filter(function (id) { return !$('.project[data-project="' + id + '"]').classList.contains('is-hidden'); });
    if (!visible.length) visible = projectIds;
    var i = visible.indexOf(currentProject);
    renderProject(visible[(i + dir + visible.length) % visible.length]);
  }
  if (modal) {
    $$('.project[data-project]').forEach(function (card) {
      var id = card.getAttribute('data-project');
      card.addEventListener('click', function () { openProject(id, card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(id, card); }
      });
    });
    $('#pmClose').addEventListener('click', closeProject);
    $('#pmPrev').addEventListener('click', function () { stepProject(-1); });
    $('#pmNext').addEventListener('click', function () { stepProject(1); });
    $('#pmCta').addEventListener('click', function () {
      var d = projectsData[currentProject];
      if (d && typeSelect) {
        var opt = $$('option', typeSelect).filter(function (o) { return d.tag && o.value.indexOf(d.tag.split(' ')[0]) === 0; })[0];
        if (opt) typeSelect.value = opt.value;
      }
      lastTrigger = null;
      closeProject();
    });
    modal.addEventListener('close', onModalClosed);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeProject(); });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') stepProject(1);
      if (e.key === 'ArrowLeft') stepProject(-1);
    });
    var touchX = null;
    modal.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    modal.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 70 && e.target.closest('.pmodal__media')) stepProject(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }

  /* ---------- Floating WhatsApp ---------- */
  var wa = $('#waFab');
  if (wa) {
    var waNumber = (wa.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
    if (waNumber) {
      wa.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(wa.getAttribute('data-message') || '');
      wa.target = '_blank';
      wa.rel = 'noopener';
    } else {
      wa.setAttribute('aria-label', 'Chat with me — go to the contact form');
    }
    var heroEl = $('#home');
    var footerBottom = $('.footer__bottom');
    var contactEl = $('#contact');
    var waTick = false;
    function updateWa() {
      var pastHero = heroEl ? heroEl.getBoundingClientRect().bottom < window.innerHeight * 0.4 : window.scrollY > 600;
      var fb = footerBottom ? footerBottom.getBoundingClientRect().top < window.innerHeight : false;
      var cr = contactEl ? contactEl.getBoundingClientRect() : null;
      var inContact = cr ? cr.top < window.innerHeight * 0.6 && cr.bottom > window.innerHeight * 0.4 : false;
      wa.classList.toggle('is-visible', pastHero && !fb && !inContact);
      waTick = false;
    }
    updateWa();
    window.addEventListener('scroll', function () {
      if (!waTick) { waTick = true; requestAnimationFrame(updateWa); }
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = !item.classList.contains('is-open');
      $$('.faq__item.is-open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          $('.faq__q', other).setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* Footer year */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
