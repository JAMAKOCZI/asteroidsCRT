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
| **Left / Right** | Turn |
| **Tab** | Boost / thrust |
| **Space** | Fire |
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

Current code is the **baseline** arcade build. Planned polish (bugfixes, classic controls, delta time, title screen, Web Audio, pause) will land in later commits.

---

## License

See [LICENSE](LICENSE) (MIT).
