(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    root.NewsFiltering = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const monthFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const normalizeMonthValue = (dateString = '') => {
        if (typeof dateString !== 'string') return '';
        return /^\d{4}-\d{2}/.test(dateString) ? dateString.slice(0, 7) : '';
    };

    const formatMonthLabel = (monthValue) => {
        if (!monthValue) return 'Any Month';
        return monthFormatter.format(new Date(monthValue + '-01T00:00:00'));
    };

    const getAvailableMonths = (items = []) => {
        const uniqueMonths = Array.from(new Set(
            items
                .map(item => normalizeMonthValue(item.date))
                .filter(Boolean)
        )).sort((a, b) => b.localeCompare(a));

        return uniqueMonths.map(value => ({
            value,
            label: formatMonthLabel(value)
        }));
    };

    const normalizeTags = (tags) => {
        if (Array.isArray(tags)) {
            return tags.map(tag => String(tag).trim().toLowerCase()).filter(Boolean);
        }

        if (typeof tags === 'string') {
            return tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
        }

        return [];
    };

    const normalizeText = (text) => String(text || '').trim().toLowerCase();

    const filterNewsCards = (cards = [], state = {}) => {
        const activeTag = String(state.activeTag || 'all').toLowerCase();
        const searchQuery = normalizeText(state.searchQuery);
        const activeMonth = normalizeMonthValue(state.activeMonth);

        return cards.filter(card => {
            const tags = normalizeTags(card.tags);
            const text = normalizeText(card.text);
            const cardMonth = normalizeMonthValue(card.date);

            const tagMatch = activeTag === 'all' || tags.includes(activeTag);
            const searchMatch = !searchQuery || text.includes(searchQuery);
            const monthMatch = !activeMonth || cardMonth === activeMonth;

            return tagMatch && searchMatch && monthMatch;
        });
    };

    const buildNewsRadarItems = (articles = [], state = {}) => {
        const openArticleId = state.openArticleId || '';
        const visibleArticleIds = Array.isArray(state.visibleArticleIds) ? state.visibleArticleIds : [];
        const preferredItems = visibleArticleIds
            .map(id => articles.find(article => article.id === id))
            .filter(article => article && article.id !== openArticleId);

        const seen = new Set(preferredItems.map(article => article.id));
        const fallbackItems = articles.filter(article => {
            return article.id !== openArticleId && !seen.has(article.id);
        });

        return preferredItems.concat(fallbackItems).slice(0, 3);
    };

    const buildStoryDockItems = (articles = [], state = {}) => {
        const visibleArticleIds = Array.isArray(state.visibleArticleIds) ? state.visibleArticleIds : [];
        const visibleSet = new Set(visibleArticleIds);

        return articles.filter(article => visibleSet.has(article.id)).slice(0, 4);
    };

    return {
        buildNewsRadarItems,
        buildStoryDockItems,
        filterNewsCards,
        formatMonthLabel,
        getAvailableMonths,
        normalizeMonthValue
    };
}));
