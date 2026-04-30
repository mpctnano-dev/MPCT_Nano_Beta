/*
 * JS/validation.js
 *
 * Shared client-side validation primitives used by all three submission
 * forms: Reserve_Equipment.html (booking.js), Contact_Us.html (script.js),
 * and ServiceRequest.html (inline). Each form keeps its own orchestrator
 * (different field IDs, different error UI) but calls these helpers so
 * the underlying rules stay identical across pages — and identical to the
 * server-side rules in includes/validation.php.
 *
 * Regex parity with PHP: any change to NAME_RE, EMAIL_RE, EMOJI_RE,
 * MASHING_RE, or HTML_TAG_RE must be mirrored in includes/validation.php
 * or the server will reject inputs the browser said were fine (or vice
 * versa).
 *
 * Loads as a plain script (no module system). Exposes one global:
 * window.MPCT.Validation.
 */
(function (global) {
    'use strict';

    var Validation = {};

    /* Same patterns as the PHP side. Don't change one without the other. */
    Validation.NAME_RE     = /^[\p{L}\s'\-\.]+$/u;
    Validation.EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    Validation.EMOJI_RE    = /\p{Extended_Pictographic}/u;
    Validation.MASHING_RE  = /(.)\1{3,}/u;
    Validation.HTML_TAG_RE = /<\s*\/?(script|img|iframe|object|embed|svg|form|input|button|a\s|div|span|style|link|meta|base|body|html)\b/i;
    Validation.HTML_ATTR_RE = /(on\w+\s*=|javascript\s*:)/i;

    /* Predicates — return true/false. Empty string passes (caller decides
       whether the field is required). */
    Validation.isEmail = function (v) {
        v = (v || '').trim();
        return v === '' || Validation.EMAIL_RE.test(v);
    };
    Validation.isValidName = function (v) {
        v = (v || '').trim();
        return v === '' || (!Validation.EMOJI_RE.test(v) && Validation.NAME_RE.test(v));
    };
    Validation.hasEmoji = function (v) {
        return Validation.EMOJI_RE.test(v || '');
    };
    Validation.hasMashing = function (v) {
        return Validation.MASHING_RE.test(v || '');
    };
    Validation.hasHtmlTag = function (v) {
        v = v || '';
        return Validation.HTML_TAG_RE.test(v) || Validation.HTML_ATTR_RE.test(v);
    };

    /* Word count using the same whitespace split the PHP side uses. */
    Validation.wordCount = function (v) {
        v = (v || '').trim();
        return v ? v.split(/\s+/).length : 0;
    };

    /* Returns null on success, or a short reason string. */
    Validation.checkNumberRange = function (v, min, max) {
        v = (v || '').toString().trim();
        if (v === '') return null;
        var n = Number(v);
        if (isNaN(n)) return 'must be a valid number';
        if (n < 0)    return 'cannot be negative';
        if (min !== null && min !== undefined && n < min) return 'must be at least ' + min;
        if (max !== null && max !== undefined && n > max) return 'must be ' + max + ' or less';
        return null;
    };

    /* Date must parse as YYYY-MM-DD, not be in the past, and be within the
       same +6-month window the PHP side allows. Returns null or a reason. */
    Validation.checkDateInRange = function (v) {
        v = (v || '').trim();
        if (v === '') return null;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'must be a valid date (YYYY-MM-DD)';
        var d = new Date(v + 'T00:00:00');
        if (isNaN(d.getTime())) return 'must be a valid date (YYYY-MM-DD)';
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var max = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
        if (d < today) return 'cannot be in the past';
        if (d > max)   return 'must be within 6 months from today';
        return null;
    };

    /* Outline an input and clear the outline once the user starts editing.
       Each form's orchestrator can use this instead of duplicating the
       border/outline boilerplate three times. */
    Validation.markInvalid = function (el, color) {
        if (!el) return;
        color = color || 'var(--nau-red, #c0392b)';
        el.style.outline = '2px solid ' + color;
        el.style.outlineOffset = '2px';
        var clear = function () { el.style.outline = ''; el.style.outlineOffset = ''; };
        el.addEventListener('input',  clear, { once: true });
        el.addEventListener('change', clear, { once: true });
    };

    global.MPCT = global.MPCT || {};
    global.MPCT.Validation = Validation;
})(window);
