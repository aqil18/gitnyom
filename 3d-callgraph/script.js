import * as d3 from "d3";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Graph data (replace with actual data or fetch dynamically)
const nodes = [
  { id: "file1", group: "file" },
  { id: "file2", group: "file" },
  { id: "folder1", group: "folder" },
  { id: "folder2", group: "folder" },
];

const links = [
  { source: "file1", target: "folder1" },
  { source: "folder1", target: "folder2" },
  { source: "file2", target: "folder1" },
];

const summaries = {
  file1: "File 1 Summary",
  file2: "File 2 Summary"
}

// D3 Force Layout
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id((d) => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(0, 0))
  .stop();

// Run simulation to stabilize
for (let i = 0; i < 300; ++i) simulation.tick();

// Add random Z-coordinates for 3D visualization
nodes.forEach((node) => {
  node.z = Math.random() * 200 - 100;
});

// Three.js Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Node Materials
const geometry = new THREE.SphereGeometry(5, 32, 32);
const materials = {
  file: new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
  folder: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
};

// Add Nodes to Scene
const nodeObjects = {};
nodes.forEach((node) => {
  const material = materials[node.group] || new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(node.x, node.y, node.z);
  nodeObjects[node.id] = sphere;
  scene.add(sphere);
});

// Add Links to Scene
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x00ff00, // Green
  opacity: 1.0,
  transparent: true
});

console.log("NODE OBJECTS", nodeObjects)
console.log("LINKS", links)

links.forEach((link) => {
  const source = link.source;
  const target = link.target;

  if (source && target) {
    const points = [
      new THREE.Vector3(source.x, source.y, source.z),
      new THREE.Vector3(target.x, target.y, target.z),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  }
});

// Camera Position
camera.position.z = 500;

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Disables panning out of the screen

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update the controls
  controls.update();

  renderer.render(scene, camera);
}

animate();
