// Photo carousels on menu cards: swipe/scroll natively, arrows and dots for mouse users.
(function () {
    document.querySelectorAll('.cabin-carousel').forEach(function (carousel) {
        var track = carousel.querySelector('.cabin-track');
        var count = track.children.length;
        var dots = carousel.querySelectorAll('.cabin-dot');
        var index = 0;
        var settle;

        function show(i) {
            dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
        }
        function go(i) {
            index = (i + count) % count;
            show(index);
            track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
        }

        carousel.querySelector('.cabin-prev').addEventListener('click', function () { go(index - 1); });
        carousel.querySelector('.cabin-next').addEventListener('click', function () { go(index + 1); });
        dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });

        // After a swipe (or a smooth scroll) comes to rest, sync the index with what is on screen
        track.addEventListener('scroll', function () {
            clearTimeout(settle);
            settle = setTimeout(function () {
                index = Math.round(track.scrollLeft / track.clientWidth);
                show(index);
            }, 120);
        }, { passive: true });

        show(0);
    });
})();
