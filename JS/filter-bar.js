/**
 * Filter-bar behaviour shared by the Equipment catalog and News.
 * --------------------------------------------------------------
 * Both pages carry a sticky toolbar that is far too tall for a phone, and
 * both solve it the same way: a horizontally scrolling chip row inside a
 * panel that folds away behind a Filters pill. Loaded only by those two
 * pages; every function here no-ops when its markup is absent.
 */

/**
 * Horizontal scroll strips (.scroll-strip, see CSS/style.css).
 * A hidden scrollbar leaves no sign that a row scrolls, so the CSS fades
 * whichever edge still has content behind it. This only decides which
 * edges those are; the fade itself is a mask driven by the classes below.
 * No-ops on pages with no strips.
 */
function initScrollStrips() {
    const strips = Array.from(document.querySelectorAll('.scroll-strip'));
    if (strips.length === 0) return;

    const updaters = strips.map(strip => {
        const update = () => {
            const max = strip.scrollWidth - strip.clientWidth;
            const x = strip.scrollLeft;
            // 1px slack: sub-pixel layout means scrollLeft rarely lands
            // exactly on 0 or on max, which would leave a fade stuck on.
            strip.classList.toggle('has-overflow-start', x > 1);
            strip.classList.toggle('has-overflow-end', max > 1 && x < max - 1);
        };

        strip.addEventListener('scroll', update, { passive: true });
        if ('ResizeObserver' in window) {
            new ResizeObserver(update).observe(strip);
        }
        update();
        return update;
    });

    const updateAll = () => updaters.forEach(update => update());

    if (!('ResizeObserver' in window)) {
        window.addEventListener('resize', updateAll);
    }

    // Item widths shift when webfonts swap in, which can change whether
    // the row overflows at all. ResizeObserver misses it: the strip's own
    // box does not change, only its contents.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateAll);
    }
}

initScrollStrips();


/**
 * Collapsing filter bar (≤1024px, see CSS/style.css).
 *
 * Several rows of toolbar is a lot of a phone screen to hand to filters most
 * visitors never open, so on phones and tablets the bar arrives closed —
 * search field and a Filters button — and the rest drops down only when
 * that button is tapped. It never opens itself: nothing about scrolling,
 * filtering or resizing brings the panel back, so it cannot appear under a
 * thumb mid-scroll.
 *
 * It does close itself once, after an open: scrolling on past the grace
 * window tidies the panel away rather than leaving it floating over the
 * cards the reader has moved to. The panel is absolutely positioned (see
 * the CSS block for why), so neither state costs the layout anything and
 * nothing here has to fight a scroll jump.
 *
 * Two pages use this — the Equipment catalog and News — and the mechanism is
 * identical on both, so it is written once here and configured at the call
 * sites below. What differs is only which elements to wire up, which CSS
 * custom property carries the measured height, and how to name the filters
 * that are currently on. No-ops when its markup is not on the page.
 *
 * @param {object} config
 * @param {string} config.sectionSelector  the sticky bar
 * @param {string} config.panelId          the .filter-expandable wrapper
 * @param {string} config.toggleId         the Filters button
 * @param {string} config.labelId          text span inside the button
 * @param {string} [config.moreId]         the "+N" span inside the button
 * @param {string} config.heightVar        custom property for the open height
 * @param {string} config.chipSelector     what a tap inside the panel that
 *                                         changes the filters looks like
 * @param {() => string[]} config.readActiveFilters  names of the active
 *                                         filters, most important first
 */
function initCollapsibleFilterBar(config) {
    const section = document.querySelector(config.sectionSelector);
    const panel = document.getElementById(config.panelId);
    const toggle = document.getElementById(config.toggleId);
    const label = document.getElementById(config.labelId);
    const more = config.moreId ? document.getElementById(config.moreId) : null;
    if (!section || !panel || !toggle || !label) return;

    const mq = window.matchMedia('(max-width: 1024px)');
    // How much scrolling a freshly opened panel survives. Enough that
    // nudging the page to see what a filter did does not shut it, short
    // enough that moving on through the catalog does.
    const GRACE = 140;

    // The markup ships closed, so read the starting state rather than
    // assuming it, then bring the button and the bar into line with it.
    let collapsed = panel.classList.contains('is-collapsed');
    let openedAtY = null;
    let lastY = window.scrollY;
    let queued = false;

    const setCollapsed = (next) => {
        if (next === collapsed) return;
        collapsed = next;
        panel.classList.toggle('is-collapsed', next);
        section.classList.toggle('is-condensed', next);
        toggle.setAttribute('aria-expanded', String(!next));
    };

    // The open height has to be a concrete number for the height transition,
    // so read the panel's natural one. Class on, measure, class off within
    // one task: layout is recalculated but never painted, so nothing flashes.
    const measurePanel = () => {
        if (!mq.matches) return;
        panel.classList.add('is-measuring');
        const height = Math.round(panel.getBoundingClientRect().height);
        panel.classList.remove('is-measuring');
        if (height > 0) {
            document.documentElement.style.setProperty(config.heightVar, `${height}px`);
        }
    };

    const evaluate = () => {
        queued = false;
        const y = window.scrollY;
        const scrollingDown = y > lastY;
        lastY = y;

        if (!mq.matches || collapsed) return;

        if (openedAtY !== null) {
            if (Math.abs(y - openedAtY) < GRACE) return;
            openedAtY = null;
        }

        if (scrollingDown) setCollapsed(true);
    };

    const onScroll = () => {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(evaluate);
    };

    // Closed, the filters are out of sight, so the button carries what is
    // filtering the grid. Only the first is named — two filter names spelled
    // out end to end do not fit at 390px — so the second is counted instead,
    // and the full list stays in the accessible name.
    const updateToggleLabel = () => {
        const parts = config.readActiveFilters();

        label.textContent = parts.length > 0 ? parts[0] : 'Filters';
        if (more) {
            more.textContent = `+${parts.length - 1}`;
            more.hidden = parts.length < 2;
        }
        toggle.setAttribute('aria-label', parts.length > 0 ? `Filters: ${parts.join(', ')}` : 'Filters');
        toggle.classList.toggle('has-active', parts.length > 0);
    };

    toggle.addEventListener('click', () => {
        setCollapsed(!collapsed);
        openedAtY = collapsed ? null : window.scrollY;
    });

    // Delegated, so it runs after the chip's own handler has moved .active.
    panel.addEventListener('click', (event) => {
        if (event.target.closest(config.chipSelector)) updateToggleLabel();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || collapsed || !mq.matches) return;
        setCollapsed(true);
        openedAtY = null;
        toggle.focus();
    });

    // Only the measurement is viewport-dependent: the panel is left however
    // the reader left it, and above 1024px .is-collapsed stops applying on
    // its own, so there is no state to undo when the breakpoint is crossed.
    const syncToViewport = () => {
        openedAtY = null;
        measurePanel();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncToViewport, { passive: true });
    window.addEventListener('orientationchange', syncToViewport);
    if (mq.addEventListener) mq.addEventListener('change', syncToViewport);

    // Chip widths — and so the panel's height, if a row ever wraps — settle
    // only once the webfont has swapped in.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measurePanel);
    }

    section.classList.toggle('is-condensed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    updateToggleLabel();
    measurePanel();
}

/* Equipment catalog — category and location chips plus the view switcher.
   Reads data-* values rather than button text: "NVC" fits the pill where
   "NVC (Phoenix)" would be cut off mid-word. */
if (document.getElementById('equipmentContainer')) {
    initCollapsibleFilterBar({
        sectionSelector: '.filter-section',
        panelId: 'filterPanel',
        toggleId: 'filterToggle',
        labelId: 'filterToggleLabel',
        moreId: 'filterToggleMore',
        heightVar: '--eq-filter-panel-h',
        chipSelector: '.filter-btn',
        readActiveFilters: () => {
            const category = document.querySelector('.category-btn.active');
            const location = document.querySelector('.location-btn.active');
            const parts = [];

            const categoryValue = category ? category.getAttribute('data-filter') : 'all';
            const locationValue = location ? location.getAttribute('data-location') : 'all';
            if (categoryValue && categoryValue !== 'all') parts.push(categoryValue);
            if (locationValue && locationValue !== 'all') parts.push(locationValue);
            return parts;
        }
    });
}

/* News — category chips plus the month picker. The chip's own text is the
   label here (it is already short), and the month reads off the calendar
   trigger, which JS/news.js keeps current. Reset is in the chip selector so
   clearing the filters clears the pill with them. */
initCollapsibleFilterBar({
    sectionSelector: '#newsFilterSection',
    panelId: 'newsFilterPanel',
    toggleId: 'newsFilterToggle',
    labelId: 'newsFilterToggleLabel',
    moreId: 'newsFilterToggleMore',
    heightVar: '--news-filter-panel-h',
    chipSelector: '.news-filter-btn, .news-reset-btn, .news-calendar-month, .news-calendar-popover__clear',
    readActiveFilters: () => {
        const tag = document.querySelector('.news-filter-btn.active');
        const month = document.getElementById('newsCalendarLabel');
        const parts = [];

        if (tag && tag.getAttribute('data-tag') !== 'all') parts.push(tag.textContent.trim());
        if (month && month.textContent.trim() && month.textContent.trim() !== 'Any date') {
            parts.push(month.textContent.trim());
        }
        return parts;
    }
});
