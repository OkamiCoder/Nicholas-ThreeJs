import { useCallback, useMemo, useState } from 'react';
import {
  CameraPresetId,
  NicholasViewport,
  ViewerSettings,
} from './components/NicholasViewport';
import { ANATOMY_PINS, CharacterRig } from './model/buildNicholasRandle';
import { generateAllProceduralTextures } from './textures/proceduralTextures';

const CAMERA_BUTTONS: { id: CameraPresetId; label: string; short: string }[] = [
  { id: 'full', label: '1. Полный рост (1.75м)', short: 'Рост' },
  { id: 'head', label: '2. Череп, глаза и родинка', short: 'Лицо' },
  { id: 'chest', label: '3. Худи «Vitality» и карман', short: 'Торс' },
  { id: 'hand', label: '4. Кисть и зажигалка', short: 'Зажигалка' },
  { id: 'back', label: '5. Сутулость и капюшон', short: 'Спина' },
  { id: 'feet', label: '6. Джинсы #232936 и кеды', short: 'Низ' },
];

export function App() {
  // Generate procedural pixel textures once via HTML5 Canvas (NearestFilter)
  const textures = useMemo(() => generateAllProceduralTextures(), []);

  const [settings, setSettings] = useState<ViewerSettings>({
    lighterLit: true,
    flameIntensity: 2.55,
    ambientIntensity: 0.65,
    fogDensity: 0.32,
    inspectFillLight: false,
    showWireframe: false,
    showHeightRuler: true,
    showPins: true,
    breathingEnabled: true,
    ps2RetroFilter: true,
    turntableSpeed: 0,
  });

  const [activePreset, setActivePreset] = useState<CameraPresetId>('full');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [showTextureModal, setShowTextureModal] = useState(false);
  const [selectedCanvasIdx, setSelectedCanvasIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sparkTriggerCount, setSparkTriggerCount] = useState(0);

  const [stats, setStats] = useState<CharacterRig['stats']>({
    vertices: 0,
    triangles: 0,
    meshes: 0,
    heightMeters: 1.75,
    headRatio: 0.23,
  });

  const handleStatsReady = useCallback((newStats: CharacterRig['stats']) => {
    setStats(newStats);
  }, []);

  const handlePresetClick = (presetId: CameraPresetId) => {
    setSelectedPinId(null);
    setActivePreset(presetId);
  };

  const handleFlickLighter = () => {
    setSparkTriggerCount((c) => c + 1);
    setSettings((prev) => ({ ...prev, lighterLit: true }));
  };

  const selectedPin = useMemo(
    () => ANATOMY_PINS.find((p) => p.id === selectedPinId) || null,
    [selectedPinId]
  );

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#090d14] text-[#d8cfc6] overflow-hidden select-none">
      {/* TOP BAR: GoldSrc / Cry of Fear Model Viewer Header */}
      <header className="z-30 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#0c111a]/95 border-b border-[#253042] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#ff7b29] shadow-[0_0_10px_#ff7b29]" />
            <h1 className="font-display-retro text-sm sm:text-base tracking-wider text-[#f0e8df] uppercase font-bold">
              PYROMANIAC // NICHOLAS RANDLE
            </h1>
          </div>
          <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] bg-[#161e2b] border border-[#2c3a50] text-[#90a0b8]">
            PS2 / GoldSrc / Cry of Fear Aesthetic
          </span>
          <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] bg-[#1b1716] border border-[#ff7b29]/40 text-[#ff9d5c]">
            THREE.NearestFilter • flatShading: true
          </span>
        </div>

        {/* Live Telemetry & Modal Triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-3 px-2.5 py-1 bg-[#090d14] border border-[#222c3c] text-[11px] text-[#8d9cb3]">
            <span>
              TRIS: <strong className="text-[#d8cfc6]">{stats.triangles}</strong>
            </span>
            <span className="text-[#2c3a50]">|</span>
            <span>
              VERTS: <strong className="text-[#d8cfc6]">{stats.vertices}</strong>
            </span>
            <span className="text-[#2c3a50]">|</span>
            <span>
              РОСТ: <strong className="text-[#ff9d5c]">1.75m</strong> (Голова{' '}
              <strong className="text-[#ff9d5c]">~0.23</strong>)
            </span>
          </div>

          <button
            onClick={() => setShowTextureModal((v) => !v)}
            className={`px-2.5 py-1 text-[11px] font-medium border transition cursor-pointer ${
              showTextureModal
                ? 'bg-[#ff7b29] text-[#090d14] border-[#ffd29d] font-bold'
                : 'bg-[#131b27] text-[#d8cfc6] border-[#33435c] hover:border-[#ff7b29]'
            }`}
          >
            CANVAS ТЕКСТУРЫ (6 BMP)
          </button>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="px-2.5 py-1 text-[11px] bg-[#131b27] border border-[#33435c] hover:border-[#ff7b29] text-[#d8cfc6] cursor-pointer"
          >
            {sidebarOpen ? 'СКРЫТЬ ПАНЕЛЬ' : 'ИНСПЕКТОР МОДЕЛИ'}
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* 3D VIEWPORT */}
        <div className="relative flex-1 h-full">
          <NicholasViewport
            textures={textures}
            settings={settings}
            activePreset={activePreset}
            selectedPinId={selectedPinId}
            onSelectPin={setSelectedPinId}
            onStatsReady={handleStatsReady}
            sparkTriggerCount={sparkTriggerCount}
          />

          {/* TOP-LEFT CAMERA PRESET BAR */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 max-w-[calc(100%-24px)]">
            {CAMERA_BUTTONS.map((btn) => {
              const isActive = activePreset === btn.id && !selectedPinId;
              return (
                <button
                  key={btn.id}
                  onClick={() => handlePresetClick(btn.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono border backdrop-blur-xs transition cursor-pointer ${
                    isActive
                      ? 'bg-[#ff7b29] text-[#090d14] border-[#ffd29d] font-bold shadow-[0_0_12px_rgba(255,123,41,0.5)]'
                      : 'bg-[#0b1018]/85 text-[#c8c0b7] border-[#283447] hover:border-[#ff7b29]/70 hover:text-white'
                  }`}
                >
                  <span className="hidden sm:inline">{btn.label}</span>
                  <span className="sm:hidden">{btn.short}</span>
                </button>
              );
            })}
          </div>

          {/* SELECTED ANATOMY PIN DETAIL CARD (Bottom Center-Left) */}
          {selectedPin && (
            <div className="absolute bottom-14 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-30 bg-[#0b1018]/95 border border-[#ff7b29] p-3.5 shadow-[0_0_25px_rgba(0,0,0,0.85)]">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="text-xs font-bold text-[#ff7b29] uppercase tracking-wide">
                  {selectedPin.label}
                </div>
                <button
                  onClick={() => setSelectedPinId(null)}
                  className="text-[11px] text-[#8d9cb3] hover:text-white px-1.5 py-0.5 border border-[#283447] cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-[#d8cfc6] leading-relaxed mb-2">
                {selectedPin.description}
              </p>
              <div className="text-[10px] font-mono px-2 py-1 bg-[#121924] border border-[#243044] text-[#8ba0be]">
                ТЕХ. СПЕЦИФИКАЦИЯ: {selectedPin.techSpec}
              </div>
            </div>
          )}

          {/* BOTTOM QUICK BAR: Controls hint & quick lighter spark */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-[#0b1018]/85 border border-[#243042] px-3 py-1.5 text-[11px] text-[#95a3b8]">
              <span>ЛКМ: Вращение</span>
              <span className="text-[#2c3a50]">•</span>
              <span>Колесо: Зум</span>
              <span className="text-[#2c3a50]">•</span>
              <span>ПКМ: Панорама</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={handleFlickLighter}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#291810] hover:bg-[#3d2214] text-[#ff964f] border border-[#ff7b29] shadow-[0_0_15px_rgba(255,123,41,0.3)] transition cursor-pointer"
              >
                🔥 Чиркнуть зажигалкой (Искры)
              </button>
              <button
                onClick={() =>
                  setSettings((s) => ({ ...s, inspectFillLight: !s.inspectFillLight }))
                }
                className={`px-3 py-1.5 text-[11px] font-mono border transition cursor-pointer ${
                  settings.inspectFillLight
                    ? 'bg-[#25354d] text-white border-[#6384b5]'
                    : 'bg-[#0b1018]/85 text-[#95a3b8] border-[#283447] hover:border-[#6384b5]'
                }`}
              >
                {settings.inspectFillLight ? 'Свет: Осмотр HLMV' : 'Свет: Хоррор (#1a2230)'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT INSPECTOR SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-88 h-full bg-[#0b1018]/95 border-l border-[#243042] flex flex-col z-20 overflow-y-auto">
            {/* Section 1: Lighter & Horror Atmosphere */}
            <div className="p-3.5 border-b border-[#1f2a3a]">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff7b29]">
                  01 // Свет, Зажигалка и Туман
                </h2>
                <span className="text-[10px] text-[#78879e]">PointLight #ff7b29</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, lighterLit: !s.lighterLit }))
                  }
                  className={`px-2.5 py-1.5 text-[11px] font-semibold border transition cursor-pointer ${
                    settings.lighterLit
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#121822] border-[#283447] text-[#78879e]'
                  }`}
                >
                  {settings.lighterLit ? '● Пламя: ВКЛ' : '○ Пламя: ВЫКЛ'}
                </button>

                <button
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      inspectFillLight: !s.inspectFillLight,
                    }))
                  }
                  className={`px-2.5 py-1.5 text-[11px] font-semibold border transition cursor-pointer ${
                    settings.inspectFillLight
                      ? 'bg-[#22324a] border-[#5d82b8] text-[#d6e4f7]'
                      : 'bg-[#121822] border-[#283447] text-[#78879e]'
                  }`}
                >
                  {settings.inspectFillLight ? '● Подсветка HLMV' : '○ Тёмный хоррор'}
                </button>
              </div>

              <div className="space-y-2.5 text-[11px]">
                <div>
                  <div className="flex justify-between text-[#9ba8bc] mb-1">
                    <span>Яркость пламени (#ff7b29)</span>
                    <span className="text-[#d8cfc6]">
                      {settings.flameIntensity.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={4.5}
                    step={0.05}
                    value={settings.flameIntensity}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        flameIntensity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#ff7b29] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#9ba8bc] mb-1">
                    <span>Холодный эмбиент (#1a2230)</span>
                    <span className="text-[#d8cfc6]">
                      {settings.ambientIntensity.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={2.2}
                    step={0.05}
                    value={settings.ambientIntensity}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        ambientIntensity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#5d82b8] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#9ba8bc] mb-1">
                    <span>Плотность тумана (FogExp2)</span>
                    <span className="text-[#d8cfc6]">
                      {settings.fogDensity.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={0.75}
                    step={0.02}
                    value={settings.fogDensity}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        fogDensity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#5d82b8] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Geometry & Render Flags */}
            <div className="p-3.5 border-b border-[#1f2a3a]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff7b29] mb-2.5">
                02 // Флаги геометрии и рендера
              </h2>

              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, showWireframe: !s.showWireframe }))
                  }
                  className={`px-2.5 py-1.5 text-left border transition cursor-pointer ${
                    settings.showWireframe
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#111722] border-[#243042] text-[#95a3b8]'
                  }`}
                >
                  [{settings.showWireframe ? 'X' : ' '}] Сетка (Wireframe)
                </button>

                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, showPins: !s.showPins }))
                  }
                  className={`px-2.5 py-1.5 text-left border transition cursor-pointer ${
                    settings.showPins
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#111722] border-[#243042] text-[#95a3b8]'
                  }`}
                >
                  [{settings.showPins ? 'X' : ' '}] 3D-Маркеры (8)
                </button>

                <button
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      breathingEnabled: !s.breathingEnabled,
                    }))
                  }
                  className={`px-2.5 py-1.5 text-left border transition cursor-pointer ${
                    settings.breathingEnabled
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#111722] border-[#243042] text-[#95a3b8]'
                  }`}
                >
                  [{settings.breathingEnabled ? 'X' : ' '}] Цикл дыхания
                </button>

                <button
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      showHeightRuler: !s.showHeightRuler,
                    }))
                  }
                  className={`px-2.5 py-1.5 text-left border transition cursor-pointer ${
                    settings.showHeightRuler
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#111722] border-[#243042] text-[#95a3b8]'
                  }`}
                >
                  [{settings.showHeightRuler ? 'X' : ' '}] Линейка 1.75м
                </button>

                <button
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      ps2RetroFilter: !s.ps2RetroFilter,
                    }))
                  }
                  className={`px-2.5 py-1.5 text-left border transition cursor-pointer ${
                    settings.ps2RetroFilter
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#111722] border-[#243042] text-[#95a3b8]'
                  }`}
                >
                  [{settings.ps2RetroFilter ? 'X' : ' '}] PS2 Scanlines
                </button>

                <button
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      turntableSpeed: s.turntableSpeed > 0 ? 0 : 0.7,
                    }))
                  }
                  className={`px-2.5 py-1.5 text-left border transition cursor-pointer ${
                    settings.turntableSpeed > 0
                      ? 'bg-[#ff7b29]/20 border-[#ff7b29] text-[#ffae78]'
                      : 'bg-[#111722] border-[#243042] text-[#95a3b8]'
                  }`}
                >
                  [{settings.turntableSpeed > 0 ? 'X' : ' '}] Авто-вращение
                </button>
              </div>
            </div>

            {/* Section 3: Anatomical & Clothing Specification Breakdown */}
            <div className="p-3.5 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff7b29]">
                  03 // Детализация анатомии и одежды
                </h2>
                <span className="text-[10px] text-[#78879e]">Клик → Камера</span>
              </div>

              <div className="space-y-1.5">
                {ANATOMY_PINS.map((pin) => {
                  const active = selectedPinId === pin.id;
                  return (
                    <button
                      key={pin.id}
                      onClick={() => setSelectedPinId(active ? null : pin.id)}
                      className={`w-full text-left p-2 border transition cursor-pointer ${
                        active
                          ? 'bg-[#1d1716] border-[#ff7b29] text-[#f5ede6]'
                          : 'bg-[#0e141f] border-[#1f2a3c] hover:border-[#3c4f6e] text-[#b8c2d1]'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-[#e6ddd3] mb-0.5">
                        {pin.label}
                      </div>
                      <div className="text-[10px] text-[#8493a8] line-clamp-2">
                        {pin.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* PROCEDURAL HTML5 CANVAS TEXTURE INSPECTOR MODAL */}
      {showTextureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-[#0c111a] border border-[#ff7b29] shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#131b28] border-b border-[#26344a]">
              <div>
                <h2 className="font-display-retro text-sm sm:text-base text-[#ff7b29] font-bold uppercase">
                  ИНСПЕКТОР ПРОЦЕДУРНЫХ ПИКСЕЛЬНЫХ ТЕКСТУР (HTML5 CANVAS • THREE.NearestFilter)
                </h2>
                <p className="text-[11px] text-[#8d9cb3]">
                  Все текстуры сгенерированы программно без внешних изображений, с отключённым сглаживанием и фильтрацией NearestFilter
                </p>
              </div>
              <button
                onClick={() => setShowTextureModal(false)}
                className="px-2.5 py-1 text-xs bg-[#1c2636] hover:bg-[#ff7b29] hover:text-black border border-[#354660] cursor-pointer"
              >
                ЗАКРЫТЬ [ESC]
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto p-4 gap-4">
              {/* Texture List */}
              <div className="md:col-span-5 space-y-2">
                {textures.canvases.map((item, idx) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedCanvasIdx(idx)}
                    className={`w-full flex items-center gap-3 p-2 border text-left transition cursor-pointer ${
                      selectedCanvasIdx === idx
                        ? 'bg-[#1c1817] border-[#ff7b29]'
                        : 'bg-[#090d14] border-[#222d3f] hover:border-[#425675]'
                    }`}
                  >
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      className="w-12 h-12 pixelated-canvas border border-[#2c3a50] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#f0e8df] truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#ff9d5c]">{item.resolution}</div>
                      <div className="text-[10px] text-[#8493a8] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Zoomed Pixel-Art Canvas Preview */}
              <div className="md:col-span-7 flex flex-col items-center justify-center bg-[#070a0f] border border-[#222d3f] p-4">
                <div className="relative p-2 bg-[#121824] border border-[#2f3e56] mb-3">
                  <img
                    src={textures.canvases[selectedCanvasIdx].dataUrl}
                    alt={textures.canvases[selectedCanvasIdx].name}
                    className="w-64 h-64 sm:w-72 sm:h-72 pixelated-canvas"
                  />
                </div>
                <div className="text-center max-w-md">
                  <div className="text-xs font-bold text-[#ff7b29] mb-1">
                    {textures.canvases[selectedCanvasIdx].name} (
                    {textures.canvases[selectedCanvasIdx].resolution})
                  </div>
                  <p className="text-xs text-[#c8c0b7]">
                    {textures.canvases[selectedCanvasIdx].subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
