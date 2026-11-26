import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ANATOMY_PINS,
  AnatomyPin,
  buildNicholasRandleCharacter,
  CharacterRig,
} from '../model/buildNicholasRandle';
import { ProceduralTextureSet } from '../textures/proceduralTextures';

export type CameraPresetId = 'full' | 'head' | 'chest' | 'hand' | 'back' | 'feet';

export interface ViewerSettings {
  lighterLit: boolean;
  flameIntensity: number;
  ambientIntensity: number;
  fogDensity: number;
  inspectFillLight: boolean;
  showWireframe: boolean;
  showHeightRuler: boolean;
  showPins: boolean;
  breathingEnabled: boolean;
  ps2RetroFilter: boolean;
  turntableSpeed: number;
}

export interface ProjectedPin {
  pin: AnatomyPin;
  x: number;
  y: number;
  visible: boolean;
}

interface NicholasViewportProps {
  textures: ProceduralTextureSet;
  settings: ViewerSettings;
  activePreset: CameraPresetId;
  selectedPinId: string | null;
  onSelectPin: (pinId: string | null) => void;
  onStatsReady: (stats: CharacterRig['stats']) => void;
  sparkTriggerCount: number;
}

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  full: { pos: [-0.42, 1.18, 1.88], target: [0, 0.96, 0.02] },
  head: { pos: [0.14, 1.61, 0.46], target: [0.0, 1.59, 0.04] },
  chest: { pos: [-0.28, 1.38, 0.72], target: [0.0, 1.32, 0.06] },
  hand: { pos: [-0.32, 1.42, 0.52], target: [-0.04, 1.36, 0.18] },
  back: { pos: [0.58, 1.36, -0.88], target: [0.0, 1.24, -0.02] },
  feet: { pos: [-0.48, 0.36, 0.88], target: [0.0, 0.25, 0.02] },
};

export const NicholasViewport: React.FC<NicholasViewportProps> = ({
  textures,
  settings,
  activePreset,
  selectedPinId,
  onSelectPin,
  onStatsReady,
  sparkTriggerCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const settingsRef = useRef<ViewerSettings>(settings);
  settingsRef.current = settings;

  const cameraGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(...CAMERA_PRESETS.full.pos),
    target: new THREE.Vector3(...CAMERA_PRESETS.full.target),
  });

  const sparkBurstRef = useRef<{
    velocities: THREE.Vector3[];
    age: number;
    active: boolean;
  }>({
    velocities: [],
    age: 0,
    active: false,
  });

  // Trigger camera move when preset changes
  useEffect(() => {
    const preset = CAMERA_PRESETS[activePreset];
    if (preset) {
      cameraGoalRef.current.pos.set(...preset.pos);
      cameraGoalRef.current.target.set(...preset.target);
      cameraGoalRef.current.active = true;
    }
  }, [activePreset]);

  // Trigger camera move when a specific anatomy pin is selected
  useEffect(() => {
    if (!selectedPinId) return;
    const found = ANATOMY_PINS.find((p) => p.id === selectedPinId);
    if (found) {
      cameraGoalRef.current.pos.set(...found.cameraPos);
      cameraGoalRef.current.target.set(...found.cameraTarget);
      cameraGoalRef.current.active = true;
    }
  }, [selectedPinId]);

  // Trigger flint spark burst
  useEffect(() => {
    if (sparkTriggerCount === 0) return;
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < 18; i++) {
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.7,
          Math.random() * 0.65 + 0.15,
          (Math.random() - 0.3) * 0.7
        )
      );
    }
    sparkBurstRef.current = {
      velocities,
      age: 0,
      active: true,
    };
  }, [sparkTriggerCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Dense Exponential Fog (FogExp2)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d14');
    const fog = new THREE.FogExp2('#0c121c', settingsRef.current.fogDensity);
    scene.fog = fog;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.03,
      25
    );
    camera.position.set(...CAMERA_PRESETS.full.pos);

    // 3. Renderer (PS2 / GoldSrc crisp edges, shadowMap enabled)
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Authentic crisp low-poly polygon edges
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap; // Hard, sharp late-2000s shadows
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.full.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.22;
    controls.maxDistance = 4.8;
    controls.maxPolarAngle = Math.PI * 0.51;
    controls.update();

    const stopAutoCamera = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', stopAutoCamera);

    // 5. Build Nicholas Randle Character Rig
    const rig = buildNicholasRandleCharacter(textures);
    scene.add(rig.root);
    onStatsReady(rig.stats);

    // 6. Lighting Setup
    // Cold dim blue ambient (#1a2230) as specified in prompt
    const ambientLight = new THREE.AmbientLight('#1a2230', settingsRef.current.ambientIntensity);
    scene.add(ambientLight);

    // Subtle cold nocturnal rim light from behind/above to define the dark silhouette against fog
    const coldRimLight = new THREE.DirectionalLight('#23324b', 0.45);
    coldRimLight.position.set(-1.2, 2.6, -1.6);
    scene.add(coldRimLight);

    // Optional HLMV Inspection Fill Light (toggled by user when inspecting dark lower body details)
    const inspectFillLight = new THREE.DirectionalLight('#8da0ba', 0.0);
    inspectFillLight.position.set(1.4, 1.5, 2.2);
    scene.add(inspectFillLight);

    // PRIMARY LIGHT SOURCE: Flickering warm PointLight (#ff7b29) from the lighter
    const lighterPointLight = new THREE.PointLight('#ff7b29', 2.4, 3.2, 1.55);
    lighterPointLight.castShadow = true;
    lighterPointLight.shadow.mapSize.set(1024, 1024);
    lighterPointLight.shadow.camera.near = 0.03;
    lighterPointLight.shadow.camera.far = 3.2;
    lighterPointLight.shadow.bias = -0.002;
    scene.add(lighterPointLight);

    // Subtle ultra-close warm glow for the hand & lighter metal
    const lighterCloseGlow = new THREE.PointLight('#ff8f3d', 0.65, 0.42, 1.8);
    scene.add(lighterCloseGlow);

    // 7. Environment: Wet dark alley concrete floor & subtle 1.75m height reference ruler
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    floorGeo.rotateX(-Math.PI * 0.5);
    const floorMat = new THREE.MeshStandardMaterial({
      map: textures.floorConcrete,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: true,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 3D Metric Height & Head Ratio Ruler (1.75m total, ~0.23 head ratio marker)
    const rulerGroup = new THREE.Group();
    const rulerMat = new THREE.LineBasicMaterial({
      color: '#ff7b29',
      transparent: true,
      opacity: 0.45,
    });
    const rulerSubMat = new THREE.LineBasicMaterial({
      color: '#4c6285',
      transparent: true,
      opacity: 0.35,
    });

    // Vertical main post at x = 0.34
    const postPoints = [new THREE.Vector3(0.34, 0, 0), new THREE.Vector3(0.34, 1.75, 0)];
    rulerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(postPoints), rulerMat));

    // Ticks every 0.25m + special ticks at 1.515m (chin/head base) and 1.75m (crown)
    const tickHeights = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.515, 1.75];
    tickHeights.forEach((h) => {
      const isMajor = h === 0 || h === 1.515 || h === 1.75;
      const w = isMajor ? 0.08 : 0.035;
      const pts = [
        new THREE.Vector3(0.34 - w, h, 0),
        new THREE.Vector3(0.34 + w * 0.4, h, 0),
      ];
      rulerGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          isMajor ? rulerMat : rulerSubMat
        )
      );
    });
    scene.add(rulerGroup);

    // 8. Flint Spark Particles Mesh (18 low-poly spark points)
    const sparkCount = 18;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: '#ffd269',
      size: 0.014,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    sparkPoints.visible = false;
    scene.add(sparkPoints);

    // Resize observer
        // Resize observer: следим и за окном, и за самим контейнером —
    // его ширина меняется при скрытии/показе правой панели без resize окна.
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop variables
    const clock = new THREE.Clock();
    const flameWorldPos = new THREE.Vector3();
    const tempPinVec = new THREE.Vector3();
    let animFrameId = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const curSettings = settingsRef.current;

      // 1. Update camera smooth transition if preset/pin clicked
      if (cameraGoalRef.current.active) {
        camera.position.lerp(cameraGoalRef.current.pos, 0.08);
        controls.target.lerp(cameraGoalRef.current.target, 0.08);
        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 0.008 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.008
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      // Optional turntable rotation
      if (curSettings.turntableSpeed > 0) {
        rig.root.rotation.y += dt * curSettings.turntableSpeed * 0.6;
      }

      controls.update();

      // 2. Cyclic Breathing Animation (подъём плеч и грудной клетки)
      if (curSettings.breathingEnabled) {
        const breathWave = Math.sin(elapsed * 2.1); // Primary breathing cycle
        const secondaryWave = Math.sin(elapsed * 1.05 + 0.6);

        // Ribcage / upper torso slight expansion & pitch
        rig.upperBodyGroup.position.y = 0.9 + breathWave * 0.0035;
        rig.upperBodyGroup.rotation.x = 0.045 + breathWave * 0.012;
        rig.upperBodyGroup.scale.set(
          1 + breathWave * 0.008,
          1,
          1 + breathWave * 0.012
        );

        // Shoulders rising & falling with each inhale/exhale
        rig.leftShoulderGroup.position.y = 0.495 + breathWave * 0.0055;
        rig.leftShoulderGroup.rotation.z = 0.06 + breathWave * 0.012;

        rig.rightShoulderGroup.position.y = 0.495 + breathWave * 0.0055;
        rig.rightShoulderGroup.rotation.x = -0.38 + breathWave * 0.014;

        // Subtle right forearm & hand micro-sway holding the lighter
        rig.rightForearmGroup.rotation.x = -1.52 + secondaryWave * 0.016;

        // Head subtle pitch & tired sway
        rig.headGroup.rotation.x = 0.07 - breathWave * 0.014;
        rig.headGroup.rotation.y = -0.05 + secondaryWave * 0.018;
      }

      // 3. Flame & PointLight Animation (#ff7b29)
      rig.root.updateMatrixWorld(true);
      rig.flameGroup.getWorldPosition(flameWorldPos);

      if (curSettings.lighterLit) {
        rig.flameGroup.visible = true;

        // Smooth multi-harmonic flicker of flame intensity & polygon scale
        const flicker =
          1.0 +
          Math.sin(elapsed * 14.3) * 0.14 +
          Math.sin(elapsed * 27.8 + 1.2) * 0.08 +
          Math.cos(elapsed * 43.1) * 0.05;

        const lateralSway =
          Math.sin(elapsed * 9.4) * 0.11 + Math.cos(elapsed * 18.2) * 0.06;

        rig.flameOuterMesh.scale.set(
          1.0 + Math.sin(elapsed * 19.0) * 0.1,
          flicker,
          1.0 + Math.cos(elapsed * 17.0) * 0.1
        );
        rig.flameOuterMesh.rotation.z = lateralSway;
        rig.flameOuterMesh.rotation.y = elapsed * 2.2;

        rig.flameMidMesh.scale.set(1.0, 0.92 + (flicker - 1) * 0.85, 1.0);
        rig.flameMidMesh.rotation.z = -lateralSway * 0.7;
        rig.flameMidMesh.rotation.y = -elapsed * 3.1;

        rig.flameCoreMesh.scale.set(1.0, 0.96 + (flicker - 1) * 0.5, 1.0);

        // Position PointLight slightly above & forward of the wick in world space
        lighterPointLight.position.set(
          flameWorldPos.x + Math.sin(elapsed * 23.0) * 0.0025,
          flameWorldPos.y + 0.032 + (flicker - 1) * 0.008,
          flameWorldPos.z + 0.035
        );
        lighterPointLight.intensity = curSettings.flameIntensity * flicker;

        lighterCloseGlow.position.set(
          flameWorldPos.x,
          flameWorldPos.y + 0.015,
          flameWorldPos.z + 0.015
        );
        lighterCloseGlow.intensity = curSettings.flameIntensity * 0.28 * flicker;
      } else {
        rig.flameGroup.visible = false;
        lighterPointLight.intensity = 0;
        lighterCloseGlow.intensity = 0;
      }

      // 4. Flint Spark Burst Animation
      if (sparkBurstRef.current.active) {
        sparkBurstRef.current.age += dt;
        const age = sparkBurstRef.current.age;
        if (age > 0.45) {
          sparkBurstRef.current.active = false;
          sparkPoints.visible = false;
        } else {
          sparkPoints.visible = true;
          const posAttr = sparkGeo.attributes.position as THREE.BufferAttribute;
          const vels = sparkBurstRef.current.velocities;
          for (let i = 0; i < sparkCount; i++) {
            const v = vels[i];
            posAttr.setXYZ(
              i,
              flameWorldPos.x + v.x * age,
              flameWorldPos.y + v.y * age - 1.6 * age * age,
              flameWorldPos.z + v.z * age
            );
          }
          posAttr.needsUpdate = true;
          sparkMat.opacity = Math.max(0, 1 - age / 0.45);
        }
      }

      // 5. Update Scene Fog, Ambient, Wireframe & Ruler visibility
      fog.density = curSettings.fogDensity;
      ambientLight.intensity = curSettings.ambientIntensity;
      inspectFillLight.intensity = curSettings.inspectFillLight ? 1.45 : 0.0;
      coldRimLight.intensity = curSettings.inspectFillLight ? 0.85 : 0.48;
      rulerGroup.visible = curSettings.showHeightRuler;

      rig.root.traverse((obj) => {
        if (obj.name === '__wireframe_child') {
          obj.visible = curSettings.showWireframe;
        }
      });

      // 6. Project 3D Anatomy Pins onto 2D Screen Overlay
      if (curSettings.showPins && container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        ANATOMY_PINS.forEach((pin) => {
          const btn = pinElementsRef.current.get(pin.id);
          if (!btn) return;
          tempPinVec.set(...pin.position);
          // Apply root rotation if turntable is active
          tempPinVec.applyMatrix4(rig.root.matrixWorld);
          tempPinVec.project(camera);

          const isBehind = tempPinVec.z > 1.0;
          const screenX = (tempPinVec.x * 0.5 + 0.5) * width;
          const screenY = (-tempPinVec.y * 0.5 + 0.5) * height;

          if (isBehind || screenX < 20 || screenX > width - 20 || screenY < 20 || screenY > height - 20) {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
          } else {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.style.transform = `translate3d(${Math.round(screenX)}px, ${Math.round(screenY)}px, 0)`;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', stopAutoCamera);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [textures, onStatsReady]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090d14]">
      {/* Main Three.js WebGL Canvas Mount */}
      <div
        ref={containerRef}
        className={`w-full h-full ${
          settings.ps2RetroFilter ? 'contrast-110 saturate-95' : ''
        }`}
      />

      {/* Optional PS2 / GoldSrc CRT Scanline & Vignette Overlay */}
      {settings.ps2RetroFilter && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, transparent 48%, rgba(4, 7, 12, 0.72) 100%), repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0px, rgba(0, 0, 0, 0.22) 1px, transparent 1px, transparent 3px)',
          }}
        />
      )}

      {/* 3D Projected Anatomy Pin Callouts */}
      {settings.showPins && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {ANATOMY_PINS.map((pin, idx) => {
            const isSelected = selectedPinId === pin.id;
            return (
              <button
                key={pin.id}
                ref={(el) => {
                  if (el) pinElementsRef.current.set(pin.id, el);
                  else pinElementsRef.current.delete(pin.id);
                }}
                onClick={() => onSelectPin(isSelected ? null : pin.id)}
                className={`group absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono border backdrop-blur-xs cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff7b29] text-[#090d14] border-[#ffd29d] font-bold shadow-[0_0_15px_rgba(255,123,41,0.75)] z-30'
                    : 'bg-[#0c111a]/85 text-[#d8cfc6] border-[#ff7b29]/55 hover:border-[#ff7b29] hover:bg-[#1a2230]/95'
                }`}
                style={{ opacity: 0 }}
                title={pin.label}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-[#090d14]' : 'bg-[#ff7b29] animate-pulse'
                  }`}
                />
                <span>0{idx + 1}</span>
                <span className="hidden sm:inline max-w-[165px] truncate">
                  {pin.label.split('//')[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Height Scale Metric Labels when Ruler is active */}
      {settings.showHeightRuler && (
        <div className="pointer-events-none absolute left-4 bottom-16 z-20 hidden md:flex flex-col gap-1 bg-[#0b1018]/85 border border-[#2a3548] px-3 py-2 text-[11px] font-mono text-[#9ba8bc]">
          <div className="text-[#ff7b29] font-semibold tracking-wider uppercase">
            Метрика пропорций (GoldSrc Scale)
          </div>
          <div className="flex justify-between gap-4">
            <span>Общий рост (Макушка):</span>
            <span className="text-[#d8cfc6] font-semibold">1.75 м</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Высота головы:</span>
            <span className="text-[#d8cfc6] font-semibold">~0.23 от роста</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Череп / Комплекция:</span>
            <span className="text-[#d8cfc6]">Долихоцефал / Эктоморф</span>
          </div>
        </div>
      )}
    </div>
  );
};
