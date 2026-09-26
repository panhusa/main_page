# main_page

Static personal site (no build step): `index.html`, `photography.html`,
`music.html`, `coding.html`, styled by `css/styles.css` plus one CSS file per
page, with small vanilla JS in `js/`.

Two homelab pages live alongside it and only work behind `nginx-sysmon.conf`:

- `sysmon.html`: CPU/RAM/temperature rings from Netdata (`/netdata/` proxy) and
  a cleanup button (`POST /action/run`, proxied to a service on the host).
- `widgets.html`: clock, weather (Open-Meteo), CPU/RAM from the same Netdata proxy,
  and notes kept in `localStorage`.

`/action/` only accepts `POST` from private networks carrying the
`X-Sysmon-Action: 1` header (CSRF protection); `/netdata/` is private-network,
read-only. Anything else calling `/action/run` must send that header.

## Checks

```bash
python3 scripts/check_assets.py   # lists HTML/CSS references to files that don't exist
```

Several images referenced by the CSS (most of `images/photo-grid/`,
`images/bands/BBP.jpg`, `chinto.jpg`) have never been committed, so a fresh
checkout renders those tiles empty. Run the check above to see the current list.

## Home page

`index.html` + `css/home.css` (home-only styles, loaded after the shared
`css/styles.css`). Its images are web-sized copies in `images/home/`, generated
from originals in `images/`; the originals are untouched.
