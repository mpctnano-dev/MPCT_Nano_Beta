/*
 * JS/supabase-read.js
 *
 * Read-only access to the LIMS database for the booking page: the equipment
 * catalog and, for a chosen instrument and date, the hours already taken.
 *
 * Only these two stored functions are reachable with the publishable key.
 * Submitting a reservation goes through EquipmentReservation.php, which holds
 * the credential that authorises writes — nothing here can create a booking.
 *
 * Requires supabase-config.php on the page for window.MPCT_SUPABASE.
 */
(function (global) {
    'use strict';

    const MPCT = global.MPCT = global.MPCT || {};

    function config() {
        const cfg = global.MPCT_SUPABASE;
        return cfg && cfg.url && cfg.key ? cfg : null;
    }

    /* True when the page has enough configuration to reach the database. */
    function isAvailable() {
        return config() !== null;
    }

    async function rpc(fn, args) {
        const cfg = config();
        if (!cfg) throw new Error('Live availability is not configured.');

        const res = await fetch(cfg.url.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, {
            method: 'POST',
            headers: {
                'apikey': cfg.key,
                'Authorization': 'Bearer ' + cfg.key,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(args || {})
        });

        const payload = await res.json().catch(() => null);

        if (!res.ok) {
            const reason = payload && payload.message ? payload.message : 'HTTP ' + res.status;
            throw new Error(reason);
        }

        return payload;
    }

    /*
     * The booking catalog, keyed by the EQ- identifier the rest of the page
     * already uses. Only equipment the database will actually accept a
     * booking for is returned as bookable.
     */
    async function loadCatalog() {
        const data = await rpc('get_booking_equipment_v1', {});
        const list = (data && data.equipment) || [];
        const byId = {};

        list.forEach(function (item) {
            byId[item.source_equipment_id] = {
                id: item.source_equipment_id,
                bookingId: item.booking_equipment_id,
                name: item.name,
                category: item.category,
                status: item.availability_status,
                warning: item.warning_message,
                bookable: item.availability_status === 'AVAILABLE'
            };
        });

        return byId;
    }

    /*
     * Approved appointments for one instrument on one date, as a set of
     * half-hour start times in minutes from midnight, Arizona time.
     */
    async function loadTakenSlots(bookingEquipmentId, isoDate) {
        const data = await rpc('get_equipment_booking_availability_v1', {
            p_booking_equipment_id: bookingEquipmentId,
            p_date: isoDate
        });

        const taken = new Set();

        ((data && data.approved) || []).forEach(function (row) {
            const start = minutesInArizona(row.starts_at);
            const end = minutesInArizona(row.ends_at);
            for (let m = start; m < end; m += 30) taken.add(m);
        });

        return taken;
    }

    /*
     * Minutes from midnight in Arizona for an ISO timestamp. Arizona does not
     * observe daylight saving, but the lab's own clock is what matters here,
     * so the conversion is done in that zone rather than the visitor's.
     */
    function minutesInArizona(iso) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Phoenix',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).formatToParts(new Date(iso));

        const hour = Number(parts.find(p => p.type === 'hour').value);
        const minute = Number(parts.find(p => p.type === 'minute').value);

        return (hour % 24) * 60 + minute;
    }

    /* ISO timestamp for a date and minutes-from-midnight in Arizona (UTC-7). */
    function arizonaIso(isoDate, minutes) {
        const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
        const mm = String(minutes % 60).padStart(2, '0');
        return isoDate + 'T' + hh + ':' + mm + ':00-07:00';
    }

    MPCT.SupabaseRead = {
        isAvailable: isAvailable,
        loadCatalog: loadCatalog,
        loadTakenSlots: loadTakenSlots,
        minutesInArizona: minutesInArizona,
        arizonaIso: arizonaIso
    };
})(window);
