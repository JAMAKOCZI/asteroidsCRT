# Asteroids CRT — Arcade polish design

**Date:** 2026-07-30  
**Repo:** https://github.com/JAMAKOCZI/asteroidsCRT  
**Approach:** A — Arcade polish (single-file `index.html`)  
**Status:** Approved for implementation

> **Superseded product scope:** Implemented features beyond this note’s “out of scope” list include hyperspace, dual saucers, power-ups (shield/rapid/triple), hangar CRT chrome, and extra-life scoring. Treat this file as an historical design note, not current feature freeze.

## Goal

Stabilize classic Asteroids gameplay, restore familiar controls and frame-rate independence, then add title screen, pause, and Web Audio — without splitting into modules or adding mobile/hyperspace/power-ups.

## Constraints

- One file: `index.html` (HTML + CSS + Canvas + JS)
- Canvas 800×600, green CRT aesthetic
- No bundler, no dependencies
- High scores remain in `localStorage`
- Out of scope: hyperspace, mobile touch, power-ups, background music, multi-file split

## Architecture (logical blocks in one script)

| Block | Responsibility |
|-------|----------------|
| State | Modes: `title` / `playing` / `paused` / `gameover` (+ initials entry) |
| Input | Key map; boost = ArrowUp + KeyW; pause = P |
| Entities | Ship, missiles, asteroids, particles, alien + alien missiles |
| Physics | Update scaled by `dt` (seconds); ship speed clamp |
| Collisions | Collect removals; no `splice` mid-iteration; max one death per frame |
| Audio | Web Audio oscillators (no asset files); resume on first gesture |
| Render | Game + title/pause overlays |
| Loop | `requestAnimationFrame` → clamp `dt` → update → render |

## Phase 1 — Bugfixes

1. **Safe collisions:** Mark entities for removal (sets/indices), apply after loops; spawn split asteroids after removal.
2. **One death per frame:** After first ship hit that costs a life, skip further ship collision checks that frame.
3. **High score eligibility:** Qualify if `leaderboard.length < 10` or `score >` lowest top-10 score. Remove hard-coded `>= 5000`.
4. **Ship max speed:** Clamp velocity magnitude (tuned to feel like classic arcade).
5. **localStorage:** `try/catch` on load and save; fall back to `[]`.
6. **Dead code:** Remove unused `won` flag / win branch.

## Phase 2 — Feel

1. **Controls:** Boost = **↑** and **W**. Update on-screen help. Tab may remain as optional alias with `preventDefault`.
2. **Delta time:** Scale turn, thrust, friction, lifetimes, invulnerability, AI timers by `dt` relative to 60 FPS baseline; cap `dt` (e.g. 50 ms) to avoid spiral after tab blur.
3. **Asteroid shapes:** Store random vertex radii per asteroid at creation; draw from that cache so rocks differ.

## Phase 3 — Polish

1. **Title screen:** Start in `title`; show title + “PRESS ANY KEY”; first key starts `playing` and spawns level. Ensure audio context unlocks on that gesture.
2. **Pause:** **P** toggles `playing` ↔ `paused`. Physics frozen; render continues with PAUSED.
3. **Web Audio (no files):**
   - Fire: short square beep
   - Asteroid break / death: noise or descending tone
   - Thrust: low-level noise while boosting (rate-limited)
   - UFO hit: distinct higher reward blip  
   Low default gain; no volume UI in this iteration.

## Target controls

| Key | Action |
|-----|--------|
| ← → | Turn |
| ↑ / W | Boost |
| Space | Fire |
| P | Pause |
| R | Restart after game over |
| A–Z, Enter | High-score initials |

## Success criteria

- No multi-kill / skipped-collision glitches from splice-in-loop
- Score entry only when actually top-10 worthy
- Playable at different monitor refresh rates without huge speed change
- Title → play → pause → game over → initials/leaderboard → restart all work
- Sounds play after first keypress (browser autoplay policy)

## Implementation order

1. Phase 1 commit  
2. Phase 2 commit  
3. Phase 3 commit  
4. README control table update if needed  

Each phase: implement → quick manual sanity check → commit → push.
