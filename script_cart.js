"use strict";

document.addEventListener("DOMContentLoaded", function () {
    var cartGrid = document.getElementById('cartGrid');
    var cartSummary = document.getElementById('cartSummary');
    var likedGrid = document.getElementById('likedGrid');
    var likesCountEl = document.getElementById('likesCount');
    var cartCountEl = document.getElementById('cartCount');

    // Use helpers from script_home.js: CATALOG, readCart/readLikes, formatPrice, etc.
    // We replicate minimal helpers here to avoid tight coupling if needed.

    var user = null;
    try { user = JSON.parse(localStorage.getItem('me_user') || 'null'); } catch (e) { user = null; }
    var userEmail = user && user.email ? String(user.email).toLowerCase() : null;

    function readCart() {
        if (!userEmail) return [];
        try { return JSON.parse(localStorage.getItem('me_cart_' + userEmail) || '[]'); } catch (e) { return []; }
    }
    function writeCart(cart) {
        if (!userEmail) return;
        try { localStorage.setItem('me_cart_' + userEmail, JSON.stringify(cart)); } catch (e) { /* ignore */ }
    }
    function readLikes() {
        if (!userEmail) return [];
        try { return JSON.parse(localStorage.getItem('me_likes_' + userEmail) || '[]'); } catch (e) { return []; }
    }
    function writeLikes(likes) {
        if (!userEmail) return;
        try { localStorage.setItem('me_likes_' + userEmail, JSON.stringify(likes)); } catch (e) { /* ignore */ }
    }
    function formatPrice(value) {
        try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value); }
        catch (e) { return '$' + Number(value).toFixed(2); }
    }

    function getCatalog() {
        if (typeof CATALOG !== 'undefined' && Array.isArray(CATALOG)) return CATALOG;
        return [];
    }

    function renderCart() {
        var cart = readCart();
        var catalog = getCatalog();
        var frag = document.createDocumentFragment();
        cartGrid.innerHTML = '';
        var total = 0;
        cart.forEach(function (item) {
            var product = catalog.find(function (p) { return p.id === item.id; });
            if (!product) return;
            total += (product.price || 0) * (item.qty || 1);

            var card = document.createElement('article');
            card.className = 'cart-card';
            var row = document.createElement('div');
            row.className = 'row';
            var img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            var info = document.createElement('div');
            info.style.flex = '1';
            info.innerHTML = '<div class="title">' + product.name + '</div>' +
                '<div class="muted">' + (product.category || '') + '</div>' +
                '<div class="price">' + formatPrice(product.price) + '</div>';

            var controls = document.createElement('div');
            controls.className = 'controls';
            var minus = document.createElement('button'); minus.className = 'qty-btn'; minus.textContent = '−';
            var qty = document.createElement('span'); qty.className = 'qty'; qty.textContent = String(item.qty || 1);
            var plus = document.createElement('button'); plus.className = 'qty-btn'; plus.textContent = '+';

            minus.addEventListener('click', function () { changeQty(item.id, -1); });
            plus.addEventListener('click', function () { changeQty(item.id, +1); });

            controls.appendChild(minus); controls.appendChild(qty); controls.appendChild(plus);
            info.appendChild(controls);

            // Add remove button next to price
            var priceRow = document.createElement('div');
            priceRow.style.display = 'flex';
            priceRow.style.alignItems = 'center';
            priceRow.style.justifyContent = 'space-between';
            priceRow.style.marginTop = '8px';
            
            var priceSpan = document.createElement('span');
            priceSpan.className = 'price';
            priceSpan.textContent = formatPrice(product.price);
            
            var removeBtn = document.createElement('button');
            removeBtn.className = 'btn remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', function () { removeFromCart(item.id); });
            
            priceRow.appendChild(priceSpan);
            priceRow.appendChild(removeBtn);
            
            // Replace the price div with the new price row
            var oldPrice = info.querySelector('.price');
            if (oldPrice) {
                oldPrice.parentNode.replaceChild(priceRow, oldPrice);
            }

            row.appendChild(img); row.appendChild(info);
            card.appendChild(row);
            frag.appendChild(card);
        });
        cartGrid.appendChild(frag);
        cartSummary.innerHTML = '<strong>Total: ' + formatPrice(total) + '</strong>';
        updateBadges();
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
        renderCart();
        updateBadges();
    }

    function removeFromCart(productId) {
        var cart = readCart();
        cart = cart.filter(function (item) { return item.id !== productId; });
        writeCart(cart);
        renderCart();
        updateBadges();
    }

    function renderLiked() {
        var likes = readLikes();
        var catalog = getCatalog();
        var likedProducts = catalog.filter(function (p) { return likes.indexOf(p.id) !== -1; });
        var frag = document.createDocumentFragment();
        likedGrid.innerHTML = '';
        likedProducts.forEach(function (p) {
            var article = document.createElement('article');
            article.className = 'product-card';
            var media = document.createElement('div'); media.className = 'product-media';
            var img = document.createElement('img'); img.src = p.image; img.alt = p.name; media.appendChild(img);
            var body = document.createElement('div'); body.className = 'product-body';
            var name = document.createElement('h3'); name.className = 'product-name'; name.textContent = p.name;
            var meta = document.createElement('div'); meta.className = 'product-meta';
            meta.innerHTML = '<span class="product-price">' + formatPrice(p.price) + '</span><span class="product-category">' + p.category + '</span>';
            var actions = document.createElement('div'); actions.className = 'product-actions';
            var likeBtn = document.createElement('button');
            likeBtn.className = 'like-btn liked';
            likeBtn.setAttribute('aria-label', 'Remove from likes');
            likeBtn.innerHTML = '♥';
            likeBtn.addEventListener('click', function () {
                var current = readLikes();
                var idx = current.indexOf(p.id);
                if (idx !== -1) { current.splice(idx, 1); }
                writeLikes(current);
                updateBadges();
                renderLiked();
            });
            actions.appendChild(likeBtn);
            body.appendChild(name); body.appendChild(meta);
            body.appendChild(actions);
            article.appendChild(media); article.appendChild(body);
            frag.appendChild(article);
        });
        likedGrid.appendChild(frag);
    }

    function updateBadges() {
        if (likesCountEl) {
            try { likesCountEl.textContent = String(readLikes().length); } catch (e) { /* ignore */ }
        }
        if (cartCountEl) {
            try {
                var items = readCart();
                var count = items.reduce(function (sum, it) { return sum + (it.qty || 1); }, 0);
                cartCountEl.textContent = String(count);
            } catch (e) { /* ignore */ }
        }
    }

    renderCart();
    renderLiked();
});


