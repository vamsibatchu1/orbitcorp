import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Radio, Cpu, Settings, Target } from 'lucide-react';
import ReidImg from './assets/astronauts/reid.jpeg';
import ChristinaImg from './assets/astronauts/Christina.jpeg';
import './App.css';

const MISSIONS = [
  { id: 'apollo8', title: 'APOLLO 08', date: '1968-12-21', crew: 'BORMAN, LOVELL, ANDERS', velocity: '24226', duration: '6 DAYS, 3 HRS' },
  { id: 'apollo11', title: 'APOLLO 11', date: '1969-07-16', crew: 'ARMSTRONG, COLLINS, ALDRIN', velocity: '24236', duration: '8 DAYS, 3 HRS' },
  { id: 'apollo12', title: 'APOLLO 12', date: '1969-11-14', crew: 'CONRAD, GORDON, BEAN', velocity: '24534', duration: '10 DAYS, 4 HRS' },
  { id: 'apollo13', title: 'APOLLO 13', date: '1970-04-11', crew: 'LOVELL, SWIGERT, HAISE', velocity: '24695', duration: '5 DAYS, 22 HRS' },
  { id: 'apollo14', title: 'APOLLO 14', date: '1971-01-31', crew: 'SHEPARD, ROOSA, MITCHELL', velocity: '24550', duration: '9 DAYS, 0 HRS' },
  { id: 'apollo15', title: 'APOLLO 15', date: '1971-07-26', crew: 'SCOTT, WORDEN, IRWIN', velocity: '24500', duration: '12 DAYS, 7 HRS' },
  { id: 'apollo16', title: 'APOLLO 16', date: '1972-04-16', crew: 'YOUNG, MATTINGLY, DUKE', velocity: '24354', duration: '11 DAYS, 1 HRS' },
  { id: 'apollo17', title: 'APOLLO 17', date: '1972-12-07', crew: 'CERNAN, EVANS, SCHMITT', velocity: '24402', duration: '12 DAYS, 13 HRS' },
  { id: 'artemis1', title: 'ARTEMIS I', date: '2022-11-16', crew: 'UNCREWED (SLS FLIGHT TEST)', velocity: '24500', duration: '25 DAYS, 10 HRS' },
  { id: 'artemis2', title: 'ARTEMIS II', date: '2025-??-??', crew: 'WISEMAN, GLOVER, KOCH, HANSEN', velocity: '24600', duration: 'EST. 10 DAYS' }
];

const TERMINAL_COLOR = '#d1f5e8';
const CRT_BG_COLOR = '#0e3a2f';

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

const ScienceBoundingBox = ({ size, label, math1, math2, math3 }: { size: number, label: string, math1: string, math2: string, math3: string }) => {
  const s = size;
  const pts = [
    new THREE.Vector3(-s, -s, 0),
    new THREE.Vector3(s, -s, 0),
    new THREE.Vector3(s, s, 0),
    new THREE.Vector3(-s, s, 0),
    new THREE.Vector3(-s, -s, 0),
  ];
  
  const ticks = [];
  for(let x=-s; x<=s+0.01; x+=s/2) {
     ticks.push([new THREE.Vector3(x, -s, 0), new THREE.Vector3(x, -s + size*0.05, 0)]);
     ticks.push([new THREE.Vector3(x, s, 0), new THREE.Vector3(x, s - size*0.05, 0)]);
  }
  for(let y=-s; y<=s+0.01; y+=s/2) {
     ticks.push([new THREE.Vector3(-s, y, 0), new THREE.Vector3(-s + size*0.05, y, 0)]);
     ticks.push([new THREE.Vector3(s, y, 0), new THREE.Vector3(s - size*0.05, y, 0)]);
  }

  const cross1 = [new THREE.Vector3(0, -s, 0), new THREE.Vector3(0, s, 0)];
  const cross2 = [new THREE.Vector3(-s, 0, 0), new THREE.Vector3(s, 0, 0)];
  
  return (
     <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
       <Line points={pts} color={TERMINAL_COLOR} lineWidth={1} transparent opacity={0.6} />
       {ticks.map((t, i) => <Line key={i} points={t} color={TERMINAL_COLOR} lineWidth={1} transparent opacity={0.6} />)}
       <Line points={cross1} color={TERMINAL_COLOR} lineWidth={1} transparent opacity={0.15} dashed dashScale={5} dashSize={0.5} />
       <Line points={cross2} color={TERMINAL_COLOR} lineWidth={1} transparent opacity={0.15} dashed dashScale={5} dashSize={0.5} />
       
       <Text position={[-s + size*0.05, -s + size*0.05, 0]} color={TERMINAL_COLOR} fontSize={size*0.06} anchorX="left" anchorY="bottom" lineHeight={1.2}>
         {`SEP (ω,δ) = ${math1}\nSSP (λ,β) = ${math2}\nNP        = ${math3}`}
       </Text>
       
       <Text position={[0, s - size*0.1, 0]} color={TERMINAL_COLOR} fontSize={size*0.1} anchorX="center" anchorY="top">
         N
       </Text>
       <Text position={[0, -s + size*0.05, 0]} color={TERMINAL_COLOR} fontSize={size*0.08} anchorX="center" anchorY="bottom">
         0
       </Text>
       
       <Text position={[0, -s - size*0.05, 0]} color={TERMINAL_COLOR} fontSize={size*0.08} anchorX="center" anchorY="top">
         X (unite de R_p)
       </Text>
       <Text position={[-s - size*0.05, 0, 0]} color={TERMINAL_COLOR} fontSize={size*0.08} anchorX="center" anchorY="bottom" rotation={[0,0,Math.PI/2]}>
         Y (unite de R_p)
       </Text>
       
       <Text position={[s - size*0.05, s - size*0.05, 0]} color={TERMINAL_COLOR} fontSize={size*0.1} anchorX="right" anchorY="top" textAlign="right" lineHeight={1.2}>
         {label}
       </Text>
     </Billboard>
  );
}

const Earth = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [geoPts, setGeoPts] = useState<Float32Array | null>(null);

  useEffect(() => {
    fetch('/countries.json')
      .then(res => res.json())
      .then(data => {
        const radius = 6;
        const pts: number[] = [];
        const addLine = (ring: any[]) => {
          for (let i = 0; i < ring.length - 1; i++) {
             const p1 = ring[i];
             const p2 = ring[i+1];
             const v1 = latLongToVector3(p1[1], p1[0], radius);
             const v2 = latLongToVector3(p2[1], p2[0], radius);
             pts.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
          }
        };

        data.features.forEach((feature: any) => {
          const geom = feature.geometry;
          if (!geom) return;
          if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring: any[]) => addLine(ring));
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((polygon: any[]) => {
              polygon.forEach((ring: any[]) => addLine(ring));
            });
          }
        });
        setGeoPts(new Float32Array(pts));
      });
  }, []);

  // Auto-rotation disabled per user request to allow manual OrbitControls rotation

  return (
    <group position={[-20, 0, 0]}>
      <ScienceBoundingBox size={8} label={"TERRA (ECJ2000)\n16 2 2004\n22h 19m 0s UTC"} math1={"+35.4016°  +2.40998°"} math2={"+32.6903°  -9.22004°"} math3={"+87.6142°"} />
      <group ref={meshRef}>
        {/* Solid background sphere to hide backface */}
        <mesh>
          <sphereGeometry args={[5.9, 32, 32]} />
          <meshBasicMaterial color={CRT_BG_COLOR} />
        </mesh>
        {/* Inverted hull for glowing retro silhouette edge */}
        <mesh>
          <sphereGeometry args={[6.0, 32, 32]} />
          <meshBasicMaterial color={TERMINAL_COLOR} side={THREE.BackSide} transparent opacity={0.3} />
        </mesh>
        {geoPts && (
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[geoPts, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color={TERMINAL_COLOR} transparent opacity={0.8} />
          </lineSegments>
        )}
      </group>
      <mesh position={[8, 0, 8]}>
        <sphereGeometry args={[0.3, 4, 4]} />
        <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
      </mesh>
    </group>
  );
};

function generateMoonCraters(radius: number, craterCount: number): Float32Array {
  const pts: number[] = [];
  for (let i = 0; i < craterCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    const cx = radius * Math.sin(phi) * Math.cos(theta);
    const cy = radius * Math.cos(phi);
    const cz = radius * Math.sin(phi) * Math.sin(theta);
    const center = new THREE.Vector3(cx, cy, cz);
    
    const craterRad = Math.random() * 0.4 + 0.05; 
    const segments = 12;
    const normal = center.clone().normalize();
    const arbitrary = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normal.y) > 0.99) arbitrary.set(1, 0, 0);
    
    const tangent = new THREE.Vector3().crossVectors(normal, arbitrary).normalize();
    const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
    
    let prevPoint: THREE.Vector3 | null = null;
    
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      const xOffset = Math.cos(angle) * craterRad;
      const yOffset = Math.sin(angle) * craterRad;
      const pt = center.clone()
        .add(tangent.clone().multiplyScalar(xOffset))
        .add(bitangent.clone().multiplyScalar(yOffset))
        .normalize()
        .multiplyScalar(radius);
        
      if (j === 0) {
        prevPoint = pt;
      } else {
        pts.push(prevPoint!.x, prevPoint!.y, prevPoint!.z, pt.x, pt.y, pt.z);
        prevPoint = pt;
      }
    }
  }
  return new Float32Array(pts);
}

const Moon = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  const craterPts = useMemo(() => {
    return generateMoonCraters(2.5, 60);
  }, []);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0005;
  });

  return (
    <group position={[25, -5, 10]}>
      <ScienceBoundingBox size={3.5} label={"LUNA (ECJ2000)\n16 2 2004\n22h 19m 0s UTC"} math1={"+21.1123°  +1.22091°"} math2={"+12.3312°  -4.11021°"} math3={"+65.1121°"} />
      <group ref={meshRef}>
        {/* Solid background sphere to hide backface */}
        <mesh>
          <sphereGeometry args={[2.46, 32, 32]} />
          <meshBasicMaterial color={CRT_BG_COLOR} />
        </mesh>
        {/* Inverted hull for glowing retro silhouette edge */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color={TERMINAL_COLOR} side={THREE.BackSide} transparent opacity={0.3} />
        </mesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[craterPts, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={TERMINAL_COLOR} transparent opacity={0.6} />
        </lineSegments>
      </group>
      <mesh position={[4, 0, 4]}>
        <sphereGeometry args={[0.2, 4, 4]} />
        <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
      </mesh>
    </group>
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
     setDisplayedText('');
     let i = 0;
     const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
     }, 20);
     return () => clearInterval(interval);
  }, [text]);

  return <div style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</div>;
};

const RetroRocket = ({ missionId = 'apollo11' }: { missionId?: string | null }) => {
  const isArtemis = missionId?.startsWith('artemis');
  const isJClass = !isArtemis && (missionId === 'apollo15' || missionId === 'apollo16' || missionId === 'apollo17');
  const hasAntennaExtension = !isArtemis && (missionId === 'apollo12' || missionId === 'apollo14');
  const extendedFins = !isArtemis && missionId === 'apollo17';

  if (isArtemis) {
     return (
        <group rotation={[0, 0, 0]} scale={[0.15, 0.15, 0.15]}>
           {/* Space Launch System (SLS) Core Stage */}
           <mesh position={[0, -0.5, 0]}>
             <cylinderGeometry args={[1, 1, 6, 8, 1, false]} />
             <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
           </mesh>
           {/* Orion Service Module */}
           <mesh position={[0, 3, 0]}>
             <cylinderGeometry args={[0.8, 1, 1, 8, 1, false]} />
             <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
           </mesh>
           {/* Orion Capsule */}
           <mesh position={[0, 4, 0]}>
             <coneGeometry args={[0.8, 1, 8, 1, false]} />
             <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
           </mesh>
           {/* Launch Abort System */}
           <mesh position={[0, 5, 0]}>
             <cylinderGeometry args={[0.05, 0.05, 1, 4, 1, false]} />
             <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
           </mesh>
           {/* Solid Rocket Booster 1 */}
           <group position={[1.2, 0, 0]}>
             <mesh position={[0, -0.5, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 6, 8, 1, false]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
             <mesh position={[0, 2.8, 0]}>
               <coneGeometry args={[0.3, 0.6, 8, 1, false]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
           </group>
           {/* Solid Rocket Booster 2 */}
           <group position={[-1.2, 0, 0]}>
             <mesh position={[0, -0.5, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 6, 8, 1, false]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
             <mesh position={[0, 2.8, 0]}>
               <coneGeometry args={[0.3, 0.6, 8, 1, false]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
           </group>
           {/* Core RS-25 Engines */}
           <group position={[0, -3.5, 0]}>
             <mesh position={[-0.3, -0.5, 0]}>
               <cylinderGeometry args={[0.2, 0.4, 1, 8, 1, true]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
             <mesh position={[0.3, -0.5, 0]}>
               <cylinderGeometry args={[0.2, 0.4, 1, 8, 1, true]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
           </group>
        </group>
     );
  }

  return (
    <group rotation={[0, 0, 0]} scale={[0.15, 0.15, 0.15]}>
      <mesh position={[0, -2, 0]}>
        {extendedFins ? (
          <cylinderGeometry args={[1.05, 1.05, 4, 8, 1, false]} />
        ) : (
          <cylinderGeometry args={[1, 1, 4, 8, 1, false]} />
        )}
        <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1, 1, 3, 8, 1, false]} />
        <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
      </mesh>
      {/* Payload Stage (J-class is wider for LRV) */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[isJClass ? 0.8 : 0.7, 1, 1, 8, 1, false]} />
        <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
      </mesh>
      
      {/* Scientific Instrumentation Module (SIM) Bay for J-Class */}
      {isJClass && (
        <mesh position={[0.7, 3.5, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
        </mesh>
      )}

      {/* Command Module */}
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[isJClass ? 0.8 : 0.7, 1, 8, 1, false]} />
        <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
      </mesh>
      
      {/* Escape Tower */}
      <group position={[0, 5.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 1, 4, 1, false]} />
          <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
        </mesh>
        {hasAntennaExtension && (
          <mesh position={[0, 0.8, 0]}>
             <boxGeometry args={[0.2, 0.2, 0.2]} />
             <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
          </mesh>
        )}
      </group>
      <group position={[0, -4, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 1, 8, 1, true]} />
          <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
        </mesh>
        <mesh position={[0.5, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 1, 8, 1, true]} />
          <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
        </mesh>
        <mesh position={[-0.5, -0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 1, 8, 1, true]} />
          <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
        </mesh>
      </group>
      <group position={[0, -3.5, 0]}>
        {[-1, 1].map((x, i) => (
           <mesh key={i} position={[x * 1.2, 0, 0]} rotation={[0, 0, x * (extendedFins ? Math.PI/3 : Math.PI/4)]}>
              <planeGeometry args={[extendedFins ? 1.0 : 0.8, 1]} />
              <meshBasicMaterial color={TERMINAL_COLOR} wireframe side={THREE.DoubleSide} />
           </mesh>
        ))}
      </group>
    </group>
  );
};

const MissionDayText = ({ text }: { text: string }) => {
  const textRef = useRef<any>(null);
  useFrame((state) => {
    if (textRef.current) {
       textRef.current.fillOpacity = 0.4 + 0.6 * Math.abs(Math.sin(state.clock.elapsedTime * 5));
    }
  });
  return (
     <Text ref={textRef} position={[2, 1.5, 0]} fontSize={0.7} color={TERMINAL_COLOR} anchorX="left" anchorY="middle">
       {text}
     </Text>
  );
};

const Trajectory = ({ progress, missionId }: { progress: number, missionId: string | null }) => {
  const currentMission = useMemo(() => MISSIONS.find(m => m.id === missionId), [missionId]);
  const totalDays = useMemo(() => {
     if (!currentMission) return 8;
     const match = currentMission.duration.match(/(\d+)\s+DAY/i);
     return match ? parseInt(match[1]) : 8;
  }, [currentMission]);

  const currentDayNumber = Math.max(1, Math.ceil(progress * totalDays));

  const earthCenter = useMemo(() => new THREE.Vector3(-20, 0, 0), []);
  const capeCanaveralLocal = useMemo(() => latLongToVector3(28.39, -80.60, 6.0), []);
  const earthStart = useMemo(() => earthCenter.clone().add(capeCanaveralLocal), [earthCenter, capeCanaveralLocal]);
  
  const blinkRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (blinkRef.current) {
      (blinkRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + 0.8 * Math.abs(Math.sin(state.clock.elapsedTime * 5));
    }
  });

  const curve = useMemo(() => {
    let points: THREE.Vector3[] = [];

    if (missionId === 'apollo13' || missionId === 'artemis2') {
       points = [
           earthStart,
           new THREE.Vector3(5, 8, 5),          // Outbound transfer
           new THREE.Vector3(28, -5, 14),       // Free return loop around far side
           new THREE.Vector3(26, -10, 5),       // Gravity slingshot
           new THREE.Vector3(0, -10, -5),       // Fast return inbound
           new THREE.Vector3(-14.5, -4, 0)      // Re-entry
       ];
    } else if (missionId === 'apollo8' || missionId === 'artemis1') {
       points = [
           earthStart,
           new THREE.Vector3(5, 5, 5),          // Outbound
           new THREE.Vector3(22, -2, 12),       // Enter lunar orbit
           new THREE.Vector3(28, -5, 12),       // Far side
           new THREE.Vector3(26, -8, 8),        // Bottom orbit pass
           new THREE.Vector3(22.5, -5, 10),     // Stable front
       ];
    } else {
       // Standard Landing Paths with slight varied vectors per mission
       let controlY = 5; let endZ = 10; let endY = -5;
       if (missionId === 'apollo12') { controlY = 8; endZ = 12; }
       if (missionId === 'apollo14') { controlY = 2; endZ = 8; }
       if (missionId === 'apollo15') { controlY = -2; endY = -2; endZ = 9;}
       if (missionId === 'apollo16') { controlY = 10; endZ = 11; }
       if (missionId === 'apollo17') { controlY = 6; endY = -7; endZ = 10;}

       points = [
           earthStart,
           new THREE.Vector3(0, controlY, 5),
           new THREE.Vector3(22.8, endY, endZ), // Lunar Touchdown
           new THREE.Vector3(26, endY + 4, endZ - 4), // Lunar Ascent & Orbit Phase
           new THREE.Vector3(0, -controlY * 0.6, 0), // Trans-Earth Injection
           new THREE.Vector3(-18, 1.5, -2) // Splashdown on Earth
       ];
    }
    return new THREE.CatmullRomCurve3(points);
  }, [missionId]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  const shipPos = curve.getPointAt(progress);
  const tangent = curve.getTangentAt(progress).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);

  const distUnits = shipPos.distanceTo(earthCenter);
  const distKm = Math.floor(distUnits * 8600).toLocaleString('en-US');
  const diagnosticStr = `T+ DAY ${currentDayNumber}\nDIST: ${distKm} KM`;

  return (
    <>
      {missionId && (
         <mesh ref={blinkRef} position={earthStart}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={TERMINAL_COLOR} transparent opacity={1} />
         </mesh>
      )}
      <Line points={points} color={TERMINAL_COLOR} opacity={0.4} transparent lineWidth={1} dashed dashScale={10} dashSize={1} dashOffset={-progress * 10} />
      {progress > 0 && progress < 1 && (
        <group position={shipPos}>
          <group quaternion={quaternion}>
             <group rotation={[Math.PI/2, 0, 0]}>
                <RetroRocket missionId={missionId} />
             </group>
             {/* Target reticle around ship */}
             <mesh rotation={[Math.PI/2, 0, 0]}>
               <ringGeometry args={[1.5, 1.8, 16]} />
               <meshBasicMaterial color={TERMINAL_COLOR} wireframe />
             </mesh>
          </group>
          {/* Active Sim Hovering Day Tracker */}
          <Billboard follow={true}>
             <MissionDayText text={diagnosticStr} />
          </Billboard>
        </group>
      )}
    </>
  );
};

const HologramRocket = ({ missionId }: { missionId: string }) => {
   const groupRef = useRef<THREE.Group>(null);
   useFrame(() => {
      if (groupRef.current) groupRef.current.rotation.y += 0.01;
   });
   return (
     <group ref={groupRef} rotation={[0.2, 0, 0]}>
        <RetroRocket missionId={missionId} />
     </group>
   );
};

const BackgroundCosmos = () => {
  const starsGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const r = 150 + Math.random() * 100;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = r * Math.sin(phi) * Math.cos(theta); // x
      positions[i+1] = r * Math.cos(phi); // y
      positions[i+2] = r * Math.sin(phi) * Math.sin(theta); // z
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  const distantPlanets = useMemo(() => {
    const planets = [];
    for (let i=0; i<8; i++) {
        const r = 80 + Math.random() * 80;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.PI/2 + (Math.random() - 0.5) * 0.8;
        
        planets.push({
            pos: [
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.cos(phi),
                r * Math.sin(phi) * Math.sin(theta)
            ],
            scale: 0.8 + Math.random() * 2.5,
            hasRings: Math.random() > 0.6,
            rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
        });
    }
    return planets;
  }, []);

  return (
    <group>
      <points geometry={starsGeometry}>
        <pointsMaterial color={TERMINAL_COLOR} size={0.15} sizeAttenuation transparent opacity={0.6} />
      </points>
      {distantPlanets.map((p, i) => (
        <group key={i} position={p.pos as [number,number,number]} rotation={p.rot}>
            <mesh>
              <sphereGeometry args={[p.scale * 0.98, 32, 32]} />
              <meshBasicMaterial color={CRT_BG_COLOR} />
            </mesh>
            <mesh>
              <sphereGeometry args={[p.scale, 32, 32]} />
              <meshBasicMaterial color={TERMINAL_COLOR} side={THREE.BackSide} transparent opacity={0.5} />
            </mesh>
            <group rotation={[Math.PI/2, 0, 0]}>
               {[-0.6, -0.3, 0, 0.3, 0.6].map((lat, idx) => {
                  const rad = p.scale * Math.sqrt(1 - lat*lat) * 1.01;
                  return (
                    <mesh key={idx} position={[0, 0, p.scale * lat]}>
                       <ringGeometry args={[rad*0.95, rad, 32]} />
                       <meshBasicMaterial color={TERMINAL_COLOR} transparent opacity={0.2} side={THREE.DoubleSide} />
                    </mesh>
                  );
               })}
            </group>
            {p.hasRings && (
                <mesh rotation={[Math.PI/2, -0.2, 0]}>
                   <ringGeometry args={[p.scale * 1.6, p.scale * 2.2, 32]} />
                   <meshBasicMaterial color={TERMINAL_COLOR} transparent opacity={0.15} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
      ))}
    </group>
  );
};

const App = () => {
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const activeMission = MISSIONS.find(m => m.id === activeMissionId);

  useEffect(() => {
    if (activeMissionId) {
      setProgress(0);
      let start = performance.now();
      let duration = 5000;
      if (activeMissionId === 'apollo13' || activeMissionId === 'artemis2') duration = 8000; // Free return takes longer
      if (activeMissionId === 'apollo8' || activeMissionId === 'artemis1') duration = 7000;  // Orbital insert/DRO takes longer

      const animate = (time: number) => {
        let elapsed = time - start;
        let p = Math.min(elapsed / duration, 1);
        setProgress(p);
        if (p < 1) requestAnimationFrame(animate);
      };
      const raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    } else {
      setProgress(0);
    }
  }, [activeMissionId]);

  return (
    <div className="ui-container">
      {/* Top Navigation */}
      <div className="top-nav box">
        <div className="icon-box active"><Activity size={24} /></div>
        <div className="icon-box"><Target size={24} /></div>
        <div className="icon-box"><Radio size={24} /></div>
        <div className="icon-box"><Settings size={24} /></div>
        <div className="icon-box"><Cpu size={24} /></div>
      </div>

      <div className="corp-header box">
        <div className="corp-logo">O R B I T &nbsp; C O R P</div>
        <div className="corp-sub">APOLLO TRACKING SYS</div>
        <div style={{fontSize: '0.6rem'}}>LUNAR COMMAND MODULE</div>
      </div>

      {/* Main View Port */}
      <div className="main-view box">
        <div className="glitch-line" style={{ top: '20%' }} />
        <div className="glitch-line" style={{ top: '65%', animationDelay: '1.2s' }} />
        <div className="glitch-line" style={{ top: '40%', animationDelay: '0.6s' }} />
        
        <div className="view-label">
          <div>LOGARITHMIC VIEW</div>
          <div>NOT TO SCALE</div>
        </div>

        {activeMissionId && activeMission && (
           <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1001, display: 'flex', gap: '20px', alignItems: 'flex-start', pointerEvents: 'none' }}>
              {activeMissionId === 'artemis2' && (
                 <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', opacity: 0.9 }}>
                    <img src={ReidImg} alt="Commander Reid" style={{ width: '150px', height: '150px', border: '1px solid var(--color-fg-bright)', filter: 'grayscale(100%) sepia(100%) hue-rotate(110deg) brightness(1.2) contrast(1.8)' }} />
                    <img src={ChristinaImg} alt="Mission Specialist Christina" style={{ width: '150px', height: '150px', border: '1px solid var(--color-fg-bright)', filter: 'grayscale(100%) sepia(100%) hue-rotate(110deg) brightness(1.2) contrast(1.8)' }} />
                    <div style={{ width: '150px', height: '150px', border: '1px dashed var(--color-fg-bright)', opacity: 0.3, display: 'grid', placeItems: 'center', fontSize: '1rem', color: 'var(--color-fg-bright)' }}>NO_SIG</div>
                    <div style={{ width: '150px', height: '150px', border: '1px dashed var(--color-fg-bright)', opacity: 0.3, display: 'grid', placeItems: 'center', fontSize: '1rem', color: 'var(--color-fg-bright)' }}>NO_SIG</div>
                 </div>
              )}
              <div style={{ fontSize: '1rem', color: 'var(--color-fg-bright)', textAlign: 'right' }}>
                 <TypewriterText text={
                    activeMissionId === 'artemis1' ? 
                    `[ ARTEMIS I ]\nUNCREWED TEST FLIGHT\nDISTANT RETROGRADE ORBIT\nSLS CORE INTEGRITY VERIFIED\nDURATION: ${activeMission.duration}` : 
                    activeMissionId === 'artemis2' ? 
                    `[ ARTEMIS II ]\nCREWED LUNAR FLYBY\nFREE RETURN TRAJECTORY\nORION LIFE SUPPORT NOMINAL\nDURATION: ${activeMission.duration}` : 
                    activeMissionId === 'apollo13' ? 
                    `[ APOLLO 13 ]\nCONTINGENCY FREE RETURN\nEXECUTED LUNAR GRAVITY SLINGSHOT\nSERVICE_MODULE_O2_FAIL\nDURATION: ${activeMission.duration}` : 
                    activeMissionId === 'apollo8' ? 
                    `[ APOLLO 08 ]\nLUNAR ORBIT INSERTION\nENTERED ELLIPTICAL LUNAR ORBIT\nORBITAL STABILIZATION CONCLUDED\nDURATION: ${activeMission.duration}` : 
                    `[ ${activeMission.title} ]\nLUNAR SURFACE LANDING\nSTANDARD DESCENT TRAJECTORY\nNOMINAL IMPACT VECTOR\nDURATION: ${activeMission.duration}`
                 } />
              </div>
           </div>
        )}

        <div className="canvas-container">
          <Canvas camera={{ position: [0, 15, 45], fov: 45 }} gl={{ antialias: false }}>
            <BackgroundCosmos />
            <Earth />
            <Moon />
            <Trajectory progress={progress} missionId={activeMissionId} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            {/* Postprocessing effects can be added if we had external libraries, but gl={{antialias:false}} gives jagged edges natively */}
          </Canvas>
        </div>
      </div>

      {/* Right Data Panel */}
      <div className="side-panel box" style={{ overflowY: 'auto' }}>
        <div className="panel-section" style={{ flex: 'none', paddingBottom: '15px' }}>
          <div className="panel-title">TARGET SELECTION</div>
          <div className="mission-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {MISSIONS.map(m => (
              <button key={m.id} className={`mission-btn ${activeMissionId === m.id ? 'active' : ''}`} onClick={() => setActiveMissionId(m.id)}>
                [{m.title}]
              </button>
            ))}
          </div>
        </div>

        <div className="panel-section" style={{ flex: 'none' }}>
          <div className="panel-title">MISSION TELEMETRY</div>
          <div style={{ fontSize: '0.9rem', marginTop: '10px', color: 'var(--color-fg-bright)' }}>
             {activeMission ? (
               <>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'4px'}}><span>OPERATOR:</span> <span>{activeMission.crew}</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'4px'}}><span>LAUNCH:</span> <span>{activeMission.date}</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'4px'}}><span>VELOCITY:</span> <span>{activeMission.velocity} MPH</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'4px'}}><span>TRACKING:</span> <span>{progress > 0 ? Math.floor(progress * 100) + '%' : 'STANDBY'}</span></div>
               </>
             ) : (
               <div style={{ color: 'var(--color-fg-dim)' }}>AWAITING PROTOCOL...</div>
             )}
          </div>
        </div>

        <div className="panel-section" style={{ flex: 'none', paddingBottom: '0' }}>
          <div className="panel-title">SIGNAL MULTIPLEX</div>
          {/* Animated fake waveform */}
          <div style={{ height: '40px', width: '100%', overflow: 'hidden', position: 'relative', marginTop: '5px' }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                bottom: 0,
                left: `${i * 2.5}%`,
                width: '2%',
                height: `${20 + Math.random() * 80}%`,
                background: 'var(--color-fg)',
                opacity: Math.random() * 0.5 + 0.3
              }} />
            ))}
            <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', background: 'var(--color-fg)' }} />
          </div>
        </div>

        {/* Hologram Rocket View */}
        <div className="panel-section" style={{ flex: '1.5', borderBottom: 'none', position: 'relative' }}>
          <div className="panel-title" style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>SYS SCHEMATIC</div>
          {activeMissionId ? (
            <>
              <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 10, fontSize: '0.65rem', color: 'var(--color-fg-bright)', pointerEvents: 'none' }}>
                 {activeMissionId.startsWith('artemis') ? (
                    <>
                       <div>VEHICLE: SLS BLK 1</div>
                       <div>ENGINES: 4x RS-25 + 2x SRB</div>
                       <div>THRUST: 8.8M LBF</div>
                       <div>PROPULSION: LH2 / LOX / SOLID</div>
                    </>
                 ) : (
                    <>
                       <div>VEHICLE: SATURN V</div>
                       <div>ENGINES: 5x F-1 (S-IC)</div>
                       <div>THRUST: 7.6M LBF</div>
                       <div>PROPULSION: RP-1 / LOX</div>
                    </>
                 )}
              </div>
              <div style={{ width: '100%', height: '100%', minHeight: '150px' }}>
                <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} gl={{ antialias: false }}>
                   <HologramRocket missionId={activeMissionId} />
                </Canvas>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--color-fg-dim)', textAlign: 'center', fontSize: '0.8rem', padding: '10px' }}>
              WAITING FOR TARGET ASSIGNMENT...<br/>NO SCHEMATIC LOADED.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Log / Controls */}
      <div className="bottom-log box" style={{ display: 'flex', gap: '40px' }}>
         <div style={{ flex: 1 }}>
            <div className="log-table-header">ARCHIVE LOG</div>
            <div className="log-content">
              240.9729 28.2120   2453080.14    2453566.05    9.640     6.962      W (X0)
              <br/>
              243.3339 31.5440   2453080.14    2453566.05   10.762     10.187     W (X0)
              <br/>
              237.9280 30.5036   2453080.14    2453566.05    9.094     8.962      W (X0)
              <br/>
              236.1192 29.8028   2453080.14    2453566.05   10.585    10.334      W (X0)
            </div>
         </div>
         <div style={{ flex: 1 }}>
            <div className="log-table-header">DATA VISUALISATION</div>
            <div className="data-table">
              {`1818 4 19  1818.297   53 9.3 1
1818 4 20  1818.300   -1 -1.0 0
1818 4 21  1818.303   -1 -1.0 0
1818 4 22  1818.305   -1 -1.0 0
1818 4 23  1818.308   -1 -1.0 0`}
            </div>
         </div>
         <div style={{ flex: 1 }}>
            <div className="log-table-header">SYSTEM LOGS</div>
            <div className="log-content">
               {`> SYS.INIT OK\n> AWAITING DIRECTIVE...\n> SYSLINK: ` + (progress > 0 && progress < 1 ? 'ACTIVE TRANSIT' : 'REDUNDANT STANDBY') + `\n> CONNECTION ESTABLISHED`}
            </div>
         </div>
      </div>
    </div>
  );
};

export default App;
