"use client";

import { OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Skill } from "@/lib/api/schemas";
import styles from "./skills.module.css";

type SceneSkill = Pick<Skill, "id" | "name" | "category" | "level">;

type SkillStar = SceneSkill & {
  color: string;
  position: [number, number, number];
  size: number;
};

const galaxyVertexShader = `
  attribute vec3 color;
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = color;
    vTwinkle = 0.62 + 0.38 * sin(uTime * (1.15 + mod(aPhase, 1.7)) + aPhase);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * (300.0 / -viewPosition.z) * (0.95 + vTwinkle * 0.55);
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float halo = smoothstep(0.5, 0.0, distanceToCenter);
    float core = smoothstep(0.18, 0.0, distanceToCenter);
    float alpha = halo * (0.52 + vTwinkle * 0.48);
    vec3 light = vColor * (1.0 + core * (0.9 + vTwinkle));
    gl_FragColor = vec4(light, alpha);
  }
`;

let sharedStarTexture: THREE.DataTexture | null = null;
let sharedRingTexture: THREE.DataTexture | null = null;

function getStarTexture() {
  if (sharedStarTexture) return sharedStarTexture;

  const size = 96;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x / (size - 1)) * 2 - 1;
      const dy = (y / (size - 1)) * 2 - 1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const core = Math.exp(-distance * 15);
      const glow = Math.exp(-distance * 4.2) * 0.68;
      const horizontalRay = Math.exp(-Math.abs(dy) * 48) * Math.exp(-Math.abs(dx) * 3.4);
      const verticalRay = Math.exp(-Math.abs(dx) * 48) * Math.exp(-Math.abs(dy) * 3.4);
      const alpha = Math.min(1, core + glow + (horizontalRay + verticalRay) * 0.42);
      const offset = (y * size + x) * 4;

      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = Math.round(alpha * 255);
    }
  }

  sharedStarTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  sharedStarTexture.needsUpdate = true;
  return sharedStarTexture;
}

function getRingTexture() {
  if (sharedRingTexture) return sharedRingTexture;

  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x / (size - 1)) * 2 - 1;
      const dy = (y / (size - 1)) * 2 - 1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ring = Math.exp(-Math.abs(distance - 0.66) * 62);
      const halo = Math.exp(-Math.abs(distance - 0.66) * 13) * 0.28;
      const alpha = Math.min(1, ring + halo);
      const offset = (y * size + x) * 4;

      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = Math.round(alpha * 255);
    }
  }

  sharedRingTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  sharedRingTexture.needsUpdate = true;
  return sharedRingTexture;
}

function categoryColor(index: number, total: number) {
  const hue = 205 + (index * 250) / Math.max(total, 1);
  return `#${new THREE.Color().setHSL((hue % 360) / 360, 0.76, 0.7).getHexString()}`;
}

function createSeededRandom(initialSeed: number) {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function SkillNode({
  point,
  active,
  onSelect,
  reduceMotion,
}: {
  point: SkillStar;
  active: boolean;
  onSelect: (skill: SceneSkill) => void;
  reduceMotion: boolean;
}) {
  const star = useRef<THREE.Sprite>(null);
  const ring = useRef<THREE.Sprite>(null);
  const ringMaterial = useRef<THREE.SpriteMaterial>(null);
  const texture = getStarTexture();
  const ringTexture = getRingTexture();

  useFrame((state) => {
    const pulse = reduceMotion
      ? 0.45
      : (Math.sin(state.clock.elapsedTime * 2.1 + point.id * 1.73) + 1) / 2;

    if (!star.current || !ring.current || !ringMaterial.current) return;
    const target = active ? point.size * 1.45 : point.size;
    star.current.scale.lerp(new THREE.Vector3(target, target, 1), 0.12);
    const ringScale = point.size * (active ? 2.75 + pulse * 0.28 : 2.25 + pulse * 0.22);
    ring.current.scale.set(ringScale, ringScale, 1);
    ringMaterial.current.opacity = active ? 0.78 + pulse * 0.2 : 0.38 + pulse * 0.3;
  });

  return (
    <group>
      <sprite
        ref={ring}
        position={point.position}
        scale={[point.size * 2.3, point.size * 2.3, 1]}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
          onSelect(point);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(point);
        }}
      >
        <spriteMaterial
          ref={ringMaterial}
          map={ringTexture}
          color={point.color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      <sprite
        ref={star}
        position={point.position}
        scale={[point.size, point.size, 1]}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
          onSelect(point);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(point);
        }}
      >
        <spriteMaterial
          map={texture}
          color={point.color}
          transparent
          opacity={active ? 1 : 0.94}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

function GalaxyParticles({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const galaxy = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 0.058 },
    }),
    [],
  );

  const { positions, colors, phases } = useMemo(() => {
    const random = createSeededRandom(20261028 + count);
    const positionData = new Float32Array(count * 3);
    const colorData = new Float32Array(count * 3);
    const phaseData = new Float32Array(count);
    const coreColor = new THREE.Color("#fff3dc");
    const middleColor = new THREE.Color("#9eb7ff");
    const edgeColor = new THREE.Color("#7c55d9");
    const branches = 5;

    for (let index = 0; index < count; index += 1) {
      const radius = Math.pow(random(), 0.68) * 2.85;
      const branch = ((index % branches) / branches) * Math.PI * 2;
      const angle = branch + radius * 1.72 + (random() - 0.5) * 0.48;
      const spread = 0.08 + radius * 0.045;
      const x = Math.cos(angle) * radius + (random() - 0.5) * spread;
      const z = Math.sin(angle) * radius + (random() - 0.5) * spread;
      const y = (random() - 0.5) * (0.24 - Math.min(radius, 2.8) * 0.045);
      const offset = index * 3;
      const mix = Math.min(1, radius / 2.85);
      const color = mix < 0.48
        ? coreColor.clone().lerp(middleColor, mix / 0.48)
        : middleColor.clone().lerp(edgeColor, (mix - 0.48) / 0.52);
      const brightness = 0.72 + random() * 0.28;

      positionData[offset] = x;
      positionData[offset + 1] = y;
      positionData[offset + 2] = z;
      colorData[offset] = color.r * brightness;
      colorData[offset + 1] = color.g * brightness;
      colorData[offset + 2] = color.b * brightness;
      phaseData[index] = random() * Math.PI * 2;
    }

    return { positions: positionData, colors: colorData, phases: phaseData };
  }, [count]);

  useFrame((state, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = reduceMotion ? 0.8 : state.clock.elapsedTime;
    }
    if (!galaxy.current || reduceMotion) return;
    galaxy.current.rotation.y += delta * 0.018;
  });

  return (
    <points ref={galaxy}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={galaxyVertexShader}
        fragmentShader={galaxyFragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function SkillsGalaxy({
  points,
  activeId,
  onSelect,
  reduceMotion,
}: {
  points: SkillStar[];
  activeId: number;
  onSelect: (skill: SceneSkill) => void;
  reduceMotion: boolean;
}) {
  const galaxyGroup = useRef<THREE.Group>(null);
  const canvasWidth = useThree((state) => state.size.width);
  const responsiveScale = THREE.MathUtils.clamp(canvasWidth / 700, 0.7, 1);

  useFrame((state) => {
    if (!galaxyGroup.current || reduceMotion) return;
    galaxyGroup.current.rotation.x = THREE.MathUtils.lerp(
      galaxyGroup.current.rotation.x,
      state.pointer.y * 0.06,
      0.02,
    );
    galaxyGroup.current.rotation.z = THREE.MathUtils.lerp(
      galaxyGroup.current.rotation.z,
      state.pointer.x * -0.05,
      0.02,
    );
  });

  return (
    <group rotation={[0.98, 0, 0.12]} scale={responsiveScale}>
      <group ref={galaxyGroup}>
        <GalaxyParticles count={Math.min(6200, 4200 + points.length * 180)} reduceMotion={reduceMotion} />
        {points.map((point) => (
          <SkillNode
            point={point}
            active={point.id === activeId}
            onSelect={onSelect}
            reduceMotion={reduceMotion}
            key={point.id}
          />
        ))}
      </group>
    </group>
  );
}

export function SkillsScene({ skills }: { skills: SceneSkill[] }) {
  const [activeSkillId, setActiveSkillId] = useState(skills[0].id);
  const [reduceMotion, setReduceMotion] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(skills.map((skill) => skill.category))),
    [skills],
  );

  const points = useMemo<SkillStar[]>(() => {
    const total = Math.max(skills.length, 1);
    const starSize = Math.max(0.66, 0.86 - Math.max(total - 10, 0) * 0.008);

    return skills.map((skill, index) => {
      const progress = (index + 1) / (total + 1);
      // Les compétences restent dans le cœur de la galaxie pour que leurs anneaux
      // ne soient jamais rognés par les limites du canvas.
      const radius = 0.55 + Math.sqrt(progress) * 1.5;
      const branch = ((index % 5) / 5) * Math.PI * 2;
      const angle = branch + radius * 1.72 + Math.sin(skill.id * 1.71) * 0.15;
      const categoryIndex = categories.indexOf(skill.category);

      return {
        ...skill,
        color: categoryColor(categoryIndex, categories.length),
        size: starSize,
        position: [
          Math.cos(angle) * radius,
          Math.sin(skill.id * 2.13) * 0.06,
          Math.sin(angle) * radius,
        ],
      };
    });
  }, [categories, skills]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const activeSkill = skills.find((skill) => skill.id === activeSkillId) ?? skills[0];
  const activeColor = points.find((point) => point.id === activeSkill.id)?.color;

  return (
    <div className={styles.sceneFrame}>
      <div className={styles.canvas} aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 5.15], fov: 44 }}
          dpr={[1, 1.55]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Sparkles
            count={Math.min(48, 18 + skills.length)}
            scale={[6, 4.5, 3.5]}
            size={0.9}
            speed={reduceMotion ? 0 : 0.08}
            opacity={0.3}
            color="#dce5ff"
          />
          <SkillsGalaxy
            points={points}
            activeId={activeSkill.id}
            onSelect={(skill) => setActiveSkillId(skill.id)}
            reduceMotion={reduceMotion}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={1.15}
            maxPolarAngle={1.98}
          />
        </Canvas>
      </div>

      <div className={styles.skillTooltip} aria-live="polite">
        <span style={{ background: activeColor }} />
        <strong>{activeSkill.name}</strong>
        <small>{activeSkill.category} · {activeSkill.level}</small>
      </div>
    </div>
  );
}
