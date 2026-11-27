import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  MapPin,
  X,
} from 'lucide-react';
import {
  TRAINING_3D_MODULES,
  Training3DModuleId,
  Training3DHotspot,
} from './training3DModulesData';
import { SupportedLanguageCode, LANGUAGE_LABELS } from '../../nelly-localization-engine';

interface Forecourt3DPlayerProps {
  moduleId: Training3DModuleId;
  stepIndex: number;
  onStepChange: (nextIndex: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  subtitleLang: SupportedLanguageCode;
  isExecutiveTour?: boolean;
  tourProgressPercent?: number;
  tourSecondsRemaining?: number;
  tourTelemetryHighlight?: string;
  onExitTour?: () => void;
  onStepCompleted?: (stepNumber: number) => void;
}

interface DynamicSceneActors {
  animatedParts: Array<(t: number, stepNum: number) => void>;
}

function buildModuleScene(scene: THREE.Scene, moduleId: Training3DModuleId): DynamicSceneActors {
  const actors: DynamicSceneActors = { animatedParts: [] };

  scene.background = new THREE.Color('#071022');
  scene.fog = new THREE.Fog('#071022', 14, 34);

  const hemi = new THREE.HemisphereLight('#bae6fd', '#0f172a', 1.15);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight('#ffffff', 1.35);
  dir.position.set(8, 12, 7);
  scene.add(dir);

  const fillLight = new THREE.PointLight('#fbbf24', 0.8, 18);
  fillLight.position.set(-4, 4, 4);
  scene.add(fillLight);

  // Concrete Forecourt Paving (Base Ground)
  const groundMat = new THREE.MeshStandardMaterial({
    color: moduleId === 'r638-food-hygiene' ? '#1e293b' : '#334155',
    roughness: 0.85,
    metalness: 0.08,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), groundMat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(22, 22, '#475569', '#1e293b');
  grid.position.y = 0.01;
  scene.add(grid);

  const addBox = (
    w: number,
    h: number,
    d: number,
    color: string,
    x: number,
    y: number,
    z: number,
    roughness = 0.45,
    metalness = 0.2
  ) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color, roughness, metalness })
    );
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };

  const addCyl = (
    rTop: number,
    rBot: number,
    h: number,
    color: string,
    x: number,
    y: number,
    z: number
  ) => {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rBot, h, 20),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.25 })
    );
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };

  if (moduleId === 'spill-response') {
    // Pump Island & Dispenser
    addBox(3.6, 0.25, 1.3, '#64748b', 0, 0.125, -1.2);
    addBox(0.9, 1.7, 0.55, '#e2e8f0', -0.4, 1.1, -1.2, 0.3, 0.3);
    addBox(0.95, 0.35, 0.6, '#f59e0b', -0.4, 2.0, -1.2);
    // Red ESD Button on column
    const esd = addCyl(0.14, 0.14, 0.12, '#ef4444', -1.8, 1.2, -0.5);
    esd.rotation.x = Math.PI / 2;
    addBox(0.25, 1.5, 0.25, '#475569', -1.8, 0.75, -0.65);

    // Animated Hydrocarbon Fuel Sheen Puddle
    const sheenMat = new THREE.MeshStandardMaterial({
      color: '#a855f7',
      emissive: '#3b0764',
      roughness: 0.15,
      metalness: 0.75,
      transparent: true,
      opacity: 0.88,
    });
    const spillPuddle = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.5, 0.03, 32), sheenMat);
    spillPuddle.position.set(0.3, 0.025, 0.8);
    scene.add(spillPuddle);

    // Absorbent Granule Layer (revealed on Step 5+)
    const granules = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.4, 0.04, 28),
      new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.95 })
    );
    granules.position.set(0.3, 0.035, 0.8);
    granules.visible = false;
    scene.add(granules);

    // Warning Cones
    [
      [-1.4, 0.3, 2.1],
      [1.8, 0.3, 2.1],
      [-1.6, 0.3, -0.1],
    ].forEach(([cx, cy, cz]) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.58, 16),
        new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.4 })
      );
      cone.position.set(cx, cy, cz);
      scene.add(cone);
    });

    // Storm Drain Grate & Containment Boom Ring
    addBox(0.9, 0.04, 0.9, '#0f172a', 2.2, 0.025, 1.8);
    const boomRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.09, 12, 36),
      new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.6 })
    );
    boomRing.rotation.x = Math.PI / 2;
    boomRing.position.set(0.3, 0.09, 0.8);
    scene.add(boomRing);

    // Mobile Spill Kit Trolley & Yellow Hazardous Waste Drum
    addBox(0.95, 1.05, 0.65, '#eab308', -2.4, 0.55, 1.2);
    addCyl(0.42, 0.42, 1.0, '#facc15', 1.6, 0.5, -0.4);
    addBox(0.86, 0.08, 0.86, '#1e293b', 1.6, 1.02, -0.4);

    // Non-Sparking PLASTIC SPADE (Bright Yellow Polymer Blade + Handle)
    const plasticSpadeGroup = new THREE.Group();
    const spadeHandle = addCyl(0.03, 0.03, 1.25, '#fbbf24', 0, 0.7, 0);
    const spadeBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.38, 0.05),
      new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.3, metalness: 0.0 })
    );
    spadeBlade.position.set(0, 0.12, 0.04);
    plasticSpadeGroup.add(spadeHandle, spadeBlade);
    plasticSpadeGroup.position.set(0.2, 0.25, 0.9);
    plasticSpadeGroup.rotation.z = -0.35;
    scene.add(plasticSpadeGroup);

    // Hard-Bristle Non-Sparking Broom
    const broomGroup = new THREE.Group();
    const broomHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.35, 12),
      new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.4 })
    );
    broomHandle.position.set(0, 0.72, 0);
    const broomHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.12, 0.14),
      new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.8 })
    );
    broomHead.position.set(0, 0.08, 0);
    broomGroup.add(broomHandle, broomHead);
    broomGroup.position.set(-0.45, 0.15, 0.9);
    broomGroup.rotation.z = 0.25;
    scene.add(broomGroup);

    actors.animatedParts.push((t, stepNum) => {
      const pulse = 1 + Math.sin(t * 3.5) * 0.06;
      esd.scale.set(pulse, 1, pulse);
      boomRing.visible = stepNum >= 4;
      granules.visible = stepNum >= 5;
      spillPuddle.scale.setScalar(stepNum >= 6 ? 0.45 : stepNum >= 5 ? 0.75 : 1);
      // Animate hard broom sweeping on Step 5
      if (stepNum === 5) {
        broomGroup.position.x = -0.3 + Math.sin(t * 4) * 0.45;
      } else {
        broomGroup.position.x = -0.55;
      }
      // Animate non-sparking plastic spade scooping on Step 6
      if (stepNum === 6) {
        plasticSpadeGroup.position.y = 0.25 + Math.abs(Math.sin(t * 3.5)) * 0.45;
        plasticSpadeGroup.rotation.x = Math.sin(t * 3.5) * 0.4;
      } else {
        plasticSpadeGroup.position.y = 0.2;
        plasticSpadeGroup.rotation.x = 0;
      }
    });
  } else if (moduleId === 'evacuation-muster') {
    // Canopy + Kiosk + Pumps + Upwind Muster Point
    addBox(6.5, 0.25, 4.2, '#1e293b', -0.8, 3.3, -0.5);
    addCyl(0.16, 0.16, 3.2, '#64748b', -3.2, 1.6, -2.0);
    addCyl(0.16, 0.16, 3.2, '#64748b', 1.6, 1.6, -2.0);
    addBox(2.4, 2.1, 2.2, '#334155', -2.5, 1.05, -2.5); // Kiosk
    const beacon = addCyl(0.16, 0.16, 0.22, '#ef4444', -2.5, 2.25, -2.5);
    // Muster Point Green Pole & Sign
    addCyl(0.08, 0.08, 2.3, '#cbd5e1', 3.2, 1.15, 1.8);
    addBox(1.2, 0.75, 0.1, '#10b981', 3.2, 2.15, 1.8);

    // Staff / Customer Avatars walking toward Muster Point
    const avatars: THREE.Mesh[] = [];
    [0, 1, 2, 3].forEach((idx) => {
      const av = addCyl(0.18, 0.22, 1.1, idx === 0 ? '#f59e0b' : '#38bdf8', -1 + idx * 0.6, 0.55, 0.5);
      avatars.push(av);
    });

    actors.animatedParts.push((t, stepNum) => {
      beacon.scale.setScalar(1 + Math.sin(t * 6) * 0.2);
      const progress = Math.min(1, (stepNum - 1) * 0.45 + ((Math.sin(t * 1.5) + 1) * 0.15));
      avatars.forEach((av, i) => {
        av.position.x = -1.2 + i * 0.4 + progress * 3.8;
        av.position.z = 0.2 + i * 0.35 + progress * 1.1;
      });
    });
  } else if (moduleId === 'tanker-offloading') {
    // Heavy Bulk Road Tanker + Wheel Chocks + Earthing Clamp + UST Manholes
    addBox(1.8, 1.6, 1.5, '#f8fafc', -2.6, 0.95, 0); // Cab
    const tankBody = addCyl(0.9, 0.9, 4.4, '#e2e8f0', 0.6, 1.15, 0);
    tankBody.rotation.z = Math.PI / 2;
    addBox(0.3, 0.18, 0.3, '#facc15', -1.8, 0.09, 0.85); // Wheel chock
    addBox(0.3, 0.18, 0.3, '#facc15', 1.8, 0.09, 0.85);

    // Earthing Clamp Cable
    const earthClamp = addBox(0.25, 0.2, 0.9, '#22c55e', -1.4, 0.45, 1.1);
    // 4 UST Grade Manholes (ULP93, ULP95, D50, D10)
    ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'].forEach((col, i) => {
      addCyl(0.32, 0.32, 0.06, col, 1.5 + i * 0.8, 0.03, 1.6);
    });
    // Staged Spill Kit
    addBox(0.75, 0.8, 0.55, '#eab308', 0.2, 0.4, -1.3);

    actors.animatedParts.push((t, stepNum) => {
      earthClamp.position.y = stepNum === 1 ? 0.45 + Math.sin(t * 4) * 0.1 : 0.45;
    });
  } else if (moduleId === 'fire-marshal-pass') {
    // Dispenser Bay Fire + Animated Flames + 9kg DCP Extinguisher Sweeping
    addBox(1.2, 1.8, 0.7, '#475569', 0, 0.9, -0.4);
    const flameOuter = new THREE.Mesh(
      new THREE.ConeGeometry(0.75, 1.7, 14),
      new THREE.MeshStandardMaterial({
        color: '#f97316',
        emissive: '#ea580c',
        transparent: true,
        opacity: 0.85,
      })
    );
    flameOuter.position.set(0, 0.85, 0.35);
    scene.add(flameOuter);

    const ext = addCyl(0.2, 0.2, 0.85, '#dc2626', -1.4, 0.45, 1.6);
    const powderJet = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.6, 12),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', transparent: true, opacity: 0.65 })
    );
    powderJet.rotation.z = -Math.PI / 2;
    powderJet.position.set(-0.55, 0.45, 1.0);
    scene.add(powderJet);

    actors.animatedParts.push((t, stepNum) => {
      const fireScale = stepNum >= 2 ? Math.max(0.28, 1 - Math.abs(Math.sin(t * 1.5)) * 0.5) : 1;
      flameOuter.scale.set(fireScale, fireScale * (1 + Math.sin(t * 10) * 0.15), fireScale);
      powderJet.visible = stepNum >= 2;
      if (stepNum >= 2) {
        ext.position.z = 1.4 + Math.sin(t * 4) * 0.5;
        powderJet.position.z = ext.position.z - 0.35;
      }
    });
  } else if (moduleId === 'customer-service-7step') {
    // Dispenser + Vehicle + 4+1 Tyres + Attendant
    addBox(1.0, 1.7, 0.6, '#0ea5e9', -1.5, 0.85, 0);
    addBox(2.8, 0.75, 1.35, '#e2e8f0', 0.9, 0.6, 0); // Car chassis
    addBox(1.4, 0.55, 1.2, '#cbd5e1', 0.8, 1.2, 0); // Car cabin
    // 4 Road Tyres + 5th Spare Wheel Ring
    const spareTyre = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.08, 10, 20),
      new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#78350f' })
    );
    spareTyre.rotation.x = Math.PI / 2;
    spareTyre.position.set(2.1, 0.6, 0);
    scene.add(spareTyre);
    [
      [-0.1, 0.3, 0.72],
      [1.7, 0.3, 0.72],
      [-0.1, 0.3, -0.72],
      [1.7, 0.3, -0.72],
    ].forEach(([tx, ty, tz]) => {
      const w = addCyl(0.28, 0.28, 0.16, '#0f172a', tx, ty, tz);
      w.rotation.x = Math.PI / 2;
    });
    const attendant = addCyl(0.18, 0.22, 1.2, '#10b981', -0.4, 0.6, 1.2);

    actors.animatedParts.push((t, stepNum) => {
      spareTyre.scale.setScalar(stepNum >= 2 ? 1.15 + Math.sin(t * 4) * 0.12 : 1);
      attendant.position.x = stepNum >= 2 ? 1.2 + Math.sin(t * 2) * 0.6 : -0.4;
    });
  } else if (moduleId === 'r638-food-hygiene') {
    // QSR Kitchen: Chiller (cyan), Freezer (blue), Hot-Hold (amber), Prep Counter + 4 Colour Boards + Hood
    addBox(1.1, 2.2, 0.9, '#06b6d4', -2.2, 1.1, -1.2); // Chiller
    addBox(1.1, 2.2, 0.9, '#2563eb', -0.9, 1.1, -1.2); // Freezer
    addBox(1.2, 1.4, 0.9, '#f59e0b', 0.5, 0.7, -1.2); // Hot-hold
    addBox(3.4, 0.9, 1.1, '#94a3b8', 1.0, 0.45, 0.5); // Prep table
    // 4 Colour-coded chopping boards
    ['#ef4444', '#facc15', '#22c55e', '#f8fafc'].forEach((c, idx) => {
      addBox(0.36, 0.04, 0.28, c, 0.0 + idx * 0.55, 0.93, 0.5);
    });
    // Extraction Hood + Green Suppression Gauge
    addBox(2.8, 0.55, 1.2, '#cbd5e1', 1.0, 2.45, -1.0);
    const gauge = addCyl(0.12, 0.12, 0.08, '#10b981', 2.0, 2.2, -0.4);
    gauge.rotation.x = Math.PI / 2;

    actors.animatedParts.push((t) => {
      gauge.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    });
  }

  return actors;
}

export const Forecourt3DPlayer: React.FC<Forecourt3DPlayerProps> = ({
  moduleId,
  stepIndex,
  onStepChange,
  isPlaying,
  onTogglePlay,
  subtitleLang,
  isExecutiveTour = false,
  tourProgressPercent = 0,
  tourSecondsRemaining = 0,
  tourTelemetryHighlight,
  onExitTour,
  onStepCompleted,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Training3DHotspot | null>(null);

  const activeModule =
    TRAINING_3D_MODULES.find((m) => m.id === moduleId) || TRAINING_3D_MODULES[0];
  const safeStepIndex = Math.min(Math.max(stepIndex, 0), activeModule.steps.length - 1);
  const activeStep = activeModule.steps[safeStepIndex];

  const stepRef = useRef(activeStep);
  stepRef.current = activeStep;
  const isTourRef = useRef(isExecutiveTour);
  isTourRef.current = isExecutiveTour;

  // Reset selected hotspot on step change (auto-highlight critical hotspot if present)
  useEffect(() => {
    const critical = activeStep.hotspots.find((h) => h.severity === 'critical');
    setSelectedHotspot(critical || activeStep.hotspots[0] || null);
  }, [moduleId, safeStepIndex]);

  // Report current step as watched when dwelling or playing
  useEffect(() => {
    if (!isPlaying && safeStepIndex === 0) return;
    const dwellMs = isPlaying ? 1200 : 800;
    const timer = setTimeout(() => {
      onStepCompleted?.(activeStep.stepNumber);
    }, dwellMs);
    return () => clearTimeout(timer);
  }, [moduleId, safeStepIndex, isPlaying, activeStep.stepNumber, onStepCompleted]);

  // Auto-advance step playback when playing (non-tour mode)
  useEffect(() => {
    if (!isPlaying || isExecutiveTour) return;
    const timer = setTimeout(() => {
      onStepCompleted?.(activeStep.stepNumber);
      if (safeStepIndex < activeModule.steps.length - 1) {
        onStepChange(safeStepIndex + 1);
      } else {
        onTogglePlay();
      }
    }, activeStep.durationSeconds * 1000);
    return () => clearTimeout(timer);
  }, [
    isPlaying,
    isExecutiveTour,
    safeStepIndex,
    activeModule.steps.length,
    activeStep.durationSeconds,
    activeStep.stepNumber,
    onStepChange,
    onTogglePlay,
    onStepCompleted,
  ]);

  // Initialize Three.js WebGL scene with ResizeObserver & full cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let rafId = 0;
    let observer: ResizeObserver | null = null;

    try {
      const width = container.clientWidth || 640;
      const height = container.clientHeight || 360;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(...stepRef.current.cameraPos);

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const actors = buildModuleScene(scene, moduleId);
      const lookTarget = new THREE.Vector3(...stepRef.current.cameraLookAt);
      const clock = new THREE.Clock();

      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.max(entry.contentRect.width, 1);
          const h = Math.max(entry.contentRect.height, 1);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer?.setSize(w, h);
        }
      });
      observer.observe(container);

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        const cur = stepRef.current;

        const desiredPos = new THREE.Vector3(...cur.cameraPos);
        if (isTourRef.current) {
          desiredPos.x += Math.sin(elapsed * 0.55) * 0.85;
          desiredPos.z += Math.cos(elapsed * 0.55) * 0.65;
        }
        camera.position.lerp(desiredPos, 0.06);

        const desiredLook = new THREE.Vector3(...cur.cameraLookAt);
        lookTarget.lerp(desiredLook, 0.08);
        camera.lookAt(lookTarget);

        actors.animatedParts.forEach((fn) => fn(elapsed, cur.stepNumber));
        renderer?.render(scene, camera);
      };
      animate();
      setWebglFailed(false);

      return () => {
        cancelAnimationFrame(rafId);
        observer?.disconnect();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
        renderer?.dispose();
        if (container) container.innerHTML = '';
      };
    } catch {
      setWebglFailed(true);
      return () => {
        cancelAnimationFrame(rafId);
        observer?.disconnect();
        renderer?.dispose();
      };
    }
  }, [moduleId]);

  return (
    <div
      data-testid="forecourt-3d-player"
      className="w-full max-w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col"
    >
      {/* Top Executive Tour / Module Telemetry Overlay Bar */}
      <div className="px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-black border border-cyan-500/30 flex-shrink-0">
            {activeModule.code} • 3D
          </span>
          <span className="font-bold text-white truncate">{activeStep.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
            {activeStep.telemetryTag}
          </span>
          {isExecutiveTour && onExitTour && (
            <button
              type="button"
              onClick={onExitTour}
              data-testid="exit-executive-tour-btn"
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Exit Tour ({tourSecondsRemaining}s)
            </button>
          )}
        </div>
      </div>

      {/* Executive Tour Progress Strip */}
      {isExecutiveTour && (
        <div
          data-testid="executive-tour-overlay"
          className="px-4 py-2 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/80 border-b border-amber-500/40 text-xs flex flex-wrap items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 font-black text-amber-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>EXECUTIVE 90s DEMO TOUR: {tourTelemetryHighlight}</span>
          </div>
          <div className="w-full sm:w-44 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-300"
              style={{ width: `${tourProgressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Responsive 16:9 / 4:3 3D WebGL Canvas (with graceful SVG fallback if WebGL unavailable) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-[#071022] overflow-hidden">
        {!webglFailed ? (
          <div
            ref={containerRef}
            data-testid="forecourt-3d-canvas-host"
            className="w-full h-full"
          />
        ) : (
          <div
            data-testid="forecourt-3d-svg-fallback"
            className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#0b1730] to-[#071022] text-center"
          >
            <svg viewBox="0 0 400 210" className="w-full max-w-md h-auto">
              <rect x="20" y="135" width="360" height="50" rx="8" fill="#334155" />
              <rect x="65" y="65" width="60" height="75" rx="6" fill="#e2e8f0" />
              <rect x="65" y="55" width="60" height="16" rx="3" fill="#f59e0b" />
              <ellipse cx="220" cy="158" rx="62" ry="14" fill="#a855f7" opacity="0.75" />
              <rect x="295" y="105" width="44" height="52" rx="4" fill="#facc15" />
              <line x1="175" y1="95" x2="215" y2="155" stroke="#facc15" strokeWidth="5" />
              <rect x="205" y="148" width="24" height="16" rx="3" fill="#facc15" />
            </svg>
            <span className="text-xs font-mono text-cyan-300 mt-1">
              2D Interactive Schematic Mode • {activeStep.title}
            </span>
          </div>
        )}

        {/* Interactive Hotspot Callout Chips */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5 pointer-events-auto">
          {activeStep.hotspots.map((hs) => {
            const isSel = selectedHotspot?.id === hs.id;
            return (
              <button
                key={hs.id}
                type="button"
                data-testid={`hotspot-${hs.id}`}
                onClick={() => setSelectedHotspot(hs)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 backdrop-blur-md border transition min-h-[36px] ${
                  hs.severity === 'critical'
                    ? isSel
                      ? 'bg-rose-600 text-white border-rose-300 shadow-lg'
                      : 'bg-rose-950/85 text-rose-200 border-rose-500/60'
                    : isSel
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-900/85 text-cyan-200 border-cyan-500/40'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{hs.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile-First Touch Playback & Step Controls (44px+ touch targets) */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safeStepIndex === 0}
            onClick={() => onStepChange(Math.max(0, safeStepIndex - 1))}
            aria-label="Previous 3D Step"
            className="min-h-[44px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            data-testid="3d-play-pause-btn"
            className="min-h-[44px] px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause 3D' : 'Play 3D'}</span>
          </button>

          <button
            type="button"
            disabled={safeStepIndex >= activeModule.steps.length - 1}
            onClick={() =>
              onStepChange(Math.min(activeModule.steps.length - 1, safeStepIndex + 1))
            }
            aria-label="Next 3D Step"
            data-testid="3d-next-step-btn"
            className="min-h-[44px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Chips */}
        <div className="flex flex-wrap items-center gap-1">
          {activeModule.steps.map((st, idx) => (
            <button
              key={st.stepNumber}
              type="button"
              onClick={() => onStepChange(idx)}
              data-testid={`3d-step-chip-${st.stepNumber}`}
              className={`min-h-[36px] min-w-[36px] px-2 rounded-lg text-xs font-mono font-black transition ${
                idx === safeStepIndex
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              {st.stepNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Localized Caption & Hotspot Safety Drawer */}
      <div className="border-t border-slate-800 bg-slate-950">
        <button
          type="button"
          data-testid="caption-drawer-toggle"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-amber-300 hover:bg-slate-900/60"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Voiceover Captions ({LANGUAGE_LABELS[subtitleLang].native}) &amp; Hotspot Safety Callout
          </span>
          {drawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {drawerOpen && (
          <div className="px-4 pb-4 space-y-2.5 text-xs">
            <p
              data-testid="3d-localized-caption"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 leading-relaxed font-medium"
            >
              {activeStep.captions[subtitleLang]}
            </p>

            {selectedHotspot && (
              <div
                data-testid="selected-hotspot-detail"
                className={`p-3 rounded-xl border flex items-start gap-2 ${
                  selectedHotspot.severity === 'critical'
                    ? 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <div className="font-black">{selectedHotspot.label}</div>
                  <div className="text-slate-200 mt-0.5">{selectedHotspot.detail}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

