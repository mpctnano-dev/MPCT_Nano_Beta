document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".wfd-reveal");

    if (!elements.length || typeof IntersectionObserver === "undefined") {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -36px 0px",
        }
    );

    elements.forEach((element) => observer.observe(element));
});
