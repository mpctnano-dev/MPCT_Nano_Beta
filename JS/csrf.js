/*
 * JS/csrf.js
 *
 * Double-submit CSRF helpers. Requires csrf-token.php on the page so
 * window.MPCT_CSRF_TOKEN is set (cookie is HttpOnly; JS uses this global).
 */
(function (global) {
    'use strict';

    function getToken() {
        return (global.MPCT_CSRF_TOKEN || '').trim();
    }

    function applyToForm(form) {
        if (!form) {
            return;
        }

        var token = getToken();
        if (!token) {
            return;
        }

        var input = form.querySelector('input[name="csrf_token"]');
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'csrf_token';
            form.appendChild(input);
        }

        input.value = token;
        // Keep reset() from wiping the token to an empty default.
        try {
            input.defaultValue = token;
        } catch (err) {
            /* ignore */
        }
    }

    function applyToAllForms() {
        var forms = document.querySelectorAll('form');
        for (var i = 0; i < forms.length; i += 1) {
            applyToForm(forms[i]);
        }
    }

    function appendToFormData(formData) {
        var token = getToken();
        if (token && formData && typeof formData.set === 'function') {
            formData.set('csrf_token', token);
        }
        return formData;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyToAllForms);
    } else {
        applyToAllForms();
    }

    global.MPCT = global.MPCT || {};
    global.MPCT.Csrf = {
        getToken: getToken,
        applyToForm: applyToForm,
        applyToAllForms: applyToAllForms,
        appendToFormData: appendToFormData,
    };
})(window);
