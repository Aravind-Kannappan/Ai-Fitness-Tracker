import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ModelViewerProps {
  exerciseType: string;
}

const ModelViewer = ({ exerciseType }: ModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // For this demo, we'll create a placeholder stick figure based on the exercise type
    // In a real app, you would load a proper 3D model here
    const createStickFigure = () => {
      const group = new THREE.Group();
      
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x2196f3 })
      );
      head.position.y = 1.5;
      group.add(head);
      
      // Torso
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0x2196f3 })
      );
      torso.position.y = 0.8;
      group.add(torso);
      
      // Arms
      const leftArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32),
        new THREE.MeshPhongMaterial({ color: 0x2196f3 })
      );
      leftArm.position.set(-0.5, 0.8, 0);
      leftArm.rotation.z = Math.PI / 2;
      group.add(leftArm);
      
      const rightArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32),
        new THREE.MeshPhongMaterial({ color: 0x2196f3 })
      );
      rightArm.position.set(0.5, 0.8, 0);
      rightArm.rotation.z = Math.PI / 2;
      group.add(rightArm);
      
      // Legs
      const leftLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0x2196f3 })
      );
      
      const rightLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0x2196f3 })
      );
      
      // Position legs differently based on exercise type
      if (exerciseType === 'squat') {
        // Squatting position
        leftLeg.position.set(-0.3, -0.2, 0);
        leftLeg.rotation.z = Math.PI / 6;
        rightLeg.position.set(0.3, -0.2, 0);
        rightLeg.rotation.z = -Math.PI / 6;
      } else {
        // Standing position
        leftLeg.position.set(-0.2, 0, 0);
        rightLeg.position.set(0.2, 0, 0);
      }
      
      group.add(leftLeg);
      group.add(rightLeg);
      
      return group;
    };
    
    const stickFigure = createStickFigure();
    scene.add(stickFigure);
    
    // Add a platform
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 0.1, 32),
      new THREE.MeshPhongMaterial({ color: 0xeeeeee })
    );
    platform.position.y = -1;
    scene.add(platform);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [exerciseType]);
  
  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};

export default ModelViewer;