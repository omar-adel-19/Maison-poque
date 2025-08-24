"use strict";

document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector('.auth-form');
    if (!form) return;

    function getInput(name) {
        var el = form.elements.namedItem(name);
        return el && 'value' in el ? el : null;
    }

    function setInvalid(inputEl) {
        if (!inputEl) return;
        inputEl.setAttribute('aria-invalid', 'true');
        inputEl.focus();
    }

    function clearInvalidStates() {
        var inputs = form.querySelectorAll('input');
        inputs.forEach(function (i) { i.removeAttribute('aria-invalid'); });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearInvalidStates();

        var emailEl = getInput('email');
        var passwordEl = getInput('password');
        var email = (emailEl ? emailEl.value : '').trim().toLowerCase();
        var password = passwordEl ? passwordEl.value : '';

        if (!email) { alert('Please enter your email.'); setInvalid(emailEl); return; }
        if (!password) { alert('Please enter your password.'); setInvalid(passwordEl); return; }

        var raw = null;
        try {
            raw = localStorage.getItem('me_user');
        } catch (err) {
            // ignore
        }

        if (!raw) {
            alert('No account found on this device. Please sign up first.');
            window.location.href = 'signup.html';
            return;
        }

        var user;
        try { user = JSON.parse(raw) || {}; } catch (err) { user = {}; }

        var matches = user && typeof user === 'object' &&
            String(user.email || '').toLowerCase() === email &&
            String(user.password || '') === password;

        if (!matches) {
            alert('Incorrect email or password.');
            setInvalid(passwordEl);
            return;
        }

        try {
            localStorage.setItem('me_logged_in', 'true');
            localStorage.setItem('me_user_email', user.email);
        } catch (err) {
            // ignore persistence errors
        }

        // Redirect to home
        window.location.href = 'index.html';
    });
});

