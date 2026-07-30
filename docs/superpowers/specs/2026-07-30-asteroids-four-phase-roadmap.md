# Asteroids CRT — roadmap 4 fazy (20 punktów)

**Date:** 2026-07-30  
**Repo:** https://github.com/JAMAKOCZI/asteroidsCRT  
**Cel:** rozwijać single-file arcade CRT bez frameworków i bez rozbijania gry na backend/multiplayer.

**Zasady:**
- Jedna gra: `index.html` (+ docs w repo).
- Desktop keyboard first; mobile tylko w fazie 4 i opcjonalnie.
- Każda faza ma być **shippable** (gra zawsze grająca po fazie).
- Po większej fazie: commit + push na `main`.

---

## Mapa 20 → faza

| # | Pomysł | Faza |
|---|--------|------|
| 1 | Bogatsze SFX (Web Audio) | 1 |
| 2 | Mute / volume + `localStorage` | 1 |
| 3 | Flash tła/bezelu przy zmianie fosforu | 1 |
| 4 | Statystyki po grze | 3 |
| 5 | Lepszy title (logo, best score) | 1 |
| 6 | Hard mode / rank / progressive | 2 |
| 7 | Sequenсe UFO (AI, rzadki boss) | 2 |
| 8 | 1–2 nowe power-upy | 2 |
| 9 | Combo / multiplier | 2 |
| 10 | Safe vs risky hyperspace | 2 |
| 11 | Ręczny podgląd fosforu na tytule | 1 |
| 12 | Barrel / chromatic (opcjonalny FX) | 1 |
| 13 | Więcej detalu „kabiny” CRT | 1 |
| 14 | Attract mode (demo AI) | 3 |
| 15 | Daily seed | 3 |
| 16 | Challenges + osobne tablice | 3 |
| 17 | Ghost last run | 3 |
| 18 | Testy logiki w Node | 4 |
| 19 | Mobile / touch (opcjonalnie) | 4 |
| 20 | README GIF / short clip | 4 |

---

## Faza 1 — Juice & CRT (prezentacja + audio)

**Cel:** gra brzmi i wygląda jak szafa arcade, bez zmiany core loop.

| # | Deliverable | Notatki |
|---|-------------|---------|
| 2 | **Mute / volume** | `M` lub knoby na CRT; zapamiętanie w `localStorage` |
| 1 | **Bogatsze SFX** | osobne barwy: mały/duży UFO, hyperspace, level-up, death, extra life; opcjonalny cichy hum |
| 5 | **Title polish** | lepsze logo/layout; **BEST: ABC · score** z leaderboardu |
| 11 | **Podgląd fosforu** | na tytule strzałki / `[` `]` cykl palety (nie blokuje auto z poziomem w grze) |
| 3 | **Flash przy level-up** | krótki glow CSS/canvas przy `applyCrtTheme` |
| 13 | **Kabina CRT** | drobny detal: model/label przy fosforze, sticker, LED pulse |
| 12 | **Barrel / fringe** | lekki filter na `.crt-screen`; wyłączany przy `prefers-reduced-motion` lub „low FX” |

**Kryterium ukończenia fazy 1**
- [x] Mute działa i przetrwa reload
- [x] Title pokazuje najlepszy wynik
- [x] Zmiana poziomu ma czytelny feedback koloru + dźwięku
- [x] Brak regresji w sterowaniu / HUD (level w prawym rogu, help tylko title/pause)

**Szacunek:** mały–średni (głównie CSS + Web Audio + title render).

---

## Faza 2 — Arcade depth (mechanika)

**Cel:** więcej depthu w klasycznym Asteroids, bez gubienia feelu.

| # | Deliverable | Notatki |
|---|-------------|---------|
| 9 | **Combo / multiplier** | łańcuch zniszczeń w oknie czasowym; HUD (np. pod LEVEL) |
| 7 | **UFO sequences** | różnice large/small; rzadszy „boss” co N poziomów |
| 10 | **Safe vs risky hyperspace** | np. hold = dłuższy safe teleport vs tap = klasyczny ryzykowny; albo 2 ładunki |
| 8 | **1–2 power-upy** | max dwa nowe (np. wide / slow); nie rozwadniać S/R/T |
| 6 | **Hard / progressive** | tryb Hard z title albo rank rosnący z poziomem (szybsze UFO, więcej skał) |

**Kolejność wewnątrz fazy (zalecana)**  
`9 combo → 7 UFO → 10 hyperspace → 8 power-ups → 6 hard mode`  
(hard na końcu, bo buduje na trudniejszych UFO i combo).

**Kryterium ukończenia fazy 2**
- [x] Combo czytelne i zbalansowane (nie farmowalne w nieskończoność)
- [x] UFO nie spawnuje się w „dziwnych” stackach (timer in-game już jest)
- [x] Hyperspace nadal ma ryzyko albo koszt
- [x] Hard jest opcją, nie domyślną pułapką dla nowych graczy

**Szacunek:** średni–duży (balans + edge cases).

---

## Faza 3 — Meta & regrywalność

**Cel:** powody wracać i porównywać runy — bez serwera.

| # | Deliverable | Notatki |
|---|-------------|---------|
| 4 | **Statystyki po grze** | czas, skały, UFO, strzały/trafienia, max combo, poziom |
| 14 | **Attract mode** | po ~30 s na tytule proste AI + restart dema |
| 15 | **Daily seed** | seeded RNG (dzień UTC); ten sam układ skał; osobny lub oznaczony high score |
| 16 | **Challenges** | 2–3 reguły (no HS, no power-ups, survive X); osobne klucze `localStorage` |
| 17 | **Ghost last run** | opcjonalna ścieżka pozycji statku z poprzedniego runu (sample’owana) |

**Kolejność wewnątrz fazy**  
`4 stats → 14 attract → 15 daily → 16 challenges → 17 ghost`  
(stats najpierw — shared instrumentation; ghost na końcu jako advanced).

**Kryterium ukończenia fazy 3**
- [x] Stats nie kłamią (liczniki w update/kolizjach)
- [x] Attract nie kradnie inputu po naciśnięciu klawisza
- [x] Daily seed deterministyczny w jednym dniu
- [x] Challenges nie psują normalnego trybu

**Szacunek:** średni (RNG seed + state machine title/attract).

---

## Faza 4 — Jakość, dystrybucja, opcjonalny mobile

**Cel:** utrwalić jakość i „opakowanie” projektu.

| # | Deliverable | Notatki |
|---|-------------|---------|
| 18 | **Testy Node** | wyciągnięte czyste funkcje: wrap, qualify HS, phosphor index, spawn timer math, combo rules; `node --test` lub mały runner |
| 20 | **README GIF / clip** | 5–15 s: hangar + fosfor + gameplay; link w README |
| 19 | **Mobile (opcjonalnie)** | tylko jeśli potrzebne: virtual pad / touch fire; nie blokuje desktopu; w README „best on keyboard” |

**Kolejność**  
`18 tests → 20 media → 19 mobile (opcjonalnie / skip)`.

**Kryterium ukończenia fazy 4**
- [ ] CI-lokalnie: testy przechodzą na logice bez przeglądarki
- [ ] README pokazuje jak gra wygląda
- [ ] Mobile (jeśli w ogóle) nie psuje CRT layout na desktopie

**Szacunek:** mały (18+20) lub średni z mobile.

---

## Zależności między fazami

```text
Faza 1 (juice)
    │
    ▼
Faza 2 (mechanika) ── stats hooks naturalnie pasują do Fazy 3
    │
    ▼
Faza 3 (meta) ── daily/challenges korzystają z solidnego core z F2
    │
    ▼
Faza 4 (testy + polish zewnętrzny)
```

- **F1 → F2:** dźwięki level-up/combo już gotowe do podpięcia pod nowe eventy.  
- **F2 → F3:** combo/UFO dają sensowne pola w stats i challenges.  
- **F3 → F4:** logika seed/combo/HS = dobre cele unit testów.

---

## Świadomie poza roadmapą

- Multiplayer, konta, backend  
- Battle pass / sklep  
- Rozbicie na bundler + framework  
- Pełny port mobile jako priorytet przed desktop polish  

---

## Proponowany rytm pracy

| Faza | Fokus sesji | „Done” = |
|------|-------------|----------|
| **1** | 1–2 sesje polish | słychać + widać arcade |
| **2** | 2–4 sesje gameplay | nowa depth, zbalansowana |
| **3** | 2–3 sesje meta | wracasz do gry „dla daily” |
| **4** | 1 sesja + opcjonalnie mobile | repo „portfolio-ready” |

---

## Następny krok

Start **Fazy 1** od kolejności: **2 mute → 1 SFX → 5 title → 11 fosfor preview → 3 flash → 13 kabina → 12 FX**.

Po akceptacji planu implementacja idzie faza po fazie (albo jeden punkt na PR).
