"use strict";

// Basic in-memory catalog. Update or extend as needed.
// Images reference files in `prods/`. Replace paths if you reorganize assets.
var CATALOG = [
    // Summer polos
    { id: "sp1", name: "Lacoste Green Polo ", price: 1499, category: "summer-polos",image: "prods/summer_polo/1.jpg" },
    { id: "sp2", name: "White classic Polo ", price: 1100, category: "summer-polos", image: "prods/summer_polo/2.jpg" },
    { id: "sp3", name: "Knit Dark Green Polo", price: 1100, category: "summer-polos", image: "prods/summer_polo/3.jpg" },
    { id: "sp4", name: "Brownstone Vertical Polo", price: 1299, category: "summer-polos", image: "prods/summer_polo/4.jpg" },
    { id: "sp5", name: "Lacoste Heritage Polo", price: 1499, category: "summer-polos", image: "prods/summer_polo/5.jpg" },
    { id: "sp6", name: "Midnight Stripes Polo", price: 999, category: "summer-polos", image: "prods/summer_polo/6.jpg" },
    { id: "sp7", name: "Midnight Ledger Polo", price: 999, category: "summer-polos", image: "prods/summer_polo/7.jpg" },
    { id: "sp8", name: "Navy Knit Polo", price: 850, category: "summer-polos", image: "prods/summer_polo/8.jpg" },
    { id: "sp9", name: "Maroon Knit Polo", price: 850, category: "summer-polos", image: "prods/summer_polo/9.jpg" },
    { id: "sp10", name: "Midnight Texture Button-Up", price: 850, category: "summer-polos", image: "prods/summer_polo/10.jpg" },
    { id: "sp11", name: "Green Ivy Button-Up", price: 1499, category: "summer-polos", image: "prods/summer_polo/11.jpg" },
    { id: "sp12", name: "Short Sleeve Polo", price: 850, category: "summer-polos", image: "prods/summer_polo/12.jpg" },


    // Winter tops
    { id: "wt1", name: "Ralph Lauren Sleeve Polo", price: 1999, category: "winter-tops", image: "prods/winter_tops/1.jpg" },
    { id: "wt2", name: "Ralph Lauren Zip-up", price: 2299, category: "winter-tops", image: "prods/winter_tops/2.jpg" },
    { id: "wt3", name: "Ralph Lauren Zip-up", price: 2299, category: "winter-tops", image: "prods/winter_tops/3.jpg" },
    { id: "wt4", name: "Ralph Lauren Black Zip-up", price: 2299, category: "winter-tops", image: "prods/winter_tops/4.jpg" },
    { id: "wt5", name: "Ralph Lauren Brown Zip-up", price: 2299, category: "winter-tops", image: "prods/winter_tops/5.jpg" },

    // Jackets
    { id: "j1", name: "black Grenfell Jacket", price: 3599, category: "jackets", image: "prods/jackets/1.jpg" },
    { id: "j2", name: "White Checkered Jacket", price: 2999, category: "jackets", image: "prods/jackets/2.jpg" },
    { id: "j3", name: "country-side Grenfell Jacket", price: 3599, category: "jackets", image: "prods/jackets/3.jpg" },
    { id: "j4", name: "Dark Grey Wool Coat", price: 3699, category: "jackets", image: "prods/jackets/4.jpg" },
    { id: "j5", name: "Brown Wool Coat", price: 3699, category: "jackets", image: "prods/jackets/5.jpg" },

    // Trousers
    { id: "t1", name: "Beige Stretch Chino", price: 2100, category: "trousers", image: "prods/trousers/1.jpg" },
    { id: "t2", name: "Navy Stretch Chino", price: 1400, category: "trousers", image: "prods/trousers/2.jpg" },
    { id: "t3", name: "Beige Slim Chino", price: 1450, category: "trousers", image: "prods/trousers/3.jpg" },
    { id: "t4", name: "Brown Slim Chino", price: 1450, category: "trousers", image: "prods/trousers/4.jpg" },
    { id: "t5", name: "Green Slim Chino", price: 1450, category: "trousers", image: "prods/trousers/5.jpg" },
    { id: "t6", name: "Grey Tailored Trousers", price: 1450, category: "trousers", image: "prods/trousers/6.jpg" },
    { id: "t7", name: "Beige Tailored Trousers", price: 1450, category: "trousers", image: "prods/trousers/7.jpg" },
    { id: "t8", name: "Dark Grey Tailored Trousers", price: 1450, category: "trousers", image: "prods/trousers/8.jpg" },
    { id: "t9", name: "Brown Tailored Trousers", price: 1450, category: "trousers", image: "prods/trousers/9.jpg" },
    { id: "t10", name: "Off-White Linen Trouser", price: 1200, category: "trousers", image: "prods/trousers/Ralph_Lauren_1.jpg" },
];

document.addEventListener("DOMContentLoaded", function () {
    var productsContainer = document.getElementById('products');
    if (!productsContainer) return;

    var selectEl = document.querySelector('.toolbar .select');
    var searchInput = document.querySelector('.toolbar .search-input');
    var searchButton = document.querySelector('.toolbar .btn.btn-primary');
    var guestActions = document.getElementById('guestActions');
    var userActions = document.getElementById('userActions');
    var greetingEl = document.getElementById('greeting');
    var likesCountEl = document.getElementById('likesCount');
    var cartCountEl = document.getElementById('cartCount');
    var logoutBtn = document.getElementById('logoutBtn');
    var cartBtn = document.getElementById('cartBtn');
    var cartDropdown = document.getElementById('cartDropdown');

    var user = null;
    try { user = JSON.parse(localStorage.getItem('me_user') || 'null'); } catch (e) { user = null; }
    var userEmail = user && user.email ? String(user.email).toLowerCase() : null;
    var isLoggedIn = false;
    try { isLoggedIn = localStorage.getItem('me_logged_in') === 'true'; } catch (e) { isLoggedIn = false; }

    function readLikes() {
        if (!userEmail) return [];
        try { return JSON.parse(localStorage.getItem('me_likes_' + userEmail) || '[]'); } catch (e) { return []; }
    }

    function writeLikes(likes) {
        if (!userEmail) return;
        try { localStorage.setItem('me_likes_' + userEmail, JSON.stringify(likes)); } catch (e) { /* ignore */ }
    }

    function readCart() {
        if (!userEmail) return [];
        try { return JSON.parse(localStorage.getItem('me_cart_' + userEmail) || '[]'); } catch (e) { return []; }
    }

    function writeCart(cart) {
        if (!userEmail) return;
        try { localStorage.setItem('me_cart_' + userEmail, JSON.stringify(cart)); } catch (e) { /* ignore */ }
    }

    function formatPrice(value) {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
        } catch (e) {
            return '$' + Number(value).toFixed(2);
        }
    }

    function buildCard(product, likedIds) {
        var article = document.createElement('article');
        article.className = 'product-card';
        article.setAttribute('data-id', product.id);
        article.setAttribute('data-category', product.category);

        var imgWrap = document.createElement('div');
        imgWrap.className = 'product-media';
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = product.name;
        img.src = product.image;
        img.onerror = function () { imgWrap.classList.add('img-missing'); };
        imgWrap.appendChild(img);

        var body = document.createElement('div');
        body.className = 'product-body';

        var name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = product.name;

        var meta = document.createElement('div');
        meta.className = 'product-meta';
        meta.innerHTML = '<span class="product-price">' + formatPrice(product.price) + '</span>' +
            '<span class="product-category">' + toLabel(product.category) + '</span>';

        var actions = document.createElement('div');
        actions.className = 'product-actions';

        var addBtn = document.createElement('button');
        addBtn.className = 'btn add-btn';
        addBtn.textContent = isInCart(product.id) ? 'Remove from cart' : 'Add to cart';
        if (isInCart(product.id)) {
            addBtn.classList.remove('add-btn');
            addBtn.classList.add('remove-btn');
        }
        addBtn.addEventListener('click', function () { toggleCart(product.id, addBtn); });

        var likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn' + (likedIds.indexOf(product.id) !== -1 ? ' liked' : '');
        likeBtn.setAttribute('aria-label', 'Like product');
        likeBtn.innerHTML = '♥';
        likeBtn.addEventListener('click', function () { onToggleLike(product.id, likeBtn); });

        actions.appendChild(addBtn);
        actions.appendChild(likeBtn);

        body.appendChild(name);
        body.appendChild(meta);
        body.appendChild(actions);

        article.appendChild(imgWrap);
        article.appendChild(body);
        return article;
    }

    function toLabel(category) {
        switch (category) {
            case 'summer-polos': return 'Summer polos';
            case 'winter-tops': return 'Winter tops';
            case 'jackets': return 'Jackets';
            case 'trousers': return 'Trousers';
            default: return category;
        }
    }

    function ensureSignedUpOrRedirect() {
        var exists = false;
        try { exists = !!localStorage.getItem('me_user'); } catch (e) { exists = false; }
        if (!exists) {
            window.location.href = 'signup.html';
            return false;
        }
        return true;
    }

    function onToggleLike(productId, btn) {
        if (!ensureSignedUpOrRedirect()) return;
        var likes = readLikes();
        var idx = likes.indexOf(productId);
        if (idx === -1) {
            likes.push(productId);
            btn.classList.add('liked');
        } else {
            likes.splice(idx, 1);
            btn.classList.remove('liked');
        }
        writeLikes(likes);
    }

    function isInCart(productId) {
        var cart = readCart();
        return cart.some(function (c) { return c.id === productId; });
    }

    function toggleCart(productId, buttonEl) {
        if (!ensureSignedUpOrRedirect()) return;
        var cart = readCart();
        var idx = cart.findIndex(function (c) { return c.id === productId; });
        if (idx === -1) {
            cart.push({ id: productId, qty: 1 });
            buttonEl.textContent = 'Remove from cart';
            buttonEl.classList.remove('add-btn');
            buttonEl.classList.add('remove-btn');
        } else {
            cart.splice(idx, 1);
            buttonEl.textContent = 'Add to cart';
            buttonEl.classList.remove('remove-btn');
            buttonEl.classList.add('add-btn');
        }
        writeCart(cart);
        updateBadges();
    }

    function filterAndRender() {
        var query = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
        var selected = selectEl ? String(selectEl.value) : 'all';
        if (selected === '1') selected = 'all'; // compatibility with current markup

        var likedIds = readLikes();
        var list = CATALOG.filter(function (p) {
            var okCat = selected === 'all' || !selected ? true : p.category === selected;
            var okText = !query || p.name.toLowerCase().indexOf(query) !== -1 || toLabel(p.category).toLowerCase().indexOf(query) !== -1;
            return okCat && okText;
        });

        productsContainer.innerHTML = '';
        if (list.length === 0) {
            var empty = document.createElement('p');
            empty.textContent = 'No products found.';
            productsContainer.appendChild(empty);
            return;
        }
        var frag = document.createDocumentFragment();
        list.forEach(function (p) { frag.appendChild(buildCard(p, likedIds)); });
        productsContainer.appendChild(frag);
    }

    if (selectEl) selectEl.addEventListener('change', filterAndRender);
    if (searchButton) searchButton.addEventListener('click', function (e) { e.preventDefault(); filterAndRender(); });
    if (searchInput) searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); filterAndRender(); } });

    function buildCartDropdown() {
        if (!cartDropdown) return;
        var cart = readCart();
        cartDropdown.innerHTML = '';
        if (cart.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'cart-empty';
            empty.textContent = 'Your cart is empty.';
            cartDropdown.appendChild(empty);
        } else {
            cart.forEach(function (item) {
                var product = CATALOG.find(function (p) { return p.id === item.id; });
                if (!product) return;
                var row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = '<div class="ci-row"><span class="ci-name">' + product.name + '</span><span class="ci-price">' + formatPrice(product.price) + '</span></div>';
                var controls = document.createElement('div');
                controls.className = 'ci-controls';

                var minus = document.createElement('button');
                minus.className = 'qty-btn';
                minus.textContent = '−';
                minus.addEventListener('click', function () {
                    changeQty(item.id, -1);
                });

                var qty = document.createElement('span');
                qty.className = 'qty';
                qty.textContent = String(item.qty || 1);

                var plus = document.createElement('button');
                plus.className = 'qty-btn';
                plus.textContent = '+';
                plus.addEventListener('click', function () {
                    changeQty(item.id, +1);
                });

                controls.appendChild(minus);
                controls.appendChild(qty);
                controls.appendChild(plus);
                row.appendChild(controls);
                cartDropdown.appendChild(row);
            });

            var footer = document.createElement('div');
            footer.className = 'cart-footer';
            var goCart = document.createElement('a');
            goCart.className = 'btn btn-primary';
            goCart.href = 'cart.html';
            goCart.textContent = 'Go to cart';
            footer.appendChild(goCart);
            cartDropdown.appendChild(footer);
        }
    }

    function changeQty(productId, delta) {
        var cart = readCart();
        var found = cart.find(function (c) { return c.id === productId; });
        if (!found) return;
        var newQty = (found.qty || 1) + delta;
        if (newQty <= 0) {
            cart = cart.filter(function (c) { return c.id !== productId; });
        } else {
            found.qty = newQty;
        }
        writeCart(cart);
        updateBadges();
        buildCartDropdown();
        // Also update any visible product cards' buttons
        var btn = document.querySelector('.product-card[data-id="' + productId + '"] .product-actions .btn');
        if (btn) {
            if (isInCart(productId)) {
                btn.textContent = 'Remove from cart';
                btn.classList.remove('add-btn');
                btn.classList.add('remove-btn');
            } else {
                btn.textContent = 'Add to cart';
                btn.classList.remove('remove-btn');
                btn.classList.add('add-btn');
            }
        }
        // Keep dropdown open by ensuring it has the 'open' class
        if (cartDropdown) {
            cartDropdown.classList.add('open');
        }
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!ensureSignedUpOrRedirect()) return;
            if (!cartDropdown) return;
            var isOpen = cartDropdown.classList.contains('open');
            if (isOpen) {
                cartDropdown.classList.remove('open');
            } else {
                buildCartDropdown();
                cartDropdown.classList.add('open');
            }
        });
        // Close on outside click
        document.addEventListener('click', function (ev) {
            if (!cartDropdown) return;
            var within = cartDropdown.contains(ev.target) || cartBtn.contains(ev.target);
            if (!within) cartDropdown.classList.remove('open');
        });
    }

    function updateBadges() {
        if (!likesCountEl || !cartCountEl) return;
        var likeCount = readLikes().length;
        var cartItems = readCart();
        var cartCount = cartItems.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
        likesCountEl.textContent = likeCount;
        cartCountEl.textContent = cartCount;
    }

    function updateHeaderState() {
        if (!guestActions || !userActions) return;
        if (isLoggedIn && user) {
            guestActions.style.display = 'none';
            userActions.style.display = 'flex';
            if (greetingEl) greetingEl.textContent = 'Hello, ' + (user.firstName || '').trim();
            updateBadges();
        } else {
            guestActions.style.display = 'flex';
            userActions.style.display = 'none';
        }
    }

    if (logoutBtn) logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        try {
            localStorage.removeItem('me_logged_in');
            localStorage.removeItem('me_user_email');
            localStorage.removeItem('me_user');
        } catch (err) { /* ignore */ }
        window.location.href = 'signup.html';
    });

    updateHeaderState();
    filterAndRender();
});


