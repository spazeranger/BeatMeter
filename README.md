# BeatMeter
Web-based watch accuracy timegrapher using phone microphone, completely free and private.

## Struktur
- `index.html`, `guides.html`, `guide-*.html`, `privatliv.html`: papir-siderne, styles i `site.css`
- `maal.html`: måleren (mørkt instrument), styles i `maal.css`, målelogikken ligger i siden selv
- `tokens.css`: alle designtokens (farver, typografi, afstande, bevægelse). Ændr brandet her.
- `brand/`: logo som SVG (symbol, vandret, mørk version, favicon) og `apple-touch-icon.png` til iOS
- `fonts/`: Inter (variabel), hostet lokalt

## Ny designretning (v2)
`v2/` er en komplet parallel udgave af siden i en ny visuel identitet. Den originale side er uændret og kører ved siden af på `/` mens v2 ligger på `/v2/`.
- `v2/tokens.css`: alle designtokens (palet, typeskala, afstande, former, højde, bevægelse)
- `v2/site.css`: papir-siderne. `v2/maal.css`: måleren. `v2/fonts.css`: Inter og Instrument Serif, begge hostet lokalt
- v2 deler `brand/`, `fonts/` og `img/` med originalen. Målelogikken i `v2/maal.html` er ordret den samme som i `maal.html`; kun `<head>` er ændret
- v2-siderne har `noindex`, så de ikke konkurrerer med originalen i søgning
- Gemte målinger ligger i samme browserlager (samme oprindelse), så de vises i begge udgaver
