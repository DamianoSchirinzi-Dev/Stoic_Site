import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {stoics} from "./data.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

//Particles
// Number of particles
const particleCount = 3000;

// Create particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3); // Each particle is a vertex (x, y, z)

for (let i = 0; i < particleCount * 3; i++) {
  
   // Random positions with a minimum distance from the origin
   let radius = 80; // Minimum distance from the origin
   let x = (Math.random() - 0.5) * 100;
   let y = (Math.random() - 0.5) * 100;
   let z = (Math.random() - 0.5) * 100;

   let distance = Math.sqrt(x * x + y * y + z * z);
   if (distance < radius) {
       let scaleFactor = radius / distance;
       x *= scaleFactor;
       y *= scaleFactor;
       z *= scaleFactor;
   }

   positions[i] = x;
   positions[i + 1] = y;
   positions[i + 2] = z;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create particle material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2, // Size of each particle
  sizeAttenuation: true,
  color: 0xffffff, // Color of particles
  transparent: true,
  opacity: 0.8,
  depthTest: true
});

// Create particle mesh
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

// Add particles to the scene
scene.add(particles);

//Models
const gltfLoader = new GLTFLoader();

let marcusBust = null;
gltfLoader.load("models/ma_bust/scene.gltf", (gltf) => {
  marcusBust = gltf.scene;
  marcusBust.position.set(.2, -0.4, 0);

  scene.add(marcusBust);

  modelsLoaded++;
  hideLoadingScreen();
});

let chrysipposBust = null;
gltfLoader.load("models/chrysippos_bust/scene.gltf", (gltf) => {
  chrysipposBust = gltf.scene;
  chrysipposBust.scale.set(0.32, 0.32, 0.32);
  chrysipposBust.position.set(30.2, -1.6, -4);

  scene.add(chrysipposBust);

  modelsLoaded++;
  hideLoadingScreen();
});

let senecaBust = null;
gltfLoader.load("models/seneca_bust/scene.gltf", (gltf) => {
  senecaBust = gltf.scene;
  senecaBust.scale.set(.5,.5,.5)
  senecaBust.position.set(-29.8, -1.5, -2);

  scene.add(senecaBust);

  modelsLoaded++;
  hideLoadingScreen();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 1, 6);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//#region Functions
//Camera
let isTransitioning = false;
let transitionProgress = 0;
const transitionDuration = .5; // Duration of the transition in seconds
let transitionStartPos = new THREE.Vector3();
let transitionEndPos = new THREE.Vector3();

function repositionCamera(newX, newY, newZ) {
  transitionStartPos.copy(camera.position);
  transitionEndPos.set(newX, newY, newZ);
  transitionProgress = 0;
  isTransitioning = true;
}

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const panels = document.getElementById("panels");

  menuToggle.addEventListener("click", function () {
    panels.classList.toggle("menu-visible");
    menuToggle.classList.toggle("visible");
    menuToggle.classList.toggle("toggled");
  });
});

let currentStoic = 0;

document.getElementById("next-stoic-button").addEventListener("click", () => {
  currentStoic++;
  if (currentStoic > stoics.length - 1) {
    currentStoic = 0;
  }

  console.log(currentStoic);

  populateStoicInformation();
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      let j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function populateStoicInformation() {
  document.getElementById("stoic-name").textContent = stoics[currentStoic].name;
  document.getElementById("stoic-heading").textContent =
    stoics[currentStoic].heading;

  const quotesList = document.getElementById("quotes");
  quotesList.innerHTML = "";

  shuffleArray(stoics[currentStoic].quotes);

  stoics[currentStoic].quotes.slice(0, 3).forEach((quote) => {
    const li = document.createElement("li");
    li.textContent = quote;
    quotesList.appendChild(li);
  });

  document.getElementById("stoic-information").textContent =
    stoics[currentStoic].info;

  const newPos = new THREE.Vector3(
    stoics[currentStoic].relativeCameraPos[0],
    stoics[currentStoic].relativeCameraPos[1],
    stoics[currentStoic].relativeCameraPos[2]
  );
  repositionCamera(newPos.x, newPos.y, newPos.z);
}

populateStoicInformation();

// Handle Loading
let modelsLoaded = 0;
const totalModels = 3; // Set this to the number of models you are loading

const hideLoadingScreen = () => {
  if (modelsLoaded === totalModels) {
    document.getElementById("loading-screen").style.display = "none";
  }
};

//#endregion

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

let time = 0;
const modelRotationMultipler = 0.3;
const rotationRange = Math.PI / 1.5;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Update Particles
  particles.rotation.x += 0.00014;
  particles.rotation.y += 0.00014;

  // Handle camera transition
  if (isTransitioning) {
    transitionProgress += deltaTime / transitionDuration;
    if (transitionProgress >= 1) {
      isTransitioning = false;
      transitionProgress = 1; // Ensure it does not exceed 1
    }
    camera.position.lerpVectors(transitionStartPos, transitionEndPos, transitionProgress);
  }

  time += deltaTime;

  if (marcusBust) {
    marcusBust.rotation.y =
      (Math.sin(time * modelRotationMultipler) * rotationRange) / 1.6;
  }

  if (senecaBust) {

    senecaBust.rotation.y =
      (Math.sin(time * modelRotationMultipler) * rotationRange) / 2;
  }

  if (chrysipposBust) {

    chrysipposBust.rotation.y =
      (Math.sin(time * modelRotationMultipler) * rotationRange) / 1.8;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
