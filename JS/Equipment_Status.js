(() => {
    'use strict';

    const STATUS = {
        AVAILABLE: 'AVAILABLE',
        UNAVAILABLE: 'UNAVAILABLE',
        EXPECTED: 'EXPECTED'
    };

    const STATUS_CLASS = {
        AVAILABLE: 'available',
        UNAVAILABLE: 'unavailable',
        EXPECTED: 'expected'
    };

    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const normalizeName = (value) => {
        if (!value) return '';
        return value
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '')
            .trim();
    };

    const getOrdinal = (day) => {
        if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    const parseExpectedDate = (value) => {
        if (!value || typeof value !== 'string') return null;

        const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoMatch) {
            const year = Number(isoMatch[1]);
            const month = Number(isoMatch[2]) - 1;
            const day = Number(isoMatch[3]);
            return new Date(year, month, day);
        }

        const usMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        if (usMatch) {
            const month = Number(usMatch[1]) - 1;
            const day = Number(usMatch[2]);
            let year = Number(usMatch[3]);
            if (year < 100) year += 2000;
            return new Date(year, month, day);
        }

        return null;
    };

    const formatExpectedDate = (value) => {
        const date = parseExpectedDate(value);
        if (!date || Number.isNaN(date.getTime())) return value;
        const monthName = MONTHS[date.getMonth()];
        const dayText = getOrdinal(date.getDate());
        return `${monthName} ${dayText}`;
    };

    const getStatusLabel = (equipment) => {
        if (!equipment) return '';
        if (equipment.status === STATUS.EXPECTED) {
            return equipment.expectedDate ? formatExpectedDate(equipment.expectedDate) : 'Expected';
        }
        if (equipment.status === STATUS.AVAILABLE) return 'Available';
        return 'Not Available';
    };

    const updateDotStatus = (dot, statusClass) => {
        if (!dot) return;
        dot.classList.remove('available', 'unavailable', 'expected', 'busy', 'maintenance');
        dot.classList.add(statusClass);
    };

    const applyCardStatus = (card, equipment) => {
        if (!card || !equipment) return;
        const dot = card.querySelector('.status-dot');
        const bookBtn = card.querySelector('.tech-actions .btn-tech-fill');
        if (!dot) return;

        const statusClass = STATUS_CLASS[equipment.status] || STATUS_CLASS.UNAVAILABLE;
        updateDotStatus(dot, statusClass);

        if (equipment.status === STATUS.EXPECTED) {
            dot.style.display = 'none';
        } else {
            dot.style.display = '';
        }

        const existingText = card.querySelector('.status-text');
        if (equipment.status === STATUS.EXPECTED) {
            const label = getStatusLabel(equipment);
            if (label) {
                const textEl = existingText || document.createElement('span');
                textEl.className = `status-text ${statusClass}`;
                textEl.textContent = label;
                if (!existingText) {
                    dot.insertAdjacentElement('afterend', textEl);
                }
            }
        } else if (existingText) {
            existingText.remove();
        }

        if (bookBtn) {
            if (!bookBtn.dataset.originalLabel) {
                bookBtn.dataset.originalLabel = bookBtn.textContent.trim() || 'Book';
            }

            if (equipment.status === STATUS.AVAILABLE) {
                bookBtn.classList.remove('disabled');
                bookBtn.removeAttribute('aria-disabled');
                bookBtn.removeAttribute('tabindex');
                bookBtn.style.pointerEvents = '';
                bookBtn.textContent = bookBtn.dataset.originalLabel;
            } else {
                bookBtn.classList.add('disabled');
                bookBtn.setAttribute('aria-disabled', 'true');
                bookBtn.setAttribute('tabindex', '-1');
                bookBtn.style.pointerEvents = 'none';
                bookBtn.textContent = 'Unavailable';
            }
        }
    };

    const applyAboutStatus = (equipment) => {
        if (!equipment) return;

        const statusClass = STATUS_CLASS[equipment.status] || STATUS_CLASS.UNAVAILABLE;
        const label = getStatusLabel(equipment);

        const wrapper = document.querySelector('.status-indicator-wrapper');
        const dot = document.querySelector('.status-indicator-wrapper .status-dot');
        if (wrapper && dot) {
            // About pages should show one status indicator only (status tag text),
            // so hide the standalone dot wrapper to avoid duplicate "Available" UI.
            wrapper.style.display = 'none';
            updateDotStatus(dot, statusClass);
            if (!dot.classList.contains('pulse')) {
                dot.classList.add('pulse');
            }
        }

        const badges = document.querySelector('.hero-badges');
        if (badges) {
            let tag = badges.querySelector('.status-tag');
            if (!tag) {
                tag = document.createElement('span');
                tag.className = 'tag status-tag';
                badges.appendChild(tag);
            }
            tag.classList.remove('available', 'unavailable', 'expected');
            tag.classList.add(statusClass);
            tag.textContent = label;
        }

        const reserveBtn = document.querySelector('.hero-cta .btn.btn-primary');
        if (reserveBtn) {
            if (!reserveBtn.dataset.availableLabel) {
                reserveBtn.dataset.availableLabel = reserveBtn.innerHTML.trim();
            }

            const contactHref = `../Book_Equipment.html?equipment=${equipment.id}`;
            if (equipment.status === STATUS.AVAILABLE) {
                reserveBtn.classList.remove('disabled');
                reserveBtn.removeAttribute('aria-disabled');
                reserveBtn.removeAttribute('tabindex');
                reserveBtn.setAttribute('href', contactHref);
                reserveBtn.innerHTML = reserveBtn.dataset.availableLabel;
            } else {
                reserveBtn.classList.add('disabled');
                reserveBtn.setAttribute('aria-disabled', 'true');
                reserveBtn.setAttribute('tabindex', '-1');
                reserveBtn.setAttribute('href', '#');
                reserveBtn.innerHTML = '<i class="fas fa-ban" style="margin-right: 8px;"></i> Currently Unavailable';
            }
        }

        // Warning ticker (scrolling banner above hero, e.g. LPKF ProtoLaser R4).
        // If an equipment page has a .warning-ticker element, we treat it as the
        // canonical place to surface equipment.warningMessage on that page.
        //
        // Track layout (for seamless 0 → -50% loop):
        //   [lead-spacer] [badge] [text] [loop-spacer] [badge] [text]
        //
        // Both spacers are the same width (25vw) so the loop boundary is
        // visually identical. The lead-spacer pushes the first "Notice"
        // badge to the center of the ticker on page load.
        const ticker = document.querySelector('.warning-ticker');
        if (ticker) {
            const track = ticker.querySelector('.warning-ticker__track');
            const tickerText = ticker.querySelector('.warning-ticker__text');
            if (equipment.warningMessage && tickerText && track) {
                tickerText.textContent = equipment.warningMessage;

                // Remove any previous duplicate set to avoid triple+ copies on re-runs
                const existingDupes = track.querySelectorAll('.warning-ticker__dupe');
                existingDupes.forEach((el) => el.remove());

                // Leading spacer — pushes the first "Notice" badge toward center
                const leadSpacer = document.createElement('span');
                leadSpacer.className = 'warning-ticker__spacer warning-ticker__dupe';
                track.insertBefore(leadSpacer, track.firstChild);

                // Loop spacer — gap between copy 1 and copy 2
                const loopSpacer = document.createElement('span');
                loopSpacer.className = 'warning-ticker__spacer warning-ticker__dupe';
                track.appendChild(loopSpacer);

                // Duplicate badge + text for seamless loop
                const badge = ticker.querySelector('.warning-ticker__badge');
                if (badge) {
                    const dupeBadge = badge.cloneNode(true);
                    dupeBadge.classList.add('warning-ticker__dupe');
                    track.appendChild(dupeBadge);
                }
                const dupeText = tickerText.cloneNode(true);
                dupeText.classList.add('warning-ticker__dupe');
                track.appendChild(dupeText);

                ticker.style.display = '';
            } else {
                // No warning message for this equipment -> hide the ticker entirely
                // so the page does not show an empty scrolling banner.
                ticker.style.display = 'none';
            }
        }

    };

    const findEquipmentForAboutPage = (data) => {
        const path = window.location.pathname.replace(/\\/g, '/');
        const marker = '/About_Equipment/';
        const pos = path.indexOf(marker);
        if (pos !== -1) {
            const rel = path.substring(pos + 1).toLowerCase();
            const byAbout = data.equipment.find((item) =>
                item.aboutPage && item.aboutPage.toLowerCase() === rel
            );
            if (byAbout) return byAbout;
        }

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const key = normalizeName(heroTitle.textContent);
            return data.equipment.find((item) => normalizeName(item.name) === key) || null;
        }

        return null;
    };

    const applyEquipmentStatuses = (data) => {
        const cards = document.querySelectorAll('.tech-card');
        if (cards.length > 0) {
            const equipmentMap = new Map(
                data.equipment.map((item) => [normalizeName(item.name), item])
            );
            cards.forEach((card) => {
                const title = card.querySelector('.tech-title');
                if (!title) return;
                const key = normalizeName(title.textContent);
                const equipment = equipmentMap.get(key);
                if (equipment) {
                    applyCardStatus(card, equipment);
                }
            });
        }

        if (document.querySelector('.product-page')) {
            const equipment = findEquipmentForAboutPage(data);
            if (equipment) {
                applyAboutStatus(equipment);
            }
        }
    };

    const init = () => {
        const hasEquipment = document.querySelector('.tech-card') || document.querySelector('.product-page');
        if (!hasEquipment) return;

        const isAbout = window.location.pathname.includes('/About_Equipment/');
        const jsonPath = isAbout ? '../equipment.json' : 'equipment.json';

        fetch(jsonPath, { cache: 'no-store' })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to load equipment.json');
                return response.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data.equipment)) return;
                applyEquipmentStatuses(data);
            })
            .catch(() => {
                // Fail silently to avoid breaking pages if JSON isn't reachable.
            });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
