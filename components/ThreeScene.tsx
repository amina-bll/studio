
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  onInteract: (name: string) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x31263e);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create Planets (Interactive Objects)
    const planets: THREE.Mesh[] = [];
    const planetColors = [0xECA72C, 0x804b98, 0x5dade2, 0xe74c3c];
    const planetNames = ['عطارد', 'الزهرة', 'الأرض', 'المريخ'];

    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.SphereGeometry(0.8 + Math.random() * 0.5, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: planetColors[i],
        shininess: 100,
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = (i - 1.5) * 3.5;
      planet.userData = { name: planetNames[i] };
      scene.add(planet);
      planets.push(planet);
    }

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0xfffdea });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets);
      if (intersects.length > 0) {
        const object = intersects[0].object as THREE.Mesh;
        onInteract(object.userData.name);
      }
    };

    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      planets.forEach((p, idx) => {
        p.rotation.y += 0.01;
        p.position.y = Math.sin(Date.now() * 0.001 + idx) * 0.2;
      });
      starMesh.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      
      // Fix: Dispose of geometries and materials for all planets
      planets.forEach(p => {
        p.geometry.dispose();
        if (Array.isArray(p.material)) {
          p.material.forEach(m => m.dispose());
        } else {
          p.material.dispose();
        }
      });
      
      // Fix: Dispose of starfield assets
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [onInteract]);

  return <div ref={mountRef} className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-brand-dark/30 border-4 border-brand-lavender/20" />;
};

export default ThreeScene;
