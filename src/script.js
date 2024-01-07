import * as THREE from 'three'
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
    },
  ];

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

//Models
const gltfLoader = new GLTFLoader();
let marcusBust = null;
gltfLoader.load("models/ma_bust/scene.gltf", (gltf) => {
  marcusBust = gltf.scene;
  marcusBust.position.set(0,-.4,0);

  scene.add(marcusBust);

  modelsLoaded++;
  hideLoadingScreen();
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1, 6)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//#region Functions
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const panels = document.getElementById('panels');

    menuToggle.addEventListener('click', function() {
        panels.classList.toggle('menu-visible');
        menuToggle.classList.toggle('visible');
    });
});

function populateStoicInformation() {
    document.getElementById('stoic-name').textContent = stoics[0].name;
    document.getElementById('stoic-heading').textContent = stoics[0].heading;

    const quotesList = document.getElementById('quotes');
    quotesList.innerHTML = "";
    stoics[0].quotes.forEach((quote) => {
        const li = document.createElement('li');
        li.textContent = quote;
        quotesList.appendChild(li);
    })

    document.getElementById(
        "stoic-information"
      ).textContent = stoics[0].info;
}   

populateStoicInformation();

// Handle Loading
let modelsLoaded = 0;
const totalModels = 1; // Set this to the number of models you are loading

const hideLoadingScreen = () => {
  if (modelsLoaded === totalModels) {
    document.getElementById('loading-screen').style.display = 'none';
  }
};

//#endregion

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

let time = 0;
const modelRotationMultipler = 0.3;
const rotationRange = Math.PI / 1.5;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(marcusBust) {
        time += deltaTime;

        marcusBust.rotation.y =
        (Math.sin(time * modelRotationMultipler) * rotationRange) / 2;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()