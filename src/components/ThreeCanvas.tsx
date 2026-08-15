import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  className?: string;
  variant?: 'hero' | 'telemetry' | 'timeline' | 'minimal';
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ className = '', variant = 'hero' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
    container.appendChild(renderer.domElement);

    // 3D GEOMETRY CREATION BY VARIANT
    const isHero = variant === 'hero';
    const isTelemetry = variant === 'telemetry';
    const isTimeline = variant === 'timeline';

    let geometry: THREE.BufferGeometry;
    if (isTelemetry) {
      geometry = new THREE.TorusKnotGeometry(1.3, 0.42, isMobile ? 64 : 128, isMobile ? 16 : 32);
    } else if (isTimeline) {
      geometry = new THREE.TorusGeometry(1.45, 0.38, isMobile ? 32 : 64, isMobile ? 64 : 100);
    } else {
      geometry = new THREE.IcosahedronGeometry(1.65, isMobile ? 2 : 3);
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

    // SPECTRAL RAINBOW PARTICLES
    const particleCount = isMobile ? 80 : 180;
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

    // MOUSE INTERACTION TRACKING (DESKTOP ONLY)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0008;
      mouseY = (event.clientY - windowHalfY) * 0.0008;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
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

      const elapsedTime = clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = elapsedTime;

      // Dynamic color shifting on outer ring
      const ringHue = (elapsedTime * 0.15) % 1;
      ringMaterial.color.setHSL(ringHue, 0.95, 0.55);

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

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
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
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
