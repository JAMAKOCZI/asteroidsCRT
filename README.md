# Asteroids CRT

Classic **Asteroids**-style arcade game in the browser, with a green CRT / vector look.

**Play:** open [`index.html`](index.html) in a modern browser (Chrome, Firefox, Edge). No build step.

**Desktop keyboard only** — no touch / mobile controls.

Repository: [github.com/JAMAKOCZI/asteroidsCRT](https://github.com/JAMAKOCZI/asteroidsCRT)

---

## Features

- Vector ship with thrust, turn, fire, and **hyperspace**
- Asteroids that split into smaller pieces (classic point values)
- Levels with rising difficulty; extra ship each level + every 10 000 points
- Large / small UFO saucers (from level 2+) with tougher AI on higher levels
- Power-ups: **S**hield, **R**apid fire, **T**riple shot
- Particle FX, floating scores, CRT scanlines / green glow
- High scores with initials (top 10, `localStorage`)
- Title screen, pause, Web Audio SFX

---

## Controls

| Key | Action |
|-----|--------|
| **Left / Right** or **A / D** | Turn |
| **Up / W** | Boost / thrust |
| **Space** | Fire (hold for auto-fire with Rapid) |
| **H** or **Down** | Hyperspace (risky teleport; cooldown) |
| **P** | Pause / resume |
| **A key** (not Tab/modifiers) | Start from title screen |
| **[** **]** or **,** **.** | Cycle phosphor preview (title) |
| **M** | Mute / unmute |
| **−** **/** **=** | Volume down / up |
| **R** | Restart (after game over) |
| **A–Z**, **Enter** | Enter high-score initials |
| **Esc** | Skip high-score entry |

---

## How to run

### Local file

1. Clone the repo:
   ```bash
   git clone https://github.com/JAMAKOCZI/asteroidsCRT.git
   cd asteroidsCRT
   ```
2. Open `index.html` in your browser (double-click or drag into a window).

### Simple local server (optional)

```bash
# Python 3
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

---

## Tech

- Single file: HTML + CSS + Canvas 2D + vanilla JavaScript
- No dependencies, no bundler
- High scores: browser `localStorage` key `asteroidsLeaderboard`

---

## Project status

Arcade build with hyperspace, dual saucers, power-ups, and extra-life scoring.
See `docs/superpowers/specs/` for the earlier polish design note.

---

## License

See [LICENSE](LICENSE) (MIT).
