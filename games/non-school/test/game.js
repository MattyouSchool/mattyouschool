import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// --- INITIALISATIE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- SPELER CONTROLS ---
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
document.addEventListener('keydown', (e) => {
    if(e.code === 'KeyW') moveForward = true;
    if(e.code === 'KeyS') moveBackward = true;
    if(e.code === 'KeyA') moveLeft = true;
    if(e.code === 'KeyD') moveRight = true;
});
document.addEventListener('keyup', (e) => {
    if(e.code === 'KeyW') moveForward = false;
    if(e.code === 'KeyS') moveBackward = false;
    if(e.code === 'KeyA') moveLeft = false;
    if(e.code === 'KeyD') moveRight = false;
});

// --- DE ARENA ---
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({ color: 0x111111 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const light = new THREE.PointLight(0xffffff, 500, 100);
light.position.set(0, 10, 0);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- BOTS SYSTEEM ---
const bots = [];
const MAX_BOTS = 15; // Pas hier het maximaal aantal bots aan
let score = 0;

function spawnBot() {
    const bot = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 1),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    bot.position.set((Math.random()-0.5)*80, 1, (Math.random()-0.5)*80);
    bot.userData = { speed: 0.05 + Math.random() * 0.1 };
    scene.add(bot);
    bots.push(bot);
}

for(let i = 0; i < MAX_BOTS; i++) spawnBot();

// --- SCHIET LOGICA ---
const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', () => {
    if (!controls.isLocked) return;
    
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(bots);

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        scene.remove(hit);
        bots.splice(bots.indexOf(hit), 1);
        score++;
        document.getElementById('score').innerText = score;
        setTimeout(spawnBot, 2000); // Er komt na 2 sec een nieuwe bot
    }
});

// --- GAME LOOP ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (controls.isLocked) {
        if (moveForward) controls.moveForward(10 * delta);
        if (moveBackward) controls.moveForward(-10 * delta);
        if (moveLeft) controls.moveRight(-10 * delta);
        if (moveRight) controls.moveRight(10 * delta);
    }

    // Laat bots bewegen
    bots.forEach(bot => {
        bot.position.z += bot.userData.speed;
        if (bot.position.z > 40) bot.position.z = -40;
    });

    renderer.render(scene, camera);
}
animate();
