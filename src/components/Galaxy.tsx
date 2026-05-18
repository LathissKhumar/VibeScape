"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import type { SpotifyArtist } from "@/lib/spotify";

function Planet({
  position,
  color,
  size,
  name,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  name: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const radius = Math.sqrt(
        position[0] * position[0] + position[2] * position[2]
      );
      const speed = 0.1 / radius;
      const angle = Math.atan2(position[2], position[0]) + time * speed;
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.z = Math.sin(angle) * radius;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[size * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="black"
        font="/fonts/Inter-Regular.woff"
      >
        {name}
      </Text>
    </group>
  );
}

/* Central pulsing core */
function GalacticCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Outer cyan ring */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#22D3EE"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Galaxy({ topArtists }: { topArtists: SpotifyArtist[] }) {
  const planets = useMemo(() => {
    return topArtists.slice(0, 30).map((artist, index) => {
      // Golden spiral distribution for a galaxy-like feel
      const theta = index * Math.PI * (1 + Math.sqrt(5));
      const radius = 2 + index * 0.4;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      // Use deterministic hash-based variance for render purity
      const y =
        (((artist.id.charCodeAt(0) + artist.id.charCodeAt(artist.id.length - 1)) %
          100) -
          50) /
        100 *
        (radius * 0.3);

      // Stitch neon palette colors
      const colors = ["#A855F7", "#22D3EE", "#F472B6", "#5de6ff", "#ddb7ff"];
      const color = colors[index % colors.length];

      const size = 0.2 + (artist.popularity / 100) * 0.8;

      return {
        id: artist.id,
        name: artist.name,
        position: [x, y, z] as [number, number, number],
        color,
        size,
      };
    });
  }, [topArtists]);

  return (
    <Canvas camera={{ position: [0, 8, 15], fov: 45 }}>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={50} />
      <pointLight position={[10, 5, -10]} intensity={0.5} color="#A855F7" distance={30} />
      <pointLight position={[-10, -5, 10]} intensity={0.5} color="#22D3EE" distance={30} />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <GalacticCore />

      {planets.map((planet) => (
        <Planet key={planet.id} {...planet} />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={30}
        minDistance={5}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
