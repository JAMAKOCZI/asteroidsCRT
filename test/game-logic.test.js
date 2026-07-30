/**
 * Node test suite for Asteroids CRT pure logic.
 * Run: node --test test/game-logic.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const L = require('../game-logic.js');

describe('wrap', () => {
    it('wraps positive overflow', () => {
        const o = { x: 850, y: 10 };
        L.wrap(o, 800, 600);
        assert.equal(o.x, 50);
        assert.equal(o.y, 10);
    });

    it('wraps negative positions', () => {
        const o = { x: -5, y: -10 };
        L.wrap(o, 800, 600);
        assert.equal(o.x, 795);
        assert.equal(o.y, 590);
    });

    it('is stable at edges after multi-screen jump', () => {
        const o = { x: -1605, y: 1205 };
        L.wrap(o, 800, 600);
        assert.ok(o.x >= 0 && o.x < 800);
        assert.ok(o.y >= 0 && o.y < 600);
    });
});

describe('phosphorForLevel', () => {
    it('level 1 is Green', () => {
        assert.equal(L.phosphorForLevel(1).name, 'Green');
    });

    it('cycles every 8 levels', () => {
        assert.equal(L.phosphorForLevel(1).name, L.phosphorForLevel(9).name);
        assert.equal(L.phosphorForLevel(2).name, 'Amber');
        assert.equal(L.phosphorForLevel(8).name, 'Magenta');
        assert.equal(L.phosphorIndexForLevel(16), L.phosphorIndexForLevel(8));
    });

    it('handles non-positive levels as 1-based cycle', () => {
        assert.equal(L.phosphorIndexForLevel(0), L.phosphorIndexForLevel(1));
    });
});

describe('combo', () => {
    it('maps kill counts to multipliers', () => {
        assert.equal(L.comboMultiplier(0), 1);
        assert.equal(L.comboMultiplier(1), 1);
        assert.equal(L.comboMultiplier(2), 2);
        assert.equal(L.comboMultiplier(3), 2);
        assert.equal(L.comboMultiplier(4), 3);
        assert.equal(L.comboMultiplier(8), 5);
        assert.equal(L.comboMultiplier(99), L.COMBO_MAX_MULT);
    });

    it('applies integer score with mult', () => {
        assert.equal(L.applyComboPoints(100, 3), 300);
        assert.equal(L.applyComboPoints(20, 1), 20);
    });
});

describe('qualifiesForHighScore', () => {
    it('rejects non-positive scores', () => {
        assert.equal(L.qualifiesForHighScore(0, []), false);
        assert.equal(L.qualifiesForHighScore(-1, []), false);
    });

    it('accepts any positive score when board has room', () => {
        assert.equal(L.qualifiesForHighScore(1, [{ initials: 'AAA', score: 10 }]), true);
    });

    it('accepts ties with 10th place', () => {
        const board = [];
        for (let i = 0; i < 10; i++) board.push({ initials: 'AAA', score: 1000 - i * 10 });
        // lowest is 910
        assert.equal(L.qualifiesForHighScore(910, board), true);
        assert.equal(L.qualifiesForHighScore(909, board), false);
    });
});

describe('sanitizeLeaderboardRows', () => {
    it('filters junk and sorts descending', () => {
        const out = L.sanitizeLeaderboardRows([
            { initials: 'bob', score: 50 },
            { initials: '!!', score: 99 },
            { initials: 'ZZZ', score: '120' },
            null,
            { initials: 'abc', score: -3 }
        ]);
        assert.equal(out.length, 2);
        assert.equal(out[0].initials, 'ZZZ');
        assert.equal(out[0].score, 120);
        assert.equal(out[1].initials, 'BOB');
    });
});

describe('alienSpawnDelayFrames', () => {
    it('is within scaled min/max frame range', () => {
        const minMs = 2000;
        const maxMs = 4000;
        const lo = L.alienSpawnDelayFrames(minMs, maxMs, false, () => 0);
        const hi = L.alienSpawnDelayFrames(minMs, maxMs, false, () => 1);
        assert.ok(Math.abs(lo - (2000 / 1000) * L.TARGET_FPS) < 1e-9);
        assert.ok(Math.abs(hi - (4000 / 1000) * L.TARGET_FPS) < 1e-9);
    });

    it('hard mode shortens the window by 0.72', () => {
        const normal = L.alienSpawnDelayFrames(10000, 10000, false, () => 0);
        const hard = L.alienSpawnDelayFrames(10000, 10000, true, () => 0);
        assert.ok(Math.abs(hard / normal - 0.72) < 1e-9);
    });
});

describe('seeded RNG', () => {
    it('mulberry32 is deterministic', () => {
        const a = L.mulberry32(12345);
        const b = L.mulberry32(12345);
        const seqA = [a(), a(), a()];
        const seqB = [b(), b(), b()];
        assert.deepEqual(seqA, seqB);
    });

    it('daily seed + level seed is stable', () => {
        const day = '20260730';
        const seed = L.dailySeedFromDayId(day);
        assert.equal(typeof seed, 'number');
        assert.equal(L.seedForLevel(seed, 1), L.seedForLevel(seed, 1));
        assert.notEqual(L.seedForLevel(seed, 1), L.seedForLevel(seed, 2));
    });
});

describe('leaderboardKeyFor', () => {
    it('returns mode-specific keys', () => {
        assert.equal(L.leaderboardKeyFor({}), 'asteroidsLeaderboard');
        assert.equal(
            L.leaderboardKeyFor({ daily: true, dayId: '20260101' }),
            'asteroidsLeaderboardDaily-20260101'
        );
        assert.equal(L.leaderboardKeyFor({ challenge: 'nohs' }), 'asteroidsLB-ch-nohs');
        assert.equal(L.leaderboardKeyFor({ challenge: 'nopu' }), 'asteroidsLB-ch-nopu');
        assert.equal(L.leaderboardKeyFor({ challenge: 'survive' }), 'asteroidsLB-ch-survive');
    });
});

describe('misc scoring helpers', () => {
    it('asteroidPoints by size bands', () => {
        assert.equal(L.asteroidPoints(40), 20);
        assert.equal(L.asteroidPoints(20), 50);
        assert.equal(L.asteroidPoints(10), 100);
    });

    it('formatTime and accuracyPct', () => {
        assert.equal(L.formatTime(0), '0:00');
        assert.equal(L.formatTime(65), '1:05');
        assert.equal(L.accuracyPct(0, 0), 0);
        assert.equal(L.accuracyPct(10, 5), 50);
        assert.equal(L.accuracyPct(3, 10), 100);
    });

    it('isBossLevel every 5 from 5', () => {
        assert.equal(L.isBossLevel(4), false);
        assert.equal(L.isBossLevel(5), true);
        assert.equal(L.isBossLevel(10), true);
        assert.equal(L.isBossLevel(11), false);
    });

    it('hyperspace hold threshold', () => {
        assert.equal(L.hyperspaceIsSafeHold(L.HYPERSPACE_HOLD_FRAMES - 1), false);
        assert.equal(L.hyperspaceIsSafeHold(L.HYPERSPACE_HOLD_FRAMES), true);
    });

    it('checkCollision and extra-life thresholds', () => {
        assert.equal(L.checkCollision({ x: 0, y: 0 }, { x: 5, y: 0 }, 3, 3), true);
        assert.equal(L.checkCollision({ x: 0, y: 0 }, { x: 50, y: 0 }, 3, 3), false);
        const r = L.nextExtraLifeThreshold(10000, 25000);
        assert.equal(r.livesGained, 2);
        assert.equal(r.nextExtraLife, 30000);
    });

    it('hardScale', () => {
        assert.equal(L.hardScale(false), 1);
        assert.equal(L.hardScale(true), 1.28);
    });
});

describe('utcDayId', () => {
    it('formats fixed UTC date', () => {
        const d = new Date(Date.UTC(2026, 6, 30, 12, 0, 0));
        assert.equal(L.utcDayId(d), '20260730');
    });
});
