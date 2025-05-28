// Escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita (desactivados para VR)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 15);
controls.update();

// Luces
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Raycaster y mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Crear el objetivo (plano)
const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});
const target = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(target);

// Función para mover el objetivo aleatoriamente
function moveTargetRandomly() {
  const range = 4;
  const x = (Math.random() - 0.5) * 2 * range;
  const y = Math.random() * 4 + 1; // más alto que el piso
  const z = (Math.random() - 0.5) * 2 * range;
  target.position.set(x, y, z);
  target.lookAt(camera.position); // mira hacia la cámara
}

moveTargetRandomly(); // Posición inicial

// Crear una "habitación" con paredes (box invertido)
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  side: THREE.BackSide,
});
const roomSize = 20; // Aumenté el tamaño de la habitación
const wallGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
const room = new THREE.Mesh(wallGeometry, wallMaterial);
scene.add(room);

// Detectar clics (solo en escritorio, en VR se maneja distinto)
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(target);

  if (intersects.length > 0) {
    console.log("🎯 ¡Le diste al objetivo!");
    moveTargetRandomly();
  }
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Redimensionamiento responsivo
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Adición de soporte VR ---
const xrButton = document.createElement('button');
xrButton.style.position = 'absolute';
xrButton.style.top = '10px';
xrButton.style.left = '10px';
xrButton.innerHTML = 'Iniciar VR';
document.body.appendChild(xrButton);

// Activar VR
xrButton.addEventListener('click', () => {
  if (renderer.xr.isPresenting) {
    renderer.xr.getSession().end();
  } else {
    navigator.xr.requestSession('immersive-vr').then((session) => {
      renderer.xr.enabled = true;
      renderer.xr.setSession(session);
    });
  }
});

// Ajuste para VR
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);
scene.add(controller1);
scene.add(controller2);
