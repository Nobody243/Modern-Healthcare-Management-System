'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function MedicalRobot3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera & Anti-Aliased WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0.05, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. Clinical Multi-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0a192f, 3.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x22d3ee, 7.5);
    cyanRimLight.position.set(-5, 3, -3);
    scene.add(cyanRimLight);

    const emeraldAccentLight = new THREE.DirectionalLight(0x10b981, 3.5);
    emeraldAccentLight.position.set(5, -2, -2);
    scene.add(emeraldAccentLight);

    const bottomFill = new THREE.PointLight(0x38bdf8, 4.0, 10);
    bottomFill.position.set(0, -3, 3);
    scene.add(bottomFill);

    const heartLight = new THREE.PointLight(0x22d3ee, 5.0, 4);
    heartLight.position.set(0, -0.15, 0.8);
    scene.add(heartLight);

    // 3. Clinical PBR Materials
    const clinicalWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.25,
      roughness: 0.12,
    });

    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.92,
      roughness: 0.2,
    });

    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      metalness: 0.2,
      roughness: 0.04,
      transmission: 0.82,
      thickness: 0.85,
      transparent: true,
      opacity: 0.96,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const cyanNeonMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 3.8,
      metalness: 0.1,
      roughness: 0.12,
    });

    const redMedicalMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 4.0,
      metalness: 0.2,
      roughness: 0.15,
    });

    // 4. MAIN MEDICAL ROBOT HIERARCHY
    const robotRoot = new THREE.Group();
    robotRoot.scale.set(1.08, 1.08, 1.08);
    scene.add(robotRoot);

    // -- HEAD ASSEMBLY --
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.72, 0);
    robotRoot.add(headGroup);

    // Aerodynamic Clinical Cranial Shell
    const headGeo = new THREE.SphereGeometry(0.68, 36, 36);
    headGeo.scale(1, 0.88, 0.96);
    const headMesh = new THREE.Mesh(headGeo, clinicalWhiteMat);
    headGroup.add(headMesh);

    // Titanium Cranial Ridge
    const ridgeGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.6, 16);
    ridgeGeo.scale(1, 1, 0.45);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, darkTitaniumMat);
    ridgeMesh.rotation.x = Math.PI / 2.2;
    ridgeMesh.position.set(0, 0.48, -0.02);
    headGroup.add(ridgeMesh);

    // Deep Curved Panoramic Visor Shield
    const visorGeo = new THREE.SphereGeometry(0.62, 36, 22, 0, Math.PI);
    visorGeo.scale(0.96, 0.74, 0.9);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = Math.PI / 2;
    visorMesh.position.set(0, 0.02, 0.2);
    headGroup.add(visorMesh);

    // Expressive Digital LED Eyes
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.04, 0.63);
    headGroup.add(eyesGroup);

    const eyeGeo = new THREE.CapsuleGeometry(0.075, 0.12, 12, 20);
    const leftEye = new THREE.Mesh(eyeGeo, cyanNeonMat);
    leftEye.position.set(-0.2, 0, 0);
    eyesGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, cyanNeonMat);
    rightEye.position.set(0.2, 0, 0);
    eyesGroup.add(rightEye);

    // Dual Neural Antennas with Glowing Medical Sensor Nodes
    const antennaGeo = new THREE.CylinderGeometry(0.015, 0.022, 0.38, 16);
    const leftAntenna = new THREE.Mesh(antennaGeo, darkTitaniumMat);
    leftAntenna.position.set(-0.38, 0.66, 0);
    leftAntenna.rotation.z = -0.28;
    headGroup.add(leftAntenna);

    const antennaSphereGeo = new THREE.SphereGeometry(0.055, 20, 20);
    const leftAntennaSphere = new THREE.Mesh(antennaSphereGeo, cyanNeonMat);
    leftAntennaSphere.position.set(-0.46, 0.85, 0);
    headGroup.add(leftAntennaSphere);

    const rightAntenna = new THREE.Mesh(antennaGeo, darkTitaniumMat);
    rightAntenna.position.set(0.38, 0.66, 0);
    rightAntenna.rotation.z = 0.28;
    headGroup.add(rightAntenna);

    const rightAntennaSphere = new THREE.Mesh(antennaSphereGeo, cyanNeonMat);
    rightAntennaSphere.position.set(0.46, 0.85, 0);
    headGroup.add(rightAntennaSphere);

    // Titanium Cybernetic Earpieces
    const earpieceGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 32);
    const leftEarpiece = new THREE.Mesh(earpieceGeo, darkTitaniumMat);
    leftEarpiece.rotation.z = Math.PI / 2;
    leftEarpiece.position.set(-0.69, 0.02, 0);
    headGroup.add(leftEarpiece);

    const rightEarpiece = new THREE.Mesh(earpieceGeo, darkTitaniumMat);
    rightEarpiece.rotation.z = Math.PI / 2;
    rightEarpiece.position.set(0.69, 0.02, 0);
    headGroup.add(rightEarpiece);

    // -- TORSO & MEDICAL CARDIAC CORE ASSEMBLY --
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.28, 0);
    robotRoot.add(torsoGroup);

    // Main Clinical Ceramic Torso
    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.36, 0.92, 32);
    torsoGeo.scale(1.22, 1, 0.9);
    const torsoMesh = new THREE.Mesh(torsoGeo, clinicalWhiteMat);
    torsoGroup.add(torsoMesh);

    // Titanium Stethoscope Collar & Neck Link
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.16, 24);
    const neckMesh = new THREE.Mesh(neckGeo, darkTitaniumMat);
    neckMesh.position.set(0, 0.48, 0);
    torsoGroup.add(neckMesh);

    const collarGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    collarGeo.scale(1.24, 1, 0.92);
    const collarMesh = new THREE.Mesh(collarGeo, darkTitaniumMat);
    collarMesh.position.set(0, 0.35, 0);
    torsoGroup.add(collarMesh);

    // Central Cardiac Reactor Housing
    const reactorHousingGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
    reactorHousingGeo.scale(1, 0.88, 1);
    const reactorHousing = new THREE.Mesh(reactorHousingGeo, darkTitaniumMat);
    reactorHousing.rotation.x = Math.PI / 2;
    reactorHousing.position.set(0, 0.06, 0.44);
    torsoGroup.add(reactorHousing);

    // Pulsing Vital Cardiac Sphere Core
    const reactorCoreGeo = new THREE.SphereGeometry(0.14, 32, 24);
    const reactorCore = new THREE.Mesh(reactorCoreGeo, cyanNeonMat);
    reactorCore.position.set(0, 0.06, 0.47);
    torsoGroup.add(reactorCore);

    // Illuminated Medical Red Cross (+) Badge on Chest
    const crossGroup = new THREE.Group();
    crossGroup.position.set(0, 0.06, 0.58);
    torsoGroup.add(crossGroup);

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.02), redMedicalMat);
    crossGroup.add(crossV);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.02), redMedicalMat);
    crossGroup.add(crossH);

    // -- ARTICULATED BIO-SCANNER ARMS --
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.76, 0.24, 0);
    torsoGroup.add(leftArmGroup);

    const shoulderBallGeo = new THREE.SphereGeometry(0.14, 20, 20);
    const leftShoulder = new THREE.Mesh(shoulderBallGeo, darkTitaniumMat);
    leftArmGroup.add(leftShoulder);

    const armSegmentGeo = new THREE.CapsuleGeometry(0.07, 0.35, 8, 16);
    const leftForearm = new THREE.Mesh(armSegmentGeo, clinicalWhiteMat);
    leftForearm.position.set(-0.09, -0.24, 0.1);
    leftForearm.rotation.z = 0.26;
    leftArmGroup.add(leftForearm);

    const handScannerGeo = new THREE.ConeGeometry(0.08, 0.2, 16);
    const leftHandScanner = new THREE.Mesh(handScannerGeo, cyanNeonMat);
    leftHandScanner.position.set(-0.16, -0.48, 0.16);
    leftHandScanner.rotation.x = Math.PI / 1.45;
    leftArmGroup.add(leftHandScanner);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.76, 0.24, 0);
    torsoGroup.add(rightArmGroup);

    const rightShoulder = new THREE.Mesh(shoulderBallGeo, darkTitaniumMat);
    rightArmGroup.add(rightShoulder);

    const rightForearm = new THREE.Mesh(armSegmentGeo, clinicalWhiteMat);
    rightForearm.position.set(0.09, -0.24, 0.1);
    rightForearm.rotation.z = -0.26;
    rightArmGroup.add(rightForearm);

    const rightHandScanner = new THREE.Mesh(handScannerGeo, cyanNeonMat);
    rightHandScanner.position.set(0.16, -0.48, 0.16);
    rightHandScanner.rotation.x = Math.PI / 1.45;
    rightArmGroup.add(rightHandScanner);

    // -- FLOATING IONIC THRUSTERS --
    const thrusterGeo = new THREE.CapsuleGeometry(0.085, 0.38, 8, 16);
    const leftThruster = new THREE.Mesh(thrusterGeo, darkTitaniumMat);
    leftThruster.position.set(-0.85, 0.04, -0.1);
    leftThruster.rotation.z = 0.18;
    torsoGroup.add(leftThruster);

    const thrusterJetGeo = new THREE.ConeGeometry(0.07, 0.32, 16);
    const leftJetGlow = new THREE.Mesh(thrusterJetGeo, cyanNeonMat);
    leftJetGlow.position.set(-0.9, -0.3, -0.1);
    leftJetGlow.rotation.z = Math.PI;
    torsoGroup.add(leftJetGlow);

    const rightThruster = new THREE.Mesh(thrusterGeo, darkTitaniumMat);
    rightThruster.position.set(0.85, 0.04, -0.1);
    rightThruster.rotation.z = -0.18;
    torsoGroup.add(rightThruster);

    const rightJetGlow = new THREE.Mesh(thrusterJetGeo, cyanNeonMat);
    rightJetGlow.position.set(0.9, -0.3, -0.1);
    rightJetGlow.rotation.z = Math.PI;
    torsoGroup.add(rightJetGlow);

    // -- HOLOGRAPHIC VITAL TELEMETRY ORBITAL RING --
    const ringGroup = new THREE.Group();
    robotRoot.add(ringGroup);

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.8,
      metalness: 0.95,
      roughness: 0.08,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.014, 16, 80), ringMat1);
    ring1.rotation.x = Math.PI / 2.7;
    ringGroup.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.4,
      metalness: 0.95,
      roughness: 0.08,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.012, 16, 80), ringMat2);
    ring2.rotation.y = Math.PI / 3.1;
    ringGroup.add(ring2);

    // Satellite Data Nodes
    const bead1 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), cyanNeonMat);
    ring1.add(bead1);

    const bead2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), cyanNeonMat);
    ring2.add(bead2);

    // 5. High-Precision Damped Mouse Tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let targetEyeX = 0;
    let targetEyeY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const mouseY = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      targetRotY = mouseX * 0.65;
      targetRotX = mouseY * 0.38;
      targetEyeX = mouseX * 0.08;
      targetEyeY = -mouseY * 0.05;
    };

    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Render Animation Loop (Silky 60-120fps Damped Physics)
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Damped Head Tracking (0.06 Ease for Butter-Smooth Motion)
      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.06;
      headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.06;

      // Eye Tracking & Random Gentle Blinks
      eyesGroup.position.x += (targetEyeX - eyesGroup.position.x) * 0.1;
      eyesGroup.position.y += (targetEyeY - eyesGroup.position.y) * 0.1;

      const blink = Math.sin(elapsedTime * 0.65) > 0.985 ? 0.15 : 1.0;
      leftEye.scale.set(1, blink, 1);
      rightEye.scale.set(1, blink, 1);

      // Torso Tracking Lag
      torsoGroup.rotation.y += (targetRotY * 0.45 - torsoGroup.rotation.y) * 0.04;
      torsoGroup.rotation.x += (targetRotX * 0.3 - torsoGroup.rotation.x) * 0.04;

      const armWave = Math.sin(elapsedTime * 1.8);
      leftArmGroup.rotation.z = armWave * 0.06 + targetRotX * 0.15;
      rightArmGroup.rotation.z = -armWave * 0.06 - targetRotX * 0.15;

      // Smooth Levitation Floating Bob
      robotRoot.position.y = Math.sin(elapsedTime * 1.4) * 0.09;
      robotRoot.rotation.z = Math.sin(elapsedTime * 0.8) * 0.025;

      // 72 BPM Cardiac Sinus Rhythm Pulse
      const heartPulse =
        1 + Math.sin(elapsedTime * 4.6) * 0.14 + (Math.sin(elapsedTime * 9.2) > 0.7 ? 0.2 : 0);
      reactorCore.scale.set(heartPulse, heartPulse, heartPulse);
      crossGroup.scale.set(heartPulse, heartPulse, heartPulse);
      heartLight.intensity = 4.5 * heartPulse;

      // Counter-Rotating Telemetry Rings
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.28;
      bead1.position.set(Math.cos(elapsedTime * 1.8) * 1.45, Math.sin(elapsedTime * 1.8) * 1.45, 0);
      bead2.position.set(Math.cos(-elapsedTime * 1.5) * 1.65, Math.sin(-elapsedTime * 1.5) * 1.65, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none">
      {/* Subtle Clinical Ambient Glow */}
      <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Medical Status Pill */}
      <div className="absolute top-2 right-4 z-10 px-3.5 py-1 rounded-full bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 flex items-center gap-2 pointer-events-none shadow-lg shadow-cyan-500/10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>CLINICAL MED-BOT // 72 BPM SYNC</span>
      </div>

      {/* Real-time 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />
    </div>
  );
}
