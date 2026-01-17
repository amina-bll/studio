
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Game } from '../types';
import { TRANSLATIONS } from '../constants';

interface SpaceMission3DProps {
  game: Game;
  onComplete: (points: number) => void;
  onCancel: () => void;
}

const SpaceMission3D: React.FC<SpaceMission3DProps> = ({ game, onComplete, onCancel }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState(0);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [travelProgress, setTravelProgress] = useState(0);

  const planetNames = ['عطارد', 'الزهرة', 'المريخ', 'المشتري', 'زحل'];
  // Accurate color hex codes for planets
  const planetColors = [
    0x8c8c8c, // Mercury: Rocky Gray
    0xe3bb76, // Venus: Cloudy Yellow
    0xc1440e, // Mars: Rusty Red
    0xd8ca9d, // Jupiter: Banded Orange/Tan
    0xead6b8  // Saturn: Pale Gold
  ];

  const requestRef = useRef<number>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020205);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Dynamic Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(5, 5, 10);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x202020, 1.5));

    // Starfield Background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 5000;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) posArray[i] = (Math.random()-0.5)*300;
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.08, color: 0xffffff, transparent: true, opacity: 0.8 });
    const starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);

    // Current Target Planet
    const planetGeo = new THREE.SphereGeometry(4, 64, 64);
    const planetMat = new THREE.MeshPhongMaterial({ 
      color: planetColors[currentPlanetIndex],
      shininess: 15,
      flatShading: false
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.z = -50;
    scene.add(planet);
    planetRef.current = planet;

    // Saturn's Ring (Hidden by default)
    const ringGeo = new THREE.TorusGeometry(6.5, 1.2, 2, 100);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x9a8c73, 
      transparent: true, 
      opacity: 0.5,
      side: THREE.DoubleSide 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    ring.visible = false;
    planet.add(ring); // Attach ring to planet so it moves with it
    ringRef.current = ring;

    // Animation state
    let lastTime = 0;
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isQuizMode) {
        // Move towards planet
        planet.position.z += 0.12;
        planet.rotation.y += 0.003;
        starMesh.rotation.z += 0.0001;

        // Show/Hide ring based on current planet (Saturn is index 4)
        if (currentPlanetIndex === 4) {
          ring.visible = true;
          ring.rotation.z += 0.001;
        } else {
          ring.visible = false;
        }

        // Check if reached docking distance
        if (planet.position.z >= 2) {
          setIsQuizMode(true);
        }
        
        // Update travel progress (approximate)
        setTravelProgress(Math.min(100, ( (50 + planet.position.z) / 52 ) * 100));
      }

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, [isQuizMode, currentPlanetIndex]);

  // Handle Question Logic
  const currentQuestion = game.quiz.questions[currentPlanetIndex];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === currentQuestion.correctAnswer;
    setShowResult(correct);
    if (correct) setPoints(p => p + 500);
  };

  const handleNextPlanet = () => {
    if (currentPlanetIndex < planetNames.length - 1) {
      const nextIdx = currentPlanetIndex + 1;
      setCurrentPlanetIndex(nextIdx);
      
      // Reset 3D planet visual and change color
      if (planetRef.current) {
        planetRef.current.position.z = -60;
        (planetRef.current.material as THREE.MeshPhongMaterial).color.setHex(planetColors[nextIdx]);
      }
      
      setIsQuizMode(false);
      setSelectedOption(null);
      setShowResult(null);
      setTravelProgress(0);
    } else {
      onComplete(points);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black overflow-hidden font-tajawal">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-10">
        <div className="flex justify-between items-start">
           <div className="bg-brand-lavender/30 backdrop-blur-xl border-2 border-brand-orange/40 p-6 rounded-[30px] text-brand-cream shadow-[0_0_30px_rgba(236,167,44,0.2)]">
              <div className="text-xs font-black opacity-50 uppercase tracking-widest">مستوى الطاقة (النقاط)</div>
              <div className="text-5xl font-black text-brand-orange">{points}</div>
           </div>

           <div className="bg-brand-lavender/30 backdrop-blur-xl border-2 border-brand-lavender/40 p-6 rounded-[30px] text-brand-cream text-right">
              <div className="text-xs font-black opacity-50 uppercase tracking-widest">المهمة الحالية</div>
              <div className="text-3xl font-black">{planetNames[currentPlanetIndex]}</div>
           </div>
        </div>

        {/* Travel Progress Indicator */}
        {!isQuizMode && (
          <div className="w-full max-w-xl mx-auto space-y-4">
             <div className="flex justify-between text-brand-cream font-black text-xl">
                <span>الاقتراب من كوكب {planetNames[currentPlanetIndex]}...</span>
                <span>{Math.round(travelProgress)}%</span>
             </div>
             <div className="w-full h-4 bg-brand-deep/50 rounded-full border-2 border-brand-lavender/30 p-1">
                <div 
                  className="h-full bg-brand-orange rounded-full shadow-[0_0_20px_rgba(236,167,44,0.6)] transition-all duration-300"
                  style={{ width: `${travelProgress}%` }}
                />
             </div>
          </div>
        )}

        <button 
          onClick={onCancel}
          className="pointer-events-auto absolute top-1/2 left-10 -translate-y-1/2 bg-red-500/20 hover:bg-red-600 text-white w-16 h-16 rounded-full font-black transition-all border-2 border-red-500 flex items-center justify-center text-3xl shadow-lg"
        >
          ✕
        </button>
      </div>

      {/* Quiz Central Modal */}
      {isQuizMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-deep/60 backdrop-blur-lg p-6">
           <div className="max-w-2xl w-full bg-brand-dark/80 p-12 rounded-[50px] border-4 border-brand-orange/40 shadow-[0_0_80px_rgba(0,0,0,0.8)] space-y-10 animate-fade-in text-center">
              <div className="space-y-4">
                 <h4 className="text-brand-orange font-black text-2xl">تحدي كوكب {planetNames[currentPlanetIndex]}</h4>
                 <h2 className="text-brand-cream text-3xl md:text-4xl font-black leading-tight">
                    {currentQuestion.text}
                 </h2>
              </div>

              <div className="grid gap-4">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(i)}
                    className={`p-6 rounded-[30px] font-black text-xl transition-all border-b-8 active:border-b-0 active:translate-y-2 ${
                      selectedOption === null 
                        ? 'bg-brand-lavender/20 border-brand-lavender/40 hover:bg-brand-lavender/40 text-brand-cream'
                        : i === currentQuestion.correctAnswer
                          ? 'bg-green-500 border-green-700 text-white scale-105 shadow-xl'
                          : selectedOption === i
                            ? 'bg-red-500 border-red-700 text-white'
                            : 'bg-brand-lavender/5 border-brand-lavender/10 text-brand-cream/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {selectedOption !== null && (
                 <div className="space-y-6 animate-fade-in">
                    <div className={`text-3xl font-black ${showResult ? 'text-green-400' : 'text-red-400'}`}>
                       {showResult ? 'إجابة عبقرية! +500 نقطة' : 'للأسف، المحرك يحتاج طاقة أكثر! حاول في الكوكب القادم'}
                    </div>
                    <button
                      onClick={handleNextPlanet}
                      className="w-full bg-brand-orange text-brand-deep py-6 rounded-[35px] font-black text-2xl shadow-xl hover:scale-105 transition-all"
                    >
                      {currentPlanetIndex < planetNames.length - 1 ? 'المحطة التالية 🚀' : 'إنهاء المهمة بنجاح 🏆'}
                    </button>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default SpaceMission3D;
