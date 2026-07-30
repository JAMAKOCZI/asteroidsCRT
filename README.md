# Asteroids CRT

Classic **Asteroids**-style arcade game in the browser, with a CRT hangar look.

![Asteroids CRT preview — vector game on a beige CRT in a hangar](docs/media/asteroids-crt-preview.jpg)

**Play:** open [`index.html`](index.html) in a modern browser (Chrome, Firefox, Edge).  
**No build step, no npm, no server required** — one self-contained file.

**Best on desktop keyboard.** No full touch controls (layout still scales on small screens; tap can start / exit demo).

Repository: [github.com/JAMAKOCZI/asteroidsCRT](https://github.com/JAMAKOCZI/asteroidsCRT)

---

## Features

- Vector ship with thrust, turn, fire, and **hyperspace** (tap = risky, hold = safe)
- Asteroids that split into smaller pieces (classic point values)
- Levels with rising difficulty; extra ship each level + every 10 000 points
- Combo score multiplier for kill chains
- Large / small / **boss** UFO saucers (boss every 5 levels)
- Power-ups: **S**hield, **R**apid, **T**riple, **W**ide, s**L**ow field
- Optional **Hard** mode from the title screen (`G`)
- **Daily seed** (`D`) and **challenges** (`C`: no hyper / no power / survive 2:00)
- Run **stats** after game over; **ghost** trail of the last run
- **Attract mode** after idle on the title screen
- CRT phosphor palette by level, hangar chrome, Web Audio SFX
- High scores with initials (top 10, separate boards per mode)
- Title screen, pause, mute / volume

---

## Controls

| Key | Action |
|-----|--------|
| **Left / Right** or **A / D** | Turn |
| **Up / W** | Boost / thrust |
| **Space** | Fire (hold for auto-fire with Rapid) |
| **H** or **Down** | Hyperspace — tap risky, hold safe (longer CD) |
| **P** | Pause / resume |
| **A key** (not Tab/modifiers) | Start from title screen |
| **G** / **1** / **2** | Toggle hard / normal / hard (title) |
| **D** | Daily seed mode on/off (title) |
| **C** | Cycle challenge (title) |
| **[** **]** or **,** **.** | Cycle phosphor preview (title) |
| **M** | Mute / unmute |
| **−** **/** **=** | Volume down / up |
| **R** | Restart (after game over) |
| **A–Z**, **Enter** | Enter high-score initials |
| **Esc** | Skip high-score entry |

---

## How to run

1. Clone or download the repo.
2. Double-click [`index.html`](index.html) (or drag it into a browser window).

Optional local server (only if you prefer):

```bash
python -m http.server 8080
```

---

## Tech

- **One playable file:** `index.html` (HTML + CSS + Canvas 2D + vanilla JS)
- No dependencies, no bundler, no npm for playing
- High scores: browser `localStorage`

Optional developer copy of pure helpers (not needed to play): [`game-logic.js`](game-logic.js) + [`test/game-logic.test.js`](test/game-logic.test.js). If you have Node installed:

```bash
node --test test/game-logic.test.js
```

---

## Project status

Arcade build (phases 1–4): juice/CRT, depth, meta modes, packaging.  
Roadmap: [`docs/superpowers/specs/2026-07-30-asteroids-four-phase-roadmap.md`](docs/superpowers/specs/2026-07-30-asteroids-four-phase-roadmap.md).

---

## License

See [LICENSE](LICENSE) (MIT).
