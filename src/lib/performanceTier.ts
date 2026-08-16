/**
 * Adaptive Device Performance Tiering & Optimization Engine
 * Detects device hardware capability (CPU cores, RAM, GPU, Battery/Data Saver)
 * and dynamically scales Three.js geometry, particle budgets, pixel ratios,
 * and CSS rasterization workloads so low-end phones run with zero lag while
 * high-end devices enjoy full 120fps fidelity.
 */

export type PerformanceTier = 'low' | 'medium' | 'high';

export interface DeviceCapabilities {
  tier: PerformanceTier;
  isLowTier: boolean;
  isHighTier: boolean;
  pixelRatio: number;
  particleBudget: number;
  geometryDetailMultiplier: number;
  enableAntialiasing: boolean;
  enableComplexShaders: boolean;
  enablePostProcessing: boolean;
  maxFpsTarget: number;
}

let cachedCapabilities: DeviceCapabilities | null = null;

export function getDeviceCapabilities(): DeviceCapabilities {
  if (cachedCapabilities) return cachedCapabilities;

  if (typeof window === 'undefined') {
    return {
      tier: 'medium',
      isLowTier: false,
      isHighTier: false,
      pixelRatio: 1.0,
      particleBudget: 80,
      geometryDetailMultiplier: 1.0,
      enableAntialiasing: true,
      enableComplexShaders: true,
      enablePostProcessing: true,
      maxFpsTarget: 60,
    };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4; // in GB (Chromium)
  const isTouchMobile = window.innerWidth <= 768;
  const rawDpr = window.devicePixelRatio || 1;
  const saveData = (navigator as any).connection?.saveData === true;

  // Inspect WebGL GPU Renderer for low-end indicators
  let isLowEndGpu = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const rendererString = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        const lower = rendererString.toLowerCase();
        // Common budget mobile GPU series
        if (
          lower.includes('mali-4') ||
          lower.includes('mali-t') ||
          lower.includes('mali-g3') ||
          lower.includes('mali-g51') ||
          lower.includes('mali-g52') ||
          lower.includes('adreno (tm) 3') ||
          lower.includes('adreno (tm) 4') ||
          lower.includes('adreno (tm) 505') ||
          lower.includes('adreno (tm) 506') ||
          lower.includes('powervr') ||
          lower.includes('intel hd graphics 2') ||
          lower.includes('intel hd graphics 3')
        ) {
          isLowEndGpu = true;
        }
      }
    }
  } catch (e) {
    // Ignore context creation errors
  }

  let tier: PerformanceTier = 'medium';

  if (cores <= 4 || memory < 4 || isLowEndGpu || saveData) {
    tier = 'low';
  } else if (cores >= 8 && memory >= 8 && !isTouchMobile) {
    tier = 'high';
  } else if (isTouchMobile && cores >= 6 && !isLowEndGpu) {
    tier = 'medium';
  }

  // Define adaptive quality budgets based on tier
  let pixelRatio = 1.0;
  let particleBudget = 60;
  let geometryDetailMultiplier = 0.6;
  let enableAntialiasing = false;
  let enableComplexShaders = true;
  let enablePostProcessing = false;
  let maxFpsTarget = 60;

  if (tier === 'low') {
    pixelRatio = Math.min(rawDpr, 1.0); // Never exceed 1.0x on low-end to prevent GPU fill-rate thermal choke
    particleBudget = isTouchMobile ? 40 : 60;
    geometryDetailMultiplier = 0.5;
    enableAntialiasing = false;
    enableComplexShaders = true;
    enablePostProcessing = false;
    maxFpsTarget = 60;
    document.documentElement.classList.add('device-tier-low');
  } else if (tier === 'medium') {
    pixelRatio = Math.min(rawDpr, 1.25);
    particleBudget = isTouchMobile ? 80 : 120;
    geometryDetailMultiplier = 0.8;
    enableAntialiasing = !isTouchMobile;
    enableComplexShaders = true;
    enablePostProcessing = true;
    maxFpsTarget = 60;
    document.documentElement.classList.add('device-tier-medium');
  } else {
    // High-end desktop / flagship tablet
    pixelRatio = Math.min(rawDpr, 1.75);
    particleBudget = 180;
    geometryDetailMultiplier = 1.0;
    enableAntialiasing = true;
    enableComplexShaders = true;
    enablePostProcessing = true;
    maxFpsTarget = 120;
    document.documentElement.classList.add('device-tier-high');
  }

  cachedCapabilities = {
    tier,
    isLowTier: tier === 'low',
    isHighTier: tier === 'high',
    pixelRatio,
    particleBudget,
    geometryDetailMultiplier,
    enableAntialiasing,
    enableComplexShaders,
    enablePostProcessing,
    maxFpsTarget,
  };

  return cachedCapabilities;
}

/**
 * FPS Monitor with Dynamic Quality Throttle:
 * Automatically drops particle count and steps down resolution if a budget device struggles under 35fps.
 */
export class DynamicPerformanceGovernor {
  private lastTime = performance.now();
  private frameCount = 0;
  private currentFps = 60;
  private onQualityDegradeCallback?: () => void;
  private hasDegraded = false;

  constructor(onQualityDegrade?: () => void) {
    this.onQualityDegradeCallback = onQualityDegrade;
  }

  public tick(): void {
    this.frameCount++;
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = now;

      // If device is dropping below 35 FPS consistently on mobile, trigger quality fallback
      if (this.currentFps < 35 && !this.hasDegraded) {
        this.hasDegraded = true;
        this.onQualityDegradeCallback?.();
      }
    }
  }

  public getFps(): number {
    return this.currentFps;
  }
}
