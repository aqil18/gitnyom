import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";


// Graph data (replace with actual data or fetch dynamically)
const nodes = [
  { id: "file1", group: "file" },
  { id: "file2", group: "file" },
  { id: "func1", group: "function" },
  { id: "func2", group: "function" },
];

const links = [
  { source: "file1", target: "func1" },
  { source: "func1", target: "func2" },
  { source: "file2", target: "func1" },
];

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
  function: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
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
  opacity: 1.0
});

links.forEach((link) => {
  const source = nodeObjects[link.source];
  const target = nodeObjects[link.target];
  console.log("LINGING")
  if (source && target) {
    const points = [
      new THREE.Vector3(source.position.x, source.position.y, source.position.z),
      new THREE.Vector3(target.position.x, target.position.y, target.position.z),
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

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
