import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const parts = [
  { file: 'models/arm_right/parts/Right Arm - Part 4.gltf',       name: 'shoulder' },
  { file: 'models/arm_right/parts/shoulder2.gltf',                name: 'shoulder2' },
  { file: 'models/arm_right/parts/Right Arm - Part 2 (1).gltf',   name: 'link2' },
  { file: 'models/arm_right/parts/Right Arm - Part 2 (2).gltf',   name: 'link3' },
  { file: 'models/arm_right/parts/Right Arm - Part 2 (3).gltf',   name: 'link4' },
  { file: 'models/arm_right/parts/Right Arm - Part 2 (4).gltf',   name: 'link1' },
  { file: 'models/arm_right/parts/Right Arm - Part 2.gltf',       name: 'link5' },
  { file: 'models/arm_right/parts/Right Arm - right holder.gltf', name: 'gripper', flip: true },
  { file: '/Users/josh/Downloads/Part 4 (1).gltf',                name: 'trigger' },
  // Backpack parts
  { file: 'models/backpack/parts/Vertical Backpack Panels - Front Panel.gltf', name: 'backpack-front' },
  { file: 'models/backpack/parts/Vertical Backpack Panels - Back Panel.gltf',  name: 'backpack-back' },
  { file: 'models/backpack/parts/bar-bracket.gltf',                            name: 'backpack-bar-bracket' },
  { file: 'models/backpack/parts/pc-holder.gltf',                              name: 'backpack-pc-holder' },
  { file: 'models/backpack/parts/vp-charger-holder.gltf',                      name: 'backpack-vp-charger-holder' },
  { file: 'models/backpack/parts/shelf-top.gltf',                              name: 'backpack-shelf-top' },
  { file: 'models/backpack/parts/shelf-mid.gltf',                              name: 'backpack-shelf-mid' },
  { file: 'models/backpack/parts/shelf-bottom.gltf',                           name: 'backpack-shelf-bottom' },
  // RB-Y1m parts
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - Part 4.gltf',       name: 'rby1m-shoulder-right' },
  { file: 'models/arm_right/parts/rby1m/left-shoulder.gltf',             name: 'rby1m-shoulder-left' },
  { file: 'models/arm_right/parts/rby1m/Link 0 - Corrected.gltf',        name: 'rby1m-link1' },
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - Part 4 (2).gltf',   name: 'rby1m-link2' },
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - Link 2.gltf',       name: 'rby1m-link3' },
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - Link 3.gltf',       name: 'rby1m-link4' },
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - Part 4 (1).gltf',   name: 'rby1m-link5' },
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - Part 5.gltf',       name: 'rby1m-link6' },
  { file: 'models/arm_right/parts/rby1m/Assembly 5 - right holder.gltf', name: 'rby1m-gripper', flip: true },
];

const pageHtml = `<!DOCTYPE html>
<html>
<head>
<style>body { margin: 0; background: transparent; } canvas { display: block; }</style>
<script type="importmap">
{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
             "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"}}
</script>
</head>
<body>
<canvas id="c" width="400" height="400"></canvas>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(400, 400);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.setClearColor(0x000000, 0);

const camera = new THREE.PerspectiveCamera(45, 1, 0.001, 1000);

window.renderGLTF = (base64, color) => new Promise((resolve, reject) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const text = new TextDecoder().decode(bytes);

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2, 3, 2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-2, 1, -1);
  scene.add(fill);

  new GLTFLoader().parse(text, '', (gltf) => {
    const model = gltf.scene;
    if (window.__flipPart__) model.rotation.z = Math.PI;
    if (window.__scalePart__) model.scale.setScalar(window.__scalePart__);

    // Override all materials to white
    model.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ color: color || 0xffffff, roughness: 0.4, metalness: 0.0 });
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    model.position.sub(center);
    scene.add(model);

    const fovRad = camera.fov * (Math.PI / 180);
    const dist = (maxDim / 2) / Math.tan(fovRad / 2) * 1.6;
    camera.position.set(dist * 0.6, dist * 0.45, dist * 0.6);
    camera.near = dist * 0.01;
    camera.far = dist * 10;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    resolve();
  }, reject);
});

window.__ready__ = true;
</script>
</body>
</html>`;

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 400, height: 400 });
await page.setContent(pageHtml, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction(() => window.__ready__ === true, { timeout: 15000 });

for (const { file, name } of parts) {
  const data = readFileSync(resolve(file));
  const base64 = data.toString('base64');
  const flip = parts.find(p => p.name === name)?.flip || false;
  const color = parts.find(p => p.name === name)?.color || null;
  const scale = parts.find(p => p.name === name)?.scale || null;
  await page.evaluate((b64, n, f, c, s) => { window.__currentPart__ = n; window.__flipPart__ = f; window.__scalePart__ = s; return window.renderGLTF(b64, c); }, base64, name, flip, color, scale);
  await new Promise(r => setTimeout(r, 200));
  const outPath = `docs/images/bom/part-${name}.png`;
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 400, height: 400 }, omitBackground: true });
  console.log(`Rendered ${name} -> ${outPath}`);
}

await browser.close();
