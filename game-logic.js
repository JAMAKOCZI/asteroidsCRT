/**
 * Pure Asteroids CRT helpers — shared by the browser game and Node tests.
 * No DOM, no Canvas. Safe to require/import in Node.
 *
 * Browser: exposes global `AsteroidsLogic`.
 * Node/CommonJS: module.exports.
 * ESM: named exports via createRequire or dynamic import of CJS.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.AsteroidsLogic = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var TARGET_FPS = 60;
    var COMBO_MAX_MULT = 5;
    var COMBO_WINDOW = 110;
    var BOSS_LEVEL_INTERVAL = 5;
    var SURVIVE_GOAL_SEC = 120;
    var HYPERSPACE_COOLDOWN = 180;
    var HYPERSPACE_SAFE_COOLDOWN = 320;
    var HYPERSPACE_HOLD_FRAMES = 28;
    var EXTRA_LIFE_EVERY = 10000;

    var CRT_PHOSPHORS = [
        { name: 'Green', hex: '#00FF66', bg: '#000a04' },
        { name: 'Amber', hex: '#FFB000', bg: '#0a0700' },
        { name: 'White', hex: '#E8F0FF', bg: '#05060a' },
        { name: 'Aqua', hex: '#00E5C8', bg: '#000a09' },
        { name: 'Orange-red', hex: '#FF5A2A', bg: '#0a0302' },
        { name: 'Ice blue', hex: '#6AB0FF', bg: '#02040a' },
        { name: 'Chartreuse', hex: '#C8FF40', bg: '#060a00' },
        { name: 'Magenta', hex: '#FF55C8', bg: '#0a0208' }
    ];

    var CHALLENGE_OPTS = [
        { id: 'none', label: 'NONE' },
        { id: 'nohs', label: 'NO HYPER' },
        { id: 'nopu', label: 'NO POWER' },
        { id: 'survive', label: 'SURVIVE 2:00' }
    ];

    function mulberry32(seed) {
        var a = seed >>> 0;
        return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            var t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function hashString32(str) {
        var h = 2166136261;
        var s = String(str);
        for (var i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    /** UTC calendar id YYYYMMDD (uses optional Date for tests). */
    function utcDayId(date) {
        var d = date || new Date();
        var y = d.getUTCFullYear();
        var m = String(d.getUTCMonth() + 1).padStart(2, '0');
        var day = String(d.getUTCDate()).padStart(2, '0');
        return '' + y + m + day;
    }

    function dailySeedFromDayId(dayId) {
        return hashString32('asteroids-daily-' + dayId);
    }

    function seedForLevel(dailySeed, level) {
        return hashString32(dailySeed + '-L' + level);
    }

    /**
     * Wrap position into [0, width) × [0, height) with proper modulo for negatives.
     * Mutates and returns obj.
     */
    function wrap(obj, width, height) {
        var w = width;
        var h = height;
        obj.x = ((obj.x % w) + w) % w;
        obj.y = ((obj.y % h) + h) % h;
        return obj;
    }

    function phosphorIndexForLevel(level) {
        var n = CRT_PHOSPHORS.length;
        return ((Math.max(1, level | 0) - 1) % n + n) % n;
    }

    function phosphorForLevel(level) {
        return CRT_PHOSPHORS[phosphorIndexForLevel(level)];
    }

    /**
     * Combo multiplier after `count` kills in the chain.
     * kills 1→×1, 2–3→×2, 4–5→×3, 6–7→×4, 8+→×5
     */
    function comboMultiplier(count) {
        var c = Math.max(0, count | 0);
        if (c <= 0) return 1;
        return Math.min(COMBO_MAX_MULT, 1 + Math.floor(c / 2));
    }

    function applyComboPoints(basePoints, mult) {
        return Math.floor(basePoints * Math.max(1, mult | 0));
    }

    /**
     * Alien spawn delay in frames @ TARGET_FPS.
     * hard mode scales real-time window by 0.72 (same as game).
     */
    function alienSpawnDelayFrames(minMs, maxMs, hard, random01) {
        var r = typeof random01 === 'function' ? random01() : 0.5;
        if (r < 0) r = 0;
        if (r > 1) r = 1;
        var scale = hard ? 0.72 : 1;
        var minF = ((minMs * scale) / 1000) * TARGET_FPS;
        var maxF = ((maxMs * scale) / 1000) * TARGET_FPS;
        return minF + r * (maxF - minF);
    }

    function asteroidPoints(size) {
        if (size > 30) return 20;
        if (size > 15) return 50;
        return 100;
    }

    function hardScale(hard) {
        return hard ? 1.28 : 1;
    }

    function qualifiesForHighScore(score, board) {
        if (score <= 0) return false;
        board = board || [];
        if (board.length < 10) return true;
        var last = board[board.length - 1];
        var lowest = last && typeof last.score === 'number' ? last.score : 0;
        return score >= lowest;
    }

    function sanitizeLeaderboardRows(data) {
        if (!Array.isArray(data)) return [];
        return data
            .map(function (row) {
                if (!row || typeof row !== 'object') return null;
                var initials = String(row.initials || '')
                    .toUpperCase()
                    .replace(/[^A-Z]/g, '')
                    .slice(0, 3);
                var score = Number(row.score);
                if (!initials || !Number.isFinite(score) || score < 0) return null;
                return { initials: initials, score: Math.floor(score) };
            })
            .filter(Boolean)
            .sort(function (a, b) {
                return b.score - a.score;
            })
            .slice(0, 10);
    }

    function leaderboardKeyFor(meta) {
        meta = meta || {};
        if (meta.daily) return 'asteroidsLeaderboardDaily-' + (meta.dayId || utcDayId());
        if (meta.challenge === 'nohs') return 'asteroidsLB-ch-nohs';
        if (meta.challenge === 'nopu') return 'asteroidsLB-ch-nopu';
        if (meta.challenge === 'survive') return 'asteroidsLB-ch-survive';
        return 'asteroidsLeaderboard';
    }

    function formatTime(sec) {
        var s = Math.max(0, Math.floor(sec));
        var m = Math.floor(s / 60);
        var r = s % 60;
        return m + ':' + (r < 10 ? '0' : '') + r;
    }

    function accuracyPct(shots, hits) {
        if (shots <= 0) return 0;
        return Math.min(100, Math.round((hits / shots) * 100));
    }

    function isBossLevel(level) {
        return level >= BOSS_LEVEL_INTERVAL && level % BOSS_LEVEL_INTERVAL === 0;
    }

    function hyperspaceIsSafeHold(chargeFrames) {
        return chargeFrames >= HYPERSPACE_HOLD_FRAMES;
    }

    function checkCollision(obj1, obj2, radius1, radius2) {
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy) < radius1 + radius2;
    }

    function nextExtraLifeThreshold(currentThreshold, score) {
        var t = currentThreshold;
        var livesGained = 0;
        while (score >= t) {
            livesGained++;
            t += EXTRA_LIFE_EVERY;
        }
        return { nextExtraLife: t, livesGained: livesGained };
    }

    return {
        TARGET_FPS: TARGET_FPS,
        COMBO_MAX_MULT: COMBO_MAX_MULT,
        COMBO_WINDOW: COMBO_WINDOW,
        BOSS_LEVEL_INTERVAL: BOSS_LEVEL_INTERVAL,
        SURVIVE_GOAL_SEC: SURVIVE_GOAL_SEC,
        HYPERSPACE_COOLDOWN: HYPERSPACE_COOLDOWN,
        HYPERSPACE_SAFE_COOLDOWN: HYPERSPACE_SAFE_COOLDOWN,
        HYPERSPACE_HOLD_FRAMES: HYPERSPACE_HOLD_FRAMES,
        EXTRA_LIFE_EVERY: EXTRA_LIFE_EVERY,
        CRT_PHOSPHORS: CRT_PHOSPHORS,
        CHALLENGE_OPTS: CHALLENGE_OPTS,
        mulberry32: mulberry32,
        hashString32: hashString32,
        utcDayId: utcDayId,
        dailySeedFromDayId: dailySeedFromDayId,
        seedForLevel: seedForLevel,
        wrap: wrap,
        phosphorIndexForLevel: phosphorIndexForLevel,
        phosphorForLevel: phosphorForLevel,
        comboMultiplier: comboMultiplier,
        applyComboPoints: applyComboPoints,
        alienSpawnDelayFrames: alienSpawnDelayFrames,
        asteroidPoints: asteroidPoints,
        hardScale: hardScale,
        qualifiesForHighScore: qualifiesForHighScore,
        sanitizeLeaderboardRows: sanitizeLeaderboardRows,
        leaderboardKeyFor: leaderboardKeyFor,
        formatTime: formatTime,
        accuracyPct: accuracyPct,
        isBossLevel: isBossLevel,
        hyperspaceIsSafeHold: hyperspaceIsSafeHold,
        checkCollision: checkCollision,
        nextExtraLifeThreshold: nextExtraLifeThreshold
    };
});
