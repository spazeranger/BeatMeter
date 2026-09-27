# BeatMeter

A free, browser-based tool to measure mechanical watch accuracy using your phone's microphone.

## What is BeatMeter?

BeatMeter lets you analyze how accurately your mechanical watch keeps time. By placing your watch near your phone's microphone, the app listens to the ticks and measures:

- **Deviation per day** — How many seconds your watch gains or loses in 24 hours
- **Beat error** — How evenly the escapement swings (left vs. right)
- **Beat rate** — The oscillation frequency of the balance wheel

## Features

- 📱 **No installation needed** — Works in Safari and Chrome, can be added to home screen
- 🔒 **Your data stays private** — All calculations happen locally; no audio is recorded or sent anywhere
- ⚙️ **Automatic or manual** — Finds the beat rate automatically or you can set it manually
- 📊 **Multiple views** — Trace graphs, gauges, history tracking, and interval analysis
- 🆓 **Completely free** — No ads, no paywalls

## How to Use

1. Find a quiet room
2. Place your phone on a towel with the watch directly over the microphone (usually at the bottom)
3. Press Start and wait 20+ seconds
4. View your results: deviation, beat error, and beat rate
5. Measure in different positions to compare performance

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses Web Audio API for real-time audio analysis
- Responsive design for mobile and desktop
- Light/dark mode support

## Limitations

BeatMeter is a hobbyist tool, not a professional measuring instrument. Your phone's microphone is not calibrated, so measurements won't match professional timegrapher results. For precise measurements, use a dedicated timegrapher like the Weishi No. 1000.

## Getting Started Locally

1. Clone the repository
2. Open `index.html` in your browser
3. No build step or dependencies required

## Learn More

- **[How it works](index.html#maaling)** — Explanation of what BeatMeter measures
- **[Guides](guides.html)** — Detailed guides on measuring, interpreting results, and understanding watch positions
- **[Privacy](privatliv.html)** — Privacy and cookie information

-

Made with ⌚ for watch enthusiasts
