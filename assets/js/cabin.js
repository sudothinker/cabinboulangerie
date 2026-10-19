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

// Hero: this week's menu card, read from assets/this-week.json.
// Falls back to the plain Place Order button if the file is missing or the pickup date has passed.
(function () {
    var box = document.getElementById('cabin-week');
    var fallback = document.getElementById('cabin-order-fallback');
    if (!box || !window.fetch) return;
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    fetch('assets/this-week.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (w) {
        if (!w || !w.items || !w.items.length) return;
        var end = new Date(w.pickup + 'T23:59:59');
        if (isNaN(end) || end < new Date()) return;
        box.innerHTML =
            '<div class="cabin-week-head"><span class="cabin-week-title">This week&rsquo;s bake</span><span class="cabin-week-when">' + esc(w.when) + '</span></div>' +
            '<ul class="cabin-week-list">' + w.items.map(function (i) {
                return '<li>' + (i.photo ? '<img src="' + esc(i.photo) + '" alt="" loading="lazy" width="48" height="48">' : '<span></span>') +
                    '<span class="cabin-week-name">' + esc(i.name) + '</span><span class="cabin-week-price">' + esc(i.price) + '</span></li>';
            }).join('') + '</ul>' +
            '<a class="gh-btn" href="' + esc(w.orderUrl || fallback.href) + '">Place Order</a>';
        box.hidden = false;
        if (fallback) fallback.hidden = true;
    }).catch(function () {});
})();
