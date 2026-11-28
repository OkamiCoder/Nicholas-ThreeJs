# PYROMANIAC // Nicholas Randle — 3D Model Inspector

A fully procedural Three.js character model viewer for **Nicholas Randle** from *Pyromaniac*, styled after the **PS2 / GoldSrc era** (dithered low-res textures, flat mid-poly shading, gritty flashlight-under-the-chin lighting). No external assets — every texture is generated procedurally in a canvas at runtime, so the app works 100% offline.

![Face](final-face.png)

## Features

- **Fully procedural character** — head (sculpted cranium, nose, ears, painted PS2 eyes), torso with hoodie, pelvis/legs, bony hands with a flip-top Zippo lighter, and a shaggy emo haircut built from tapered 3D strands.
- **Real-time lighter flame** — layered procedural fire with flicker animation, orange point lighting and adjustable intensity.
- **7 camera presets** — smooth animated transitions between full-body, face, skull profile, hoodie, hand/lighter, hood/back and jeans/sneakers close-ups.
- **Scene tree inspector** — click any joint group (head, torso, elbow, lighter…) to inspect it in isolation.
- **Debug toggles** — wireframe mode, joint pivots, inspection light, texture canvas viewer.
- **Adjustable fog** and animation speed sliders.

## Tech Stack

- [Three.js](https://threejs.org/) — rendering
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) — UI
- [Vite](https://vite.dev/) — build tool & dev server
- Procedural canvas textures (no image files, no network requests)

## Getting Started

Requires **Node.js 20.19+** (or 22.12+).

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173/`).

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serves the production build locally
```

## Controls

| Input | Action |
| --- | --- |
| Left mouse drag | Orbit camera |
| Mouse wheel | Zoom |
| Right mouse drag | Pan |
| Preset buttons (01–07) | Fly to a fixed camera shot |
| Sliders | Fire intensity / fog density / animation speed |

## Project Structure

```
src/
├── App.tsx                     # Scene setup, UI, camera presets, lighting
├── model/
│   ├── buildNicholasRandle.ts  # Assembles the full character rig
│   ├── buildHead.ts            # Cranium, face sculpt, nose, eyes, ears, hair
│   ├── buildTorsoAndHoodie.ts  # Torso, hoodie, kangaroo pocket
│   ├── buildArmsAndLighter.ts  # Arms, hands, Zippo lighter + flame
│   └── buildPelvisAndLegs.ts   # Pelvis, jeans, sneakers
└── textures/
    └── proceduralTextures.ts   # Runtime canvas-generated textures
```

## License

For personal / educational use. 
