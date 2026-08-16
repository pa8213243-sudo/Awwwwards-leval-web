/**
 * Device Fingerprint, Cross-Platform Hardware Inspector & Persistent Quota Utility
 * Universal cross-platform compatibility:
 * - Mobile Phones (iOS iPhone, Android Smartphones)
 * - Tablets (iPad, iPad Pro, Android Tablets)
 * - Laptops & Desktops (MacBook, iMac, Windows Laptops/PCs, Linux, Chromebooks)
 * 
 * Accurately tracks device hardware tokens across refreshes and prevents API bot draining.
 */

const COOKIE_NAME = 'parvej_device_id';
const CONSENT_COOKIE_NAME = 'parvej_cookie_consent';

export interface DeviceInfo {
  deviceId: string;
  deviceCode: string;
  deviceType: string;
  platformCategory: 'Mobile' | 'Tablet' | 'Laptop/Desktop' | 'Other';
  os: string;
  browser: string;
  screenRes: string;
  gpuRenderer: string;
  touchPoints: number;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase();
}

/**
 * Detects device hardware profile, OS, form factor and WebGL GPU across Mobile, Tablet, Laptop & Desktop
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceId: 'dev_server',
      deviceCode: 'DEV-SRV-000',
      deviceType: 'Server',
      platformCategory: 'Other',
      os: 'Unknown OS',
      browser: 'Unknown Browser',
      screenRes: '1920x1080',
      gpuRenderer: 'Standard',
      touchPoints: 0
    };
  }

  const ua = navigator.userAgent || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenW = window.screen?.width || 1280;
  const screenH = window.screen?.height || 800;
  const minDim = Math.min(screenW, screenH);
  const maxDim = Math.max(screenW, screenH);

  // Form Factor & OS Detection
  let os = 'Unknown OS';
  let deviceType = 'Desktop';
  let prefix = 'PC';
  let platformCategory: 'Mobile' | 'Tablet' | 'Laptop/Desktop' | 'Other' = 'Laptop/Desktop';

  const isIpadOS = /Macintosh/i.test(ua) && maxTouchPoints > 1;

  if (/iPhone/i.test(ua)) {
    os = 'iOS (iPhone)';
    deviceType = 'iPhone';
    prefix = 'IPH';
    platformCategory = 'Mobile';
  } else if (/iPad/i.test(ua) || isIpadOS) {
    os = 'iPadOS (iPad)';
    deviceType = 'iPad / Tablet';
    prefix = 'IPD';
    platformCategory = 'Tablet';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    if (/Mobile/i.test(ua) || minDim < 600) {
      deviceType = 'Android Phone';
      prefix = 'AND';
      platformCategory = 'Mobile';
    } else {
      deviceType = 'Android Tablet';
      prefix = 'TAB';
      platformCategory = 'Tablet';
    }
  } else if (/CrOS/i.test(ua)) {
    os = 'ChromeOS';
    deviceType = 'Chromebook';
    prefix = 'CHR';
    platformCategory = 'Laptop/Desktop';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS (Mac)';
    deviceType = maxDim <= 1728 && screenW <= 1728 ? 'MacBook' : 'Mac';
    prefix = 'MAC';
    platformCategory = 'Laptop/Desktop';
  } else if (/Windows NT/i.test(ua)) {
    os = 'Windows';
    deviceType = maxTouchPoints > 0 && minDim < 1000 ? 'Windows Laptop/2-in-1' : 'Windows PC';
    prefix = 'WIN';
    platformCategory = 'Laptop/Desktop';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
    deviceType = 'Linux PC';
    prefix = 'LNX';
    platformCategory = 'Laptop/Desktop';
  }

  // Browser Detection
  let browser = 'Browser';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  // Screen
  const screenRes = `${screenW}x${screenH}`;

  // GPU Renderer Detection via WebGL (Hardware signature)
  let gpuRenderer = 'Default GPU';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuRenderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'WebGL Renderer';
      }
    }
  } catch {}

  const deviceId = getDeviceFingerprint();
  const shortHash = simpleHash(deviceId).substring(0, 4);
  const deviceCode = `DEV-${prefix}-${shortHash}`;

  return {
    deviceId,
    deviceCode,
    deviceType,
    platformCategory,
    os,
    browser,
    screenRes,
    gpuRenderer,
    touchPoints: maxTouchPoints
  };
}

/**
 * Generates or retrieves a permanent device identifier
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server_render';

  // 1. Check existing cookie
  const existingCookie = getCookie(COOKIE_NAME);
  if (existingCookie && existingCookie.startsWith('dev_')) {
    try {
      localStorage.setItem(COOKIE_NAME, existingCookie);
    } catch {}
    return existingCookie;
  }

  // 2. Check existing localStorage
  try {
    const stored = localStorage.getItem(COOKIE_NAME);
    if (stored && stored.startsWith('dev_')) {
      setCookie(COOKIE_NAME, stored);
      return stored;
    }
  } catch {}

  // 3. Compute unique device signature based on hardware, screen, touch, and canvas
  const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const navInfo = `${navigator.userAgent}-${navigator.language}-${navigator.hardwareConcurrency || 4}-${navigator.maxTouchPoints || 0}-${navigator.platform || ''}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  let canvasSig = 'cvs';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = '#E0533C';
      ctx.fillText('ParvejFP_2026', 2, 2);
      canvasSig = simpleHash(canvas.toDataURL());
    }
  } catch {}

  const rawFingerprint = `${screenInfo}|${navInfo}|${tz}|${canvasSig}`;
  const deviceHash = simpleHash(rawFingerprint);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const finalDeviceId = `dev_${deviceHash}_${randomSuffix}`;

  // Persist across cookie + localStorage
  setCookie(COOKIE_NAME, finalDeviceId);
  try {
    localStorage.setItem(COOKIE_NAME, finalDeviceId);
  } catch {}

  return finalDeviceId;
}

export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return true;
  return getCookie(CONSENT_COOKIE_NAME) === 'accepted' || localStorage.getItem(CONSENT_COOKIE_NAME) === 'accepted';
}

export function setCookieConsent(accepted = true): void {
  const val = accepted ? 'accepted' : 'declined';
  setCookie(CONSENT_COOKIE_NAME, val);
  try {
    localStorage.setItem(CONSENT_COOKIE_NAME, val);
  } catch {}
}
