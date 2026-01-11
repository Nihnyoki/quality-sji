import { Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type * as THREE_NS from 'three';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';

import { BlogPost, qualityPhilosophyPosts } from '../data/qualityPhilosophy';
import { VideoPost, videoPosts } from '../data/videoPosts';
import { ProjectPost, projectPosts } from '../data/projectPosts';
import SlideInPanel from './SlideInPanel';
import { FaGithub } from 'react-icons/fa'
import PostContent from './PostContent';
import TypingText from './TypingText';
import CommentsSection from './CommentsSection';
import { cn } from '../lib/utils';
const qualitySystemModel = '/images/quality-system.glb';
const telemetryModel = '/images/telemetry.glb';
const blogsNavModel = '/images/blogs.glb';
const leftStaticModel = '/images/Sandile.glb';

type StaticGlbConfig = {
  src: string;
  position: [number, number, number];
  mobilePosition?: [number, number, number];
  rotationDeg?: [number, number, number];
  navTo?: string;
};

const staticGlbObjects: Record<'blogsNav' | 'sandile', StaticGlbConfig> = {
  blogsNav: {
    src: blogsNavModel,
    navTo: '/quality-philosophy',
    position: [8, 3, -10],
    mobilePosition: [3.8, 2.1, -12],
    // [x, y, z] in DEGREES: x=pitch (look up/down), y=yaw (look left/right), z=roll
    rotationDeg: [0, -90, 0],
  },
  sandile: {
    src: leftStaticModel,
    navTo: '/cv',
    position: [-11, 4, -10],
    mobilePosition: [-3.8, 2.4, -12],
    rotationDeg: [0, 90, 20],
  },
};

function extractYouTubeIdFromText(text: string): string | undefined {
  const candidates = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const re of candidates) {
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return undefined;
}

function getYouTubeIdFromPost(post: unknown): string | undefined {
  if (post && typeof post === 'object') {
    const maybe = post as { youtubeId?: unknown; content?: unknown };
    if (typeof maybe.youtubeId === 'string' && maybe.youtubeId.trim()) {
      return maybe.youtubeId.trim();
    }
    if (Array.isArray(maybe.content)) {
      for (const line of maybe.content) {
        if (typeof line !== 'string') continue;
        const id = extractYouTubeIdFromText(line);
        if (id) return id;
      }
    }
  }
  return undefined;
}

type PostType = 'quality' | 'video' | 'project';
type PanelContent = { type: PostType; post: BlogPost | VideoPost | ProjectPost } | null;

const MainContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<PanelContent>(null);
  const navigate = useNavigate();
  const reduceMotionUI = useReducedMotion();
  const terminalAnim = useAnimationControls();
  const terminalWrapRef = useRef<HTMLDivElement>(null);
  const [activeInfoCard, setActiveInfoCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const openPost = (type: PostType, post: BlogPost | VideoPost | ProjectPost) => {
    setPanelContent({ type, post });
    setPanelOpen(true);
  };

  useLayoutEffect(() => {
    if (reduceMotionUI) {
      terminalAnim.set({ y: 0, opacity: 1 });
      return;
    }

    const el = terminalWrapRef.current;
    if (!el) return;

    // Keep it fully hidden until the 4th second.
    terminalAnim.set({ y: 0, opacity: 0 });

    // Always start the animation after 4s, even if the terminal is far down the page.
    // Use a safe start offset (one viewport height) to avoid jumping from a huge distance.
    const t = window.setTimeout(() => {
      const startY = -window.innerHeight;

      terminalAnim.set({ y: startY, opacity: 0 });
      terminalAnim.start({
        y: 0,
        opacity: 1,
        transition: {
          y: { duration: 60, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 1, ease: 'easeOut' },
        },
      });
    }, 4000);

    return () => window.clearTimeout(t);
  }, [reduceMotionUI, terminalAnim]);

  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 767px)');
    if (!mq) return;

    const apply = () => setIsMobile(Boolean(mq.matches));
    apply();

    // Safari fallback
    const anyMq = mq as any;
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    if (typeof anyMq.addListener === 'function') {
      anyMq.addListener(apply);
      return () => anyMq.removeListener(apply);
    }
  }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let cancelled = false;
      let cleanup: null | (() => void) = null;

      const start = async () => {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { CSS3DRenderer, CSS3DObject } = await import('three/examples/jsm/renderers/CSS3DRenderer.js');
        if (cancelled) return;

        const degToRad = (deg: number) => (deg * Math.PI) / 180;
        const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const applyRotationDeg = (obj: any, rotationDeg?: [number, number, number]) => {
          if (!rotationDeg || !obj?.rotation?.set) return;
          const [rx, ry, rz] = rotationDeg;
          obj.rotation.set(degToRad(rx), degToRad(ry), degToRad(rz));
        };
        const isMobile3d = window.matchMedia?.('(max-width: 767px)')?.matches ?? false;

        const applyStaticTransform = (model: any, cfg: StaticGlbConfig) => {
          const pos = isMobile3d ? (cfg.mobilePosition ?? cfg.position) : cfg.position;
          const [x, y, z] = pos;
          model.position.set(x, y, z);
          const [rx, ry, rz] = cfg.rotationDeg ?? [0, 0, 0];
          model.rotation.set(degToRad(rx), degToRad(ry), degToRad(rz));
        };

        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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
        // Space-like background
        scene.background = new THREE.Color(0x04040a);
        renderer.setClearColor(0x04040a, 1);

        // Starfield (simple, lightweight Points cloud)
        {
          const starCount = 1400;
          const positions = new Float32Array(starCount * 3);
          for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Distribute stars in a large box behind the content
            positions[i3 + 0] = (Math.random() - 0.5) * 220;
            positions[i3 + 1] = (Math.random() - 0.5) * 140;
            positions[i3 + 2] = -Math.random() * 420;
          }
          const starGeo = new THREE.BufferGeometry();
          starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.35,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
          });
          const stars = new THREE.Points(starGeo, starMat);
          (stars as any).renderOrder = -1;
          scene.add(stars);
        }

        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(container.clientWidth, container.clientHeight);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0';
        cssRenderer.domElement.style.left = '0';
        cssRenderer.domElement.style.width = '100%';
        cssRenderer.domElement.style.height = '100%';
        cssRenderer.domElement.style.pointerEvents = 'none';
        cssRenderer.domElement.style.zIndex = '2';
        container.appendChild(cssRenderer.domElement);

      // Prepare posts
      const randomQualityXYZ = (): [number, number, number] => {
        const x = Math.random() * 30 - 15; // [-15, 15]
        const y = Math.random() * 16 - 8; // [-8, 8]
        const z = -20 - Math.random() * 50; // [-70, -20]
        return [x, y, z];
      };

      const posts: Array<{
        id: string;
        type: PostType;
        title: string;
        link: string;
        delay: number;
        image?: string;
        model?: string;
        youtubeId?: string;
        position?: [number, number, number];
        rotationDeg?: [number, number, number];
        randomizeOnReset?: boolean;
      }> = [
        ...qualityPhilosophyPosts.map((post: BlogPost, i: number) => {
          const hasExplicitPosition = Boolean(post.position);
          return {
          id: post.id,
          type: 'quality' as PostType,
          title: post.title,
          link: `/quality/${post.id}`,
          // If an explicit position is provided, do not add random delay-based Z offsets.
          delay: hasExplicitPosition ? 0 : Math.random() * 5,
          image: post.image,
          model: post.model ?? (i % 2 === 0 ? qualitySystemModel : telemetryModel),
          position: post.position,
          rotationDeg: post.rotationDeg,
          randomizeOnReset: !hasExplicitPosition,
          };
        }),
        ...videoPosts.map((post: VideoPost, i: number) => ({
          id: post.id,
          type: 'video' as PostType,
          title: post.title,
          link: `/videos/${post.id}`,
          delay: Math.random() * 5,
          image: post.image,
          youtubeId: post.youtubeId,
          model: post.youtubeId ? undefined : (i % 2 === 0 ? telemetryModel : qualitySystemModel),
        })),
        ...projectPosts.map((post: ProjectPost, i: number) => ({
          id: post.id,
          type: 'project' as PostType,
          title: post.title,
          link: `/projects/${post.id}`,
          delay: Math.random() * 5,
          image: post.image,
          model: i % 2 === 0 ? qualitySystemModel : telemetryModel,
        })),
      ];

      
      const loader = new GLTFLoader();
      const objects: THREE_NS.Object3D[] = [];

      const makeAnimData = (x: number, y: number, zReset: number, randomizeOnReset?: boolean) => ({
        x,
        y,
        zReset,
        speed: [0.02, 0.03, 0.04][Math.floor(Math.random() * 3)],
        randomizeOnReset: Boolean(randomizeOnReset),
      });

      const attachAnim = (obj: any, x: number, y: number, zReset: number, randomizeOnReset?: boolean) => {
        obj.userData = obj.userData || {};
        obj.userData.__anim = makeAnimData(x, y, zReset, randomizeOnReset);
      };

      const initialXs = posts.map((p) => (p.position?.[0] ?? randomQualityXYZ()[0]));
      const initialYs = posts.map((p) => (p.position?.[1] ?? randomQualityXYZ()[1]));
      const initialZResets = posts.map((p) => (p.position?.[2] ?? (-20 - p.delay * 10)));

      posts.forEach((post, index) => {
        if (post.type === 'video' && post.youtubeId) {
          const widthPx = 480;
          const heightPx = 270;
          const scale = 0.01;

          const iframe = document.createElement('iframe');
          iframe.width = String(widthPx);
          iframe.height = String(heightPx);
          iframe.style.border = '0';
          iframe.style.borderRadius = '14px';
          iframe.style.background = 'transparent';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
          iframe.loading = 'eager';

          const id = post.youtubeId;
          const origin = encodeURIComponent(window.location.origin);
          iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${id}&enablejsapi=1&origin=${origin}`;

          // Some browsers ignore autoplay params on first paint; nudge the player via JS API.
          iframe.addEventListener('load', () => {
            const targetWindow = iframe.contentWindow;
            if (!targetWindow) return;

            const send = (func: string, args: any = '') => {
              targetWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
            };

            send('mute');
            send('playVideo');
            window.setTimeout(() => send('playVideo'), 500);
            window.setTimeout(() => send('playVideo'), 1500);
          });

          const cssObject = new CSS3DObject(iframe);
          (cssObject as any).position.set(0, 0, 0.01);
          (cssObject as any).scale.set(scale, scale, scale);

          const planeW = widthPx * scale;
          const planeH = heightPx * scale;
          const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
          const planeMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
          const planeMesh = new THREE.Mesh(planeGeo, planeMat) as unknown as THREE_NS.Object3D;
          const x = initialXs[index];
          const y = initialYs[index];
          const zReset = initialZResets[index];
          (planeMesh as any).position.set(x, y, zReset);
          applyRotationDeg(planeMesh as any, post.rotationDeg);
          (planeMesh as any).userData = { link: post.link, postType: post.type, postId: post.id, youtubeId: post.youtubeId };
          attachAnim(planeMesh as any, x, y, zReset, post.randomizeOnReset);
          (planeMesh as any).add(cssObject);
          (scene as any).add(planeMesh);
          (objects as any).push(planeMesh);
          return;
        }

        // If a post has no model, render its image as a CSS3D card.
        if (!post.model && post.image) {
          const widthPx = 420;
          const heightPx = 280;
          const scale = 0.01;

          const img = document.createElement('img');
          img.width = widthPx;
          img.height = heightPx;
          img.src = post.image;
          img.alt = post.title;
          img.loading = 'lazy';
          img.decoding = 'async';
          img.draggable = false;
          img.style.border = '0';
          img.style.borderRadius = '14px';
          img.style.background = 'transparent';
          img.style.objectFit = 'cover';

          const cssObject = new CSS3DObject(img);
          (cssObject as any).position.set(0, 0, 0.01);
          (cssObject as any).scale.set(scale, scale, scale);

          const planeW = widthPx * scale;
          const planeH = heightPx * scale;
          const planeGeo = new THREE.PlaneGeometry(planeW, planeH);
          const planeMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
          const planeMesh = new THREE.Mesh(planeGeo, planeMat) as unknown as THREE_NS.Object3D;
          const x = initialXs[index];
          const y = initialYs[index];
          const zReset = initialZResets[index];
          (planeMesh as any).position.set(x, y, zReset);
          applyRotationDeg(planeMesh as any, post.rotationDeg);
          (planeMesh as any).userData = { link: post.link, postType: post.type, postId: post.id };
          attachAnim(planeMesh as any, x, y, zReset, post.randomizeOnReset);
          (planeMesh as any).add(cssObject);
          (scene as any).add(planeMesh);
          (objects as any).push(planeMesh);
          return;
        }

        if (post.model) {
          loader.load(
            post.model,
            (gltf: any) => {
              const model = gltf.scene as unknown as THREE_NS.Object3D;
              const box = new THREE.Box3().setFromObject(model);
              const size = new THREE.Vector3();
              box.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = maxDim > 0 ? 4 / maxDim : 1;
              (model as any).scale.setScalar(scale);
              const x = initialXs[index];
              const y = initialYs[index];
              const zReset = initialZResets[index];
              (model as any).position.set(x, y, zReset);
              applyRotationDeg(model as any, post.rotationDeg);
              (model as any).userData = { link: post.link, postType: post.type, postId: post.id };
              attachAnim(model as any, x, y, zReset, post.randomizeOnReset);
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
          const mesh = new THREE.Mesh(geometry, material) as unknown as THREE_NS.Object3D;
          const x = initialXs[index];
          const y = initialYs[index];
          const zReset = initialZResets[index];
          (mesh as any).position.set(x, y, zReset);
          applyRotationDeg(mesh as any, post.rotationDeg);
          (mesh as any).userData = { link: post.link, postType: post.type, postId: post.id };
          attachAnim(mesh as any, x, y, zReset, post.randomizeOnReset);
          (scene as any).add(mesh);
          (objects as any).push(mesh);
        }
      });

      (Object.values(staticGlbObjects) as StaticGlbConfig[]).forEach((cfg) => {
        loader.load(
          cfg.src,
          (gltf: any) => {
            const model = gltf.scene as unknown as THREE_NS.Object3D;
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? 4 / maxDim : 1;
            (model as any).scale.setScalar(scale);

            applyStaticTransform(model as any, cfg);

            // Keep nav objects stationary (no __anim), but allow a one-time float-in for Sandile.
            if (cfg.navTo) {
              (model as any).userData = { navTo: cfg.navTo };

              // Float the Sandile navigator into its target position.
              if (!reduceMotion && cfg.navTo === '/cv') {
                const [tx, ty, tz] = cfg.position;
                const start: [number, number, number] = [tx, ty + 8, tz - 70];
                (model as any).position.set(start[0], start[1], start[2]);
                (model as any).userData.__intro = {
                  start,
                  end: cfg.position,
                  startMs: performance.now(),
                  durationMs: 2500,
                };
              }
            }

            (scene as any).add(model);
            (objects as any).push(model);
          },
          undefined,
          (error: any) => {
            console.error('An error occurred while loading a static model:', error);
          }
        );
      });

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      (pointLight as any).position.set(5, 5, 5);
      scene.add(pointLight);

      // Animation
      let rafId = 0;
      const animate = () => {
        rafId = requestAnimationFrame(animate);

        // One-time intro animations (e.g., Sandile floating into place)
        if (!reduceMotion) {
          (objects as any).forEach((obj: any) => {
            const intro = obj?.userData?.__intro;
            if (!intro || !obj?.position?.set) return;

            const elapsed = performance.now() - (intro.startMs ?? 0);
            const t = clamp01((intro.durationMs ? elapsed / intro.durationMs : 1) as number);
            const tt = easeOutCubic(t);

            const [sx, sy, sz] = intro.start as [number, number, number];
            const [ex, ey, ez] = intro.end as [number, number, number];
            obj.position.set(sx + (ex - sx) * tt, sy + (ey - sy) * tt, sz + (ez - sz) * tt);

            if (t >= 1) {
              obj.position.set(ex, ey, ez);
              if (obj.userData) delete obj.userData.__intro;
            }
          });
        }

        if (!reduceMotion) {
          (objects as any).forEach((obj: any) => {
            const anim = obj?.userData?.__anim;
            if (!anim || !obj.position) return;

            obj.position.z += anim.speed;
            if (obj.position.z > 0) {
              if (anim.randomizeOnReset) {
                const x = Math.random() * 30 - 15;
                const y = Math.random() * 16 - 8;
                const zReset = -20 - Math.random() * 50;
                anim.x = x;
                anim.y = y;
                anim.zReset = zReset;
              }

              obj.position.z = anim.zReset;
              obj.position.x = anim.x;
              obj.position.y = anim.y;
              anim.speed = [0.02, 0.03, 0.04][Math.floor(Math.random() * 3)];
            }
          });
        }
        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
      };
      animate();

      const findInteractiveRoot = (obj: any) => {
        let current = obj;
        let data = current?.userData || {};
        while (current && (!data.navTo && (!data.postType || !data.postId)) && current.parent) {
          current = current.parent;
          data = current?.userData || {};
        }
        return current && (data.navTo || (data.postType && data.postId)) ? current : null;
      };

      let hovered: any = null;
      const setHovered = (next: any) => {
        if (hovered === next) return;
        if (hovered) {
          const prevScale = hovered.userData?.__hoverScaleBackup;
          if (prevScale && hovered.scale?.set) hovered.scale.set(prevScale.x, prevScale.y, prevScale.z);
          if (hovered.userData) delete hovered.userData.__hoverScaleBackup;
        }
        hovered = next;
        if (hovered) {
          if (hovered.scale?.clone) {
            hovered.userData = hovered.userData || {};
            hovered.userData.__hoverScaleBackup = hovered.scale.clone();
            hovered.scale.multiplyScalar?.(1.05);
          }
          (renderer.domElement as HTMLCanvasElement).style.cursor = 'pointer';
        } else {
          (renderer.domElement as HTMLCanvasElement).style.cursor = 'default';
        }
      };

      const handlePointerMove = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const canvas = renderer.domElement as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((mouseEvent.clientX - rect.left) / rect.width) * 2 - 1,
          -((mouseEvent.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects as any, true) as Array<any>;
        if (intersects.length > 0) {
          const root = findInteractiveRoot(intersects[0].object);
          setHovered(root);
        } else {
          setHovered(null);
        }
      };
      renderer.domElement.addEventListener('mousemove', handlePointerMove);

      // Click handler (attach to canvas)
      const handleClick = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const canvas = renderer.domElement as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((mouseEvent.clientX - rect.left) / rect.width) * 2 - 1,
          -((mouseEvent.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects as any, true) as Array<any>;
        if (intersects.length > 0) {
          const root = findInteractiveRoot(intersects[0].object as any);
          const userData = (root as any)?.userData || {};

          if (typeof userData?.navTo === 'string' && userData.navTo.trim()) {
            setPanelOpen(false);
            navigate({ to: userData.navTo });
            return;
          }

          const { postType, postId } = userData || {};
          let found: BlogPost | VideoPost | ProjectPost | undefined;
          if (postType === 'quality') {
            found = qualityPhilosophyPosts.find((p: BlogPost) => p.id === postId);
          } else if (postType === 'video') {
            found = videoPosts.find((p: VideoPost) => p.id === postId);
          } else if (postType === 'project') {
            found = projectPosts.find((p: ProjectPost) => p.id === postId);
          }
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
        cssRenderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('mousemove', handlePointerMove);
        setHovered(null);
        if (renderer.domElement instanceof HTMLCanvasElement) {
          container.removeChild(renderer.domElement);
        }
        container.removeChild(cssRenderer.domElement);
        renderer.dispose();
      };
    };

      const win = window as any;
      const idleId: number = win.requestIdleCallback
        ? win.requestIdleCallback(start)
        : window.setTimeout(start, 0);

      return () => {
        cancelled = true;
        if (win.cancelIdleCallback) {
          win.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
        cleanup?.();
      };
    }, [navigate]);

    return (
      <div className="min-h-screen bg-gray-100 relative overflow-x-hidden">
        {/* Full-viewport 3D background (visible behind content) */}
        <div ref={containerRef} className="fixed inset-0 z-0" />

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
        <header className="relative pointer-events-none" style={{ height: isMobile ? '52vh' : '65vh' }} />

        {/* Content Section */}
        <main className="relative z-10 bg-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <SlideInPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)}>
              {panelContent && (
                <article className="font-poppins max-w-4xl">
                {(() => {
                  const youtubeId = getYouTubeIdFromPost(panelContent.post);
                  if (!youtubeId) return null;

                  return (
                    <section
                      className="mb-6 overflow-hidden rounded-2xl"
                      aria-label="Video"
                    >
                      <div className="px-4 pt-4">
                        <div className="text-xs font-medium tracking-wide text-zinc-600">Video</div>
                      </div>
                      <div className="p-4 pt-3">
                        <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video">
                          <iframe
                            className="absolute inset-0 h-full w-full"
                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </section>
                  );
                })()}
                <header className="mb-6">
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full border border-zinc-300 bg-zinc-50/70 px-3 py-1 text-xs font-medium text-zinc-700">
                      {panelContent.type === 'quality'
                        ? 'Quality Philosophy'
                        : panelContent.type === 'video'
                          ? 'Video'
                          : 'Project'}
                    </span>
                  </div>
                  <h2 className="font-merriweather text-2xl md:text-3xl font-semibold leading-snug text-zinc-900">
                    {panelContent?.post.title}
                  </h2>
                  {panelContent?.post.subtitle && (
                    <p className="mt-2 text-base text-zinc-700 leading-relaxed">
                      {panelContent?.post.subtitle}
                    </p>
                  )}
                  <div className="mt-3 text-xs tracking-wide text-zinc-500">
                    Published {panelContent?.post.published}
                  </div>
                </header>

                <PostContent
                  content={panelContent.post.content}
                  authorName={panelContent.post.authorName}
                  authorImage={panelContent.post.authorImage}
                />

                <div className="mt-8">
                  <CommentsSection
                    postId={panelContent.post.id}
                    postType={panelContent.type}
                  />
                </div>
                </article>
              )}
            </SlideInPanel>
          </div>

          {/* Extend the page vertically so bottom content is reached by scroll */}
          <div className="h-[70vh]" aria-hidden="true" />

          {/* Bottom dock: Posts + Compliance cards (static), Terminal (falls) */}
          <div className="px-4 sm:px-6 lg:px-8 pb-12 pointer-events-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="order-2 md:order-1 w-full">
                <section
                  aria-label="Posts"
                  className="w-full rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur shadow-sm"
                >
                  <div className="px-4 py-3 sm:px-5 sm:py-4">
                    <div className="font-merriweather text-base font-semibold text-slate-100">Posts</div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <div className="text-xs font-medium tracking-wide text-slate-300">Quality</div>
                        <div className="mt-2 max-h-32 sm:max-h-36 overflow-auto overscroll-contain touch-pan-y pr-2">
                          {qualityPhilosophyPosts.map((post) => (
                            <button
                              key={post.id}
                              type="button"
                              className="block w-full text-left text-[0.95rem] sm:text-sm text-slate-200/90 hover:text-white py-2 leading-snug"
                              onClick={() => openPost('quality', post)}
                            >
                              {post.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium tracking-wide text-slate-300">Videos</div>
                        <div className="mt-2 max-h-32 sm:max-h-36 overflow-auto overscroll-contain touch-pan-y pr-2">
                          {videoPosts.map((post) => (
                            <button
                              key={post.id}
                              type="button"
                              className="block w-full text-left text-[0.95rem] sm:text-sm text-slate-200/90 hover:text-white py-2 leading-snug"
                              onClick={() => openPost('video', post)}
                            >
                              {post.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium tracking-wide text-slate-300">Projects</div>
                        <div className="mt-2 max-h-32 sm:max-h-36 overflow-auto overscroll-contain touch-pan-y pr-2">
                          {projectPosts.map((post) => (
                            <button
                              key={post.id}
                              type="button"
                              className="block w-full text-left text-[0.95rem] sm:text-sm text-slate-200/90 hover:text-white py-2 leading-snug"
                              onClick={() => openPost('project', post)}
                            >
                              {post.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mt-6">
                  <div className="relative [perspective:1200px] flex flex-col gap-3 md:flex-row-reverse md:items-end md:justify-end overflow-visible">
                    {([
                      { title: 'About', to: '/about', description: 'What this site is about.' },
                      { title: 'Privacy Policy', to: '/privacy-policy', description: 'How data is handled.' },
                      { title: 'Contact', to: '/contact', description: 'Get in touch.' },
                    ] as const).map((card, i) => {
                      const isActive = activeInfoCard === i;
                      const zIndex = isMobile ? 1 : isActive ? 50 : 20 - i;
                      const baseZ = -i * 80;
                      const rotateY = 16 - i * 2;
                      const rotateZ = 2 - i * 0.6;

                      return (
                        <div
                          key={card.to}
                          className={cn('relative', i === 0 ? '' : 'md:-mr-16')}
                          style={{ zIndex }}
                          onMouseEnter={() => setActiveInfoCard(i)}
                          onMouseLeave={() => setActiveInfoCard(null)}
                        >
                          <Link
                            to={card.to}
                            className={cn(
                              'block w-[min(23rem,calc(100vw-3rem))] rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur',
                              'px-5 py-4 shadow-lg transition-transform duration-200',
                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/30'
                            )}
                            style={{
                              transform: isMobile
                                ? isActive
                                  ? 'translate3d(0px, -4px, 0px)'
                                  : 'translate3d(0px, 0px, 0px)'
                                : isActive
                                  ? 'translate3d(0px, -6px, 0px) rotateY(8deg) rotateZ(0deg)'
                                  : `translate3d(0px, 0px, ${baseZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                              transformStyle: 'preserve-3d',
                            }}
                            onFocus={() => setActiveInfoCard(i)}
                            onBlur={() => setActiveInfoCard(null)}
                            aria-label={card.title}
                          >
                            <div className="font-merriweather text-base font-semibold text-slate-100">
                              {card.title}
                            </div>
                            <div className="mt-1 text-sm text-slate-300">{card.description}</div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <motion.div
                ref={terminalWrapRef}
                className="order-1 md:order-2 pointer-events-none w-[min(29.75rem,calc(100vw-2rem))] sm:w-[min(29.75rem,calc(100vw-3rem))] h-[20rem] sm:h-[23rem] max-h-[calc(100vh-6rem)]"
                initial={{ opacity: 0, y: 0 }}
                animate={terminalAnim}
              >
                {(() => {
              const charIntervalMs = 32;
              const gapMs = 180;
              const t1 = 'Title: Sandile Mnqayi.';
              const d1 = 'Test Automation Architect, QA Team Lead, and BDD advocate.';
              const t2 = 'Title: GitHub.';
              const d2 = 'Coffe & Code — projects, experiments, and tooling.';
              const t3 = 'Title: Videos.';
              const d3 = 'Quality in software: practical insights, patterns, and demos.';
              const t4 = 'Title: Blogs.';
              const d4 = 'Field notes on quality, delivery, and systems thinking.';

              const s1 = 120;
              const s2 = s1 + t1.length * charIntervalMs + gapMs;
              const s3 = s2 + d1.length * charIntervalMs + gapMs;
              const s4 = s3 + t2.length * charIntervalMs + gapMs;
              const s5 = s4 + d2.length * charIntervalMs + gapMs;
              const s6 = s5 + t3.length * charIntervalMs + gapMs;
              const s7 = s6 + d3.length * charIntervalMs + gapMs;
              const s8 = s7 + t4.length * charIntervalMs + gapMs;

              const rowBase =
                'pointer-events-auto block flex-1 px-5 py-4 sm:py-3 font-mono font-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/30 hover:bg-slate-900/65 overflow-hidden';

              return (
                <div className="h-full rounded-none border border-slate-700/60 bg-slate-900/55 backdrop-blur shadow-sm overflow-hidden flex flex-col">
                  <div className="pointer-events-none select-none flex items-center gap-2 bg-slate-900/70 px-3 py-2 shrink-0">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" aria-hidden="true" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" aria-hidden="true" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" aria-hidden="true" />
                  </div>

                  <div className="flex-1 flex flex-col">
                  <Link
                    to="/cv"
                    className={rowBase}
                    aria-label="Open CV"
                  >
                    <div className="h-full flex flex-col justify-center text-[0.95rem] sm:text-sm text-slate-300 space-y-1 leading-snug">
                      <div>
                        <TypingText
                          text={t1}
                          startDelayMs={s1}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                      <div>
                        <TypingText
                          text={d1}
                          startDelayMs={s2}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                    </div>
                  </Link>

                  <a
                    href="https://github.com/Nihnyoki/"
                    target="_blank"
                    rel="noreferrer"
                    className={rowBase}
                    aria-label="Open GitHub profile"
                  >
                    <div className="h-full flex flex-col justify-center text-[0.95rem] sm:text-sm text-slate-300 space-y-1 leading-snug">
                      <div>
                        <TypingText
                          text={t2}
                          startDelayMs={s3}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                      <div>
                        <TypingText
                          text={d2}
                          startDelayMs={s4}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/@NeatNetSpring"
                    target="_blank"
                    rel="noreferrer"
                    className={rowBase}
                    aria-label="Open YouTube channel"
                  >
                    <div className="h-full flex flex-col justify-center text-[0.95rem] sm:text-sm text-slate-300 space-y-1 leading-snug">
                      <div>
                        <TypingText
                          text={t3}
                          startDelayMs={s5}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                      <div>
                        <TypingText
                          text={d3}
                          startDelayMs={s6}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                    </div>
                  </a>

                  <Link
                    to="/quality-philosophy"
                    className={rowBase}
                    aria-label="Open Blogs"
                  >
                    <div className="h-full flex flex-col justify-center text-sm text-slate-300 space-y-1 leading-snug">
                      <div>
                        <TypingText
                          text={t4}
                          startDelayMs={s7}
                          charIntervalMs={charIntervalMs}
                          showCursor={false}
                        />
                      </div>
                      <div>
                        <TypingText
                          text={d4}
                          startDelayMs={s8}
                          charIntervalMs={charIntervalMs}
                          showCursor
                          persistCursor
                        />
                      </div>
                    </div>
                  </Link>
                  </div>
                </div>
              );
                })()}
              </motion.div>
            </div>
          </div>
        </main>

        <div className="px-4 sm:px-6 lg:px-8 pb-10 pointer-events-auto">
          <div className="max-w-3xl mx-auto">
            <CommentsSection postId="home" postType="quality" />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-gray-100 py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2026 Quality SJI. All rights reserved.</p>
            </div>
      </footer>
    </div>
  );
};


export default MainContainer;