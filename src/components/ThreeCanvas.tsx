import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getDeviceCapabilities, DynamicPerformanceGovernor } from '../lib/performanceTier';

interface ThreeCanvasProps {
  className?: string;
  variant?: 'hero' | 'telemetry' | 'timeline' | 'minimal';
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ className = '', variant = 'hero' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const capabilities = getDeviceCapabilities();
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: capabilities.enableAntialiasing,
      powerPreference: capabilities.isLowTier ? 'low-power' : 'high-performance',
      precision: capabilities.isLowTier ? 'mediump' : 'highp',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(capabilities.pixelRatio);
    container.appendChild(renderer.domElement);

    // 3D GEOMETRY CREATION BY VARIANT (Scaled by hardware detail multiplier)
    const isHero = variant === 'hero';
    const isTelemetry = variant === 'telemetry';
    const isTimeline = variant === 'timeline';
    const mult = capabilities.geometryDetailMultiplier;

    let geometry: THREE.BufferGeometry;
    if (isTelemetry) {
      geometry = new THREE.TorusKnotGeometry(1.3, 0.42, Math.round(96 * mult), Math.round(24 * mult));
    } else if (isTimeline) {
      geometry = new THREE.TorusGeometry(1.45, 0.38, Math.round(48 * mult), Math.round(80 * mult));
    } else {
      geometry = new THREE.IcosahedronGeometry(1.65, capabilities.isLowTier ? 1 : (isMobile ? 2 : 3));
    }

    // ELEGANT SPECTRAL RAINBOW IRIDESCENT GLSL SHADER MATERIAL
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          vec3 p = position;
          // Smooth, organic fluid breathing motion
          float displacement = sin(p.x * 2.2 + uTime * 1.2) * cos(p.y * 2.2 + uTime * 1.2) * 0.14;
          displacement += sin(p.z * 2.4 + uTime * 0.9) * 0.08;
          p += normal * displacement;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;

        // Smooth mathematical spectral rainbow spectrum (Red -> Orange -> Yellow -> Green -> Cyan -> Blue -> Violet)
        vec3 rainbow(float h) {
          float r = sin(h * 6.2831853 + 0.0) * 0.5 + 0.5;
          float g = sin(h * 6.2831853 + 2.0943951) * 0.5 + 0.5;
          float b = sin(h * 6.2831853 + 4.1887902) * 0.5 + 0.5;
          return vec3(r, g, b);
        }

        void main() {
          float t = uTime * 0.28;
          
          // Spatial continuous rainbow coordinate
          float hue = fract((vPosition.y * 0.28 + vPosition.x * 0.22 + vPosition.z * 0.18) + t);
          vec3 rainbowColor = rainbow(hue);

          // Subtle secondary chromatic refraction
          float secondaryHue = fract(hue + 0.33);
          vec3 secondaryRainbow = rainbow(secondaryHue);

          // Fine crisp wireframe ribs
          float lineX = step(0.82, fract(vUv.x * 16.0));
          float lineY = step(0.82, fract(vUv.y * 16.0));
          float wireGrid = max(lineX, lineY);

          // Smooth iridescent rim Fresnel
          float rimGlow = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          rimGlow = pow(rimGlow, 2.0);

          vec3 wireColor = rainbowColor * 1.4;
          vec3 innerGlow = mix(rainbowColor * 0.45, secondaryRainbow * 0.8, rimGlow);

          vec3 finalColor = mix(innerGlow, wireColor, wireGrid * 0.9);
          float alpha = 0.95;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
      wireframe: true,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);

    // SECONDARY SPECTRAL RAINBOW ORBITAL RING
    const ringGeometry = new THREE.RingGeometry(2.15, 2.25, isMobile ? 32 : 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
    const orbitRing = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitRing.rotation.x = Math.PI / 3;
    scene.add(orbitRing);

    // SPECTRAL RAINBOW PARTICLES (Budget scaled dynamically by device tier)
    const particleCount = capabilities.particleBudget;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx3 = i * 3;
      positions[idx3] = (Math.random() - 0.5) * 12;
      positions[idx3 + 1] = (Math.random() - 0.5) * 12;
      positions[idx3 + 2] = (Math.random() - 0.5) * 12;

      const hue = (i / particleCount);
      const r = Math.sin(hue * Math.PI * 2 + 0.0) * 0.5 + 0.5;
      const g = Math.sin(hue * Math.PI * 2 + (Math.PI * 2) / 3) * 0.5 + 0.5;
      const b = Math.sin(hue * Math.PI * 2 + (Math.PI * 4) / 3) * 0.5 + 0.5;

      colors[idx3] = r;
      colors[idx3 + 1] = g;
      colors[idx3 + 2] = b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.07 : 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // DYNAMIC PERFORMANCE GOVERNOR (auto-downgrades if fps dips on slow phones)
    const governor = new DynamicPerformanceGovernor(() => {
      renderer.setPixelRatio(1.0);
    });

    // INTERACTION TRACKING (MOUSE + MOBILE TOUCH GESTURES + GYROSCOPE)
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let touchVelocityX = 0;
    let touchVelocityY = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTouching = false;

    // Desktop Mouse Move Handler
    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      pointerX = (event.clientX - windowHalfX) * 0.0008;
      pointerY = (event.clientY - windowHalfY) * 0.0008;
    };

    // Mobile Touch Handlers with Momentum & Inertia
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        isTouching = true;
        const touch = event.touches[0];
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        touchVelocityX = 0;
        touchVelocityY = 0;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;

        touchVelocityX = deltaX * 0.0035;
        touchVelocityY = deltaY * 0.0035;

        // Immediate responsive touch rotation
        targetX += touchVelocityX;
        targetY += touchVelocityY;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        pointerX = (touch.clientX - windowHalfX) * 0.0012;
        pointerY = (touch.clientY - windowHalfY) * 0.0012;
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Mobile Gyroscope / Device Orientation Parallax
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        // gamma: left-to-right tilt in [-90, 90], beta: front-to-back tilt in [-180, 180]
        const gyroX = (event.gamma / 45) * 0.4;
        const gyroY = ((event.beta - 45) / 45) * 0.4;
        if (!isTouching) {
          pointerX = gyroX;
          pointerY = gyroY;
        }
      }
    };

    // Register interaction listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    if (window.DeviceOrientationEvent && typeof (window.DeviceOrientationEvent as any).requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    // RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // ANIMATION LOOP WITH INTERSECTION OBSERVER VISIBILITY PAUSE
    let animationFrameId: number;
    let isVisibleInViewport = true;
    let clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleInViewport = entry.isIntersecting;
        if (entry.isIntersecting) {
          clock.start();
        } else {
          clock.stop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisibleInViewport) return;

      governor.tick();

      const elapsedTime = clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = elapsedTime;

      // Dynamic color shifting on outer ring
      const ringHue = (elapsedTime * 0.15) % 1;
      ringMaterial.color.setHSL(ringHue, 0.95, 0.55);

      // Smooth damping with touch momentum inertia decay on release
      if (!isTouching && (Math.abs(touchVelocityX) > 0.0001 || Math.abs(touchVelocityY) > 0.0001)) {
        targetX += touchVelocityX;
        targetY += touchVelocityY;
        touchVelocityX *= 0.92; // fluid friction damping
        touchVelocityY *= 0.92;
      }

      targetX += (pointerX - targetX) * 0.05;
      targetY += (pointerY - targetY) * 0.05;

      mesh.rotation.y = elapsedTime * 0.32 + targetX * 1.5;
      mesh.rotation.x = elapsedTime * 0.2 + targetY * 1.5;

      orbitRing.rotation.z = elapsedTime * 0.18;
      orbitRing.rotation.y = -elapsedTime * 0.22 + targetX;

      particles.rotation.y = -elapsedTime * 0.1 + targetX;
      particles.rotation.x = elapsedTime * 0.08 + targetY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      ringGeometry.dispose();
      shaderMaterial.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.95 }}
    />
  );
};
