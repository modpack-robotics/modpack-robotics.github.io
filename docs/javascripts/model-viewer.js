// Initializes a Three.js GLTF viewer for any <canvas class="model-viewer" data-model="path/to/file.gltf">
// The model path is resolved relative to the site root.
// Optional data attributes:
//   data-cam-x, data-cam-y, data-cam-z  — camera direction vector (default 0.5, 0.6, 1.0)
//   data-bg                              — background hex color (default faf7ff)

async function initModelViewers() {
    const canvases = document.querySelectorAll('canvas.model-viewer');
    console.log('[model-viewer] found canvases:', canvases.length);
    if (!canvases.length) return;

    const THREE = await import('three');
    console.log('[model-viewer] THREE loaded');
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
    const { GLTFLoader }    = await import('three/addons/loaders/GLTFLoader.js');
    console.log('[model-viewer] loaders ready');

    const loader = new GLTFLoader();

    canvases.forEach(canvas => {
        const modelUrl = canvas.dataset.model;
        if (!modelUrl) return;

        const bg  = parseInt(canvas.dataset.bg || 'faf7ff', 16);
        const camDir = new THREE.Vector3(
            parseFloat(canvas.dataset.camX ?? 0.5),
            parseFloat(canvas.dataset.camY ?? 0.6),
            parseFloat(canvas.dataset.camZ ?? 1.0)
        ).normalize();

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(bg);

        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50000);
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.zoomSpeed = 3.0;
        controls.enablePan = true;
        controls.panSpeed = 1.0;
        controls.screenSpacePanning = true;

        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const keyLight = new THREE.DirectionalLight(0xfff8f0, 3.5);
        keyLight.position.set(2, 3, 2).normalize().multiplyScalar(800);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        keyLight.shadow.radius = 3;
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xc8dcff, 1.2);
        fillLight.position.set(-2, 1, -1).normalize().multiplyScalar(600);
        scene.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0x8833ff, 0.5);
        rimLight.position.set(0.1, -0.5, -1).normalize().multiplyScalar(500);
        scene.add(rimLight);

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(10000, 10000),
            new THREE.ShadowMaterial({ opacity: 0.05 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        const MAT = {
            pla:   new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6,  metalness: 0.0, flatShading: true }),
            motor: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3,  metalness: 0.7, flatShading: true }),
            metal: new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2,  metalness: 0.9, flatShading: true }),
        };
        function getMat(n) {
            n = (n || '').toLowerCase();
            // startsWith (not ===) so GLTFLoader's auto-suffixed duplicate mesh
            // names (e.g. "motor_1") from multi-primitive models still resolve.
            if (n.startsWith('motor')) return MAT.motor;
            if (n.startsWith('metal')) return MAT.metal;
            return MAT.pla;
        }

        function resize() {
            const W = canvas.clientWidth || 600;
            const H = canvas.clientHeight || 400;
            renderer.setSize(W, H, false);
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
        }
        new ResizeObserver(resize).observe(canvas);
        resize();

        console.log('[model-viewer] loading:', modelUrl);
        loader.load(modelUrl, gltf => {
            console.log('[model-viewer] loaded:', modelUrl);
            gltf.scene.traverse(c => {
                if (!c.isMesh) return;
                c.material = getMat(c.name);
                c.castShadow = true;
                c.receiveShadow = true;
            });
            gltf.scene.rotation.x = -Math.PI / 2;
            const root = new THREE.Group();
            root.add(gltf.scene);
            scene.add(root);

            const box = new THREE.Box3().setFromObject(root);
            const scale = 600 / Math.max(...box.getSize(new THREE.Vector3()).toArray());
            root.scale.setScalar(scale);

            const box2 = new THREE.Box3().setFromObject(root);
            const center = box2.getCenter(new THREE.Vector3());
            root.position.sub(center);

            const box3 = new THREE.Box3().setFromObject(root);
            const maxDim = Math.max(...box3.getSize(new THREE.Vector3()).toArray());

            camera.position.copy(camDir).multiplyScalar(maxDim * 2.2);
            controls.target.set(0, 0, 0);
            camera.near = maxDim * 0.001;
            camera.far  = maxDim * 30;
            camera.updateProjectionMatrix();
            ground.position.y = box3.min.y - 1;
            keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -maxDim * 0.8;
            keyLight.shadow.camera.right = keyLight.shadow.camera.top   =  maxDim * 0.8;
            keyLight.shadow.camera.far   = maxDim * 4;
            keyLight.shadow.camera.updateProjectionMatrix();
            controls.update();

            (function render() {
                requestAnimationFrame(render);
                controls.update();
                renderer.render(scene, camera);
            })();
        }, undefined, err => {
            console.error('[model-viewer] failed to load', modelUrl, err);
        });
    });
}

document.addEventListener('DOMContentLoaded', initModelViewers);
document.addEventListener('page:loaded', initModelViewers);
