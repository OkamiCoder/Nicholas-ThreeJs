import * as THREE from 'three';

export interface ProceduralTextureSet {
  face: THREE.CanvasTexture;
  hoodieChest: THREE.CanvasTexture;
  hoodieFabric: THREE.CanvasTexture;
  jeans: THREE.CanvasTexture;
  sneakers: THREE.CanvasTexture;
  skin: THREE.CanvasTexture;
  hair: THREE.CanvasTexture;
  lighterMetal: THREE.CanvasTexture;
  floorConcrete: THREE.CanvasTexture;
  canvases: {
    name: string;
    subtitle: string;
    resolution: string;
    dataUrl: string;
  }[];
}

// Deterministic PRNG for consistent pixel-art dithering & grunge wear
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function configureNearestTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * 1. Face & Head Pixel Texture (128x128)
 * - Base tone: #d8cfc6 (pale greyish-beige)
 * - Cold shadow gradients on sunken cheeks, temples, eye sockets
 * - Tired dark eyes with heavy dark bags underneath
 * - Thin, neutral-gloomy mouth line without a smile
 * - Distinct pixel mole under the left eye (character's left eye)
 */
function createFaceCanvas(): HTMLCanvasElement {
  const W = 128;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const rand = mulberry32(104729);

  // Base pale greyish-beige skin (#d8cfc6)
  ctx.fillStyle = '#d8cfc6';
  ctx.fillRect(0, 0, W, H);

  // Pixel-by-pixel cold shadow gradient & subtle GoldSrc skin grain
  const imgData = ctx.getImageData(0, 0, W, H);
  const data = imgData.data;

  const setPx = (x: number, y: number, r: number, g: number, b: number, a = 255) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = (Math.floor(y) * W + Math.floor(x)) * 4;
    data[idx] = Math.max(0, Math.min(255, Math.round(r)));
    data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
    data[idx + 3] = a;
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Normalized UV where u=0.5 is center of face front, v=0.5 is mid-face (flipped in canvas Y)
      const nx = (x - W * 0.5) / (W * 0.5); // -1..1
      const ny = y / H; // 0 (top forehead) .. 1 (chin/neck)

      // Base #d8cfc6 -> RGB(216, 207, 198)
      let r = 216;
      let g = 207;
      let b = 198;

      // Subtle PS2/GoldSrc 2x2 ordered dither + pixel noise
      const dither = ((x + y) % 2 === 0 ? 2 : -2) + (rand() - 0.5) * 5;
      r += dither;
      g += dither;
      b += dither;

      // Cold blue-grey periphery shadow toward sides of head & jawline
      const sideFactor = Math.min(1, Math.abs(nx) * 1.15);
      r -= sideFactor * 36;
      g -= sideFactor * 32;
      b -= sideFactor * 24; // cooler shadow (retains slightly more blue)

      // Forehead top shadow (under bangs)
      if (ny < 0.28) {
        const t = (0.28 - ny) / 0.28;
        r -= t * 44;
        g -= t * 42;
        b -= t * 36;
      }

      // Lower jaw & neck shadow
      if (ny > 0.78) {
        const t = (ny - 0.78) / 0.22;
        r -= t * 48;
        g -= t * 44;
        b -= t * 38;
      }

      // Hollow sunken cheeks shadow pockets (left and right cheek hollows)
      const leftCheekDist = Math.hypot((x - 42) / 14, (y - 76) / 18);
      const rightCheekDist = Math.hypot((x - 86) / 14, (y - 76) / 18);
      const cheekHollow =
        Math.max(0, 1 - leftCheekDist) * 0.85 + Math.max(0, 1 - rightCheekDist) * 0.85;
      if (cheekHollow > 0) {
        // Cold sunken shadow (#9c9593)
        r -= cheekHollow * 42;
        g -= cheekHollow * 38;
        b -= cheekHollow * 31;
      }

      // Subtle cheekbone ridge highlight just above the hollow
      const leftZygoma = Math.hypot((x - 43) / 11, (y - 59) / 5);
      const rightZygoma = Math.hypot((x - 85) / 11, (y - 59) / 5);
      const zygomaHighlight = Math.max(0, 1 - leftZygoma) + Math.max(0, 1 - rightZygoma);
      if (zygomaHighlight > 0) {
        r += zygomaHighlight * 10;
        g += zygomaHighlight * 9;
        b += zygomaHighlight * 8;
      }

      // Deep-set eye socket shadow wells (around y=46..56, x=45 & x=83)
      const rightEyeSocket = Math.hypot((x - 47) / 12, (y - 49) / 9);
      const leftEyeSocket = Math.hypot((x - 81) / 12, (y - 49) / 9);
      const socketShadow =
        Math.max(0, 1 - rightEyeSocket) + Math.max(0, 1 - leftEyeSocket);
      if (socketShadow > 0) {
        r -= socketShadow * 68;
        g -= socketShadow * 66;
        b -= socketShadow * 58;
      }

      // Pronounced tired dark circles / bags directly underneath the eyes (y=52..60)
      const rightBag = Math.hypot((x - 47) / 10, (y - 55) / 4.5);
      const leftBag = Math.hypot((x - 81) / 10, (y - 55) / 4.5);
      const bagIntensity = Math.max(0, 1 - rightBag) + Math.max(0, 1 - leftBag);
      if (bagIntensity > 0) {
        r -= bagIntensity * 54;
        g -= bagIntensity * 58;
        b -= bagIntensity * 46; // bruised purplish-grey tint
      }

      // High narrow nasal bridge highlight (center x=64, y=42..68)
      if (y >= 40 && y <= 69 && Math.abs(x - 64) <= 6) {
        const nxBridge = Math.abs(x - 64);
        if (nxBridge <= 2) {
          r += 14;
          g += 13;
          b += 11;
        } else if (nxBridge >= 4) {
          // Sharp triangular nose side walls shadow
          r -= 28;
          g -= 26;
          b -= 22;
        }
      }

      setPx(x, y, r, g, b);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Draw crisp pixel-art facial features on top
  // 1. Brow ridges & dark knitted eyebrows (moderate brow ridges, gloomy expression)
  ctx.fillStyle = '#1f1d20';
  // Character's right eyebrow (viewer's left: x=37..55, y=40..43)
  ctx.fillRect(37, 41, 12, 3);
  ctx.fillRect(49, 42, 7, 3);
  // Character's left eyebrow (viewer's right: x=72..90, y=40..43)
  ctx.fillRect(72, 42, 7, 3);
  ctx.fillRect(79, 41, 12, 3);

  // Glabella frown creases between eyebrows
  ctx.fillStyle = '#8b817c';
  ctx.fillRect(61, 40, 1, 6);
  ctx.fillRect(66, 40, 1, 6);

  // 2. Deep-set dark tired eyes (half-lidded upper eyelids, muted sclera, dark iris)
  const drawTiredEye = (cx: number, cy: number) => {
    // Dark upper lash / deep crease
    ctx.fillStyle = '#1a171b';
    ctx.fillRect(cx - 7, cy - 3, 14, 2);
    ctx.fillRect(cx - 8, cy - 1, 2, 3);
    ctx.fillRect(cx + 6, cy - 1, 2, 3);

    // Shadowed tired sclera
    ctx.fillStyle = '#aba39e';
    ctx.fillRect(cx - 6, cy - 1, 12, 4);

    // Upper sclera shadow from heavy lid
    ctx.fillStyle = '#7e7674';
    ctx.fillRect(cx - 6, cy - 1, 12, 1);

    // Dark tired iris & pupil (#1b1b20 / #0d0d10)
    ctx.fillStyle = '#232126';
    ctx.fillRect(cx - 3, cy - 1, 6, 4);
    ctx.fillStyle = '#0f0f13';
    ctx.fillRect(cx - 2, cy, 4, 3);

    // Tiny cold tired eye specularity (1 pixel)
    ctx.fillStyle = '#b8bfc7';
    ctx.fillRect(cx - 2, cy, 1, 1);

    // Lower eyelid margin & dark eye-bag crease lines
    ctx.fillStyle = '#5a4e52';
    ctx.fillRect(cx - 6, cy + 3, 12, 1);
    ctx.fillStyle = '#473c41';
    ctx.fillRect(cx - 5, cy + 5, 10, 1);
    ctx.fillStyle = '#63575b';
    ctx.fillRect(cx - 4, cy + 6, 8, 1);
  };

  // Character's right eye (viewer left) & Character's left eye (viewer right)
  drawTiredEye(47, 48);
  drawTiredEye(81, 48);

  // 3. ONE DISTINCT PIXEL MOLE UNDER THE LEFT EYE
  // In UV space, character's left eye is around x=81, y=48 (under-eye / upper cheek is y=57..59, x=83..85)
  // Let's draw a crisp dark brown-black pixel mole with a 1px transition pixel so it's unmistakable
  ctx.fillStyle = '#4d3b36';
  ctx.fillRect(83, 57, 3, 3);
  ctx.fillStyle = '#211816';
  ctx.fillRect(83, 57, 2, 2);

  // 4. Nose undersides & nostrils (y=68..71)
  ctx.fillStyle = '#736863';
  ctx.fillRect(59, 68, 10, 3);
  ctx.fillStyle = '#302927';
  ctx.fillRect(60, 69, 3, 2);
  ctx.fillRect(65, 69, 3, 2);

  // Subtle philtrum groove
  ctx.fillStyle = '#9c928b';
  ctx.fillRect(63, 71, 2, 7);

  // 5. Mouth: thin, neutral-gloomy line without a smile (y=79..82)
  // Slight shadow of upper lip
  ctx.fillStyle = '#8e7e7a';
  ctx.fillRect(54, 78, 20, 1);
  // Thin dark gloomy mouth line
  ctx.fillStyle = '#3d3031';
  ctx.fillRect(53, 79, 22, 2);
  // Slightly downturned corners (neutral-gloomy)
  ctx.fillRect(51, 80, 2, 2);
  ctx.fillRect(75, 80, 2, 2);
  // Muted lower lip tone & under-lip shadow crease
  ctx.fillStyle = '#a89894';
  ctx.fillRect(56, 81, 16, 2);
  ctx.fillStyle = '#756b66';
  ctx.fillRect(58, 84, 12, 2);

  return canvas;
}

/**
 * 2. Hoodie Chest Texture (256x256)
 * - Dark charcoal #1c1c1e base weave
 * - Distressed white pixel grunge inscription "Vitality" across the chest
 * - Kangaroo pocket details & worn cotton creases
 */
function createHoodieChestCanvas(): HTMLCanvasElement {
  const W = 256;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const rand = mulberry32(991823);

  // Base dark charcoal #1c1c1e -> RGB(28, 28, 30)
  ctx.fillStyle = '#1c1c1e';
  ctx.fillRect(0, 0, W, H);

  const imgData = ctx.getImageData(0, 0, W, H);
  const data = imgData.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      let r = 28;
      let g = 28;
      let b = 30;

      // Coarse fleece pixel weave + vertical rib grain
      const weave = ((x % 2 === 0 ? 1 : -1) + (y % 3 === 0 ? 1 : -1)) * 1.5;
      const noise = (rand() - 0.5) * 6;

      // Baked vertical fold crevices & grime gradients
      const foldWave = Math.sin(x * 0.11 + Math.sin(y * 0.04) * 1.8) * 4;
      const waistCrease = y > 195 ? Math.sin(x * 0.25 + y * 0.15) * 6 : 0;

      const delta = weave + noise + foldWave + waistCrease;
      r = Math.max(12, Math.min(54, r + delta));
      g = Math.max(12, Math.min(54, g + delta));
      b = Math.max(14, Math.min(58, b + delta));

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Neckline collar seam & dark drawstring cords at top center
  ctx.fillStyle = '#111113';
  ctx.fillRect(108, 18, 4, 48);
  ctx.fillRect(144, 18, 4, 44);
  ctx.fillStyle = '#2c2c30';
  ctx.fillRect(107, 16, 6, 4);
  ctx.fillRect(143, 16, 6, 4);

  // Generate the distressed pixel-art "Vitality" inscription on a low-res scratch buffer (128x44)
  // and blit it pixel-by-pixel with grunge erosion, cracks, and drips onto the chest
  const logoW = 112;
  const logoH = 38;
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = logoW;
  logoCanvas.height = logoH;
  const lctx = logoCanvas.getContext('2d')!;
  lctx.imageSmoothingEnabled = false;

  lctx.clearRect(0, 0, logoW, logoH);
  lctx.fillStyle = '#ffffff';
  lctx.font = 'bold 24px "Georgia", "Times New Roman", serif';
  lctx.textAlign = 'center';
  lctx.textBaseline = 'middle';
  lctx.fillText('Vitality', logoW / 2, logoH / 2 - 1);

  // Add gothic/grunge underline slash and thorny serifs in pixel space
  lctx.fillRect(14, 29, 84, 2);
  lctx.fillRect(22, 31, 60, 1);

  const logoData = lctx.getImageData(0, 0, logoW, logoH).data;

  // Blit scaled 2x onto the chest area (x: 16..240, y: 58..134) with heavy grunge distressing
  const destStartX = 16;
  const destStartY = 60;

  for (let ly = 0; ly < logoH; ly++) {
    for (let lx = 0; lx < logoW; lx++) {
      const a = logoData[(ly * logoW + lx) * 4 + 3];
      if (a > 90) {
        // Distressing mask: cracks, peeled ink patches, and worn edges
        const crack1 = Math.abs(lx - ly * 1.4 - 22) < 1.1;
        const crack2 = Math.abs(lx + ly * 0.9 - 78) < 1.0;
        const crack3 = Math.abs(lx - 54) < 0.9 && ly % 3 === 0;
        const randomPeel = rand() < 0.16;

        if (crack1 || crack2 || crack3 || randomPeel) {
          // Faded cracked ink trace instead of solid white
          if (rand() < 0.45) {
            ctx.fillStyle = '#565552';
            ctx.fillRect(destStartX + lx * 2, destStartY + ly * 2, 2, 2);
          }
          continue;
        }

        // Main distressed white plastisol print (#e4e1da to #b5b1a8)
        const shade = rand() < 0.3 ? '#bdb9b0' : rand() < 0.15 ? '#8e8b84' : '#e8e5de';
        ctx.fillStyle = shade;
        ctx.fillRect(destStartX + lx * 2, destStartY + ly * 2, 2, 2);

        // Occasional vertical grunge drip below letters
        if (ly > 20 && rand() < 0.045) {
          const dripLen = Math.floor(rand() * 5) + 2;
          ctx.fillStyle = '#96938c';
          for (let d = 1; d <= dripLen; d++) {
            ctx.fillRect(destStartX + lx * 2, destStartY + (ly + d) * 2, 2, 1);
          }
        }
      } else if (rand() < 0.008 && lx > 12 && lx < 100 && ly > 6 && ly < 32) {
        // Tiny stray grunge ink spatter around the logo
        ctx.fillStyle = '#9e9b95';
        ctx.fillRect(destStartX + lx * 2, destStartY + ly * 2, 2, 2);
      }
    }
  }

  // Kangaroo pocket seam outlines on lower front (also sculpted in 3D geometry!)
  ctx.fillStyle = '#121214';
  // Top horizontal seam of pocket
  ctx.fillRect(54, 146, 148, 3);
  // Slanted side hand-entry seams
  for (let i = 0; i < 48; i++) {
    ctx.fillRect(54 - Math.floor(i * 0.35), 146 + i, 3, 2);
    ctx.fillRect(202 + Math.floor(i * 0.35), 146 + i, 3, 2);
  }
  // Ribbed bottom waistband hem (y=226..256)
  for (let y = 226; y < H; y++) {
    for (let x = 0; x < W; x += 4) {
      ctx.fillStyle = x % 8 === 0 ? '#141416' : '#242428';
      ctx.fillRect(x, y, 2, 1);
    }
  }

  return canvas;
}

/**
 * 3. Hoodie Fabric & Cuffs Texture (128x128)
 */
function createHoodieFabricCanvas(): HTMLCanvasElement {
  const W = 128;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(55211);

  ctx.fillStyle = '#1c1c1e';
  ctx.fillRect(0, 0, W, H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x += 2) {
      const n = Math.floor((rand() - 0.5) * 10);
      const fold = Math.floor(Math.sin(y * 0.22 + x * 0.08) * 5);
      const isCuff = y > 108;
      const cuffRib = isCuff ? (x % 4 === 0 ? -6 : 5) : 0;
      const v = Math.max(12, Math.min(48, 28 + n + fold + cuffRib));
      ctx.fillStyle = `rgb(${v},${v},${v + 2})`;
      ctx.fillRect(x, y, 2, 1);
    }
  }

  return canvas;
}

/**
 * 4. Faded Dark-Blue Jeans Texture (#232936) (128x128)
 */
function createJeansCanvas(): HTMLCanvasElement {
  const W = 128;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(77312);

  // Base #232936 -> RGB(35, 41, 54)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let r = 35;
      let g = 41;
      let b = 54;

      // Diagonal denim twill pixel pattern
      const twill = (x + y) % 3 === 0 ? 4 : -2;
      const noise = (rand() - 0.5) * 6;

      // Faded thigh & knee wear (center of leg UV)
      const fadeDist = Math.hypot((x - 64) / 36, (y - 54) / 38);
      const fade = Math.max(0, 1 - fadeDist) * 14;

      // Horizontal knee & ankle fold whiskers
      const ankleCrease = y > 96 ? Math.sin(y * 0.7 + x * 0.15) * 8 : 0;
      const mudGrime = y > 112 ? -(y - 112) * 1.1 : 0;

      r = Math.max(16, Math.min(78, r + twill + noise + fade + ankleCrease + mudGrime));
      g = Math.max(20, Math.min(86, g + twill + noise + fade + ankleCrease + mudGrime));
      b = Math.max(28, Math.min(104, b + twill + noise + fade * 1.1 + ankleCrease + mudGrime));

      ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Outseam & inseam dark denim stitching lines
  ctx.fillStyle = '#161a22';
  ctx.fillRect(0, 0, 3, H);
  ctx.fillRect(63, 0, 2, H);
  ctx.fillStyle = '#47433b';
  for (let y = 2; y < H; y += 4) {
    ctx.fillRect(2, y, 1, 2);
    ctx.fillRect(62, y, 1, 2);
  }

  return canvas;
}

/**
 * 5. Old Dark Sneakers with Dirty-White Toe Caps & Soles (128x128)
 */
function createSneakersCanvas(): HTMLCanvasElement {
  const W = 128;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(33919);

  // Upper dark worn canvas (#1a1b1f)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = Math.floor((rand() - 0.5) * 10);
      // Bottom 28% is dirty-white rubber sole; front section is dirty-white toe cap
      const isSole = y > 94;
      if (isSole) {
        // Dirty-white sole (#bfb8a8) with dark scuff marks
        const grime = rand() < 0.22 ? -22 : 0;
        const r = 190 + n + grime;
        const g = 183 + n + grime;
        const b = 168 + n + grime;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
      } else {
        const v = 26 + n;
        ctx.fillStyle = `rgb(${v},${v + 1},${v + 4})`;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Black rubber foxing stripe along top of sole
  ctx.fillStyle = '#141416';
  ctx.fillRect(0, 93, W, 3);
  ctx.fillRect(0, 122, W, 6);

  // Dirty-white crisscrossed shoelaces on front tongue area
  ctx.fillStyle = '#b8b2a4';
  for (let y = 28; y <= 72; y += 11) {
    ctx.fillRect(48, y, 32, 3);
    ctx.fillStyle = '#706c64';
    ctx.fillRect(46, y - 1, 3, 4);
    ctx.fillRect(79, y - 1, 3, 4);
    ctx.fillStyle = '#b8b2a4';
  }

  return canvas;
}

/**
 * 6. Bony Hand Skin Texture (#d8cfc6 with cold tendon & knuckle shading)
 */
function createSkinCanvas(): HTMLCanvasElement {
  const W = 64;
  const H = 64;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(8123);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = (rand() - 0.5) * 8;
      // Tendon & knuckle shadow bands
      const tendon = Math.sin(x * 0.45) * 6;
      const knuckle = y % 16 < 3 ? -12 : 0;
      const r = Math.max(145, Math.min(232, 212 + n + tendon + knuckle));
      const g = Math.max(138, Math.min(224, 203 + n + tendon + knuckle));
      const b = Math.max(132, Math.min(218, 195 + n + tendon + knuckle));
      ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}

/**
 * 7. Charcoal-Black Hair Strand Texture (#121214)
 */
function createHairCanvas(): HTMLCanvasElement {
  const W = 64;
  const H = 64;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(44109);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Base #121214 -> RGB(18, 18, 20) with sharp strand striations
      const strand = ((x * 3) % 7 === 0 ? 7 : -2) + (rand() - 0.5) * 5;
      const tipShadow = y > 48 ? -5 : 0;
      const r = Math.max(8, Math.min(36, 18 + strand + tipShadow));
      const g = Math.max(8, Math.min(36, 18 + strand + tipShadow));
      const b = Math.max(10, Math.min(40, 20 + strand + tipShadow));
      ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}

/**
 * 8. Old Metallic Petrol Lighter Texture (64x64)
 */
function createLighterMetalCanvas(): HTMLCanvasElement {
  const W = 64;
  const H = 64;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(6091);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const brush = (rand() - 0.5) * 14 + Math.sin(y * 0.5) * 6;
      const edgeWear = x < 4 || x > 59 || y < 4 || y > 59 ? 18 : 0;
      const soot = y < 14 ? -16 : 0;
      const r = Math.max(40, Math.min(165, 106 + brush + edgeWear + soot));
      const g = Math.max(42, Math.min(168, 108 + brush + edgeWear + soot));
      const b = Math.max(46, Math.min(174, 114 + brush + edgeWear + soot));
      ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Hinge & lid separation line
  ctx.fillStyle = '#25272b';
  ctx.fillRect(0, 24, W, 2);
  // Chimney windguard air holes pattern
  ctx.fillStyle = '#1b1c1f';
  for (let x = 14; x <= 50; x += 12) {
    ctx.fillRect(x, 8, 4, 4);
    ctx.fillRect(x + 6, 15, 4, 4);
  }

  return canvas;
}

/**
 * 9. Wet Asphalt / Grimy Alley Concrete Floor Texture (128x128)
 */
function createFloorConcreteCanvas(): HTMLCanvasElement {
  const W = 128;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(19982);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = (rand() - 0.5) * 12;
      const tileSeam = x % 64 === 0 || y % 64 === 0 ? -8 : 0;
      const r = Math.max(10, Math.min(42, 22 + n + tileSeam));
      const g = Math.max(12, Math.min(46, 25 + n + tileSeam));
      const b = Math.max(16, Math.min(54, 32 + n + tileSeam));
      ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}

export function generateAllProceduralTextures(): ProceduralTextureSet {
  const faceCanvas = createFaceCanvas();
  const hoodieChestCanvas = createHoodieChestCanvas();
  const hoodieFabricCanvas = createHoodieFabricCanvas();
  const jeansCanvas = createJeansCanvas();
  const sneakersCanvas = createSneakersCanvas();
  const skinCanvas = createSkinCanvas();
  const hairCanvas = createHairCanvas();
  const lighterCanvas = createLighterMetalCanvas();
  const floorCanvas = createFloorConcreteCanvas();

  const floorTex = configureNearestTexture(floorCanvas);
  floorTex.wrapS = THREE.RepeatWrapping;
  floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(10, 10);

  return {
    face: configureNearestTexture(faceCanvas),
    hoodieChest: configureNearestTexture(hoodieChestCanvas),
    hoodieFabric: configureNearestTexture(hoodieFabricCanvas),
    jeans: configureNearestTexture(jeansCanvas),
    sneakers: configureNearestTexture(sneakersCanvas),
    skin: configureNearestTexture(skinCanvas),
    hair: configureNearestTexture(hairCanvas),
    lighterMetal: configureNearestTexture(lighterCanvas),
    floorConcrete: floorTex,
    canvases: [
      {
        name: 'FACE_RANDLE.BMP',
        subtitle: 'Кожа #d8cfc6, тени глазниц, впалые щёки, родинка под левым глазом',
        resolution: '128×128 NEAREST',
        dataUrl: faceCanvas.toDataURL(),
      },
      {
        name: 'HOODIE_VITALITY.BMP',
        subtitle: 'Худи #1c1c1e, потёртая гранж-надпись «Vitality», швы кармана',
        resolution: '256×256 NEAREST',
        dataUrl: hoodieChestCanvas.toDataURL(),
      },
      {
        name: 'DENIM_FADED.BMP',
        subtitle: 'Выцветшие тёмно-синие джинсы #232936, потёртости и складки',
        resolution: '128×128 NEAREST',
        dataUrl: jeansCanvas.toDataURL(),
      },
      {
        name: 'SNEAKER_WORN.BMP',
        subtitle: 'Старые кеды, грязно-белая подошва и шнуровка',
        resolution: '128×128 NEAREST',
        dataUrl: sneakersCanvas.toDataURL(),
      },
      {
        name: 'HAIR_STRANDS.BMP',
        subtitle: 'Угольно-чёрные пряди #121214 с пиксельной штриховкой',
        resolution: '64×64 NEAREST',
        dataUrl: hairCanvas.toDataURL(),
      },
      {
        name: 'ZIPPO_METAL.BMP',
        subtitle: 'Старая бензиновая зажигалка с царапинами и копотью',
        resolution: '64×64 NEAREST',
        dataUrl: lighterCanvas.toDataURL(),
      },
    ],
  };
}
