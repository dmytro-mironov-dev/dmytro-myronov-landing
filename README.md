# Dmytro Myronov — career landing page

Static one-page site: no build step, open `index.html` through any web server.

```bash
python3 -m http.server 8099 --bind 127.0.0.1   # then open http://127.0.0.1:8099
```

- `js/content.js` — all texts, dates, skills, contacts and photo slots
- `assets/photos/` — photo slots, see `assets/photos/README.md`
- `assets/magepilot/` — MagePilot screenshots and banner
- `assets/cv/` — downloadable CV
- `js/main.js` — rendering, parallax (GSAP ScrollTrigger from CDN), integration hub, CV demo, trucks
- `js/game.js` — "ElePHPant vs Bugs" mini-game

Deploy: GitHub Pages from the `main` branch root.
