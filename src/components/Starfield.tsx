"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RotatingStars() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
      groupRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={7000} factor={6} saturation={1} fade speed={1.5} />
    </group>
  );
}

export default function Starfield() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={["#030008"]} />
        <ambientLight intensity={0.5} />
        <RotatingStars />
      </Canvas>
    </div>
  );
}
