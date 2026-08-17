/*
 * JS/turnstile.js
 *
 * Shared Cloudflare Turnstile helpers for all submission forms.
 * Requires api.js?render=explicit and turnstile-config.php on the page.
 */
(function (global) {
    'use strict';

    var widgetIds = {};
    var widgetErrors = {};

    function getSiteKey() {
        var key = (global.MPCT_TURNSTILE_SITE_KEY || '').trim();
        if (!key || key === 'REPLACE_WITH_YOUR_SITE_KEY') {
            return '';
        }
        return key;
    }

    function getContainer(containerId) {
        return typeof containerId === 'string'
            ? document.getElementById(containerId)
            : containerId;
    }

    // Do not call turnstile.ready() — it throws when api.js is loaded with
    // async/defer (which all our form pages use). Poll for turnstile.render.
    function whenReady(callback, onTimeout) {
        if (global.turnstile && typeof global.turnstile.render === 'function') {
            callback();
            return;
        }

        var attempts = 0;
        var timer = setInterval(function () {
            attempts += 1;
            if (global.turnstile && typeof global.turnstile.render === 'function') {
                clearInterval(timer);
                callback();
            } else if (attempts >= 100) {
                clearInterval(timer);
                if (typeof onTimeout === 'function') {
                    onTimeout();
                }
            }
        }, 100);
    }

    function render(containerId, options) {
        var el = getContainer(containerId);
        if (!el) {
            return null;
        }

        var siteKey = getSiteKey();
        if (!siteKey) {
            widgetErrors[containerId] = 'missing-site-key';
            return null;
        }

        widgetErrors[containerId] = false;

        whenReady(function () {
            var existingId = el.getAttribute('data-turnstile-widget-id');
            if (existingId) {
                try {
                    global.turnstile.remove(existingId);
                } catch (err) {
                    /* ignore stale widget */
                }
                el.removeAttribute('data-turnstile-widget-id');
            }

            el.innerHTML = '';

            try {
                var widgetId = global.turnstile.render(el, Object.assign({
                    sitekey: siteKey,
                    theme: 'light',
                    action: 'turnstile-spin-v2',
                    'error-callback': function () {
                        widgetErrors[containerId] = 'widget-error';
                    },
                    'expired-callback': function () {
                        widgetErrors[containerId] = 'expired';
                    },
                    callback: function () {
                        widgetErrors[containerId] = false;
                    }
                }, options || {}));

                el.setAttribute('data-turnstile-widget-id', widgetId);
                widgetIds[containerId] = widgetId;
            } catch (err) {
                widgetErrors[containerId] = 'widget-error';
                if (typeof console !== 'undefined' && console.error) {
                    console.error('MPCT Turnstile render failed:', err);
                }
            }
        }, function () {
            widgetErrors[containerId] = 'widget-error';
        });

        return null;
    }

    function ensureRendered(containerId, options) {
        var el = getContainer(containerId);
        if (!el) {
            return;
        }

        if (el.getAttribute('data-turnstile-widget-id')) {
            return;
        }

        render(containerId, options);
    }

    function reset(containerId) {
        var el = getContainer(containerId);
        if (!el || !global.turnstile) {
            return;
        }

        var widgetId = el.getAttribute('data-turnstile-widget-id') || widgetIds[containerId];
        if (!widgetId) {
            ensureRendered(containerId);
            return;
        }

        widgetErrors[containerId] = false;

        try {
            global.turnstile.reset(widgetId);
        } catch (err) {
            render(containerId);
        }
    }

    function getToken(form) {
        if (!form) {
            return '';
        }
        var input = form.querySelector('[name="cf-turnstile-response"]');
        return input && input.value ? input.value.trim() : '';
    }

    function getBlockReason(form, containerId) {
        if (!getSiteKey()) {
            return 'Security check is not configured. Add your Turnstile site key to the server config.';
        }
        if (containerId && widgetErrors[containerId]) {
            return 'Security check failed to load. Confirm your domain is allowed on your Turnstile widget, refresh, and try again.';
        }
        if (!getToken(form)) {
            return 'Please wait for the security check to finish (spinner above Submit).';
        }
        return '';
    }

    function requireToken(form) {
        return getToken(form) !== '';
    }

    global.MPCT = global.MPCT || {};
    global.MPCT.Turnstile = {
        getSiteKey: getSiteKey,
        render: render,
        ensureRendered: ensureRendered,
        reset: reset,
        getToken: getToken,
        getBlockReason: getBlockReason,
        requireToken: requireToken
    };
})(window);
