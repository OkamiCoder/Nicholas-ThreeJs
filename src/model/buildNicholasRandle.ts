import * as THREE from 'three';
import { ProceduralTextureSet } from '../textures/proceduralTextures';

export interface CharacterRig {
  root: THREE.Group;
  upperBodyGroup: THREE.Group;
  headGroup: THREE.Group;
  leftShoulderGroup: THREE.Group;
  rightShoulderGroup: THREE.Group;
  rightForearmGroup: THREE.Group;
  lighterGroup: THREE.Group;
  flameGroup: THREE.Group;
  flameOuterMesh: THREE.Mesh;
  flameMidMesh: THREE.Mesh;
  flameCoreMesh: THREE.Mesh;
  flameLightAnchor: THREE.Object3D;
  wireframeOverlayGroup: THREE.Group;
  stats: {
    vertices: number;
    triangles: number;
    meshes: number;
    heightMeters: number;
    headRatio: number;
  };
}

export interface AnatomyPin {
  id: string;
  label: string;
  category: 'head' | 'torso' | 'limbs' | 'prop';
  position: [number, number, number];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  description: string;
  techSpec: string;
}

export const ANATOMY_PINS: AnatomyPin[] = [
  {
    id: 'skull-cheeks',
    label: '01 // Долихоцефальный череп и впалые щёки',
    category: 'head',
    position: [-0.065, 1.57, 0.08],
    cameraPos: [-0.28, 1.61, 0.48],
    cameraTarget: [0, 1.58, 0.04],
    description:
      'Узкий вытянутый по вертикали череп (~0.23 от роста 1.75 м). Нижняя треть резко сужается к угловатому подбородку; вершины в зоне щёк вдавлены внутрь для создания болезненной худобы.',
    techSpec: 'BufferGeometry Vertex Displacement • Inward Cheek Pinch (-26% X)',
  },
  {
    id: 'eyes-mole',
    label: '02 // Глубокие глазницы и родинка под левым глазом',
    category: 'head',
    position: [0.036, 1.595, 0.105],
    cameraPos: [0.16, 1.62, 0.38],
    cameraTarget: [0.02, 1.6, 0.05],
    description:
      'Глаза глубоко посажены под надбровными дугами, с тёмными кругами усталости. Кожа бледного серо-бежевого тона (#d8cfc6) с холодным градиентом и чёткой пиксельной родинкой под левым глазом.',
    techSpec: 'CanvasTexture 128×128 • THREE.NearestFilter • Pixel Mole @ UV(83,57)',
  },
  {
    id: 'hair-bangs',
    label: '03 // Многослойные треугольные пряди и рваная чёлка',
    category: 'head',
    position: [-0.04, 1.68, 0.095],
    cameraPos: [-0.32, 1.7, 0.44],
    cameraTarget: [0, 1.64, 0.04],
    description:
      'Короткие угольно-чёрные волосы (#121214), собранные из нескольких слоёв острых низкополигональных треугольных пластин. Асимметричная рваная чёлка падает на лоб и прикрывает правый глаз.',
    techSpec: 'Layered Triangle Strip Planes • #121214 • flatShading: true',
  },
  {
    id: 'hoodie-vitality',
    label: '04 // Худи #1c1c1e и гранж-принт «Vitality»',
    category: 'torso',
    position: [-0.04, 1.24, 0.14],
    cameraPos: [-0.35, 1.32, 0.68],
    cameraTarget: [0, 1.24, 0.04],
    description:
      'Мешковатая толстовка тёмно-угольного цвета (#1c1c1e) с потёртой пиксельной надписью «Vitality» на груди, сгенерированной на HTML5 Canvas с трещинами и потёками краски.',
    techSpec: 'CanvasTexture 256×256 • Procedural Grunge Erosion • #1c1c1e',
  },
  {
    id: 'posture-hood',
    label: '05 // Астеническая сутулость и опущенный капюшон',
    category: 'torso',
    position: [0.0, 1.38, -0.15],
    cameraPos: [0.55, 1.42, -0.62],
    cameraTarget: [0, 1.32, -0.02],
    description:
      'Эктоморфное телосложение: узкие покатые плечи, скруглённая в сутулости верхняя часть спины, шея и голова поданы вперёд. Сзади лежит объёмный складчатый капюшон.',
    techSpec: 'Kyphotic Spine Curve Offset • Volumetric Hood Mesh',
  },
  {
    id: 'pocket-folds',
    label: '06 // Складки на талии и накладной карман-кенгуру',
    category: 'torso',
    position: [0.0, 1.03, 0.145],
    cameraPos: [0.42, 1.12, 0.68],
    cameraTarget: [0, 1.06, 0.05],
    description:
      'Грубые геометрические складки ткани над поясом и на локтях, полученные радиальным и вертикальным смещением вершин цилиндра, а также объёмный накладной карман-кенгуру.',
    techSpec: 'Radial & Axial Vertex Perturbation • 3D Kangaroo Patch Pocket',
  },
  {
    id: 'hands-lighter',
    label: '07 // Костлявые фаланги и бензиновая зажигалка',
    category: 'prop',
    position: [0.06, 1.33, 0.27],
    cameraPos: [0.34, 1.38, 0.56],
    cameraTarget: [0.05, 1.33, 0.22],
    description:
      'Правая рука согнута в локте и поднята к груди. В узкой костлявой кисти с длинными фалангами зажата старая металлическая зажигалка с откинутой крышкой и полигональным пламенем.',
    techSpec: 'Articulated Phalanges • PointLight #ff7b29 • Alpha Flame Shards',
  },
  {
    id: 'jeans-sneakers',
    label: '08 // Джинсы #232936 со складками и старые кеды',
    category: 'limbs',
    position: [-0.09, 0.16, 0.08],
    cameraPos: [-0.52, 0.34, 0.78],
    cameraTarget: [0, 0.24, 0.02],
    description:
      'Прямые узкие выцветшие джинсы (#232936) с гармошкой грубых складок у щиколоток и поношенные тёмные кеды с грязно-белыми резиновыми носами и подошвой.',
    techSpec: 'Ankle Accordion Vertex Folding • Dirty-White Toe Cap Geometry',
  },
];

/**
 * Helper to finalize a BufferGeometry for crisp GoldSrc/PS2 flat shading
 */
function finalizeFlatGeometry(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const nonIndexed = geo.index ? geo.toNonIndexed() : geo;
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}

/**
 * 1. HEAD GEOMETRY (Dolichocephalic skull, sunken cheeks, deep eye sockets,
 *    sharp triangular nose, angular pointed chin)
 */
/**
/**
 * 1. HEAD GEOMETRY — естественный череп.
 *    Лицо уплощено (не выпирает дальше чёлки), подбородок укорочен.
 *    UV считается от исходной высоты — текстуры остаются на месте.
 */
/**
 * 1. HEAD GEOMETRY — естественный череп.
 *    Лицо уплощено (не выпирает дальше чёлки).
 *    Подбородок удлинён и расширен, челюсть стала массивнее.
 *    UV считается от исходной высоты — текстуры остаются на месте.
 */
/**
 * 1. HEAD GEOMETRY — естественный череп.
 *    Лицо уплощено. Подбородок удлинён и выдвинут вперёд (не рецессирован).
 *    UV считается от исходной высоты — текстуры остаются на месте.
 */
function buildHeadGeometry(): THREE.BufferGeometry {
  const radialSegs = 16;
  const heightSegs = 14;
  const geo = new THREE.SphereGeometry(1, radialSegs, heightSegs);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();

  const halfW = 0.072;
  const halfH = 0.113;
  const halfD = 0.092;

  const FACE_FLATTEN = 0.10;
  const CHIN_PIVOT_NY = -0.40;
  const CHIN_SCALE = 0.61;
  const JAW_TAPER = 0.22;
  const CHIN_FACET_FALLOFF = 1.25;
  // Насколько подбородок выдвигается вперёд у кончика
  const CHIN_FORWARD = 0.04;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const nx = v.x; // -1..1
    const ny = v.y; // -1 (подбородок) .. +1 (макушка)
    const nz = v.z; // -1 (затылок) .. +1 (лицо)

    let x = nx * halfW;
    let y = ny * halfH;
    let z = nz * halfD;

    // 1. Макушка: округлая, слегка уплощённая сверху.
    if (ny > 0.2) {
      const t = (ny - 0.2) / 0.8;
      x *= 1.0 - t * t * 0.10;
      z *= 1.0 - t * t * 0.05;
      if (ny > 0.85) {
        y -= (ny - 0.85) * halfH * 0.30;
      }
    }

    // 2. Затылок плоский, без горба.
    if (nz < -0.2 && ny > -0.2) {
      z *= 0.93;
    }

    // 3. Лицо не выпирает: мягко прижимаем переднюю полусферу.
    if (nz > 0) {
      z *= 1.0 - FACE_FLATTEN * nz;
    }

    // 4. Челюсть: сужение к подбородку + выдвижение подбородка вперёд.
    if (ny < 0.05) {
      const lowerT = Math.min(1, (0.05 - ny) / 1.05);
      const jawNarrow = 1.0 - Math.pow(lowerT, 1.2) * JAW_TAPER;
      x *= jawNarrow;

      if (nz > 0) {
        const centerProximity = Math.max(0, 1 - Math.abs(nx) * CHIN_FACET_FALLOFF);
        z *= 0.86 + centerProximity * 0.18;
        if (ny < -0.65) {
          // Сильный подбородок: выдвигаем вперёд, чтобы не был скошен назад.
          const chinT = Math.min(1, (-0.65 - ny) / 0.33);
          z += centerProximity * chinT * CHIN_FORWARD;
          y -= centerProximity * 0.006;
        }
      } else {
        z *= 0.60 * (1 - lowerT * 0.30);
        if (ny < -0.45) {
          y += (-0.45 - ny) * 0.022;
        }
      }
    }

    // 5. Впалые щёки.
    // 5. Лёгкая рельефность щёк (впалость сильно уменьшена).
    if (nz > 0.1 && ny > -0.58 && ny < 0.02 && Math.abs(nx) > 0.22 && Math.abs(nx) < 0.88) {
      const cheekYFactor = 1.0 - Math.abs(ny + 0.26) / 0.32;
      const cheekXFactor = 1.0 - Math.abs(Math.abs(nx) - 0.54) / 0.34;
      const hollowAmount = Math.max(0, cheekYFactor) * Math.max(0, cheekXFactor);
      x *= 1.0 - hollowAmount * 0.6;
      z -= hollowAmount * 0.006;
    }

    // 6. Скулы.
    if (nz > 0.15 && ny >= 0.0 && ny <= 0.18 && Math.abs(nx) > 0.35 && Math.abs(nx) < 0.85) {
      x *= 1.07;
      z += 0.005;
    }

    // 7. Черты лица.
    if (nz > 0.3) {
      if (ny >= 0.22 && ny <= 0.38 && Math.abs(nx) < 0.72) {
        z += 0.005 * (1 - Math.abs(nx) * 0.5);
      }
      if (ny >= 0.02 && ny < 0.22 && Math.abs(nx) >= 0.16 && Math.abs(nx) <= 0.68) {
        const socketDepth =
          (1 - Math.abs(ny - 0.12) / 0.11) * (1 - Math.abs(Math.abs(nx) - 0.4) / 0.28);
        if (socketDepth > 0) {
          z -= socketDepth * 0.019;
        }
      }
      if (Math.abs(nx) < 0.16 && ny >= -0.24 && ny <= 0.25) {
        const noseT = 1 - (ny + 0.24) / 0.49;
        z += 0.003 + Math.sin(noseT * Math.PI * 0.85) * 0.005;
      }
      if (Math.abs(nx) < 0.32 && ny >= -0.40 && ny <= -0.26) {
        z -= 0.004;
      }
    }

    // 8. Длина подбородка: сжатие нижней трети лица от точки под губой.
    if (ny < CHIN_PIVOT_NY) {
      const yBase = ny * halfH;
      const yCompressed =
        (CHIN_PIVOT_NY + (ny - CHIN_PIVOT_NY) * CHIN_SCALE) * halfH;
      y += yCompressed - yBase;
    }

    pos.setXYZ(i, x, y, z);

    // UV: v от ИСХОДНОЙ ny — глаза, нос и рот на текстуре не смещаются.
    if (nz >= -0.1) {
      const uCoord = 0.5 + (x / (halfW * 1.05)) * 0.42;
      const vCoord = 0.5 + (ny / 1.02) * 0.45;
      uv.setXY(
        i,
        THREE.MathUtils.clamp(uCoord, 0.02, 0.98),
        THREE.MathUtils.clamp(vCoord, 0.02, 0.98)
      );
    } else {
      uv.setXY(i, 0.08, 0.85);
    }
  }

  return finalizeFlatGeometry(geo);
}

/**
 * Sharp Triangular Low-Poly Nose Prism (high nasal bridge & crisp triangular profile)
 */
/**
 * Острый низкополигональный нос-призма, посаженный НА плоскость лица.
 * Кончик выступает всего на ~12 мм — без «хобота». UV сохранены.
 */
/**
 * Острый треугольный нос, посаженный на уплощённое лицо.
 * Основание утоплено в голову, кончик не выступает дальше чёлки.
 */
function buildTriangularNoseGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();

  const BTop = [0.0, 0.032, 0.082];
  const BLeft = [-0.009, 0.026, 0.078];
  const BRight = [0.009, 0.026, 0.078];
  const Tip = [0.0, -0.022, 0.099];
  const WingL = [-0.013, -0.025, 0.078];
  const WingR = [0.013, -0.025, 0.078];
  const Base = [0.0, -0.033, 0.080];

  const positions = new Float32Array([
    // Левая стенка
    ...BTop, ...BLeft, ...Tip,
    ...BLeft, ...WingL, ...Tip,
    // Правая стенка
    ...BTop, ...Tip, ...BRight,
    ...BRight, ...Tip, ...WingR,
    // Низ / ноздри
    ...Tip, ...WingL, ...Base,
    ...Tip, ...Base, ...WingR,
  ]);

  const uvs = new Float32Array([
    0.5, 0.66, 0.45, 0.65, 0.5, 0.47,
    0.45, 0.65, 0.44, 0.46, 0.5, 0.47,
    0.5, 0.66, 0.5, 0.47, 0.55, 0.65,
    0.55, 0.65, 0.5, 0.47, 0.56, 0.46,
    0.5, 0.47, 0.45, 0.45, 0.5, 0.44,
    0.5, 0.47, 0.5, 0.44, 0.55, 0.45,
  ]);

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}
/**
 * Multi-layered Charcoal-Black (#121214) Sharp Triangular Hair Strands & Asymmetric Bangs
 * Partially covering one eye (covers character's right eye, leaving left eye & mole exposed)
 */
/**
 * Многослойные угольно-чёрные пряди. Чёлка выдвинута вперёд и удлинена,
 * чтобы перекрывать почти всё лицо (лоб, глаза, нос), оставляя видимыми
 * рот и подбородок ниже.
 */
function buildHairGroup(hairMat: THREE.Material): THREE.Group {
  const hairGroup = new THREE.Group();

  const addTriangularStrand = (
    root: [number, number, number],
    mid: [number, number, number],
    tip: [number, number, number],
    widthRoot: number,
    widthMid: number,
    tangent: [number, number, number]
  ) => {
    const tx = tangent[0];
    const ty = tangent[1];
    const tz = tangent[2];

    const rL = [root[0] - tx * widthRoot, root[1] - ty * widthRoot, root[2] - tz * widthRoot];
    const rR = [root[0] + tx * widthRoot, root[1] + ty * widthRoot, root[2] + tz * widthRoot];
    const mL = [mid[0] - tx * widthMid, mid[1] - ty * widthMid, mid[2] - tz * widthMid];
    const mR = [mid[0] + tx * widthMid, mid[1] + ty * widthMid, mid[2] + tz * widthMid];

    const positions = new Float32Array([
      ...rL, ...mL, ...rR,
      ...rR, ...mL, ...mR,
      ...mL, ...tip, ...mR,
    ]);

    const uvs = new Float32Array([
      0.1, 0.9, 0.1, 0.45, 0.9, 0.9,
      0.9, 0.9, 0.1, 0.45, 0.9, 0.45,
      0.1, 0.45, 0.5, 0.02, 0.9, 0.45,
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, hairMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    hairGroup.add(mesh);
  };

  // Базовый низкополигональный капюшон-скейлкап
  const capGeo = new THREE.SphereGeometry(0.075, 10, 8);
  const capPos = capGeo.attributes.position;
  for (let i = 0; i < capPos.count; i++) {
    let x = capPos.getX(i) * 1.03;
    let y = capPos.getY(i) * 1.48 + 0.022;
    let z = capPos.getZ(i) * 1.24 - 0.008;
    if (y < 0.03 && z > 0.01) {
      y = 0.035;
      z *= 0.85;
    }
    if (y < -0.05) {
      y = -0.05;
    }
    capPos.setXYZ(i, x, y, z);
  }
  const capMesh = new THREE.Mesh(finalizeFlatGeometry(capGeo), hairMat);
  capMesh.castShadow = true;
  hairGroup.add(capMesh);

    // ЧЁЛКА-ЗАВЕСА: выдвинута вперёд (+0.012 по z) и удлинена, перекрывает почти всё лицо.
  // Прядь над правым глазом (длинная)
  addTriangularStrand(
    [-0.016, 0.108, 0.074],
    [-0.034, 0.046, 0.108],
    [-0.040, -0.032, 0.116],
    0.024,
    0.016,
    [0.95, 0.1, -0.25]
  );
  // Правый висок / бровь
  addTriangularStrand(
    [-0.040, 0.102, 0.064],
    [-0.058, 0.044, 0.102],
    [-0.062, -0.018, 0.110],
    0.021,
    0.015,
    [0.82, 0.12, 0.55]
  );
  // Крайняя правая височная прядь (обрамление)
  addTriangularStrand(
    [-0.058, 0.094, 0.044],
    [-0.076, 0.036, 0.072],
    [-0.074, -0.020, 0.088],
    0.019,
    0.013,
    [0.35, 0.1, 0.92]
  );
  // Центральная прядь над носом (самая длинная)
  addTriangularStrand(
    [0.004, 0.112, 0.076],
    [-0.008, 0.050, 0.112],
    [-0.012, -0.036, 0.118],
    0.022,
    0.015,
    [0.98, 0.08, -0.10]
  );
  // Прядь над левым глазом
  addTriangularStrand(
    [0.028, 0.108, 0.072],
    [0.038, 0.046, 0.106],
    [0.042, -0.030, 0.114],
    0.023,
    0.015,
    [0.92, -0.15, -0.35]
  );
  // Левая височная прядь (обрамление)
  addTriangularStrand(
    [0.056, 0.096, 0.050],
    [0.074, 0.038, 0.078],
    [0.072, -0.016, 0.092],
    0.019,
    0.013,
    [0.35, 0.1, -0.92]
  );

  // Слой 3: макушка, бока и затылок — растрёпанные шипы
  const perimeterSpikes = 14;
  for (let i = 0; i < perimeterSpikes; i++) {
    const angle = (i / perimeterSpikes) * Math.PI * 1.45 + Math.PI * 0.78;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    const tangent: [number, number, number] = [cosA, 0, -sinA];

    addTriangularStrand(
      [sinA * 0.042, 0.118, cosA * 0.052 - 0.006],
      [sinA * 0.078, 0.064, cosA * 0.094 - 0.01],
      [sinA * 0.084, -0.005 - (i % 3) * 0.014, cosA * 0.102 - 0.012],
      0.024,
      0.017,
      tangent
    );

    addTriangularStrand(
      [sinA * 0.062, 0.055, cosA * 0.076 - 0.008],
      [sinA * 0.076, -0.008, cosA * 0.096 - 0.012],
      [sinA * 0.072, -0.065 - (i % 2) * 0.015, cosA * 0.094 - 0.015],
      0.021,
      0.014,
      tangent
    );
  }

  // Верхние растрёпанные пучки
  addTriangularStrand(
    [-0.01, 0.122, -0.01],
    [-0.035, 0.134, 0.025],
    [-0.052, 0.118, 0.055],
    0.022,
    0.014,
    [0.4, 0.2, 0.88]
  );
  addTriangularStrand(
    [0.015, 0.122, -0.02],
    [0.038, 0.132, -0.05],
    [0.05, 0.108, -0.085],
    0.022,
    0.014,
    [0.85, 0.1, -0.5]
  );

  return hairGroup;
}

/**
 * 2. TORSO & BAGGY HOODIE GEOMETRY (#1c1c1e)
 * - Ectomorphic narrow sloped shoulders, rounded kyphotic upper back (slouch)
 * - Coarse geometric folds at the waist via cylinder vertex displacement
 */
function buildTorsoHoodieGeometry(): THREE.BufferGeometry {
  const height = 0.56;
  const radialSegs = 16;
  const heightSegs = 12;
  const geo = new THREE.CylinderGeometry(0.145, 0.142, height, radialSegs, heightSegs, false);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ny = (v.y + height * 0.5) / height; // 0 (bottom waist hem) .. 1 (top shoulders/neck)
    const angle = Math.atan2(v.x, v.z); // 0 is front (+Z), PI is back (-Z)

    let x = v.x;
    let y = v.y;
    let z = v.z;

    // Cross-section flatten: human torso is wider in X than deep in Z
    x *= 1.12;
    z *= 0.78;

    // 1. Narrow, slightly sloped shoulders at top (ny > 0.78)
    if (ny > 0.78) {
      const shoulderT = (ny - 0.78) / 0.22;
      // Taper inward to neck opening at the very top
      const neckPinch = 1.0 - Math.pow(shoulderT, 1.5) * 0.58;
      x *= neckPinch;
      z *= neckPinch;
      // Sloped shoulders: outer X vertices drop down slightly
      const outerX = Math.min(1, Math.abs(x) / 0.14);
      y -= outerX * shoulderT * 0.038;
    }

    // 2. Baggy drape in mid-lower hoodie + tighter ribbed waistband at very bottom (ny < 0.12)
    if (ny >= 0.12 && ny <= 0.65) {
      const baggy = Math.sin(((ny - 0.12) / 0.53) * Math.PI) * 0.018;
      x += Math.sign(x) * baggy;
      z += Math.sign(z) * baggy * 0.85;
    } else if (ny < 0.12) {
      const hemT = (0.12 - ny) / 0.12;
      x *= 1.0 - hemT * 0.09;
      z *= 1.0 - hemT * 0.09;
    }

    // 3. Asthenic slouch / kyphotic upper back curve:
    // Upper back rounds backward (-Z), while top neck pitches forward (+Z)
    const slouchBack = Math.sin(ny * Math.PI) * -0.024;
    const neckPitchForward = Math.pow(ny, 2.2) * 0.036;
    z += slouchBack + neckPitchForward;

    // 4. Coarse geometric folds at the waist & lower torso (смещение вершин цилиндра)
    if (ny > 0.08 && ny < 0.58) {
      const waistWeight = 1.0 - Math.abs(ny - 0.28) / 0.28;
      const foldRadius =
        Math.sin(angle * 5.0 + ny * 9.0) * 0.011 +
        Math.cos(angle * 3.0 - ny * 12.0) * 0.008;
      const verticalBunch = Math.sin(angle * 6.0 + ny * 7.0) * 0.009 * waistWeight;

      x += Math.sin(angle) * foldRadius * Math.max(0.3, waistWeight);
      z += Math.cos(angle) * foldRadius * Math.max(0.3, waistWeight);
      y += verticalBunch;
    }

    pos.setXYZ(i, x, y, z);

    // Map front torso (z > 0) cleanly to hoodieChestTexture so "Vitality" sits across the chest
    if (z >= -0.01) {
      const uFront = 0.5 + (x / 0.175) * 0.44;
      const vFront = THREE.MathUtils.clamp(ny * 0.94 + 0.03, 0.02, 0.98);
      uv.setXY(i, THREE.MathUtils.clamp(uFront, 0.02, 0.98), vFront);
    } else {
      // Back torso uses dark charcoal fabric side of texture
      const uBack = 0.05 + ((x + 0.17) / 0.34) * 0.12;
      uv.setXY(i, THREE.MathUtils.clamp(uBack, 0.01, 0.2), THREE.MathUtils.clamp(ny, 0.02, 0.92));
    }
  }

  return finalizeFlatGeometry(geo);
}

/**
 * 3D Patch Kangaroo Pocket on Front Lower Hoodie
 */
function buildKangarooPocketGeometry(): THREE.BufferGeometry {
  // Box geometry sculpted into a trapezoidal kangaroo pouch with central bulge and side openings
  const geo = new THREE.BoxGeometry(0.19, 0.145, 0.032, 6, 4, 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ny = (v.y + 0.0725) / 0.145; // 0 bottom .. 1 top

    // Trapezoidal narrowing toward the top seam of the kangaroo pocket
    if (ny > 0.35) {
      const taper = (ny - 0.35) / 0.65;
      v.x *= 1.0 - taper * 0.28;
    }

    // Wrap around the curved front of the torso cylinder
    const curveZ = -Math.pow(v.x / 0.1, 2) * 0.016;
    v.z += curveZ;

    // Bulge the front pouch outward in the middle & add coarse fabric creases
    if (v.z > 0) {
      const pouchBulge = Math.sin(ny * Math.PI) * (1 - Math.pow(v.x / 0.1, 2)) * 0.016;
      const crease = Math.sin(v.x * 45 + v.y * 30) * 0.004;
      v.z += pouchBulge + crease;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  return finalizeFlatGeometry(geo);
}

/**
 * Volumetric Lowered Hood on the Back of the Hoodie
 */
function buildLoweredHoodGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.115, 10, 8);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Stretch vertically and flatten slightly into a heavy draped hood sack on upper back
    let x = v.x * 1.18;
    let y = v.y * 1.25;
    let z = v.z * 0.85;

    // Taper bottom point of the lowered hood
    if (v.y < 0) {
      x *= 1.0 + v.y * 0.45;
      z -= v.y * 0.03;
    }

    // Carve hollow fold cavity at top-front where hood opens around the neck
    if (v.y > 0.02 && v.z > -0.02) {
      y -= 0.035;
      z -= 0.025;
    }

    // Coarse geometric fabric folds across the back of the hood
    const hoodFold = Math.sin(y * 38.0 + Math.abs(x) * 20.0) * 0.011;
    z += hoodFold;
    x += Math.sin(y * 28.0) * 0.006 * Math.sign(x);

    pos.setXYZ(i, x, y, z);
  }

  return finalizeFlatGeometry(geo);
}

/**
 * Baggy Hoodie Sleeve Segment with Coarse Elbow Folds & Tight Ribbed Cuff
 */
function buildSleeveSegmentGeometry(
  length: number,
  topRadius: number,
  bottomRadius: number,
  isForearm: boolean,
  isBentArm: boolean
): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(topRadius, bottomRadius, length, 10, 9, false);
  // Shift so top pivot is at y = 0 and segment extends downward to y = -length
  geo.translate(0, -length * 0.5, 0);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = Math.abs(v.y) / length; // 0 at top joint .. 1 at bottom joint
    const angle = Math.atan2(v.x, v.z);

    let x = v.x;
    let y = v.y;
    let z = v.z;

    if (!isForearm) {
      // Upper arm: wide baggy sleeve with deep elbow bunching near bottom (t > 0.6)
      const baggy = Math.sin(t * Math.PI) * 0.012;
      x += Math.sin(angle) * baggy;
      z += Math.cos(angle) * baggy;

      if (t > 0.55) {
        const elbowFactor = (t - 0.55) / 0.45;
        const intensity = isBentArm ? 0.014 : 0.009;
        const fold = Math.sin(t * 28.0 + angle * 3.0) * intensity * elbowFactor;
        x += Math.sin(angle) * fold;
        z += Math.cos(angle) * fold;
        y += Math.cos(angle * 2.0 + t * 18.0) * 0.006 * elbowFactor;
      }
    } else {
      // Forearm: wide at elbow (t < 0.35), baggy mid-sleeve, tapering sharply to tight ribbed cuff (t > 0.82)
      if (t < 0.4) {
        const elbowFactor = 1.0 - t / 0.4;
        const intensity = isBentArm ? 0.015 : 0.009;
        const fold = Math.sin(t * 30.0 - angle * 3.0) * intensity * elbowFactor;
        x += Math.sin(angle) * fold;
        z += Math.cos(angle) * fold;
      } else if (t >= 0.4 && t <= 0.82) {
        // Puff out slightly right above the tight wrist cuff
        const puff = Math.sin(((t - 0.4) / 0.42) * Math.PI) * 0.014;
        x += Math.sin(angle) * puff;
        z += Math.cos(angle) * puff;
      } else {
        // Tight ribbed cuff (сужаются к плотным трикотажным манжетам)
        x *= 0.78;
        z *= 0.78;
      }
    }

    pos.setXYZ(i, x, y, z);
    uv.setXY(i, (angle + Math.PI) / (Math.PI * 2), 1 - t);
  }

  return finalizeFlatGeometry(geo);
}

/**
 * 3. NARROW BONY HANDS WITH ELONGATED PHALANGES
 * Builds either the relaxed hanging left hand or the right hand clutching the lighter
 */
function buildBonyHandGroup(skinMat: THREE.Material, isRightHandClutching: boolean): THREE.Group {
  const handGroup = new THREE.Group();

  // Narrow, flat, bony metacarpal palm with sculpted knuckle ridges
  const palmGeo = new THREE.BoxGeometry(0.044, 0.068, 0.018, 4, 4, 2);
  palmGeo.translate(0, -0.034, 0);
  const pPos = palmGeo.attributes.position;
  for (let i = 0; i < pPos.count; i++) {
    let x = pPos.getX(i);
    let y = pPos.getY(i);
    let z = pPos.getZ(i);
    const t = Math.abs(y) / 0.068; // 0 wrist .. 1 knuckles
    // Narrow at wrist, slightly wider at bony knuckles
    x *= 0.82 + t * 0.26;
    // Bony dorsal tendon grooves on back of hand
    if (z < 0) {
      z -= Math.abs(Math.sin(x * 140)) * 0.003;
    }
    // Knuckle ridge bumps at t > 0.85
    if (t > 0.85) {
      z += Math.cos(x * 180) * 0.003;
    }
    pPos.setXYZ(i, x, y, z);
  }
  const palmMesh = new THREE.Mesh(finalizeFlatGeometry(palmGeo), skinMat);
  palmMesh.castShadow = true;
  palmMesh.receiveShadow = true;
  handGroup.add(palmMesh);

  // Helper to build a 3-phalanx elongated bony finger
  const createFinger = (
    baseX: number,
    baseY: number,
    baseZ: number,
    len1: number,
    len2: number,
    len3: number,
    curl1: number,
    curl2: number,
    curl3: number,
    splayZ = 0
  ) => {
    const fingerRoot = new THREE.Group();
    fingerRoot.position.set(baseX, baseY, baseZ);
    fingerRoot.rotation.z = splayZ;

    const buildPhalanx = (length: number, rTop: number, rBot: number) => {
      const geo = new THREE.CylinderGeometry(rTop, rBot, length, 5, 2);
      geo.translate(0, -length * 0.5, 0);
      // Bony knuckle joint swelling at top
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const py = pos.getY(i);
        if (Math.abs(py) < length * 0.25 || Math.abs(py) > length * 0.8) {
          pos.setX(i, pos.getX(i) * 1.15);
          pos.setZ(i, pos.getZ(i) * 1.15);
        }
      }
      const mesh = new THREE.Mesh(finalizeFlatGeometry(geo), skinMat);
      mesh.castShadow = true;
      return mesh;
    };

    // Proximal phalanx
    const p1Group = new THREE.Group();
    p1Group.rotation.x = curl1;
    p1Group.add(buildPhalanx(len1, 0.0048, 0.0042));
    fingerRoot.add(p1Group);

    // Middle phalanx
    const p2Group = new THREE.Group();
    p2Group.position.y = -len1;
    p2Group.rotation.x = curl2;
    p2Group.add(buildPhalanx(len2, 0.0041, 0.0035));
    p1Group.add(p2Group);

    // Distal phalanx (elongated bony fingertip)
    const p3Group = new THREE.Group();
    p3Group.position.y = -len2;
    p3Group.rotation.x = curl3;
    p3Group.add(buildPhalanx(len3, 0.0034, 0.0024));
    p2Group.add(p3Group);

    return fingerRoot;
  };

  if (!isRightHandClutching) {
    // LEFT HAND: Relaxed, narrow, bony fingers with elongated phalanges slightly curved inward (+Z palm side)
    handGroup.add(createFinger(-0.017, -0.066, 0, 0.026, 0.019, 0.014, -0.22, -0.28, -0.18, -0.04)); // Index
    handGroup.add(createFinger(-0.006, -0.068, 0, 0.029, 0.021, 0.015, -0.26, -0.32, -0.22, 0.0));   // Middle
    handGroup.add(createFinger(0.006, -0.067, 0, 0.027, 0.019, 0.014, -0.30, -0.36, -0.25, 0.03));   // Ring
    handGroup.add(createFinger(0.017, -0.064, 0, 0.022, 0.016, 0.012, -0.34, -0.42, -0.28, 0.07));   // Pinky

    // Elongated bony thumb on radial (-X) side
    const thumb = createFinger(-0.023, -0.028, 0.005, 0.024, 0.019, 0.015, -0.28, -0.24, -0.16, -0.48);
    thumb.rotation.y = -0.45;
    handGroup.add(thumb);
  } else {
    // RIGHT HAND: Fingers curled into +Z palm around the metallic petrol lighter body
    handGroup.add(createFinger(-0.017, -0.066, 0, 0.026, 0.019, 0.014, -1.22, -1.35, -0.88, -0.02));
    handGroup.add(createFinger(-0.006, -0.068, 0, 0.029, 0.021, 0.015, -1.32, -1.42, -0.95, 0.0));
    handGroup.add(createFinger(0.006, -0.067, 0, 0.027, 0.019, 0.014, -1.38, -1.46, -0.98, 0.02));
    handGroup.add(createFinger(0.017, -0.064, 0, 0.022, 0.016, 0.012, -1.45, -1.50, -1.02, 0.05));

    // Thumb poised by the spark wheel on the -X (top) side of the grip
    const thumb = createFinger(-0.023, -0.028, 0.008, 0.024, 0.019, 0.015, -0.58, -0.52, -0.25, -0.32);
    thumb.rotation.y = -0.65;
    handGroup.add(thumb);
  }

  return handGroup;
}

/**
 * 4. OLD METALLIC PETROL LIGHTER (ZIPPO-STYLE) WITH FLIPPED-OPEN LID & POLYGONAL FLAME
 */
function buildLighterAndFlame(lighterMat: THREE.Material): {
  lighterGroup: THREE.Group;
  flameGroup: THREE.Group;
  flameOuterMesh: THREE.Mesh;
  flameMidMesh: THREE.Mesh;
  flameCoreMesh: THREE.Mesh;
  flameLightAnchor: THREE.Object3D;
} {
  const lighterGroup = new THREE.Group();

  // 1. Main metallic casing body
  const caseGeo = finalizeFlatGeometry(new THREE.BoxGeometry(0.036, 0.048, 0.014));
  const caseMesh = new THREE.Mesh(caseGeo, lighterMat);
  caseMesh.receiveShadow = true;
  lighterGroup.add(caseMesh);

  // 2. Inner brass/steel insert & perforated windguard chimney
  const chimneyGeo = finalizeFlatGeometry(new THREE.BoxGeometry(0.028, 0.018, 0.011));
  const chimneyMesh = new THREE.Mesh(chimneyGeo, lighterMat);
  chimneyMesh.position.set(0, 0.032, 0);
  lighterGroup.add(chimneyMesh);

  // 3. Spark wheel (flint wheel)
  const wheelMat = new THREE.MeshStandardMaterial({
    color: '#32353a',
    roughness: 0.5,
    metalness: 0.7,
    flatShading: true,
  });
  const wheelGeo = finalizeFlatGeometry(new THREE.CylinderGeometry(0.006, 0.006, 0.009, 8));
  wheelGeo.rotateX(Math.PI * 0.5);
  const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
  wheelMesh.position.set(-0.009, 0.029, 0);
  lighterGroup.add(wheelMesh);

  // 4. Short charred wick protruding above chimney
  const wickMat = new THREE.MeshBasicMaterial({ color: '#1b1614' });
  const wickGeo = finalizeFlatGeometry(new THREE.CylinderGeometry(0.0014, 0.0016, 0.009, 5));
  const wickMesh = new THREE.Mesh(wickGeo, wickMat);
  wickMesh.position.set(0.004, 0.043, 0);
  lighterGroup.add(wickMesh);

  // 5. Flipped-open lid (с откинутой крышкой) swung open around hinge at x = +0.018, y = +0.024
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0.018, 0.024, 0);
  lidPivot.rotation.z = -2.15; // Swung wide open (~123 degrees)
  const lidGeo = finalizeFlatGeometry(new THREE.BoxGeometry(0.036, 0.022, 0.0145));
  lidGeo.translate(-0.018, 0.011, 0);
  const lidMesh = new THREE.Mesh(lidGeo, lighterMat);
  lidMesh.receiveShadow = true;
  lidPivot.add(lidMesh);
  lighterGroup.add(lidPivot);

  // 6. Animated Flame Tongue made of semi-transparent orange polygons
  // (небольшое анимированное язычок-пламя из полупрозрачных оранжевых полигонов)
  const flameGroup = new THREE.Group();
  flameGroup.position.set(0.004, 0.046, 0);
  lighterGroup.add(flameGroup);

  const buildFlameShardGeometry = (radius: number, height: number): THREE.BufferGeometry => {
    // Crossed low-poly diamond/octahedral shard with elongated tapered apex
    const geo = new THREE.ConeGeometry(radius, height, 5, 3);
    geo.translate(0, height * 0.42, 0);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const py = pos.getY(i);
      const t = THREE.MathUtils.clamp(py / height, 0, 1);
      // Bulge lower-mid belly of the flame tongue, sharpen top tip
      const profile = Math.sin(Math.pow(t, 0.7) * Math.PI);
      pos.setX(i, pos.getX(i) * (0.4 + profile * 1.15));
      pos.setZ(i, pos.getZ(i) * (0.4 + profile * 1.15));
      // Slight organic S-curve flicker offset
      if (t > 0.65) {
        pos.setX(i, pos.getX(i) + (t - 0.65) * 0.006);
      }
    }
    return finalizeFlatGeometry(geo);
  };

  const outerFlameMat = new THREE.MeshBasicMaterial({
    color: '#ff6a14',
    transparent: true,
    opacity: 0.68,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const midFlameMat = new THREE.MeshBasicMaterial({
    color: '#ff9e2b',
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const coreFlameMat = new THREE.MeshBasicMaterial({
    color: '#fff1a8',
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const flameOuterMesh = new THREE.Mesh(buildFlameShardGeometry(0.013, 0.046), outerFlameMat);
  const flameMidMesh = new THREE.Mesh(buildFlameShardGeometry(0.0085, 0.033), midFlameMat);
  flameMidMesh.rotation.y = 0.6;
  const flameCoreMesh = new THREE.Mesh(buildFlameShardGeometry(0.0045, 0.019), coreFlameMat);

  flameGroup.add(flameOuterMesh, flameMidMesh, flameCoreMesh);

  // Light anchor slightly forward/up from the flame so it illuminates face, hand & chest cleanly without self-shadow artifacts
  const flameLightAnchor = new THREE.Object3D();
  flameLightAnchor.position.set(-0.01, 0.032, 0.015);
  flameGroup.add(flameLightAnchor);

  return {
    lighterGroup,
    flameGroup,
    flameOuterMesh,
    flameMidMesh,
    flameCoreMesh,
    flameLightAnchor,
  };
}

/**
 * 5. JEANS GEOMETRY (#232936) WITH STACKED ANKLE FOLDS
 */
function buildJeansLegGeometry(isLeftLeg: boolean): THREE.BufferGeometry {
  const length = 0.78;
  const geo = new THREE.CylinderGeometry(0.072, 0.056, length, 10, 14, false);
  geo.translate(0, -length * 0.5, 0);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  const sign = isLeftLeg ? 1 : -1;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = Math.abs(v.y) / length; // 0 hip .. 1 ankle
    const angle = Math.atan2(v.x, v.z);

    let x = v.x;
    let y = v.y;
    let z = v.z;

    // Straight, slightly narrow asthenic fit
    // Subtle forward knee bend around t = 0.48
    const kneeBend = Math.exp(-Math.pow((t - 0.48) / 0.14, 2));
    z += kneeBend * 0.014;

    // Knee fabric creases behind the knee
    if (t > 0.38 && t < 0.58 && z < 0) {
      z += Math.sin(t * 55.0) * 0.006;
    }

    // Coarse stacked folds at the ankles (со складками у щиколоток)
    if (t > 0.72) {
      const ankleT = (t - 0.72) / 0.28;
      const accordion =
        Math.sin(t * 48.0 + angle * 2.0 * sign) * 0.011 * ankleT +
        Math.cos(t * 32.0 - angle * 3.0) * 0.007 * ankleT;
      x += Math.sin(angle) * (accordion + 0.006 * ankleT);
      z += Math.cos(angle) * (accordion + 0.008 * ankleT);
      y += Math.sin(angle * 3.0 + t * 24.0) * 0.006 * ankleT;
    }

    pos.setXYZ(i, x, y, z);
    uv.setXY(i, (angle + Math.PI) / (Math.PI * 2), 1 - t);
  }

  return finalizeFlatGeometry(geo);
}

/**
 * 6. OLD DARK SNEAKERS WITH DIRTY-WHITE TOE CAPS & SOLES
 */
function buildSneakerGroup(sneakerMat: THREE.Material): THREE.Group {
  const shoeGroup = new THREE.Group();

  // Dirty-white rubber sole + upper dark canvas body + dirty-white rounded toe cap
  const geo = new THREE.BoxGeometry(0.092, 0.072, 0.225, 4, 4, 7);
  geo.translate(0, 0.036, 0.038);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ny = v.y / 0.072; // 0 (bottom of sole) .. 1 (ankle collar)
    const nz = (v.z + 0.0745) / 0.225; // 0 (heel) .. 1 (toe tip)

    let x = v.x;
    let y = v.y;
    let z = v.z;

    // Taper width at toe tip and heel
    if (nz > 0.72) {
      const toeT = (nz - 0.72) / 0.28;
      x *= 1.0 - Math.pow(toeT, 1.5) * 0.36;
      // Slope top of toe box down toward dirty-white rubber toe cap
      if (ny > 0.28) {
        y *= 0.42 + (1 - toeT) * 0.48;
      }
    } else if (nz > 0.35 && nz <= 0.72 && ny > 0.35) {
      // Sloped laced instep
      const instepT = (nz - 0.35) / 0.37;
      y *= 1.0 - instepT * 0.42;
      x *= 0.88;
    } else if (nz <= 0.35 && ny > 0.5) {
      // Narrow high-top ankle collar under the jeans hem
      x *= 0.82;
    }

    // Slightly flared vulcanized rubber sole at bottom
    if (ny < 0.26) {
      x *= 1.05;
      z *= 1.02;
    }

    pos.setXYZ(i, x, y, z);

    // Map UVs so:
    // - Sole (ny < 0.28) OR Toe cap (nz > 0.73 and ny < 0.62) samples the dirty-white bottom band of sneakersTexture (v < 0.25 in Three UV = bottom of canvas y > 94)
    // - Laced instep samples middle-top of canvas
    // - Side canvas panels sample dark upper canvas
    const isSoleOrToeCap = ny < 0.26 || (nz > 0.72 && ny < 0.65);
    if (isSoleOrToeCap) {
      uv.setXY(i, THREE.MathUtils.clamp(0.2 + nz * 0.6, 0.05, 0.95), 0.12);
    } else if (ny > 0.45 && nz > 0.32 && nz < 0.72 && Math.abs(x) < 0.032) {
      // Laces tongue area
      uv.setXY(i, 0.5 + (x / 0.032) * 0.12, THREE.MathUtils.clamp(0.4 + nz * 0.4, 0.35, 0.85));
    } else {
      // Dark canvas upper
      uv.setXY(i, 0.15 + nz * 0.25, 0.55 + ny * 0.35);
    }
  }

  const shoeMesh = new THREE.Mesh(finalizeFlatGeometry(geo), sneakerMat);
  shoeMesh.castShadow = true;
  shoeMesh.receiveShadow = true;
  shoeGroup.add(shoeMesh);

  return shoeGroup;
}

/**
 * ASSEMBLE COMPLETE NICHOLAS RANDLE CHARACTER RIG (Total Height = 1.75m)
 */
export function buildNicholasRandleCharacter(textures: ProceduralTextureSet): CharacterRig {
  const root = new THREE.Group();
  root.name = 'NicholasRandle_Root';

  // Materials — all with flatShading: true and NearestFilter procedural textures
  const faceMat = new THREE.MeshStandardMaterial({
    map: textures.face,
    roughness: 0.88,
    metalness: 0.02,
    flatShading: true,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    map: textures.skin,
    roughness: 0.86,
    metalness: 0.02,
    flatShading: true,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    map: textures.hair,
    roughness: 0.92,
    metalness: 0.04,
    flatShading: true,
    side: THREE.DoubleSide,
  });

  const hoodieChestMat = new THREE.MeshStandardMaterial({
    map: textures.hoodieChest,
    roughness: 0.94,
    metalness: 0.02,
    flatShading: true,
  });

  const hoodieFabricMat = new THREE.MeshStandardMaterial({
    map: textures.hoodieFabric,
    roughness: 0.94,
    metalness: 0.02,
    flatShading: true,
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    map: textures.jeans,
    roughness: 0.9,
    metalness: 0.03,
    flatShading: true,
  });

  const sneakerMat = new THREE.MeshStandardMaterial({
    map: textures.sneakers,
    roughness: 0.85,
    metalness: 0.04,
    flatShading: true,
  });

  const lighterMat = new THREE.MeshStandardMaterial({
    map: textures.lighterMetal,
    roughness: 0.42,
    metalness: 0.78,
    flatShading: true,
  });

  // --- LOWER BODY (Feet at y = 0.00, Hips at y = 0.86) ---
  const lowerBodyGroup = new THREE.Group();
  root.add(lowerBodyGroup);

  // Pelvis / Jeans Hip Block
  const pelvisGeo = finalizeFlatGeometry(new THREE.CylinderGeometry(0.132, 0.125, 0.13, 12, 3));
  pelvisGeo.scale(1.06, 1.0, 0.76);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, jeansMat);
  pelvisMesh.position.set(0, 0.87, -0.01);
  pelvisMesh.castShadow = true;
  pelvisMesh.receiveShadow = true;
  lowerBodyGroup.add(pelvisMesh);

  // Left & Right Jeans Legs (from y = 0.83 down to ankle y = 0.05)
  const leftLegMesh = new THREE.Mesh(buildJeansLegGeometry(true), jeansMat);
  leftLegMesh.position.set(-0.072, 0.83, -0.008);
  leftLegMesh.rotation.z = -0.018;
  leftLegMesh.castShadow = true;
  leftLegMesh.receiveShadow = true;
  lowerBodyGroup.add(leftLegMesh);

  const rightLegMesh = new THREE.Mesh(buildJeansLegGeometry(false), jeansMat);
  rightLegMesh.position.set(0.072, 0.83, -0.008);
  rightLegMesh.rotation.z = 0.018;
  rightLegMesh.castShadow = true;
  rightLegMesh.receiveShadow = true;
  lowerBodyGroup.add(rightLegMesh);

  // Left & Right Old Dark Sneakers with Dirty-White Toe Caps (resting on y = 0)
  const leftShoe = buildSneakerGroup(sneakerMat);
  leftShoe.position.set(-0.078, 0.0, 0.0);
  leftShoe.rotation.y = 0.09; // Natural slight outward stance
  lowerBodyGroup.add(leftShoe);

  const rightShoe = buildSneakerGroup(sneakerMat);
  rightShoe.position.set(0.078, 0.0, -0.01);
  rightShoe.rotation.y = -0.08;
  lowerBodyGroup.add(rightShoe);

  // --- UPPER BODY GROUP (Breathing pivot at waist y = 0.90) ---
  const upperBodyGroup = new THREE.Group();
  upperBodyGroup.position.set(0, 0.9, 0);
  // Subtle asthenic forward slouch
  upperBodyGroup.rotation.x = 0.045;
  root.add(upperBodyGroup);

  // Baggy Charcoal Hoodie Torso (center at +0.27 -> spans y = 0.89..1.45 in world)
  const torsoMesh = new THREE.Mesh(buildTorsoHoodieGeometry(), hoodieChestMat);
  torsoMesh.position.set(0, 0.27, 0);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  upperBodyGroup.add(torsoMesh);

  // 3D Patch Kangaroo Pocket on lower front chest/abdomen
  const pocketMesh = new THREE.Mesh(buildKangarooPocketGeometry(), hoodieFabricMat);
  pocketMesh.position.set(0, 0.135, 0.112);
  pocketMesh.castShadow = true;
  pocketMesh.receiveShadow = true;
  upperBodyGroup.add(pocketMesh);

  // Volumetric Lowered Hood on upper back (сзади — объёмный опущенный капюшон)
  const hoodMesh = new THREE.Mesh(buildLoweredHoodGeometry(), hoodieFabricMat);
  hoodMesh.position.set(0, 0.455, -0.095);
  hoodMesh.rotation.x = 0.24;
  hoodMesh.castShadow = true;
  hoodMesh.receiveShadow = true;
  upperBodyGroup.add(hoodMesh);

  // Collar fold ring connecting neck and lowered hood
  const collarGeo = finalizeFlatGeometry(new THREE.TorusGeometry(0.068, 0.022, 6, 12));
  collarGeo.rotateX(Math.PI * 0.5 + 0.18);
  const collarMesh = new THREE.Mesh(collarGeo, hoodieFabricMat);
  collarMesh.position.set(0, 0.54, 0.012);
  collarMesh.castShadow = true;
  upperBodyGroup.add(collarMesh);

  // --- NECK & HEAD GROUP (Голова чуть подана вперёд, общая высота ~ 1.75m) ---
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.555, 0.024); // y ≈ 1.455m at neck base
  headGroup.rotation.x = 0.07; // Pitched slightly forward toward the lighter
  headGroup.rotation.y = -0.05; // Subtle pensive turn toward the lighter flame
  upperBodyGroup.add(headGroup);

  // Thin asthenic neck
  const neckGeo = finalizeFlatGeometry(new THREE.CylinderGeometry(0.036, 0.042, 0.095, 8, 2));
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.position.set(0, 0.035, 0.008);
  neckMesh.rotation.x = 0.14;
  neckMesh.castShadow = true;
  neckMesh.receiveShadow = true;
  headGroup.add(neckMesh);

  // Dolichocephalic Skull & Face (center at y = 0.145 in headGroup -> world y ≈ 1.60m, top at ~1.75m)
  const headMesh = new THREE.Mesh(buildHeadGeometry(), faceMat);
  headMesh.position.set(0, 0.145, 0.02);
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  headGroup.add(headMesh);

  // Sharp Triangular Nose Prism
  const noseMesh = new THREE.Mesh(buildTriangularNoseGeometry(), faceMat);
  noseMesh.position.set(0, 0.145, 0.02);
  noseMesh.castShadow = true;
   noseMesh.receiveShadow = true;
  headGroup.add(noseMesh);

  // Low-poly ears
  const earGeo = finalizeFlatGeometry(new THREE.BoxGeometry(0.012, 0.038, 0.022));
  const rightEar = new THREE.Mesh(earGeo, skinMat);
  rightEar.position.set(-0.072, 0.142, 0.008);
  rightEar.rotation.y = -0.18;
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(0.072, 0.142, 0.008);
  leftEar.rotation.y = 0.18;
  headGroup.add(rightEar, leftEar);

  // Distinct pixel mole micro-patch right below the left eye (reinforces the canvas pixel mole in 3D!)
  const moleGeo = new THREE.PlaneGeometry(0.0042, 0.0042);
  const moleMat = new THREE.MeshBasicMaterial({ color: '#211816', side: THREE.DoubleSide });
  const moleMesh = new THREE.Mesh(moleGeo, moleMat);
  // Character's left eye is on +X (viewer's right): x ≈ +0.028, y ≈ 0.146, z ≈ 0.098
  moleMesh.position.set(0.028, 0.136, 0.097);
  moleMesh.rotation.y = 0.25;
  headGroup.add(moleMesh);

  // Layered Charcoal-Black (#121214) Triangular Hair & Asymmetric Bangs
  const hairGroup = buildHairGroup(hairMat);
  hairGroup.position.set(0, 0.145, 0.02);
  headGroup.add(hairGroup);

  // --- LEFT ARM: Long, thin, relaxed hanging along torso (-X side in character space or +X? Wait:
  // When character faces +Z:
  // Character's LEFT side is +X (viewer's right)!
  // Character's RIGHT side is -X (viewer's left)!
  // Wait — let's check! In Three.js right-handed coordinate system:
  // If character faces +Z (toward the camera at +Z) and +Y is UP:
  // The character's RIGHT side is -X (to the viewer's left), and the character's LEFT side is +X (to the viewer's right)!
  // Let's verify: Stand facing +Z. Your right hand is at -X, your left hand is at +X!
  // Let's position the relaxed LEFT arm on +X (character's left side) and the bent RIGHT arm holding the lighter on -X (character's right side, raised toward center-chest)!
  // Wait: let's also check ANATOMY_PINS[6] for the lighter so its pin coordinates match the exact world position of the lighter!

  // 1. LEFT ARM (Character's Left = +X, relaxed hanging down along the torso)
  const leftShoulderGroup = new THREE.Group();
  leftShoulderGroup.position.set(0.155, 0.495, -0.005); // Narrow sloped shoulder
  leftShoulderGroup.rotation.z = 0.06;
  leftShoulderGroup.rotation.x = 0.04;
  upperBodyGroup.add(leftShoulderGroup);

  const leftUpperArmMesh = new THREE.Mesh(
    buildSleeveSegmentGeometry(0.28, 0.056, 0.05, false, false),
    hoodieFabricMat
  );
  leftUpperArmMesh.castShadow = true;
  leftUpperArmMesh.receiveShadow = true;
  leftShoulderGroup.add(leftUpperArmMesh);

  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.position.set(0, -0.27, 0);
  leftForearmGroup.rotation.x = -0.16; // Slight natural elbow bend forward
  leftForearmGroup.rotation.z = -0.04;
  leftShoulderGroup.add(leftForearmGroup);

  const leftForearmMesh = new THREE.Mesh(
    buildSleeveSegmentGeometry(0.26, 0.05, 0.036, true, false),
    hoodieFabricMat
  );
  leftForearmMesh.castShadow = true;
  leftForearmMesh.receiveShadow = true;
  leftForearmGroup.add(leftForearmMesh);

  const leftHand = buildBonyHandGroup(skinMat, false);
  leftHand.position.set(0, -0.26, 0);
  leftHand.rotation.y = -Math.PI * 0.5; // Palm facing inward toward thigh
  leftForearmGroup.add(leftHand);

  // 2. RIGHT ARM (Character's Right = -X, bent at elbow and raised to chest level holding the lighter)
  const rightShoulderGroup = new THREE.Group();
  rightShoulderGroup.position.set(-0.155, 0.495, 0.005);
  // Bring upper arm slightly forward and inward
  rightShoulderGroup.rotation.x = -0.38;
  rightShoulderGroup.rotation.z = 0.14;
  rightShoulderGroup.rotation.y = 0.22;
  upperBodyGroup.add(rightShoulderGroup);

  const rightUpperArmMesh = new THREE.Mesh(
    buildSleeveSegmentGeometry(0.27, 0.056, 0.052, false, true),
    hoodieFabricMat
  );
  rightUpperArmMesh.castShadow = true;
  rightUpperArmMesh.receiveShadow = true;
  rightShoulderGroup.add(rightUpperArmMesh);

  // Right Forearm bent at elbow and raised to chest level (правая согнута в локте и поднята на уровень груди)
  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.position.set(0, -0.26, 0);
  rightForearmGroup.rotation.x = -1.52; // Bent upward to chest level
  rightForearmGroup.rotation.z = -0.46; // Angled inward toward center chest
  rightForearmGroup.rotation.y = -0.18;
  rightShoulderGroup.add(rightForearmGroup);

  const rightForearmMesh = new THREE.Mesh(
    buildSleeveSegmentGeometry(0.245, 0.052, 0.036, true, true),
    hoodieFabricMat
  );
  rightForearmMesh.castShadow = true;
  rightForearmMesh.receiveShadow = true;
  rightForearmGroup.add(rightForearmMesh);

  // Right Bony Hand clutching the lighter
  const rightHand = buildBonyHandGroup(skinMat, true);
  rightHand.position.set(0, -0.242, 0);
  rightForearmGroup.add(rightHand);

  // Compute exact world-to-local rotation for rightHand so:
  // - Thumb/Radial side (-X of hand) points straight UP in world (+Y)
  // - Knuckles (-Y of hand) point forward & right (+X, +Z)
  // - Palm (+Z of hand) faces inward toward chest
  root.updateMatrixWorld(true);
  const forearmWorldQuat = new THREE.Quaternion();
  rightForearmGroup.getWorldQuaternion(forearmWorldQuat);

  const handXWorld = new THREE.Vector3(0.04, -1.0, -0.06).normalize(); // -X is UP
  const handYWorld = new THREE.Vector3(-0.68, -0.06, -0.73).normalize(); // -Y (knuckles) points forward-inward
  const handZWorld = new THREE.Vector3().crossVectors(handXWorld, handYWorld).normalize();
  handYWorld.crossVectors(handZWorld, handXWorld).normalize();

  const desiredHandWorldMat = new THREE.Matrix4().makeBasis(handXWorld, handYWorld, handZWorld);
  const desiredHandWorldQuat = new THREE.Quaternion().setFromRotationMatrix(desiredHandWorldMat);
  rightHand.quaternion.copy(forearmWorldQuat.clone().invert().multiply(desiredHandWorldQuat));

  // Lighter & Flame mounted inside the curled fingers of the right hand
  const {
    lighterGroup,
    flameGroup,
    flameOuterMesh,
    flameMidMesh,
    flameCoreMesh,
    flameLightAnchor,
  } = buildLighterAndFlame(lighterMat);

  // Align lighter's +Y axis with -X of rightHand (pointing straight UP out past thumb & index finger)
  lighterGroup.position.set(-0.014, -0.047, 0.015);
  lighterGroup.rotation.set(0, 0.25, Math.PI * 0.5);
  rightHand.add(lighterGroup);

  // Update pin 07 to exact world coordinates of the lighter
  root.updateMatrixWorld(true);
  const lighterWorldPos = new THREE.Vector3();
  flameGroup.getWorldPosition(lighterWorldPos);
  ANATOMY_PINS[6].position = [lighterWorldPos.x, lighterWorldPos.y, lighterWorldPos.z];
  ANATOMY_PINS[6].cameraPos = [lighterWorldPos.x - 0.26, lighterWorldPos.y + 0.06, lighterWorldPos.z + 0.34];
  ANATOMY_PINS[6].cameraTarget = [lighterWorldPos.x, lighterWorldPos.y + 0.02, lighterWorldPos.z - 0.04];

  // Build synchronized wireframe overlay & count vertices/triangles
   // Build synchronized wireframe overlay & count vertices/triangles
  const wireframeOverlayGroup = new THREE.Group();
  wireframeOverlayGroup.visible = false;
  const wireMat = new THREE.MeshBasicMaterial({
    color: '#ff8a3d',
    wireframe: true,
    transparent: true,
    opacity: 0.28,
    depthTest: true,
  });

  // ПРОХОД 1: только собираем меши, граф сцены НЕ меняем.
  // Добавлять детей внутри traverse() нельзя: новый wireframe-Mesh сам
  // попадает в обход, получает свой клон — и так до бесконечной рекурсии
  // (RangeError: Maximum call stack size exceeded).
  const meshes: THREE.Mesh[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry) {
      meshes.push(obj);
    }
  });

  // ПРОХОД 2: считаем статистику и вешаем ровно один wireframe-клон на меш.
  let totalVertices = 0;
  let totalTriangles = 0;
  const totalMeshes = meshes.length;

  for (const mesh of meshes) {
    const geo = mesh.geometry;
    const posAttr = geo.attributes.position;
    if (posAttr) {
      totalVertices += posAttr.count;
      // Для индексированной геометрии (родинка-PlaneGeometry) считаем
      // треугольники по индексу, а не по числу вершин.
      totalTriangles += Math.floor((geo.index ? geo.index.count : posAttr.count) / 3);
    }
    // Attach wireframe clone directly to each mesh so skeletal breathing animations stay 100% synced
    const wf = new THREE.Mesh(geo, wireMat);
    wf.name = '__wireframe_child';
    wf.visible = false;
    mesh.add(wf);
  }

  // Update ANATOMY_PINS[6] to match the right hand / lighter position (-0.05, 1.34, 0.26)
  ANATOMY_PINS[6].position = [-0.045, 1.35, 0.27];
  ANATOMY_PINS[6].cameraPos = [-0.32, 1.4, 0.56];
  ANATOMY_PINS[6].cameraTarget = [-0.04, 1.35, 0.22];

  return {
    root,
    upperBodyGroup,
    headGroup,
    leftShoulderGroup,
    rightShoulderGroup,
    rightForearmGroup,
    lighterGroup,
    flameGroup,
    flameOuterMesh,
    flameMidMesh,
    flameCoreMesh,
    flameLightAnchor,
    wireframeOverlayGroup,
    stats: {
      vertices: totalVertices,
      triangles: totalTriangles,
      meshes: totalMeshes,
      heightMeters: 1.75,
      headRatio: 0.23,
    },
  };
}
