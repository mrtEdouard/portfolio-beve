"use client";

import { Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function LiquidSculpture() {
  const group = useRef<THREE.Group>(null);
  const sculpture = useRef<THREE.Mesh>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !sculpture.current || reduceMotion) return;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.16,
      0.03,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.24,
      0.03,
    );
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.06;
    sculpture.current.rotation.x += delta * 0.06;
    sculpture.current.rotation.y += delta * 0.11;
  });

  return (
    <group ref={group}>
      <mesh ref={sculpture} scale={1.18} rotation={[0.25, -0.35, 0.15]}>
        <torusKnotGeometry args={[1.15, 0.3, 220, 40, 2, 3]} />
        <meshPhysicalMaterial
          color="#6c8cff"
          emissive="#2847bd"
          emissiveIntensity={0.75}
          roughness={0.16}
          metalness={0.72}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      <mesh rotation={[1.25, 0.25, 0.15]}>
        <torusGeometry args={[2.05, 0.014, 12, 180]} />
        <meshBasicMaterial color="#9db0ff" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.15} />
      <pointLight position={[3, 4, 5]} intensity={38} color="#dce3ff" />
      <pointLight position={[-4, -2, 3]} intensity={26} color="#456bff" />
      <Sparkles
        count={12}
        scale={[5, 4, 3]}
        size={1.1}
        speed={0.12}
        opacity={0.22}
        color="#a9b8ff"
      />
      <LiquidSculpture />
    </Canvas>
  );
}
