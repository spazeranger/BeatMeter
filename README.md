# BeatMeter
Web-based watch accuracy timegrapher using phone microphone, completely free and private.

## Struktur
- `index.html`, `guides.html`, `guide-*.html`, `privatliv.html`: papir-siderne, styles i `site.css`
- `maal.html`: måleren (mørkt instrument), styles i `maal.css`, målelogikken ligger i siden selv
- `tokens.css`: alle designtokens (palet, typeskala, afstande, former, højde, bevægelse). Ændr brandet her.
- `brand/`: logo som SVG (symbol, vandret, mørk version, favicon) og `apple-touch-icon.png` til iOS
- `fonts/`: Inter (variabel), Instrument Serif og IBM Plex Mono, alle hostet lokalt

## Designretning
Hårlinje: cool varm papirfarve, blæk, én signalorange (`#D9512C`, `#B8431F` som tekstfarve), omrids i 1px og store runde hjørner. Instrument Serif til overskrifter, Inter til brødtekst og tal, IBM Plex Mono til mærkater.
- Forsiden og vejledningssiden har en Layout 1 / 2-kontakt. Valget gemmes i browseren (`beatmeter-layout`) og deles mellem siderne.
- Målerens canvas-tegninger læser `--bg`, `--ink`, `--line`, `--mute`, `--gilt`, `--tock`, `--grid`, `--good` og `--bad` fra `maal.css`. Ændr dem ikke uden at tjekke tegningerne.
- Appikon og logofiler i `brand/` bruger stadig den ældre terrakotta (`#C76F52`). Logoet på siderne farves med signalfarven via CSS.
