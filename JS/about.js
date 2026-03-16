document.addEventListener('DOMContentLoaded', () => {
    /* Scroll reveal for about-reveal elements */
    const revealElements = Array.from(document.querySelectorAll('.about-reveal'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }

    /* Copy acknowledgement text */
    const copyButton = document.getElementById('ackCopyBtn');
    const acknowledgementText = document.getElementById('ackText');
    if (!copyButton || !acknowledgementText) return;

    const fallbackCopy = (text) => {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'absolute';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(helper);
        return copied;
    };

    copyButton.addEventListener('click', async () => {
        const text = acknowledgementText.innerText.trim();
        let copied = false;

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                copied = true;
            } catch (_) {
                copied = fallbackCopy(text);
            }
        } else {
            copied = fallbackCopy(text);
        }

        if (!copied) return;

        copyButton.classList.add('copied');
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';

        window.setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
});
