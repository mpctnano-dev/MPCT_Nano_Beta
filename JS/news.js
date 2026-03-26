/**
 * News Page
 * ─────────────────────────────────────────────────────────────
 * - Renders relative timestamps ("2 days ago") for recent articles
 * - Filters cards by tag chip selection and search input
 * - Card click stub (expand behaviour added in next phase)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Timestamp rendering ──────────────────────────────────
    const renderTimestamps = () => {
        const now = new Date();
        document.querySelectorAll('.news-card__timestamp[data-date]').forEach(el => {
            const articleDate = new Date(el.dataset.date + 'T00:00:00');
            const diffMs = now - articleDate;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                el.textContent = 'Today';
            } else if (diffDays === 1) {
                el.textContent = 'Yesterday';
            } else if (diffDays <= 7) {
                el.textContent = `${diffDays} days ago`;
            } else {
                el.textContent = articleDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        });
    };

    // ── Filter logic ─────────────────────────────────────────
    const cards = Array.from(document.querySelectorAll('.news-card'));
    const emptyState = document.getElementById('newsEmptyState');
    const searchInput = document.getElementById('newsSearch');
    const filterBtns = document.querySelectorAll('.news-filter-btn[data-tag]');

    let activeTag = 'all';
    let searchQuery = '';

    const applyFilters = () => {
        let visibleCount = 0;

        cards.forEach(card => {
            const tags = card.dataset.tags ? card.dataset.tags.split(',').map(t => t.trim()) : [];
            const title = card.querySelector('.news-card__title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.news-card__excerpt')?.textContent.toLowerCase() || '';
            const hashtags = Array.from(card.querySelectorAll('.news-card__hashtag'))
                .map(h => h.textContent.toLowerCase()).join(' ');
            const searchableText = title + ' ' + excerpt + ' ' + hashtags;

            const tagMatch = activeTag === 'all' || tags.includes(activeTag);
            const searchMatch = searchQuery === '' || searchableText.includes(searchQuery);

            if (tagMatch && searchMatch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };

    // Tag chip clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTag = btn.dataset.tag.toLowerCase();
            applyFilters();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            applyFilters();
        });
    }

    // ── Card click stub ──────────────────────────────────────
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.news-card__title')?.textContent;
            console.log('[News] Card clicked:', title);
            // TODO (next phase): open expanded article modal/overlay
        });
    });

    // ── Init ─────────────────────────────────────────────────
    renderTimestamps();
    applyFilters();

});
