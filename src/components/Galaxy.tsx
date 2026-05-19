"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Line } from "@react-three/drei";
import { EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";
import type { SpotifyArtist } from "@/lib/spotify";
import useWebGL from "@/hooks/useWebGL";
import { WebGLFallback } from "@/components/ui/WebGLFallback";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, RotateCcw } from "lucide-react";

const GENRE_COLORS: Record<string, string> = {
  pop: "#F472B6",
  rock: "#EF4444",
  "alternative rock": "#EF4444",
  electronic: "#22D3EE",
  dance: "#22D3EE",
  edm: "#22D3EE",
  hip: "#FBBF24",
  "hip hop": "#FBBF24",
  rap: "#FBBF24",
  "r&b": "#A78BFA",
  jazz: "#34D399",
  classical: "#94A3B8",
  indie: "#FB923C",
  "indie rock": "#FB923C",
  metal: "#64748B",
  folk: "#86EFAC",
  country: "#FDE68A",
  soul: "#C084FC",
  funk: "#F59E0B",
  blues: "#60A5FA",
  reggae: "#4ADE80",
  latin: "#F97316",
  "k-pop": "#EC4899",
  punk: "#DC2626",
  ambient: "#7DD3FC",
  techno: "#06B6D4",
  house: "#22D3EE",
  trap: "#FBBF24",
  "drill and bass": "#A855F7",
  "lo-fi": "#94A3B8",
};

function getGenreColor(genre: string): string {
  const lower = genre.toLowerCase();
  return GENRE_COLORS[lower] || "#A855F7";
}

function getPrimaryGenre(artist: SpotifyArtist): string {
  return artist.genres[0] || "unknown";
}

function ConstellationLines({
  planets,
}: {
  planets: Array<{ id: string; position: [number, number, number]; genre: string }>;
}) {
  const lines = useMemo(() => {
    const result: Array<{ points: [number, number, number][]; color: string }> = [];
    const byGenre: Record<string, typeof planets> = {};
    planets.forEach((p) => {
      if (!byGenre[p.genre]) byGenre[p.genre] = [];
      byGenre[p.genre].push(p);
    });
    Object.entries(byGenre).forEach(([, genrePlanets]) => {
      for (let i = 0; i < genrePlanets.length; i++) {
        for (let j = i + 1; j < genrePlanets.length; j++) {
          const dist = Math.sqrt(
            (genrePlanets[i].position[0] - genrePlanets[j].position[0]) ** 2 +
              (genrePlanets[i].position[1] - genrePlanets[j].position[1]) ** 2 +
              (genrePlanets[i].position[2] - genrePlanets[j].position[2]) ** 2
          );
          if (dist < 12) {
            result.push({
              points: [genrePlanets[i].position, genrePlanets[j].position],
              color: getGenreColor(genrePlanets[i].genre),
            });
          }
        }
      }
    });
    return result;
  }, [planets]);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={0.5}
          transparent
          opacity={0.25}
        />
      ))}
    </>
  );
}

function ParticleTrail({
  position,
  color,
  size,
}: {
  position: [number, number, number];
  color: string;
  size: number;
}) {
  const trailRef = useRef<THREE.Points>(null);
  const count = 40;

  useFrame((state) => {
    if (!trailRef.current) return;
    const geo = trailRef.current.geometry;
    const pos = geo.attributes.position;
    if (!pos) return;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const drift = Math.sin(state.clock.getElapsedTime() * 0.5 + i * 0.3) * 0.02;
      pos.setX(i, position[0] + (Math.sin(i * 0.5 + state.clock.getElapsedTime() * 0.3) * t * 1.5) + drift);
      pos.setY(i, position[1] + drift * 0.5);
      pos.setZ(i, position[2] + (Math.cos(i * 0.5 + state.clock.getElapsedTime() * 0.3) * t * 1.5) + drift);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(count * 3), 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size * 0.3}
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Planet({
  position,
  color,
  size,
  name,
  id,
  isSelected,
  onSelect,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  name: string;
  id: string;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const radius = Math.sqrt(position[0] * position[0] + position[2] * position[2]);
    const speed = 0.1 / radius;
    const angle = Math.atan2(position[2], position[0]) + time * speed;
    meshRef.current.position.x = Math.cos(angle) * radius;
    meshRef.current.position.z = Math.sin(angle) * radius;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + parseInt(id, 36) * 0.1) * 0.15;
    meshRef.current.rotation.y += 0.01;

    if (glowRef.current) {
      const pulse = isSelected
        ? 1 + Math.sin(time * 3) * 0.2
        : 1 + Math.sin(time * 0.5) * 0.05;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  return (
    <group>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.25 : 0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <ParticleTrail position={position} color={color} size={size} />
      <Text
        position={[0, size + 0.6, 0]}
        fontSize={isSelected ? 0.45 : 0.35}
        color={isSelected ? "#ffffff" : "white"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="black"
      >
        {name}
      </Text>
    </group>
  );
}

function GenreLabel({
  genre,
  position,
}: {
  genre: string;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Text
        fontSize={0.5}
        color={getGenreColor(genre)}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
        font="/fonts/Inter-Regular.woff"
      >
        {genre.toUpperCase()}
      </Text>
      <mesh>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshBasicMaterial
          color={getGenreColor(genre)}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function OrbitalRing({
  radius,
  color,
}: {
  radius: number;
  color: string;
}) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const rotationZ = Math.sin(t * 0.05) * 0.05;
  });

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.3}
      transparent
      opacity={0.08}
    />
  );
}

function ParallaxStarfield() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.0003;
    groupRef.current.rotation.x = Math.sin(t * 0.0002) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Stars radius={120} depth={60} count={8000} factor={6} saturation={1} fade speed={1.5} />
      <Stars radius={80} depth={40} count={3000} factor={4} saturation={0} fade speed={0.8} />
    </group>
  );
}

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

function CameraController({
  target,
}: {
  target: [number, number, number] | null;
}) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  useFrame((_, delta) => {
    if (target && !isAnimating.current) {
      isAnimating.current = true;
    }
    if (isAnimating.current && target) {
      const targetVec = new THREE.Vector3(...target);
      currentTarget.current.lerp(targetVec, delta * 2);
      camera.position.lerp(
        new THREE.Vector3(target[0], target[1] + 3, target[2] + 6),
        delta * 2
      );
      camera.lookAt(currentTarget.current);
      if (camera.position.distanceTo(new THREE.Vector3(target[0], target[1] + 3, target[2] + 6)) < 0.05) {
        isAnimating.current = false;
      }
    }
  });

  return null;
}

function BloomEffect() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.2;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.9;

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    gl.setAnimationLoop(null);

    return () => {
      composer.dispose();
      gl.setAnimationLoop(null);
    };
  }, [gl, scene, camera, size.width, size.height]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}

function GalaxyScene({
  topArtists,
  selectedId,
  onSelect,
  autoRotate,
}: {
  topArtists: SpotifyArtist[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  autoRotate: boolean;
}) {
  const { planets, genreCentroids, orbitalRings } = useMemo(() => {
    const p = topArtists.slice(0, 30).map((artist, index) => {
      const theta = index * Math.PI * (1 + Math.sqrt(5));
      const radius = 2 + index * 0.4;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y =
        (((artist.id.charCodeAt(0) + artist.id.charCodeAt(artist.id.length - 1)) % 100) - 50) /
        100 *
        (radius * 0.3);

      const colors = ["#A855F7", "#22D3EE", "#F472B6", "#5de6ff", "#ddb7ff"];
      const color = colors[index % colors.length];
      const size = 0.2 + (artist.popularity / 100) * 0.8;

      return {
        id: artist.id,
        name: artist.name,
        position: [x, y, z] as [number, number, number],
        color,
        size,
        genre: getPrimaryGenre(artist),
        genres: artist.genres,
        popularity: artist.popularity,
      };
    });

    const centroids: Array<{ genre: string; position: [number, number, number] }> = [];
    const byGenre: Record<string, typeof p> = {};
    p.forEach((planet) => {
      if (!byGenre[planet.genre]) byGenre[planet.genre] = [];
      byGenre[planet.genre].push(planet);
    });
    Object.entries(byGenre).forEach(([genre, planets]) => {
      const avgX = planets.reduce((s, pl) => s + pl.position[0], 0) / planets.length;
      const avgY = planets.reduce((s, pl) => s + pl.position[1], 0) / planets.length;
      const avgZ = planets.reduce((s, pl) => s + pl.position[2], 0) / planets.length;
      centroids.push({
        genre,
        position: [avgX, avgY + 2, avgZ] as [number, number, number],
      });
    });

    const rings = [...new Set(p.map((pl) => pl.genre))].map((genre, i) => ({
      genre,
      radius: 4 + i * 5,
      color: getGenreColor(genre),
    }));

    return { planets: p, genreCentroids: centroids, orbitalRings: rings };
  }, [topArtists]);

  const selectedPlanet = planets.find((p) => p.id === selectedId);
  const cameraTarget = selectedPlanet
    ? selectedPlanet.position
    : null;

  return (
    <>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={50} />
      <pointLight position={[10, 5, -10]} intensity={0.5} color="#A855F7" distance={30} />
      <pointLight position={[-10, -5, 10]} intensity={0.5} color="#22D3EE" distance={30} />

      <ParallaxStarfield />

      <GalacticCore />

      {orbitalRings.map((ring) => (
        <OrbitalRing key={ring.genre} radius={ring.radius} color={ring.color} />
      ))}

      <ConstellationLines
        planets={planets.map((p) => ({
          id: p.id,
          position: p.position,
          genre: p.genre,
        }))}
      />

      {genreCentroids.map((centroid) => (
        <GenreLabel key={centroid.genre} genre={centroid.genre} position={centroid.position} />
      ))}

      {planets.map((planet) => (
        <Planet
          key={planet.id}
          id={planet.id}
          name={planet.name}
          position={planet.position}
          color={planet.color}
          size={planet.size}
          isSelected={planet.id === selectedId}
          onSelect={onSelect}
        />
      ))}

      <CameraController target={cameraTarget} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={30}
        minDistance={5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
      />

      <BloomEffect />
    </>
  );
}

export default function Galaxy({ topArtists }: { topArtists: SpotifyArtist[] }) {
  const webglSupported = useWebGL();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const selectedArtist = useMemo(
    () => topArtists.find((a) => a.id === selectedId),
    [topArtists, selectedId]
  );

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 8, 15], fov: 45 }}>
        <GalaxyScene
          topArtists={topArtists}
          selectedId={selectedId}
          onSelect={setSelectedId}
          autoRotate={autoRotate}
        />
      </Canvas>

      <button
        onClick={() => setAutoRotate((v) => !v)}
        className="absolute top-4 left-4 z-20 p-2 rounded-full glass-card border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all"
        aria-label={autoRotate ? "Disable auto-rotate" : "Enable auto-rotate"}
      >
        {autoRotate ? <RotateCw size={18} /> : <RotateCcw size={18} />}
      </button>

      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 left-6 z-20 w-72 glass-card rounded-xl p-5 shadow-2xl shadow-black/40 border border-white/10"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-[var(--font-outfit)] text-xl font-semibold text-white">
                {selectedArtist.name}
              </h3>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Popularity
              </span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                  style={{ width: `${selectedArtist.popularity}%` }}
                />
              </div>
              <span className="text-xs text-white font-mono">{selectedArtist.popularity}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedArtist.genres.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    color: getGenreColor(genre),
                    borderColor: getGenreColor(genre) + "40",
                    backgroundColor: getGenreColor(genre) + "15",
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
