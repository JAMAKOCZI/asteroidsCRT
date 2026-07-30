# Asteroids CRT

Classic **Asteroids**-style arcade game in the browser, with a green CRT / vector look.

**Play:** open [`index.html`](index.html) in a modern browser (Chrome, Firefox, Edge). No build step.

Repository: [github.com/JAMAKOCZI/asteroidsCRT](https://github.com/JAMAKOCZI/asteroidsCRT)

---

## Features

- Vector ship with thrust, turn, and fire
- Asteroids that split into smaller pieces
- Levels with rising difficulty and an extra life per level
- UFO enemy from level 3 (chases and shoots)
- Particle effects (explosions, thruster)
- High scores with initials (top 10, saved in `localStorage`)
- CRT-style UI (scanlines, green glow)

---

## Controls

| Key | Action |
|-----|--------|
| **Left / Right** or **A / D** | Turn |
| **Up / W** | Boost / thrust (Tab also works) |
| **Space** | Fire |
| **P** | Pause / resume |
| **Any key** | Start from title screen |
| **R** | Restart (after game over) |
| **A–Z**, **Enter** | Enter high-score initials |

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

Arcade polish (approach A) is implemented: safe collisions, top-10 high scores,
delta-time physics, classic boost keys, unique asteroid shapes, title screen,
pause, and Web Audio SFX. See `docs/superpowers/specs/` for the design note.

---

## License

See [LICENSE](LICENSE) (MIT).
