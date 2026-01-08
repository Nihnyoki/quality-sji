import { Link } from '@tanstack/react-router';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { BlogPost, qualityPhilosophyPosts } from '../data/qualityPhilosophy';
import { VideoPost, videoPosts } from '../data/videoPosts';
import { ProjectPost, projectPosts } from '../data/projectPosts';
import SlideInPanel from './SlideInPanel';
import { FaGithub } from 'react-icons/fa'
const qualitySystemModel = '/public/images/quality-system.glb';
const telemetryModel = '/public/images/telemetry.glb';

type PostType = 'quality' | 'video' | 'project';
type PanelContent = { type: PostType; post: BlogPost | VideoPost | ProjectPost } | null;

const MainContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<PanelContent>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Set up the scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      if (renderer.domElement instanceof HTMLCanvasElement) {
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        container.appendChild(renderer.domElement);
      }
      renderer.setClearColor(0x87ceeb, 1);

      // Prepare posts
      const posts: Array<{ id: string; type: PostType; title: string; link: string; delay: number; model: string; }> = [
        ...qualityPhilosophyPosts.map((post: BlogPost, i: number) => ({
          id: post.id,
          type: 'quality' as PostType,
          title: post.title,
          link: `/quality/${post.id}`,
          delay: Math.random() * 5,
          model: i % 2 === 0 ? qualitySystemModel : telemetryModel,
        })),
        ...videoPosts.map((post: VideoPost, i: number) => ({
          id: post.id,
          type: 'video' as PostType,
          title: post.title,
          link: `/videos/${post.id}`,
          delay: Math.random() * 5,
          model: i % 2 === 0 ? telemetryModel : qualitySystemModel,
        })),
        ...projectPosts.map((post: ProjectPost, i: number) => ({
          id: post.id,
          type: 'project' as PostType,
          title: post.title,
          link: `/projects/${post.id}`,
          delay: Math.random() * 5,
          model: i % 2 === 0 ? qualitySystemModel : telemetryModel,
        })),
      ];

      
      const loader = new GLTFLoader();
      const objects: THREE.Object3D[] = [];
      const speedMultipliers = posts.map(() => [0.02, 0.03, 0.04][Math.floor(Math.random() * 3)]);
      const initialXs = posts.map(() => Math.random() * 30 - 15);
      const initialYs = posts.map(() => Math.random() * 16 - 8);
      const titleColors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#1A535C', '#FF8C42', '#6B47DC', '#FF5EAE', '#00B8A9'];

      posts.forEach((post, index) => {
        if (post.model) {
          loader.load(
            post.model,
            (gltf: any) => {
              const model = gltf.scene as unknown as THREE.Object3D;
              const box = new THREE.Box3().setFromObject(model);
              const size = new THREE.Vector3();
              box.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = maxDim > 0 ? 4 / maxDim : 1;
              (model as any).scale.setScalar(scale);
              (model as any).position.set(initialXs[index], initialYs[index], -20 - post.delay * 10);
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (ctx) {
                canvas.width = 512;
                canvas.height = 128;
                ctx.fillStyle = 'transparent';
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = titleColors[index % titleColors.length];
                ctx.fillText(post.title, canvas.width / 2, canvas.height / 2 + 10);
              }
              const texture = new THREE.CanvasTexture(canvas);
              const titleMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
              const titlePlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), titleMaterial) as unknown as THREE.Object3D;
              (titlePlane as any).position.set(0, 0.7, 0);
              (titlePlane as any).rotation.x = 0;
              (titlePlane as any).rotation.y = 0;
              (titlePlane as any).rotation.z = 0;
              (model as any).add(titlePlane);
              (model as any).userData = { link: post.link, postType: post.type, postId: post.id };
              (scene as any).add(model);
              (objects as any).push(model);
            },
            undefined,
            (error: any) => {
              console.error('An error occurred while loading the model:', error);
            }
          );
        } else {
          const geometry = new THREE.BoxGeometry(2, 2, 2);
          const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
          const mesh = new THREE.Mesh(geometry, material) as unknown as THREE.Object3D;
          (mesh as any).position.set(initialXs[index], initialYs[index], -20 - post.delay * 10);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 512;
            canvas.height = 128;
            ctx.fillStyle = 'transparent';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = titleColors[index % titleColors.length];
            ctx.fillText(post.title, canvas.width / 2, canvas.height / 2 + 10);
          }
          const texture = new THREE.CanvasTexture(canvas);
          const titleMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const titlePlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), titleMaterial) as unknown as THREE.Object3D;
          (titlePlane as any).position.set(0, 2.5, 0);
          (mesh as any).add(titlePlane);
          (mesh as any).userData = { link: post.link, postType: post.type, postId: post.id };
          (scene as any).add(mesh);
          (objects as any).push(mesh);
        }
      });

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      (pointLight as any).position.set(5, 5, 5);
      scene.add(pointLight);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        (objects as any).forEach((obj: any, index: number) => {
          if (obj.position) {
            obj.position.z += speedMultipliers[index];
            if (obj.position.z > 0) {
              obj.position.z = -20 - posts[index].delay * 10;
              obj.position.x = initialXs[index];
              obj.position.y = initialYs[index];
              speedMultipliers[index] = [0.02, 0.03, 0.04][Math.floor(Math.random() * 3)];
            }
          }
        });
        renderer.render(scene, camera);
      };
      animate();

      // Click handler (attach to canvas)
      const handleClick = (event: MouseEvent) => {
        console.log('Canvas click event from handleClick');
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects as any, true);
        console.log('Intersects:', intersects);
        if (intersects.length > 0) {
          let obj = intersects[0].object;
          let userData = (obj as any).userData || {};
          // Traverse up the parent chain to find userData with postType and postId
          while (obj && (!userData.postType || !userData.postId) && obj.parent) {
            obj = obj.parent;
            userData = (obj as any).userData || {};
          }
          const { postType, postId } = userData || {};
          console.log('userData:', userData, 'postType:', postType, 'postId:', postId);
          let found: BlogPost | VideoPost | ProjectPost | undefined;
          if (postType === 'quality') {
            found = qualityPhilosophyPosts.find((p: BlogPost) => p.id === postId);
          } else if (postType === 'video') {
            found = videoPosts.find((p: VideoPost) => p.id === postId);
          } else if (postType === 'project') {
            found = projectPosts.find((p: ProjectPost) => p.id === postId);
          }
          console.log('found:', found);
          if (found) {
            setPanelContent({ type: postType, post: found });
            setPanelOpen(true);
          }
        }
      };
      renderer.domElement.addEventListener('click', handleClick);

      // Resize handler
      const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('click', handleClick);
        if (renderer.domElement instanceof HTMLCanvasElement) {
          container.removeChild(renderer.domElement);
        }
      };
    }, []);

    // Debug: log panelOpen and panelContent on each render
    console.log('RENDER: panelOpen:', panelOpen, 'panelContent:', panelContent);
    return (
      <div className="min-h-screen bg-gray-100 relative">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-8">
                <Link to="/quality-philosophy" className="text-gray-700 hover:text-blue-500 font-medium">QA Philosophy</Link>
                {/* Add more valid routes as needed */}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section with 3D Objects */}
        <header className="relative" style={{ height: '65vh' }}>
          <div ref={containerRef} className="absolute top-0 left-0 w-full h-full z-0" />
        </header>

        {/* Content Section */}
        <main className="py-12">
          <SlideInPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)}>
            {panelContent && (
              <div>
                <h2 className="text-2xl font-bold mb-2">{panelContent?.post.title}</h2>
                {panelContent?.post.subtitle && <h3 className="text-lg text-gray-500 mb-2">{panelContent?.post.subtitle}</h3>}
                <div className="text-xs text-gray-400 mb-4">{panelContent?.post.published}</div>
                {panelContent?.post.image && (
                  <img src={panelContent?.post.image} alt={panelContent?.post.title} className="mb-4 rounded shadow" />
                )}
                {panelContent?.post.content.map((p: string, idx: number) => (
                  <p className="mb-2" key={idx}>{p}</p>
                ))}
              </div>
            )}
          </SlideInPanel>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Sandile Mnqayi</h2>
                <p className="text-gray-600 mb-2">Test Automation Architect, QA Team Lead, and BDD advocate. Click below to view my profile.</p>
                <Link to="/cv" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-pink-300 transition">Well versed in...</Link>
            </div>
<div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-2xl font-semibold mb-2">GitHub</h2>
  <p className="text-gray-600 mb-4 p-1">

    <FaGithub size={24} />  </p>

     <Link to="https://github.com/Nihnyoki/" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-pink-300 transition">Coffe & Code</Link>

</div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Videos</h2>
              <p className="text-gray-600">Videos on quality in the software industry, my personal insights, and more...</p>
                <Link to="https://www.youtube.com/@NeatNetSpring" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-pink-300 transition">Put a face to the name</Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
              <p className="text-gray-600">Some popular, some not so popular however very intriguing to an authentic audience.</p>
                <Link to="/quality-philosophy" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-pink-300 transition">I say this...</Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2026 Quality SJI. All rights reserved.</p>
            </div>
      </footer>
    </div>
  );
};


export default MainContainer;