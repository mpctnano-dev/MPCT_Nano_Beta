document.addEventListener('DOMContentLoaded', () => {

    // Initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }

    const listView = document.getElementById('listView');
    const articleView = document.getElementById('articleView');
    const articleContent = document.getElementById('articleContent');
    const backBtn = document.getElementById('backBtn');

    // Animate bars
    setTimeout(() => {
        document.querySelectorAll('.bar-fill')
            .forEach(f => f.style.transform = 'translateX(0)');
    }, 100);

    // Card click
    document.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', () => {

            const title = card.querySelector('.card-title').innerText;
            const img = card.querySelector('img').src;
            const cat = card.querySelector('.category').innerText;

            articleContent.innerHTML = `
                <img src="${img}" style="width:100%; border-radius:12px;">
                <span class="category">${cat}</span>
                <h1>${title}</h1>
                <p>News description......</p>
            `;

            listView.classList.add('hidden');
            articleView.classList.remove('hidden');
            window.scrollTo(0, 0);
        });
    });

    // Back button
    backBtn.addEventListener('click', () => {
        articleView.classList.add('hidden');
        listView.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

});