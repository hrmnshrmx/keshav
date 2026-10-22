/* ==========================================================================
   Keshav Sharma — Animation Designer Portfolio
   Vanilla JavaScript: theme, navigation, motion, filters, modal, form
   ========================================================================== */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ======================================================================
       THEME — single source of truth, no flash (inline head script sets it
       first, this only reads/syncs the toggle UI)
       ====================================================================== */
    var themeToggle = document.getElementById('themeToggle');
    var sunIcon = document.querySelector('.theme-toggle__icon--sun');
    var moonIcon = document.querySelector('.theme-toggle__icon--moon');

    function readStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            /* storage unavailable — theme still applies for this session */
        }
    }

    function defaultTheme() {
        // Dark is the primary design and the default for all visitors.
        // Light is only used when the visitor explicitly chooses it.
        return 'dark';
    }

    function syncThemeUI(theme) {
        var isLight = theme === 'light';
        if (sunIcon) sunIcon.style.display = isLight ? 'none' : 'block';
        if (moonIcon) moonIcon.style.display = isLight ? 'block' : 'none';
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
            themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        syncThemeUI(theme);
    }

    // Current theme: whatever the head script already applied, else derive it.
    var currentTheme = document.documentElement.getAttribute('data-theme') ||
        readStoredTheme() || defaultTheme();
    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            storeTheme(next);
        });
    }

    /* ======================================================================
       MOBILE NAVIGATION
       ====================================================================== */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var header = document.getElementById('header');

    function setMenuOpen(open) {
        if (!navMenu || !navToggle) return;
        navMenu.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        // Never leave the header hidden behind an open menu
        if (open && header) header.classList.remove('is-hidden');
        var bars = navToggle.querySelectorAll('.nav__toggle-bar');
        if (bars.length === 3) {
            bars[0].style.transform = open ? 'translateY(6px) rotate(45deg)' : 'none';
            bars[1].style.opacity = open ? '0' : '1';
            bars[2].style.transform = open ? 'translateY(-6px) rotate(-45deg)' : 'none';
        }
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            setMenuOpen(!navMenu.classList.contains('is-open'));
        });

        // Close after selecting a destination
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMenuOpen(false);
            });
        });

        // Close on outside click
        document.addEventListener('click', function (event) {
            if (!navMenu.classList.contains('is-open')) return;
            if (navToggle.contains(event.target) || navMenu.contains(event.target)) return;
            setMenuOpen(false);
        });

        // Close on Escape
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        });

        // Reset when returning to desktop widths
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) setMenuOpen(false);
        });
    }

    /* ======================================================================
       STICKY HEADER STATE + SCROLL PROGRESS + ACTIVE NAV LINK
       ====================================================================== */
    var scrollProgress = document.getElementById('scrollProgress');
    // Pair each nav link with its section, then sort by real page position.
    // Nav order (About, Creations, Process…) differs from page order
    // (Tools, Creations, About…), so we must use document order here.
    var navPairs = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'))
        .map(function (link) {
            return { link: link, section: document.querySelector(link.getAttribute('href')) };
        })
        .filter(function (pair) {
            return pair.section;
        })
        .sort(function (a, b) {
            var pos = a.section.compareDocumentPosition(b.section);
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            return 0;
        });

    var sections = navPairs.map(function (pair) {
        return pair.section;
    });

    var ticking = false;
    var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    function onScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var delta = scrollTop - lastScrollTop;

        if (header) {
            header.classList.toggle('is-scrolled', scrollTop > 8);

            // Auto-hide: slide the header up when scrolling down, reveal it
            // when scrolling up. Ignore tiny scroll jitter and never hide
            // while the mobile menu is open.
            var menuOpen = navMenu && navMenu.classList.contains('is-open');
            var scrollingDown = delta > 2;
            var scrollingUp = delta < -2;

            if (scrollTop <= 8 || menuOpen) {
                header.classList.remove('is-hidden');
            } else if (scrollingDown && scrollTop > header.offsetHeight + 40) {
                header.classList.add('is-hidden');
            } else if (scrollingUp) {
                header.classList.remove('is-hidden');
            }
        }

        lastScrollTop = scrollTop < 0 ? 0 : scrollTop;

        if (scrollProgress) {
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
            scrollProgress.style.width = (ratio * 100) + '%';
        }

        // Back to top: appears after a meaningful scroll
        if (backToTop) {
            var showBackToTop = scrollTop > 600;
            if (showBackToTop && backToTop.hidden) {
                backToTop.hidden = false;
                // Let the transition run after the element becomes visible
                void backToTop.offsetWidth;
            }
            backToTop.classList.toggle('is-visible', showBackToTop);
        }

        // Active section: in page order, the last section whose top has
        // passed the header line. Everything before the first section counts
        // as the hero, so no link is active there.
        var offset = (header ? header.offsetHeight : 70) + 24;
        var activeSection = null;
        var activeTop = -Infinity;

        sections.forEach(function (section) {
            var top = section.getBoundingClientRect().top - offset;
            if (top <= 0 && top > activeTop) {
                activeTop = top;
                activeSection = section;
            }
        });

        // Special case: once the contact/footer area is reached, highlight
        // the last nav item even if the section top is still just below.
        var nearBottom = window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 2;
        if (nearBottom && sections.length) {
            activeSection = sections[sections.length - 1];
        }

        navPairs.forEach(function (pair) {
            pair.link.classList.toggle('is-active', pair.section === activeSection);
        });

        ticking = false;
    }

    function requestScroll() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }

    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll, { passive: true });
    onScroll();

    /* ======================================================================
       SMOOTH ANCHOR SCROLL (accounts for sticky header height)
       ====================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            var hash = this.getAttribute('href');
            if (!hash || hash === '#') return;
            var target = document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            var headerHeight = header ? header.offsetHeight : 0;
            var targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
            window.scrollTo({
                top: targetTop,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            if (history.replaceState) {
                history.replaceState(null, '', hash);
            }
        });
    });

    /* ======================================================================
       SCROLL REVEALS (IntersectionObserver, with JS-disabled safety)
       ====================================================================== */
    var revealTargets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach(function (el) {
            el.classList.add('is-visible');
        });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealTargets.forEach(function (el, index) {
            // Small stagger for grouped items
            var group = el.parentElement ? el.parentElement.children : null;
            if (group) {
                var positionInGroup = Array.prototype.indexOf.call(group, el);
                el.style.setProperty('--reveal-delay', Math.min(positionInGroup, 5) * 70 + 'ms');
            }
            revealObserver.observe(el);
        });
    }

    /* ======================================================================
       HERO POINTER AMBIENT GLOW (desktop, fine pointer, motion allowed)
       ====================================================================== */
    var hero = document.querySelector('.hero');
    var heroAmbient = document.getElementById('heroAmbient');
    var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hero && heroAmbient && finePointer && !prefersReducedMotion) {
        hero.addEventListener('pointermove', function (event) {
            var rect = hero.getBoundingClientRect();
            var x = ((event.clientX - rect.left) / rect.width) * 100;
            var y = ((event.clientY - rect.top) / rect.height) * 100;
            heroAmbient.style.setProperty('--mx', x.toFixed(2) + '%');
            heroAmbient.style.setProperty('--my', y.toFixed(2) + '%');
            heroAmbient.classList.add('is-active');
        });
        hero.addEventListener('pointerleave', function () {
            heroAmbient.classList.remove('is-active');
        });
    }

    /* ======================================================================
       PROJECT DATA (single source for cards, featured work and modal)
       Replace titles, descriptions, tools and image/link values with real work.
       ====================================================================== */
    var PROJECTS = {
        'character-animation': {
            title: 'Character Animation',
            category: 'Animation',
            description: 'Bringing characters to life with expressive motion and personality-driven performance.',
            details: 'A character-driven piece focused on believable movement, weight, and expression. The animation explores how small timing choices — pauses, overshoot, anticipation — shape a character\u2019s personality on screen.',
            process: 'Concept sketches and pose studies, a rough blocking pass to find the timing, then a polish pass on secondary motion and facial expression.',
            tools: ['After Effects', 'Blender'],
            image: 'assets/projects/character-animation.svg',
            link: ''
        },
        'anime-edit': {
            title: 'Anime Edit & Motion Graphics',
            category: 'Editing',
            description: 'Dynamic edits with cinematic transitions and impactful visual storytelling.',
            details: 'A high-energy edit built around rhythmic cutting, beat-synced transitions, and motion graphics layered over the footage to amplify the emotion of each sequence.',
            process: 'Music-led structure first, then select-and-cut to the beat, then motion graphics and transitions layered on top before a final grade.',
            tools: ['Premiere Pro', 'After Effects'],
            image: 'assets/projects/anime-edit.svg',
            link: ''
        },
        'product-animation': {
            title: 'Product Animation',
            category: 'Product / 3D',
            description: 'Showcasing products with 3D animation and engaging commercial motion.',
            details: 'A commercial-style product piece using 3D modelling, lighting and camera movement to present a product clearly and attractively, with motion that highlights form and detail.',
            process: 'Modelling and look-development, lighting studies, camera layout, then render and compositing passes with motion design overlays.',
            tools: ['Cinema 4D', 'After Effects'],
            image: 'assets/projects/product-animation.svg',
            link: ''
        },
        'cinematic-title-sequence': {
            title: 'Cinematic Title Sequence',
            category: 'Motion Graphics',
            description: 'Dramatic opening sequences with impactful typography and motion design.',
            details: 'A title sequence designed to set the tone of a story through typography, transitions, texture and pacing — balancing restraint with dramatic emphasis from the first frame.',
            process: 'Type exploration and layout studies, motion tests for pacing, then texture, light and transition refinement.',
            tools: ['After Effects', 'Typography'],
            image: 'assets/projects/cinematic-title-sequence.svg',
            link: ''
        },
        'explainer-animation': {
            title: 'Explainer Animation',
            category: 'Motion Graphics',
            description: 'Simplifying complex ideas into engaging, clearly structured animated explanations.',
            details: 'An explainer built to make a complex idea easy to follow — combining clear illustration, considered pacing and motion that guides attention through each point.',
            process: 'Script and structure, illustrated styleframes, storyboarded timing, then asset design and animated build.',
            tools: ['Illustration', 'After Effects'],
            image: 'assets/projects/explainer-animation.svg',
            link: ''
        },
        'animated-short-film': {
            title: 'Short Film / Animated Scene',
            category: 'Animation',
            description: 'Narrative-driven animation with emotional storytelling and cinematic pacing.',
            details: 'A narrative animated scene exploring atmosphere, character and emotion through staging, lighting and camera work rather than dialogue.',
            process: 'Story beats and staging sketches, layout and lighting studies, then animation, effects and final grade.',
            tools: ['Blender', 'Storytelling'],
            image: 'assets/projects/animated-short-film.svg',
            link: ''
        }
    };

    /* ======================================================================
       PROJECT FILTERS
       ====================================================================== */
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.creation-card'));
    var filtersEmpty = document.getElementById('filtersEmpty');

    function applyFilter(filter) {
        var visibleCount = 0;

        cards.forEach(function (card) {
            var match = filter === 'all' || card.getAttribute('data-category') === filter;
            card.classList.toggle('is-hidden', !match);
            if (match) visibleCount++;
        });

        if (filtersEmpty) filtersEmpty.hidden = visibleCount !== 0;

        // Re-run reveal for newly shown cards so they don't appear stuck
        cards.forEach(function (card) {
            if (!card.classList.contains('is-hidden')) {
                card.classList.add('is-visible');
            }
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            filterButtons.forEach(function (other) {
                var isActive = other === button;
                other.classList.toggle('is-active', isActive);
                other.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            applyFilter(filter);
        });
    });

    /* ======================================================================
       PROJECT DETAILS MODAL
       ====================================================================== */
    var modal = document.getElementById('projectModal');
    var modalDialog = modal ? modal.querySelector('.modal__dialog') : null;
    var modalImage = document.getElementById('modalImage');
    var modalVideo = document.getElementById('modalVideo');
    var modalCategory = document.getElementById('modalCategory');
    var modalTitle = document.getElementById('modalTitle');
    var modalDescription = document.getElementById('modalDescription');
    var modalTools = document.getElementById('modalTools');
    var modalLink = document.getElementById('modalLink');
    var modalNote = document.getElementById('modalNote');
    var lastFocused = null;

    function openModal(projectId, trigger) {
        var project = PROJECTS[projectId];
        if (!modal || !project) return;

        lastFocused = trigger || document.activeElement;

        if (modalImage) {
            // Allow a fresh placeholder fallback for this project's image.
            delete modalImage.dataset.placeholderApplied;
            modalImage.classList.remove('is-placeholder');
            modalImage.src = project.image;
            modalImage.alt = project.title + ' — project preview';
            modalImage.setAttribute('data-placeholder', project.title);
            modalImage.hidden = false;
        }
        if (modalVideo) {
            modalVideo.hidden = true;
            modalVideo.removeAttribute('src');
        }
        if (modalCategory) modalCategory.textContent = project.category;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalDescription) modalDescription.textContent = project.details || project.description;

        if (modalTools) {
            modalTools.innerHTML = '';
            (project.tools || []).forEach(function (tool) {
                var span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tool;
                modalTools.appendChild(span);
            });
            if (project.process) {
                var note = document.createElement('span');
                note.className = 'modal__process';
                note.textContent = 'Process: ' + project.process;
                modalTools.appendChild(note);
            }
        }

        if (modalLink) {
            if (project.link) {
                modalLink.href = project.link;
                modalLink.hidden = false;
            } else {
                modalLink.hidden = true;
            }
        }

        if (modalNote) {
            modalNote.hidden = false;
            modalNote.textContent = 'This is a placeholder project entry. Replace the image, description, tools and optional link in js/script.js once the real work is available.';
        }

        modal.hidden = false;
        document.body.classList.add('modal-open');

        // Force reflow so the transition runs
        void modal.offsetWidth;
        modal.classList.add('is-open');

        if (modalDialog) modalDialog.focus();
    }

    function closeModal() {
        if (!modal || modal.hidden) return;
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');

        var finish = function () {
            modal.hidden = true;
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.removeAttribute('src');
            }
        };

        if (prefersReducedMotion) {
            finish();
        } else {
            window.setTimeout(finish, 260);
        }

        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    document.querySelectorAll('[data-close-modal]').forEach(function (el) {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (event) {
        if (!modal || modal.hidden) return;

        if (event.key === 'Escape') {
            closeModal();
            return;
        }

        if (event.key === 'Tab') {
            var focusables = modal.querySelectorAll(
                'a[href], button:not([disabled]), video, [tabindex]:not([tabindex="-1"])'
            );
            var list = Array.prototype.filter.call(focusables, function (el) {
                return !el.hidden && el.offsetParent !== null;
            });
            if (!list.length) return;

            var first = list[0];
            var last = list[list.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    // Wire up cards + featured work as modal triggers
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            var id = card.getAttribute('data-project');
            if (id) openModal(id, card);
        });
        card.style.cursor = 'pointer';
    });

    document.querySelectorAll('.js-open-project').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            openModal(button.getAttribute('data-project'), button);
        });
    });

    // Featured work image is also clickable
    var featuredWork = document.querySelector('.featured-work');
    if (featuredWork) {
        var featuredMedia = featuredWork.querySelector('.featured-work__media');
        if (featuredMedia) {
            featuredMedia.style.cursor = 'pointer';
            featuredMedia.addEventListener('click', function () {
                openModal(featuredWork.getAttribute('data-project'), featuredMedia);
            });
        }
    }

    /* ======================================================================
       SHOWREEL
       No video file is committed to this repo, so the player stays in a
       documented "coming soon" state. Set SHOWREEL_SRC to a real file to
       switch it on — nothing plays until then and we never fake playback.
       ====================================================================== */
    var SHOWREEL_SRC = '';          // e.g. 'assets/video/showreel.mp4'
    var SHOWREEL_TYPE = 'video/mp4';

    var showreelSection = document.querySelector('.showreel');
    var showreelVideo = document.getElementById('showreelVideo');
    var showreelPoster = document.getElementById('showreelPoster');
    var showreelNote = document.getElementById('showreelNote');
    var showreelPlay = document.getElementById('showreelPlay');

    if (showreelSection && showreelVideo && SHOWREEL_SRC) {
        var source = document.createElement('source');
        source.src = SHOWREEL_SRC;
        source.type = SHOWREEL_TYPE;
        showreelVideo.appendChild(source);
        showreelVideo.hidden = false;
        if (showreelPoster) showreelPoster.hidden = true;
        if (showreelNote) showreelNote.hidden = true;
        showreelSection.classList.add('showreel--has-video');

        // If the file turns out to be missing, fall back honestly.
        showreelVideo.addEventListener('error', function () {
            showreelSection.classList.remove('showreel--has-video');
            showreelVideo.hidden = true;
            if (showreelPoster) showreelPoster.hidden = false;
            if (showreelNote) showreelNote.hidden = false;
        });
    }

    // Play control. With a real video it starts playback. With no video file it
    // reveals the honest "temporary preview" note — it never fakes playback.
    if (showreelPlay) {
        showreelPlay.addEventListener('click', function () {
            if (showreelSection && showreelSection.classList.contains('showreel--has-video') && showreelVideo) {
                var attempt = showreelVideo.play();
                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(function () { /* autoplay policy — user can use native controls */ });
                }
            } else if (showreelNote) {
                showreelNote.hidden = false;
                showreelSection && showreelSection.classList.add('showreel--noticed');
            }
        });
    }

    /* ======================================================================
       AVAILABILITY (configurable — makes no claim by default)
       Change this one object to publish a real status.
       ====================================================================== */
    var AVAILABILITY = {
        status: 'unconfirmed',
        // Used when status === 'unconfirmed'
        unconfirmed: 'Status not confirmed — ask me',
        // Used when status === 'available'
        available: 'Available for freelance projects',
        // Used when status === 'booked'
        booked: 'Currently booked'
    };

    function applyAvailability() {
        var status = AVAILABILITY.status;
        var text = status === 'available'
            ? AVAILABILITY.available
            : status === 'booked'
                ? AVAILABILITY.booked
                : AVAILABILITY.unconfirmed;

        var contactText = document.getElementById('availabilityText');
        var pill = document.getElementById('availabilityPill');
        var dot = document.getElementById('availabilityDot');

        if (contactText) {
            contactText.textContent = text;
            contactText.setAttribute('data-status', status);
        }
        if (pill) {
            pill.textContent = text;
            pill.setAttribute('data-status', status);
        }
        if (dot) dot.setAttribute('data-status', status);
    }

    applyAvailability();

    /* ======================================================================
       BACK TO TOP
       ====================================================================== */
    var backToTop = document.getElementById('backToTop');

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ======================================================================
       IMAGE PLACEHOLDERS
       If a project/portrait file is missing, swap in a branded SVG placeholder
       instead of a broken icon. Paths stay easy to replace.
       ====================================================================== */
    function buildPlaceholder(label) {
        var safe = String(label || 'Keshav Sharma').replace(/[<>&"]/g, '');
        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">' +
            '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#1a1226"/><stop offset="1" stop-color="#0d0916"/>' +
            '</linearGradient></defs>' +
            '<rect width="800" height="500" fill="url(#g)"/>' +
            '<circle cx="400" cy="210" r="120" fill="none" stroke="#8b5cf6" stroke-opacity="0.35" stroke-width="2"/>' +
            '<path d="M400 130 L470 250 L330 250 Z" fill="#a970ff" fill-opacity="0.85"/>' +
            '<text x="400" y="380" fill="#b7aec8" font-family="Inter, sans-serif" font-size="26" ' +
            'text-anchor="middle">' + safe + '</text>' +
            '<text x="400" y="418" fill="#81788f" font-family="Inter, sans-serif" font-size="16" ' +
            'text-anchor="middle">Placeholder — replace this image</text>' +
            '</svg>';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    function swapToPlaceholder(img) {
        if (img.dataset.placeholderApplied) return;
        img.dataset.placeholderApplied = 'true';
        img.src = buildPlaceholder(img.getAttribute('data-placeholder') || img.alt);
        img.classList.add('is-placeholder');
    }

    document.querySelectorAll('img[data-placeholder]').forEach(function (img) {
        // Catch future load failures
        img.addEventListener('error', function () {
            swapToPlaceholder(img);
        });
        // Catch failures that already happened before this script ran
        // (defer + fast 404 means `complete` is true and naturalWidth is 0)
        if (img.complete && img.naturalWidth === 0) {
            swapToPlaceholder(img);
        }
    });

    /* ======================================================================
       SERVICE INQUIRY LINKS
       Each service card links to the contact form and pre-selects the
       matching Project Type, so an inquiry arrives already qualified.
       ====================================================================== */
    var projectTypeSelect = document.getElementById('projectType');

    document.querySelectorAll('.js-service-link').forEach(function (link) {
        link.addEventListener('click', function () {
            var service = link.getAttribute('data-service');
            if (!projectTypeSelect || !service) return;
            var hasOption = Array.prototype.some.call(projectTypeSelect.options, function (option) {
                return option.value === service;
            });
            if (hasOption) projectTypeSelect.value = service;
        });
    });

    /* ======================================================================
       CONTACT FORM
       Client-side validation + configurable submission endpoint.
       No endpoint configured => never claims the message was sent.
       ====================================================================== */
    var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx' or your Worker URL

    var contactForm = document.getElementById('contactForm');
    var formSubmit = document.getElementById('formSubmit');
    var formSubmitText = document.getElementById('formSubmitText');
    var formSubmitLoading = document.getElementById('formSubmitLoading');
    var formStatus = document.getElementById('formStatus');

    function setFieldError(fieldId, errorId, message) {
        var field = document.getElementById(fieldId);
        var error = document.getElementById(errorId);
        if (error) error.textContent = message || '';
        if (field) {
            if (message) {
                field.setAttribute('aria-invalid', 'true');
            } else {
                field.removeAttribute('aria-invalid');
            }
        }
    }

    function setStatus(kind, message) {
        if (!formStatus) return;
        formStatus.className = 'form__status' + (kind ? ' is-' + kind : '');
        formStatus.textContent = message || '';
    }

    function setLoading(isLoading) {
        if (formSubmit) formSubmit.disabled = isLoading;
        if (formSubmitText) formSubmitText.hidden = isLoading;
        if (formSubmitLoading) formSubmitLoading.hidden = !isLoading;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var name = document.getElementById('name');
            var email = document.getElementById('email');
            var message = document.getElementById('message');
            var honeypot = document.getElementById('companyWebsite');

            var nameValue = name ? name.value.trim() : '';
            var emailValue = email ? email.value.trim() : '';
            var messageValue = message ? message.value.trim() : '';

            setFieldError('name', 'nameError', '');
            setFieldError('email', 'emailError', '');
            setFieldError('message', 'messageError', '');
            setStatus('', '');

            var hasError = false;
            var firstInvalid = null;

            if (!nameValue) {
                setFieldError('name', 'nameError', 'Please enter your name.');
                hasError = true;
                firstInvalid = firstInvalid || name;
            }

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailValue) {
                setFieldError('email', 'emailError', 'Please enter your email address.');
                hasError = true;
                firstInvalid = firstInvalid || email;
            } else if (!emailPattern.test(emailValue)) {
                setFieldError('email', 'emailError', 'Please enter a valid email address.');
                hasError = true;
                firstInvalid = firstInvalid || email;
            }

            if (!messageValue) {
                setFieldError('message', 'messageError', 'Please write a short message.');
                hasError = true;
                firstInvalid = firstInvalid || message;
            }

            if (hasError) {
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Basic spam trap — real users never fill this
            if (honeypot && honeypot.value) {
                setStatus('success', 'Message sent successfully. Thank you!');
                contactForm.reset();
                return;
            }

            if (!FORM_ENDPOINT) {
                setStatus(
                    'info',
                    'The contact form is not connected yet. Add your form endpoint (e.g. Formspree or a Cloudflare Worker) to FORM_ENDPOINT in js/script.js to start receiving messages. No message was sent.'
                );
                return;
            }

            setLoading(true);

            var payload = new FormData(contactForm);

            // Budget is optional — include it only when the visitor chose a range
            var budgetField = document.getElementById('budget');
            if (budgetField && !budgetField.value) {
                payload.delete('budget');
            }

            fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: payload,
                headers: { Accept: 'application/json' }
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Request failed with status ' + response.status);
                    setStatus('success', 'Message sent successfully. Thank you — I\u2019ll get back to you soon.');
                    contactForm.reset();
                })
                .catch(function () {
                    setStatus('error', 'Sorry, the message could not be sent. Please try again, or email directly.');
                })
                .finally(function () {
                    setLoading(false);
                });
        });
    }

    /* ======================================================================
       FOOTER YEAR
       ====================================================================== */
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
})();
