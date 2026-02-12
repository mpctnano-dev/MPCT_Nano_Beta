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
    };

    const applyAboutStatus = (equipment) => {
        if (!equipment) return;

        const statusClass = STATUS_CLASS[equipment.status] || STATUS_CLASS.UNAVAILABLE;
        const label = getStatusLabel(equipment);

        const wrapper = document.querySelector('.status-indicator-wrapper');
        const dot = document.querySelector('.status-indicator-wrapper .status-dot');
        if (wrapper && dot) {
            if (equipment.status === STATUS.EXPECTED) {
                wrapper.style.display = 'none';
            } else {
                wrapper.style.display = '';
                updateDotStatus(dot, statusClass);
                if (!dot.classList.contains('pulse')) {
                    dot.classList.add('pulse');
                }
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

        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            let warning = document.querySelector('.status-warning');
            if (equipment.warningMessage) {
                if (!warning) {
                    warning = document.createElement('div');
                    warning.className = 'status-warning';
                    subtitle.insertAdjacentElement('afterend', warning);
                }
                warning.textContent = equipment.warningMessage;
            } else if (warning) {
                warning.remove();
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
