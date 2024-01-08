import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//Data
const stoics = [
  {
    name: "Marcus Aurelius",
    heading: "Roman Emperor & Stoic Philosopher",
    quotes: [
      "You have power over your mind — not outside events. Realize this, and you will find strength.",
      "The happiness of your life depends upon the quality of your thoughts.",
      "Waste no more time arguing about what a good man should be. Be one.",
    ],
    info: "Marcus Aurelius was the son of the praetor Marcus Annius Verus and his wife, Domitia Calvilla. He was related through marriage to the emperors Trajan and Hadrian. Marcus's father died when he was three, and he was raised by his mother and paternal grandfather. After Hadrian's adoptive son, Aelius Caesar, died in 138, Hadrian adopted Marcus's uncle Antoninus Pius as his new heir. In turn, Antoninus adopted Marcus and Lucius, the son of Aelius. Hadrian died that year, and Antoninus became emperor. Now heir to the throne, Marcus studied Greek and Latin under tutors such as Herodes Atticus and Marcus Cornelius Fronto. He married Antoninus's daughter Faustina in 145.",
    relativeCameraPos: [0, 1, 6],
  },
  {
    name: "Chrysippus of Soli",
    heading: "Disciple of Cleanthes",
    quotes: [
      "The universe itself is God and the universal outpouring of its soul.",
      "Thought is the fountain of speech.",
      "Living virtuously is equal to living in accordance with one’s experience of the actual course of nature.",
    ],
    info: "Chrysippus excelled in logic, the theory of knowledge, ethics, and physics. He created an original system of propositional logic in order to better understand the workings of the universe and role of humanity within it. He adhered to a fatalistic view of fate, but nevertheless sought a role for personal agency in thought and action. Ethics, he thought, depended on understanding the nature of the universe, and he taught a therapy of extirpating the unruly passions which depress and crush the soul.",
    relativeCameraPos: [30, 0.5, 6],
  },
  {
    name: "Lucius Seneca",
    heading: "Statesman, dramatist & satirist",
    quotes: [
      "I am not born for one corner; the whole world is my native land.",
      "Regard a friend as loyal, and you will make him loyal.",
      "He who spares the wicked injures the good.",
    ],
    info: "Seneca was born in Corduba in Hispania, and raised in Rome, where he was trained in rhetoric and philosophy. His father was Seneca the Elder, his elder brother was Lucius Junius Gallio Annaeanus, and his nephew was the poet Lucan. In AD 41, Seneca was exiled to the island of Corsica under emperor Claudius,[2] but was allowed to return in 49 to become a tutor to Nero. When Nero became emperor in 54, Seneca became his advisor and, together with the praetorian prefect Sextus Afranius Burrus, provided competent government for the first five years of Nero's reign. Seneca's influence over Nero declined with time, and in 65 Seneca was forced to take his own life for alleged complicity in the Pisonian conspiracy to assassinate Nero, of which he was probably innocent.[3] His stoic and calm suicide has become the subject of numerous paintings.",
    relativeCameraPos: [-30, 0.5, 6],
  },
];

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
const particleCount = 2000;

// Create particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3); // Each particle is a vertex (x, y, z)

for (let i = 0; i < particleCount * 3; i++) {
  // Random positions
  positions[i] = (Math.random() - 0.5) * 100; // Spread particles over the scene
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create particle material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2, // Size of each particle
  sizeAttenuation: true,
  color: 0xffffff, // Color of particles
  transparent: true,
  opacity: 0.8
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
  marcusBust.position.set(0, -0.4, 0);

  scene.add(marcusBust);

  modelsLoaded++;
  hideLoadingScreen();
});

let chrysipposBust = null;
gltfLoader.load("models/chrysippos_bust/scene.gltf", (gltf) => {
  chrysipposBust = gltf.scene;
  chrysipposBust.scale.set(0.2, 0.2, 0.2);
  chrysipposBust.position.set(30, -0.4, 0);

  scene.add(chrysipposBust);

  modelsLoaded++;
  hideLoadingScreen();
});

let senecaBust = null;
gltfLoader.load("models/seneca_bust/scene.gltf", (gltf) => {
  senecaBust = gltf.scene;
  senecaBust.scale.set(.5,.5,.5)
  senecaBust.position.set(-30, -1, -1);

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

function populateStoicInformation() {
  document.getElementById("stoic-name").textContent = stoics[currentStoic].name;
  document.getElementById("stoic-heading").textContent =
    stoics[currentStoic].heading;

  const quotesList = document.getElementById("quotes");
  quotesList.innerHTML = "";
  stoics[currentStoic].quotes.forEach((quote) => {
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
