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

        var firstNameEl = getInput('firstName');
        var lastNameEl = getInput('lastName');
        var emailEl = getInput('email');
        var passwordEl = getInput('password');
        var confirmPasswordEl = getInput('confirmPassword');
        var termsEl = getInput('terms');

        var firstName = (firstNameEl ? firstNameEl.value : '').trim();
        var lastName = (lastNameEl ? lastNameEl.value : '').trim();
        var email = (emailEl ? emailEl.value : '').trim().toLowerCase();
        var password = passwordEl ? passwordEl.value : '';
        var confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';

        // Validate presence
        if (!firstName) { alert('Please enter your first name.'); setInvalid(firstNameEl); return; }
        if (!lastName) { alert('Please enter your last name.'); setInvalid(lastNameEl); return; }
        if (!email) { alert('Please enter your email.'); setInvalid(emailEl); return; }
        if (!password) { alert('Please create a password.'); setInvalid(passwordEl); return; }
        if (!confirmPassword) { alert('Please confirm your password.'); setInvalid(confirmPasswordEl); return; }
        if (termsEl && !(termsEl).checked) { alert('Please agree to the terms.'); (termsEl).focus(); return; }

        // Basic email shape
        var emailOk = /\S+@\S+\.\S+/.test(email);
        if (!emailOk) { alert('Please enter a valid email address.'); setInvalid(emailEl); return; }

        // Password match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            setInvalid(confirmPasswordEl);
            return;
        }

        // Save to localStorage (demo purposes only)
        var userRecord = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        try {
            localStorage.setItem('me_user', JSON.stringify(userRecord));
        } catch (err) {
            alert('Unable to save your account on this device.');
            return;
        }

        // Redirect to login
        window.location.href = 'login.html';
    });
});

